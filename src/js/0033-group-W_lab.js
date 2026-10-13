function W_lab(bd, id) {
  let z = bd && bd.picks.find((q) => q.id === id);
  return z
    ? z.pk <= 3
      ? `top-3 pick (#${z.pk})`
      : z.pk <= 14
        ? `lottery pick (#${z.pk})`
        : z.pk <= 30
          ? `1st round (#${z.pk})`
          : `2nd round (#${z.pk})`
    : "undrafted";
}
function W_mock(e) {
  let bd = W_draft(e, !0);
  return {
    rows: bd.picks
      .slice(0, 45)
      .map((z) => ({ n: z.n, t: z.t, p: z.p, o: z.o, y: z.y, pot: z.pot, ppg: z.ppg, you: z.you, pk: z.pk })),
    stat: bd.stat,
  };
}
function W_fr(e, t, R) {
  let base = (R.length ? W_tr(R) : t.rating) - 8 + j(e, -6, 5),
    pr = (t.pr == null ? 50 : t.pr) + W_nilBonus(e, t);
  if (ne(e) < le((pr - 35) / 90, 0.03, 0.55)) base = t.rating + j(e, 1, 9) + (pr - 50) / 12;
  let p = W_p(e, Math.min(base, 93), 1);
  p.t = le(p.o + j(e, 5, 12), p.o, 98);
  return p;
}
function W_dest(e, p) {
  let n = e.opponents.length,
    sc = (t) => (t.pr == null ? 50 : t.pr) + t.rating * 0.4 + W_nilBonus(e, t),
    rk = [...e.opponents].sort((a, b) => sc(b) - sc(a));
  // schools that cannot pay him (a player may take at most 35% of a budget) are skipped
  if (TUNE.nilBudgets && TUNE.nilAI) {
    const ok = rk.filter((t) => W_nilCanAfford(e, t, p.ovr));
    ok.length >= 30 && (rk = ok);
  }
  let top = Math.min(rk.length, [170, 140, 110, 70, 45, 30][(p.sg ?? p.stars) || 0]),
    h = TS(p.id + e.year);
  return rk[h % top];
}
function W_fire(e) {
  e.vac = [];
  for (let t of e.opponents) {
    let rc = W_t(e, t.id), // your conference mates' records are on their e.league copy
      g = rc.wins + rc.losses,
      wp = g ? rc.wins / g : 0.5,
      exp = 0.3 + ((t.rating - 46) / 48) * 0.5;
    t.fired = g >= 20 && wp < exp - 0.14 && ne(e) < 0.5;
    t.fired && Xl.some((h) => h.id === t.id) && e.vac.push(t.id);
  }
}
function W_hl(e) {
  let g = e.schedule.filter((f) => f.played),
    w = g.filter((f) => f.win),
    big = [...w].sort((a, b) => b.us - b.them - (a.us - a.them))[0],
    up = [...w].filter((f) => f.rating > Ps(e) + 3).sort((a, b) => b.rating - a.rating)[0],
    bad = [...g].filter((f) => !f.win).sort((a, b) => a.rating - b.rating)[0],
    best = null,
    st = 0,
    mx = 0;
  for (let f of g) {
    f.win ? (mx = Math.max(mx, ++st)) : (st = 0);
    for (let p of f.box || []) {
      let v = p.pts + p.reb * 0.7 + p.ast * 0.8;
      (!best || v > best.v) && (best = { v, n: p.name, pts: p.pts, reb: p.reb, ast: p.ast, o: f.opponent });
    }
  }
  let c = (a) => a && { o: a.opponent, us: a.us, t: a.them, r: a.rating };
  return { big: c(big), up: c(up), bad: c(bad), best, streak: mx };
}
function W_revInit(e) {
  let b = e.baseBudget || e.budget || 3e5;
  e.rev = {
    donors: Math.round(b * 0.55),
    tickets: Math.round(b * 0.2),
    media: Math.round(b * 0.15),
    conf: Math.round(b * 0.1),
    tourney: 0,
  };
}
// Item 23: coaching staff and facilities (e.staff = { rec, dev, tac, fac }, each level 0 to 3, schema `staff`). They cost a share of the
// base budget every year, taken from the available NIL in Ce(). rec: recruiting assistant (+2 signing chance and +2 scouting visits a level,
// an extra official visit at levels 2 and 3), dev: development assistant (+0.34 growth points a level), tac: tactics assistant (+2 chemistry a level),
// fac: facilities (+1.5 signing chance, +0.15 growth points a level). No staff (the default) changes nothing.
var STAFF_SHARE = { a: [0, 0.02, 0.045, 0.08], f: [0, 0.03, 0.07, 0.12] },
  STAFF_ROLES = [
    { k: "rec", name: "Recruiting assistant", perk: "+2 signing chance and +2 scouting visits per level; an extra official visit at levels 2 and 3" },
    { k: "dev", name: "Development assistant", perk: "Players improve a little faster each offseason (+0.34 growth points per level)" },
    { k: "tac", name: "Tactics assistant", perk: "Better team chemistry at the start of each season (+2 per level)" },
    { k: "fac", name: "Facilities", perk: "Recruits like your campus (+1.5 signing chance per level) and players grow a bit faster (+0.15 per level)" },
  ];
