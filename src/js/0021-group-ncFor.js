function ncFor(e) {
  let n = e.opponents.length,
    b = le(Math.round(n * 0.31 + ((e.rep - 12) * 0.6 + (Ps(e) - 50) * 0.45) * (n / 72)), 0, n - 13);
  return [...e.opponents]
    .sort((a, l) => a.rating - l.rating)
    .slice(b, b + 12)
    .map((a, l) => {
      // item 55: two early-season events at neutral sites (two games each, slots NC_EVENT_SLOTS); two road games, the rest at home.
      // Home minus away stays 4 games (8 home / 4 away before), so the total home-court edge of a season is unchanged.
      // rd 1 = the event's first game, rd 2 = its second game: the opponent is set after the first one (W_day): winners meet winners
      // and losers meet losers (the same for every other team, which also plays both event games at a neutral site)
      let ev = NC_EVENT_SLOTS.findIndex((z) => z.includes(l));
      return ev >= 0
        ? { teamId: a.id, venue: "Neutral", event: ncEvents(e)[ev][0], rd: NC_EVENT_SLOTS[ev].indexOf(l) + 1 }
        : { teamId: a.id, venue: l === 0 || l === 6 ? "Away" : "Home" };
    });
}
// the two events of a season (name, host city); they change from year to year
var NC_EVENTS = [
  ["Pacific Shores Classic", "San Diego, CA"],
  ["Harvest Hoops Invitational", "Kansas City, MO"],
  ["Lakefront Showcase", "Milwaukee, WI"],
  ["Sunshine Tip-Off", "Orlando, FL"],
  ["Mountain West Challenge", "Denver, CO"],
  ["Gulf Coast Classic", "New Orleans, LA"],
];
var NC_EVENT_SLOTS = [
  [3, 4],
  [9, 10],
];
// true when nonconference game d (0 to 11) is the second game of an event whose first game is still at the event too
function evSecond(e, d) {
  let a = e.nc && e.nc[d - 1],
    b = e.nc && e.nc[d];
  return !!(a && b && a.rd === 1 && b.rd === 2 && a.event && a.event === b.event && a.venue === "Neutral" && b.venue === "Neutral");
}
function ncEvents(e) {
  return [NC_EVENTS[e.year % 6], NC_EVENTS[(e.year + 3) % 6]];
}
// Calendar (item 55): nonconference games from early November (two events around Thanksgiving and just before the holidays), a break,
// then conference play from January 2 about every three days. Display only: it does not change who plays whom or when games are simulated.
function W_gdate(e, i) {
  let off = i < 12 ? [0, 4, 10, 17, 18, 19, 25, 30, 46, 47, 48, 55][i] : 59 + Math.round((i - 12) * 3.3),
    d = new Date(Date.UTC(e.year, 10, 4 + off));
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
}
// Item 54: conferences have different sizes. Your own conference has LEAGUE_SIZE[tier of your school] teams (bigger for richer schools);
// the rest of the country is split into conferences of 10 to 18 teams, the biggest ones holding the strongest teams (the "power" leagues).
// Every size is even, so a round robin has n - 1 rounds with every team playing every round, and conference play is always 18 games.
var LEAGUE_SIZE = [10, 10, 12, 14, 16];
// Full-size league (e.nt = 360 teams, 31 conferences like real Division I): a fixed spread of even sizes, biggest first.
var CONF_TEMPLATE = [16, 16, 16, 14, 14, 14, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
function confSizes(R, nt, own) {
  if (nt >= 300) {
    let t = [...CONF_TEMPLATE],
      i = t.indexOf(own);
    if (i >= 0 && t.reduce((x, y) => x + y, 0) - own === R) return (t.splice(i, 1), t);
  }
  let out = [];
  for (let s of [16, 14, 14, 12, 12, 12]) R - s >= 10 && (out.push(s), (R -= s));
  while (R > 0) {
    if (R >= 10 && R <= 18) (out.push(R), (R = 0));
    else if (R < 10) for (let i = out.length - 1; R > 0; i--, R -= 2) out[i] += 2;
    else (out.push(10), (R -= 10));
  }
  return out;
}
function confTeams(e, t, uid, x) {
  if (REAL_ON) {
    // real conferences: your conference mates are the real members of your school's conference
    const me = (e.school && e.school.id === uid && e.school) || Xl.find((h) => h.id === uid) || e.opponents.find((o) => o.id === uid) || W_schoolById(uid),
      rc = me && W_rc(me);
    if (rc) return e.opponents.filter((o) => o.id !== uid && W_rc(o) === rc).map((o) => ({ ...o, wins: 0, losses: 0, cw: 0, cl: 0 }));
  }
  // rating the generic conference mates are picked around, by tier (item 15: tier 1 was 73, which left a small-budget
  // school 5th of 10 in a one-bid league and in the tournament ~10% of the time against a ~20% target). Tier 1 71 -> 68 and
  // tier 2 74 -> 71 when the AI prestige fix (W_off) stopped these leagues' generic teams from fading over the years.
  let c = [72, 68, 71, 77, 82][t],
    pt = e.opponents.filter(
      (o) => o.id !== uid && Xl.some((h) => h.id === o.id && tierOf({ school: h }) === t)
    ),
    ge = e.opponents
      .filter((o) => !Xl.some((h) => h.id === o.id))
      .sort((a, b) => Math.abs(a.rating - c) - Math.abs(b.rating - c));
  return [...pt, ...ge.slice(0, (x || 10) - 1 - pt.length)].map((o) => ({ ...o, wins: 0, losses: 0, cw: 0, cl: 0 }));
}
function cbk(e, b) {
  return (b || [])
    .filter((r) => r && r.length)
    .map((r) =>
      r.map((g) => ({
        a: g.a.name,
        b: g.b.name,
        sa: g.sa,
        sb: g.sb,
        w: g.winner?.name,
        sda: e.seedMap?.[g.a.id],
        sdb: e.seedMap?.[g.b.id],
        me: g.a.id === e.school.id || g.b.id === e.school.id,
        ...(g.ff ? { ff: 1 } : g.pi ? { pi: 1 } : {}),
      }))
    );
}
var ONX = REAL_REST_NAMES,
  CONFN = [
    "Southland",
    "Great Plains",
    "Tri-State",
    "Ohio Valley",
    "Great Lakes",
    "Southern Premier",
    "Heartland Premier",
    "Northwest",
    "Eastern Premier",
    "Mountain Alliance",
    "Pacific Coast",
    "Gulf Belt",
    "Sun Valley",
    "Big Prairie",
    "Capital Atlantic",
    "Lone Star Plains",
    "Northeast Coastal",
    "Piedmont",
    "Rocky Summit",
    "Atlantic South",
  ],
  // more conference names for the full-size league (31 conferences)
  CONFN_MORE = [
    "Midwest Valley",
    "Big River",
    "Bluegrass",
    "Coastal Plains",
    "Desert West",
    "Evergreen",
    "Frontier",
    "Great Basin",
    "Harbor",
    "Keystone",
    "Lakeshore",
    "Magnolia",
    "North Woods",
    "Ozark",
    "Prairie Rim",
  ];
function W_tr(R) {
  let a = [...R].sort((x, y) => y.o - x.o).slice(0, 8),
    w = [0.2, 0.17, 0.15, 0.13, 0.1, 0.09, 0.08, 0.08].slice(0, a.length);
  return Math.round(a.reduce((q, p, i) => q + p.o * w[i], 0) / (w.reduce((x, y) => x + y, 0) || 1));
}
// Real rosters: a school's real 2026-27 players as compact AI players. Last season's real per-game stats are kept as the "last season" line (hs).
// r[11] = [games, mpg, stl, blk, to, fgm, fga, tpm, tpa, ftm, fta] (season totals) from tools/add-real-stats.js
function W_realLine(r, g) {
  const x = r[11], G = x ? x[0] : g;
  return { G, p: Math.round(r[6] * G), r: Math.round(r[7] * G), a: Math.round(r[8] * G), s: x ? x[2] : 0, b: x ? x[3] : 0, t: x ? x[4] : 0 };
}
// Real-life injuries (REAL_INJURIES, from tools/fetch-injuries.js): a hurt player on your roster starts the season injured for the real number of games
function W_applyRealInjuries(o, school) {
  if (typeof REAL_INJURIES === "undefined") return;
  const k = (n) => String(n || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z]/g, "");
  for (const [name, sc, inj, g] of REAL_INJURIES) {
    if (k(sc) !== k(school)) continue;
    const p = o.roster.find((x) => k(x.name) === k(name));
    if (!p || g <= 0) continue;
    p.injury = g;
    p.ih = { n: 1, g, major: g >= 8 ? 1 : 0 };
    p.realInj = inj;
    Be(o, "Injury report", `${p.name} is hurt in real life (${inj}) and will miss ${g} games.`);
  }
}
function W_realMk(e, t) {
  const rt = REAL_ON && REAL_TEAMS[t.name];
  if (!rt) return null;
  const g = Math.max(20, rt.w + rt.l),
    R = rt.r.slice(0, 13).map((r) => {
      const rs = j(e, 1, 2147483647),
        p = { i: Ff(e, "w"), rl: 1, n: r[0], p: r[1], y: r[2], o: r[4], t: Math.max(r[4], r[5]), k: r[12] || undefined, f: (typeof REAL_PHOTO_SEED === "function" && REAL_PHOTO_SEED(r[0], t.name)) || rs, s: { g: 0, p: 0, r: 0, a: 0, s: 0, b: 0, t: 0 } };
      if (typeof REAL_INJURIES !== "undefined") { const ik = (n) => String(n || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z]/g, ""), hit = REAL_INJURIES.find((x) => ik(x[0]) === ik(r[0]) && ik(x[1]) === ik(t.name)); hit && hit[3] > 0 && (p.ij = hit[3]); }
      if (r[6] != null) { const L = W_realLine(r, g); p.hs = [{ y: e.year - 1, g: L.G, p: L.p, r: L.r, a: L.a, s: L.s, b: L.b, t: L.t }]; }
      return p;
    });
  const lo = R.length ? Math.min(...R.map((p) => p.o)) : 55;
  while (R.length < 12) R.push(W_p(e, lo - 4 + j(e, -3, 2), j(e, 1, 2), Le[R.length % 5]));
  R.sort((a, b) => b.o - a.o);
  t.rating = W_tr(R);
  return R;
}
// a real portal player (row layout as REAL_TEAMS, last team in r[9]) as a full prospect with his real stat line as history
function W_realPortalP(e, r) {
  const o = r[4], P = Gf(e, "Transfer", o, r[2], r[1]);
  P.name = r[0]; P.height = r[3]; P.age = 17 + r[2]; P.rl = 1;
  const sd = typeof REAL_PHOTO_SEED === "function" && REAL_PHOTO_SEED(r[0], "_portal");
  sd && (P.faceSeed = sd);
  let a = P.attrs.slice();
  r[12] && (a = a.map((v, i) => le(v + W_kOff(r[12], i), 25, 96)));
  for (let k = 0; k < 8; k++) { const d = o - W_ovr(a, P.pos); if (!d) break; a = a.map((v) => le(v + d, 25, 96)); }
  P.attrs = a; P.ovr = W_ovr(a, P.pos); P.potential = Math.max(P.ovr, r[5]);
  const x = r[11], gp = x ? x[0] : 30;
  P.history = [{ year: e.year - 1, team: r[9], stats: { ...zs(), gp, min: Math.round((x ? x[1] : 20) * gp), pts: Math.round(r[6] * gp), reb: Math.round(r[7] * gp), ast: Math.round(r[8] * gp), stl: x ? x[2] : 0, blk: x ? x[3] : 0, to: x ? x[4] : 0, fgm: x ? x[5] : 0, fga: x ? x[6] : 0, tpm: x ? x[7] : 0, tpa: x ? x[8] : 0, ftm: x ? x[9] : 0, fta: x ? x[10] : 0 } }];
  return P;
}
// the same real player as a full user-roster player (attributes shifted so the overall comes out at the real rating)
function W_realPlayer(e, r, school) {
  const o = r[4],
    P = Gf(e, "Roster", o, r[2], r[1]);
  P.name = r[0];
  P.height = r[3];
  P.age = 17 + r[2];
  P.rl = 1;
  const sd = typeof REAL_PHOTO_SEED === "function" && REAL_PHOTO_SEED(r[0], school);
  sd && (P.faceSeed = sd);
  let a = P.attrs.slice();
  r[12] && (a = a.map((v, i) => le(v + W_kOff(r[12], i), 25, 96)), (P.tend = Object.assign({}, P.tend, { k: r[12] })));
  for (let k = 0; k < 8; k++) {
    const d = o - W_ovr(a, P.pos);
    if (!d) break;
    a = a.map((v) => le(v + d, 25, 96));
  }
  P.attrs = a;
  P.ovr = W_ovr(a, P.pos);
  P.potential = Math.max(P.ovr, r[5]);
  if (r[6] != null) {
    const x = r[11], L = W_realLine(r, 30);
    P.history = [{ year: e.year - 1, team: r[9] || school, stats: { ...zs(), gp: L.G, min: Math.round((x ? x[1] : 20) * L.G), pts: L.p, reb: L.r, ast: L.a, stl: L.s, blk: L.b, to: L.t, fgm: x ? x[5] : 0, fga: x ? x[6] : 0, tpm: x ? x[7] : 0, tpa: x ? x[8] : 0, ftm: x ? x[9] : 0, fta: x ? x[10] : 0 } }];
  }
  return P;
}
function W_p(e, o, y, pos) {
  let v = le(Math.round(o), 38, 97);
  return {
    i: Ff(e, "w"),
    n: W_pName(e),
    p: pos || jl(e, Le),
    y: y,
    o: v,
    t: le(v + (y <= 2 ? j(e, 4, 18) : y === 3 ? j(e, 1, 8) : 0), v, 98),
    f: j(e, 1, 2147483647),
    s: { g: 0, p: 0, r: 0, a: 0, s: 0, b: 0, t: 0 },
  };
}
function W_mk(e, rating) {
  let cl = [4, 3, 4, 3, 2, 3, 2, 4, 2, 1, 1, 1, 1];
  for (let k = 0; k < cl.length - 1; k++) ne(e) < 0.3 && ([cl[k], cl[k + 1]] = [cl[k + 1], cl[k]]);
  let off = j(e, 0, 4),
    R = [
      ...[7, 5, 3.5, 2, 1, 0, -1.5, -3, -5, -7, -9, -11, -13].map((d, i) =>
        W_p(e, rating + d + j(e, -3, 3), cl[i], Le[(i + off) % 5])
      ),
    ],
    g = rating - W_tr(R);
  R.forEach((p) => {
    ((p.o = le(Math.round(p.o + g), 38, 97)), (p.t = le(Math.max(p.o, Math.round(p.t + g)), p.o, 98))); // whole numbers even when the league boost makes the target a half point
  });
  if (ne(e) < le((rating - 58) / 38, 0.05, 0.85)) {
    let f = R.filter((p) => p.y === 1).sort((a, b) => b.o - a.o)[0];
    f && ((f.o = le(Math.round(rating + j(e, 2, 9)), 60, 93)), (f.t = le(f.o + j(e, 4, 10), f.o, 98)));
  }
  return R.sort((a, b) => b.o - a.o);
}
function W_conf(e) {
  let inL = new Set(e.league.map((x) => x.id)),
    // strongest teams go to the biggest leagues, but not perfectly (a +-9 rating shuffle), so power leagues still have weak members
    rest = e.opponents
      .filter((x) => !inL.has(x.id))
      .map((x) => [x, x.rating + (ne(e) - 0.5) * 8])
      .sort((a, b) => b[1] - a[1])
      .map((z) => z[0]);
  if (REAL_ON) {
    // real conferences: every other school sits in the conference it really plays in
    const g = new Map();
    for (const x of rest) {
      const c = W_rc(x);
      g.has(c) || g.set(c, []);
      g.get(c).push(x);
    }
    const mean = (a) => a.reduce((q, x) => q + x.rating, 0) / a.length,
      order = [...g.entries()].sort((a, b) => mean(b[1]) - mean(a[1]));
    e.confs = [e.league.map((x) => x.id), ...order.map(([, a]) => a.map((x) => x.id))];
    e.confNames = [e.school.league, ...order.map(([c]) => c)];
  } else {
    e.confs = [e.league.map((x) => x.id)];
    let at = 0;
    for (let s of confSizes(rest.length, e.nt || 200, e.league.length)) (e.confs.push(rest.slice(at, at + s).map((x) => x.id)), (at += s));
    e.confNames = [e.school.league, ...[...CONFN, ...(e.nt > 200 ? CONFN_MORE : [])].filter((x) => x !== e.school.league)];
  }
  e.confs.forEach((g, ci) =>
    g.forEach((id) => {
      (e.league.forEach((l) => {
        l.id === id && (l.conf = ci);
      }),
        e.opponents.forEach((t) => {
          t.id === id && (t.conf = ci);
        }));
    })
  );
}
// More team names for the full-size league: 36 place words x 4 forms, skipping any name already in use.
var GEN_WORDS = ["Alder", "Briar", "Copperfield", "Dunmore", "Eastgate", "Fairhaven", "Glenrock", "Halston", "Ivywood", "Juniper", "Kestrel", "Larkspur", "Marlow", "Northfield", "Oakhurst", "Prescott", "Quarry", "Redfern", "Stonebrook", "Thornbury", "Umber", "Valemont", "Westmere", "Yarrow", "Zephyr", "Ashford", "Blackwater", "Crestview", "Driftwood", "Elmhurst", "Foxhall", "Greystone", "Hawthorne", "Kingsley", "Lockwood", "Maplewood"];
function W_genName(k, taken) {
  let used = new Set([...ONX, ...Xl.map((h) => h.name), ...(taken || [])]),
    out = [];
  for (let f of [(w) => `${w} State`, (w) => `${w} Tech`, (w) => `Northern ${w}`, (w) => `${w} A&M`])
    for (let w of GEN_WORDS) used.has(f(w)) || out.push(f(w));
  return out[k] || `Team ${k}`;
}
function W_teams(e) {
  let nt = e.nt || 200;
  let have = new Set(e.opponents.map((x) => x.id)),
    tb = REAL_ON ? 0 : [0, 1, 3, 5, 7][tierOf(e)],
    mine = e.school.generated ? e.school.gi : -1; // a school picked from the generated ones takes the place of team t<gi>
  for (let i = 0; i < nt - Xl.length; i++) {
    if (have.has(`t${i}`) || i === mine) continue;
    let nm = ONX[i] || W_genName(i - ONX.length);
    if (nt > 200 && (ONX[i] ? e.opponents.some((o) => o.name === nm) || e.school.name === nm || Xl.some((h) => h.name === nm) : false)) {
      // a name used twice in the old lists: take the next unused generated name instead
      let k = 0;
      while (e.opponents.some((o) => o.name === W_genName(k, [e.school.name])) || W_genName(k, [e.school.name]) === e.school.name) k++;
      nm = W_genName(k, [e.school.name]);
    }
    e.opponents.push({
      id: `t${i}`,
      name: nm,
      short: REAL_BY_NAME[nm]
        ? REAL_BY_NAME[nm].short
        : nm
            .split(" ")
            .map((d) => d[0])
            .join(""),
      rating: REAL_BY_NAME[nm] ? le(REAL_BY_NAME[nm].rating + tb, 44, 94) : le(Math.round(44 + ((ne(e) + ne(e) + ne(e)) / 3) * 52 + tb), 46, 94),
      ...(REAL_BY_NAME[nm] && REAL_BY_NAME[nm].nil != null ? { budget: REAL_BASE(REAL_BY_NAME[nm].nil) } : {}),
      wins: 0,
      losses: 0,
      cw: 0,
      cl: 0,
    });
  }
  if (nt > 200) {
    // full-size league: no two schools share a name (the old lists repeat a few, and some match a named school)
    let seen = new Set([e.school.name, ...Xl.map((h) => h.name)]);
    for (let o of e.opponents) {
      if (!/^t\d+$/.test(o.id)) continue;
      if (seen.has(o.name)) {
        let k = 0;
        while (seen.has(W_genName(k, e.opponents.map((q) => q.name)))) k++;
        ((o.name = W_genName(k, e.opponents.map((q) => q.name))),
          (o.short = o.name
            .split(" ")
            .map((d) => d[0])
            .join("")));
      }
      seen.add(o.name);
    }
  }
  for (let h of Xl)
    h.id !== e.school.id &&
      !have.has(h.id) &&
      e.opponents.push({
        id: h.id,
        name: h.name,
        short: h.short,
        rating: le(h.rating + tb, 44, 92),
        wins: 0,
        losses: 0,
        cw: 0,
        cl: 0,
      });
}
function W_init(e) {
  (W_teams(e), (e.rosters = e.rosters || {}));
  // TUNE.leagueBoost (rating points): every other school starts this much stronger. Added when better Auto-recruit made your teams stronger than the balance anchors
  // (see CLAUDE.md, Balance). e.lb remembers how much has been applied; W_off lifts older careers to the current value one offseason at a time.
  const fresh = !e.wm;
  if (fresh && e.lb == null && TUNE.leagueBoost) e.lb = TUNE.leagueBoost;
  if (REAL_ON) for (let t of e.opponents) e.rosters[t.id] || ((rr) => rr && (e.rosters[t.id] = rr))(W_realMk(e, t));
  for (let t of e.opponents)
    ((t.coach = t.coach || { n: "Coach " + jl(e, CS), r: j(e, 42, 84) }),
      e.rosters[t.id] || ((fresh && e.lb && (t.rating = le(t.rating + e.lb, 44, 96))), (e.rosters[t.id] = W_mk(e, t.rating)), (fresh && e.lb && (t.rating = TS(String(t.id)) & 1 ? Math.ceil(t.rating) : Math.floor(t.rating)))));  // whole-number rating; half the teams round up and half down, so the average stays put
  // conference rivals are kept in e.league as well; show the same (boosted, whole-number) rating as their roster
  if (fresh && (e.lb || REAL_ON))
    for (let l of e.league || []) {
      let t = e.opponents.find((z) => z.id === l.id);
      t && l.id !== e.school.id && (l.rating = t.rating);
    }
  ((e.lnews = e.lnews || []),
    (e.draftLog = e.draftLog || []),
    (e.wm = e.wm || Math.round(e.opponents.reduce((q, t) => q + t.rating, 0) / e.opponents.length)));
  W_conf(e);
  W_nilInit(e);
}
