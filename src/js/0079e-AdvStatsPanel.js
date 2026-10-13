// Item 51: advanced stats (League news > Advanced stats).
// Teams: points per 100 possessions scored (ORTG) and allowed (DRTG), their difference (NET), an opponent-adjusted net (ADJ) and tempo
// (possessions a game). W_eff in W_lab. These numbers feed the Top 25 and the tournament selection score (W_score / W_net).
// Players: Impact40 = (pts + 1.2 reb + 1.5 ast + 2 stl + 2 blk) per 40 minutes, a single box-score rating (like a simple PER); Usage = the
// player's share of his team's points plus 0.7 x assists. Other teams' players have no minutes or shot log, so their minutes are the planned
// rotation (the same minutes W_game uses); your players use real minutes. Only your players also show true shooting.
var ADV_MIN = [32, 30, 28, 26, 24, 18, 14, 10, 8];
function W_advPlayers(e) {
  let teams = {};
  W_all(e).forEach((t) => (teams[t.id] = t));
  let out = [],
    mine = teams[e.school.id],
    mk = (id, name, nm, pos, g, min, p, r, a, st, b, tpf, tAst, extra) =>
      g >= 6 &&
      min >= 12 &&
      out.push({
        id,
        name: nm,
        team: name,
        pos,
        g,
        min,
        ppg: p / g,
        rpg: r / g,
        apg: a / g,
        imp: (((p + 1.2 * r + 1.5 * a + 2 * st + 2 * b) / g) * 40) / min,
        usg: (100 * (p + 0.7 * a)) / Math.max(1, tpf + 0.7 * tAst),
        ...extra,
      });
  for (let t of e.opponents) {
    let R = (e.rosters[t.id] || []).slice(0, 9),
      T = teams[t.id] || t,
      tot = ADV_MIN.slice(0, R.length).reduce((x, y) => x + y, 0),
      tAst = R.reduce((x, p) => x + p.s.a, 0);
    R.forEach((p, i) =>
      mk(p.i, t.name, p.n, p.p, p.s.g, (ADV_MIN[i] * 200) / tot, p.s.p, p.s.r, p.s.a, p.s.s, p.s.b, T.pf || 0, tAst, { ovr: p.o })
    );
  }
  let tAst = e.roster.reduce((x, p) => x + p.stats.ast, 0);
  for (let p of e.roster) {
    let s0 = p.stats;
    mk(p.id, e.school.name, p.name, p.pos, s0.gp, s0.gp ? s0.min / s0.gp : 0, s0.pts, s0.reb, s0.ast, s0.stl, s0.blk, mine.pf || 0, tAst, {
      you: !0,
      ovr: p.ovr,
      ts: s0.fga + s0.fta ? s0.pts / (2 * (s0.fga + 0.44 * s0.fta)) : 0,
    });
  }
  return out.sort((a, b) => b.imp - a.imp);
}
function AdvStatsPanel({ g: e }) {
  let [v, setV] = (0, N.useState)("Teams"),
    f1 = (x) => x.toFixed(1),
    table = (head, rows) =>
      (0, s.jsx)(DataTable, {
        columns: head.map((h, k) => ({ key: "c" + k, label: h })),
        rows: rows.map((r) => ({ you: r.you, ...Object.fromEntries(r.c.map((c, k) => ["c" + k, c])) })),
        rowClass: (r) => (r.you ? "you-row" : ""),
      }),
    teams =
      v === "Teams"
        ? W_all(e)
            .map((t) => ({ t, x: W_eff(t) }))
            .filter((z) => z.x.g > 0)
            .sort((a, b) => b.x.adj - a.x.adj)
        : [],
    pl = v !== "Teams" ? W_advPlayers(e) : [];
  return (0, s.jsx)(qe, {
    title: "Advanced stats",
    meta: "Per 100 possessions, so fast and slow teams compare fairly. These ratings feed the Top 25 and the tournament selection.",
    children: (0, s.jsxs)("div", {
      style: { padding: "10px 16px" },
      children: [
        (0, s.jsx)("div", {
          className: "chips",
          children: ["Teams", "Players", "Your players"].map((d) =>
            (0, s.jsx)("button", { className: d === v ? "active" : "", onClick: () => setV(d), children: d }, d)
          ),
        }),
        v === "Teams" &&
          (teams.length
            ? table(
                ["#", "TEAM", "RECORD", "ORTG", "DRTG", "NET", "ADJ NET", "TEMPO", "RATING"],
                teams.slice(0, 50).map((z, i) => ({
                  you: z.t.id === e.school.id,
                  c: [i + 1, z.t.name, `${z.t.wins}–${z.t.losses}`, f1(z.x.ortg), f1(z.x.drtg), (z.x.net >= 0 ? "+" : "") + f1(z.x.net), (z.x.adj >= 0 ? "+" : "") + f1(z.x.adj), f1(z.x.tempo), z.t.rating],
                }))
              )
            : (0, s.jsx)("p", { className: "muted", children: "Play some games first: efficiency needs a few results." })),
        v === "Players" &&
          (pl.length
            ? table(
                ["#", "PLAYER", "TEAM", "POS", "OVR", "G", "MIN", "PTS", "REB", "AST", "USAGE", "IMPACT/40"],
                pl.slice(0, 50).map((p, i) => ({
                  you: p.you,
                  c: [i + 1, p.name, p.team, p.pos, p.ovr, p.g, Math.round(p.min), f1(p.ppg), f1(p.rpg), f1(p.apg), f1(p.usg) + "%", f1(p.imp)],
                }))
              )
            : (0, s.jsx)("p", { className: "muted", children: "Play some games first: player ratings need at least 6 games." })),
        v === "Your players" &&
          (pl.some((p) => p.you)
            ? table(
                ["PLAYER", "POS", "OVR", "G", "MIN", "PTS", "REB", "AST", "TS%", "USAGE", "IMPACT/40", "NATIONAL RANK"],
                pl
                  .map((p, i) => ({ p, i }))
                  .filter((z) => z.p.you)
                  .map(({ p, i }) => ({
                    c: [p.name, p.pos, p.ovr, p.g, f1(p.min), f1(p.ppg), f1(p.rpg), f1(p.apg), Math.round(p.ts * 100) + "%", f1(p.usg) + "%", f1(p.imp), "#" + (i + 1)],
                  }))
              )
            : (0, s.jsx)("p", { className: "muted", children: "Play some games first: player ratings need at least 6 games." })),
      ],
    }),
  });
}