function W_staffCostOf(e, st) {
  let b = e.baseBudget || e.budget || 0,
    s = st || e.staff || {},
    m = (k) => W_asstCostMult(e.asst?.[k]); // item 23: a better named assistant costs more
  return (
    Math.round(
      (STAFF_SHARE.a[s.rec || 0] * m("rec") + STAFF_SHARE.a[s.dev || 0] * m("dev") + STAFF_SHARE.a[s.tac || 0] * m("tac") + STAFF_SHARE.f[s.fac || 0]) * b / 1e3
    ) * 1e3
  );
}
// price of a level for a role; person = the assistant in question (default: the one in the chair)
function W_staffLevelCost(e, k, lv, person) {
  let m = k === "fac" ? 1 : W_asstCostMult(person === undefined ? e.asst?.[k] : person);
  return Math.round(((k === "fac" ? STAFF_SHARE.f : STAFF_SHARE.a)[lv] * m * (e.baseBudget || e.budget || 0)) / 1e3) * 1e3;
}
// Item 25: national tournament wins (First Four excluded) by your conference mates this season; they earn "units" the league shares.
function W_confWins(e) {
  let names = new Set(e.league.filter((t) => t.id !== e.school.id).map((t) => t.name)),
    nb = e.natBracket || (e.tournament === "National" ? cbk(e, e.bracket) : null),
    n = 0;
  for (let r of nb || []) for (let g of r) g.w && !g.ff && names.has(g.w) && n++;
  return n;
}
// Item 7: a conference's payout depends on the league. Conferences are ranked by their mean team rating (yours included);
// the best pays x1.3 of the base share, the weakest x0.7. rank 1 = best.
function W_confMult(e) {
  let rt = new Map(e.opponents.map((t) => [t.id, t.rating]));
  e.league.forEach((t) => rt.set(t.id, t.rating));
  let cs = (e.confs || [])
      .map((g) => {
        let v = g.map((id) => rt.get(id)).filter((x) => x != null);
        return { mine: g.includes(e.school.id), m: v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0 };
      })
      .sort((a, b) => b.m - a.m),
    n = cs.length,
    rank = Math.max(1, cs.findIndex((c) => c.mine) + 1);
  return { rank, n, mult: n > 1 ? 1.3 - (0.6 * (rank - 1)) / (n - 1) : 1 };
}
// Item 24: each position has its own price index (e.pm). Every offseason it moves halfway toward a target set by how few good
// (70+) players that position has across all rosters: scarce positions cost more (up to x1.3), plentiful ones less (down to x0.8), plus a random trend of a few percent.
function W_posMkt(e) {
  let c = { PG: 0, SG: 0, SF: 0, PF: 0, C: 0 };
  Object.values(e.rosters || {}).forEach((r) => r.forEach((p) => p.o >= 70 && c[p.p] != null && c[p.p]++));
  e.roster.forEach((p) => p.ovr >= 70 && c[p.pos] != null && c[p.pos]++);
  let m = Math.max(1, Le.reduce((x, k) => x + c[k], 0) / 5),
    pm = e.pm || {};
  return Object.fromEntries(
    Le.map((k) => [k, +le((pm[k] || 1) * 0.5 + (1 + (1.2 * (m - c[k])) / m) * 0.5 + j(e, -5, 5) / 100, 0.8, 1.3).toFixed(3)])
  );
}
function W_ask(e, o, origin, pos) {
  return (
    Math.round(
      ((e.mkt || 1) *
        (e.pm?.[pos] || 1) *
        (4e3 + Math.pow(Math.max(2, o - 43), 2) * 110 * (o >= 64 ? 2.1 : 1)) *
        (origin === "Transfer" ? 1.15 : origin === "High school" ? 0.7 : 1)) /
        1e3
    ) * 1e3
  );
}
// Item 51: team totals for efficiency. pf / pa = points for / against, po = possessions (each side has the same number in a game).
function W_tot(t, pf, pa, po) {
  t && ((t.pf = (t.pf || 0) + pf), (t.pa = (t.pa || 0) + pa), (t.po = (t.po || 0) + po));
}
// points per 100 possessions scored (ortg) and allowed (drtg), tempo = possessions a game, and an opponent-adjusted net rating:
// net + half of how much stronger than 75 (about the average team rating) the opponents were
function W_eff(t) {
  let g = t.wins + t.losses,
    po = t.po || 0;
  if (!po || !g) return { ortg: 0, drtg: 0, net: 0, tempo: 0, adj: 0, g };
  let ortg = ((t.pf || 0) / po) * 100,
    drtg = ((t.pa || 0) / po) * 100;
  return { ortg, drtg, net: ortg - drtg, tempo: po / g, adj: ortg - drtg + ((t.sr || 75 * g) / g - 75) * 0.5, g };
}
// Item 9: NET-style selection. Quadrants (opponent rank and venue decide how much a game is worth, thresholds scaled from 360 to 200 teams):
// Q1 home 1-17, neutral 1-28, away 1-42; Q2 to 42 / 56 / 75; Q3 to 89 / 111 / 133; Q4 the rest. Opponent rank here is the rank by team rating.
function W_quad(rank, venue, n) {
  let c = (venue === "H" ? [30, 75, 160] : venue === "N" ? [50, 100, 200] : [75, 135, 240]).map((x) => Math.round((x * n) / 360));
  return rank <= c[0] ? 0 : rank <= c[1] ? 1 : rank <= c[2] ? 2 : 3;
}
function W_ranks(e) {
  if (e.rr && e.rr.y === e.year) return e.rr.m;
  let L = [...e.opponents.filter((t) => t.id !== e.school.id).map((t) => [t.id, t.rating]), [e.school.id, Ps(e)]].sort(
      (a, b) => b[1] - a[1]
    ),
    m = {};
  L.forEach(([id], i) => (m[id] = i + 1));
  return ((e.rr = { y: e.year, m }), m);
}
// adds one game to a team's quadrant record qd = [Q1 wins, Q1 losses, Q2 wins, Q2 losses, ...]
function W_qrec(e, t, oppId, win, venue) {
  let m = W_ranks(e),
    r = m[oppId];
  if (!t || !r) return;
  let q = W_quad(r, venue, Object.keys(m).length);
  (t.qd = t.qd || [0, 0, 0, 0, 0, 0, 0, 0])[q * 2 + (win ? 0 : 1)]++;
}
function W_net(t) {
  let g = t.wins + t.losses,
    q = t.qd || [],
    n = (i) => q[i] || 0;
  return (
    (g ? t.wins / g : 0.5) * TUNE.netW +
    t.rating * TUNE.netR +
    W_eff(t).net * 0.35 +
    (g ? (t.sr || 65 * g) / g - 65 : 0) * TUNE.netSos +
    (t.cs || 0) * TUNE.netCs +
    Math.max(0, 1 - (t.cr || 0) / (0.55 * (t.cn || 10))) * TUNE.netCr +
    (Math.min(t.cn || 10, 12) - 10) * TUNE.netCn +
    n(0) * TUNE.netQ1 +
    n(2) * TUNE.netQ2 -
    n(5) * 0.6 -
    n(7) * 1.8
  );
}
function W_netRank(e) {
  let m = {};
  W_all(e)
    .sort((a, b) => W_net(b) - W_net(a))
    .forEach((t, i) => (m[t.id] = i + 1));
  return m;
}
function W_all(e) {
  let pl = e.schedule.filter((f) => f.played && ["Nonconference", "Conference"].includes(f.kind)),
    me = {
      ...e.league[0],
      rating: Ps(e),
      sr: pl.reduce((x, f) => x + f.rating, 0),
      qw: pl.filter((f) => f.win && f.rating >= 78).length,
      bl: pl.filter((f) => !f.win && f.rating <= 60).length,
      qd: null,
      pf: pl.reduce((x, f) => x + (f.us || 0), 0),
      pa: pl.reduce((x, f) => x + (f.them || 0), 0),
      po: pl.reduce((x, f) => x + (f.poss || 70), 0),
    };
  e.schedule
    .filter((f) => f.played && (["Nonconference", "Conference"].includes(f.kind) || /tournament/.test(f.kind)))
    .forEach((f) => W_qrec(e, me, f.oppId, f.win, f.venue === "Home" ? "H" : f.venue === "Away" ? "A" : "N"));
  let all = [me, ...e.league.slice(1), ...e.opponents.filter((x) => !e.league.some((l) => l.id === x.id))],
    sum = {},
    cnt = {};
  for (let t of all) {
    let c = t.conf ?? 0;
    ((sum[c] = (sum[c] || 0) + t.rating), (cnt[c] = (cnt[c] || 0) + 1));
  }
  // Conference strength: how far the average rating of a team's conference is above or below the whole country.
  let nat = all.reduce((x, t) => x + t.rating, 0) / Math.max(1, all.length);
  for (let t of all) t.cs = sum[t.conf ?? 0] / cnt[t.conf ?? 0] - nat;
  // Conference finish (0 = best record in the league): the ranking credits the top three of every league, see W_net
  let byConf = {};
  for (let t of all) (byConf[t.conf ?? 0] = byConf[t.conf ?? 0] || []).push(t);
  for (let c in byConf)
    byConf[c].sort((a, b) => (b.cw || 0) - (a.cw || 0) || b.wins - a.wins || b.rating - a.rating).forEach((t, i) => ((t.cr = i), (t.cn = byConf[c].length)));
  return all;
}
// Strength-of-schedule factor for a team's players and awards: its conference strength plus how tough its opponents
// have been so far. Between 0.90 (weak schedule) and 1.10 (strong schedule).
function W_sosAdj(t) {
  let g = t.wins + t.losses;
  return 1 + Math.max(-0.1, Math.min(0.1, ((t.cs || 0) + (g && t.sr ? t.sr / g - 65 : 0) * 0.5) * 0.016));
}
function W_score(t) {
  let g = t.wins + t.losses;
  return (
    (g ? t.wins / g : 0.5) * 44 +
    t.rating * 0.45 +
    W_eff(t).net * 0.35 +
    (g ? (t.sr || 65 * g) / g - 65 : 0) * 0.5 +
    (t.cs || 0) * 0.45 +
    (t.qw || 0) * 1.1 -
    (t.bl || 0) * 1.8
  );
}
// Item 10: the Top 25 is a poll, not a formula. It starts from a preseason score (team strength plus last year's reputation, so big
// programs start high) and every week moves only part of the way (TUNE.pollStep) toward the current results: a single loss costs a few
// spots, not ten, and the preseason opinion fades over about a month. e.poll = { y: year, s: { id: score }, r: { id: rank }, prev: { id: rank }, w: week }
function W_pollScore(e, t) {
  let pr = t.id === e.school.id ? e.rep : t.pr == null ? 50 : t.pr;
  return 25 + t.rating * 0.5 + (t.cs || 0) * 0.45 + (pr - 50) * 0.15;
}
function W_poll(e) {
  if (e.poll && e.poll.y === e.year) return e.poll;
  let P = { y: e.year, s: {}, r: {}, prev: {}, w: 0 };
  W_all(e).forEach((t) => (P.s[t.id] = W_pollScore(e, t)));
  e.poll = P;
  W_pollRank(P, W_all(e));
  P.prev = { ...P.r };
  return P;
}
function W_pollRank(P, all) {
  [...all].sort((a, b) => P.s[b.id] - P.s[a.id]).forEach((t, i) => (P.r[t.id] = i + 1));
}
// one weekly update (called from W_day every third league day)
function W_pollWeek(e) {
  let P = W_poll(e),
    all = W_all(e);
  P.prev = { ...P.r };
  all.forEach((t) => (P.s[t.id] = P.s[t.id] * (1 - TUNE.pollStep) + W_score(t) * TUNE.pollStep));
  P.w++;
  W_pollRank(P, all);
}
function W_top25(e) {
  let P = W_poll(e);
  return W_all(e)
    .sort((a, b) => P.s[b.id] - P.s[a.id])
    .slice(0, 25)
    .map((t) => ({ ...t, chg: P.prev[t.id] - P.r[t.id], pre: P.w === 0 }));
}
