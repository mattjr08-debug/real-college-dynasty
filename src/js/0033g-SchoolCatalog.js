// All 360 schools can be picked on the Choose a School screen (October 2026).
//   - The 30 hand-written schools (Xl) are shown as they always were.
//   - The other 330 are made once, the same way every time (a fixed seed), by running the league builder on a throw-away league:
//     names come from the usual team-name lists, conferences from the 31-conference template, NIL budgets from W_nilInit.
//   - Picking one of them (id "t57", say) starts a career at that school: sy() gives you the school below and leaves that team out
//     of the other teams (see W_teams), so the league still has 360 schools.
var _XG = null;
var XG_CITIES = ["Springfield", "Fairview", "Riverton", "Lakewood", "Brookfield", "Hillcrest", "Oakdale", "Millbrook", "Clearwater", "Ridgemont", "Stonebridge", "Pinehurst"];
var XG_STATES = ["AL", "AR", "AZ", "CA", "CO", "FL", "GA", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "SC", "SD", "TN", "TX", "UT", "VA", "WA", "WI", "WV"];
var XG_COLORS = ["#4c9eff", "#c58aff", "#f27935", "#38c4af", "#69bc8a", "#e8bf55", "#ed5e58", "#68a2db", "#9c8fff", "#e0a555", "#d9534f", "#58b368", "#8d7bd6", "#4fc0c8", "#c75c5c", "#e6c24a", "#3aa6a0", "#d4a43a", "#a63d6b", "#35b6a1", "#5a6fd6", "#e07a3d"];
function W_diffText(base) {
  const t = tierOf({ school: { budget: base } });
  return ["Shoestring budget · 5-yr grace", "Small budget · 4-yr grace", "Mid budget · 3-yr grace", "Big budget · 3-yr grace", "Elite budget · 2-yr grace"][t];
}
function W_catalog() {
  if (_XG) return _XG;
  const e = { nt: REAL_N, opponents: [], school: { id: "__catalog", name: "", budget: 5e5, rating: 70, league: "" }, rng: 90210, seq: 0, year: 2026, league: [], mkt: 1 };
  W_teams(e);
  // conferences: strongest teams first, with a little shuffle, in the template sizes (the same idea as W_conf)
  const ord = e.opponents.map((x) => [x, x.rating + (ne(e) - 0.5) * 8]).sort((a, b) => b[1] - a[1]).map((z) => z[0]),
    names = [...CONFN, ...CONFN_MORE];
  e.confs = [];
  e.confNames = [];
  let at = 0;
  CONF_TEMPLATE.forEach((s, ci) => {
    e.confs.push(ord.slice(at, at + s).map((x) => x.id));
    e.confNames.push(names[ci]);
    at += s;
  });
  if (REAL_ON) {
    // real conferences instead of the made-up template
    const g = new Map();
    for (const x of e.opponents) {
      const c = W_rc(x);
      g.has(c) || g.set(c, []);
      g.get(c).push(x.id);
    }
    const mean = (ids) => ids.reduce((q, id) => q + e.opponents.find((z) => z.id === id).rating, 0) / ids.length,
      order = [...g.entries()].sort((a, b) => mean(b[1]) - mean(a[1]));
    e.confs = order.map(([, ids]) => ids);
    e.confNames = order.map(([c]) => c);
  }
  W_nilInit(e);
  const mas = Object.keys(MAS),
    out = [];
  for (const o of e.opponents) {
    const xl = Xl.find((h) => h.id === o.id);
    if (xl) {
      out.push(xl);
      continue;
    }
    const gi = parseInt(o.id.slice(1), 10),
      h = TS(o.id + "|" + o.name),
      ci = e.confs.findIndex((c) => c.includes(o.id)),
      rating = Math.max(42, Math.min(REAL_ON ? 99 : 80, o.rating)),
      budget = o.budget,
      word = o.name.replace(/^Northern /, "").split(" ")[0],
      wins = (REAL_TEAMS[o.name] || {}).w ?? Math.max(2, Math.min(26, Math.round((rating - 44) * 0.68 + 2.5 + ((h >> 3) % 5) - 2))),
      rep = REAL_REP(o.name) ?? Math.max(5, Math.min(70, Math.round(6 + (rating - 44) * 1.45 + ((h >> 5) % 7) - 3))),
      t = W_nilTier(budget);
    out.push({
      id: o.id,
      gi,
      generated: true,
      name: o.name,
      mascot: (REAL_BY_NAME[o.name] || {}).mascot || mas[h % mas.length],
      short: o.short,
      city: (REAL_BY_NAME[o.name] || {}).city || `${XG_CITIES[(h >> 7) % XG_CITIES.length]}, ${XG_STATES[(h >> 11) % XG_STATES.length]}`,
      color: (REAL_BY_NAME[o.name] || {}).color || XG_COLORS[h % XG_COLORS.length],
      wins,
      losses: (REAL_TEAMS[o.name] || {}).l ?? 30 - wins,
      budget,
      rep,
      rating,
      league: e.confNames[ci],
      difficulty: W_diffText(budget),
      story:
        t.n <= 2
          ? `${wins} wins last year in the ${e.confNames[ci]}. The money is there. The wins are expected.`
          : t.n <= 4
            ? `${wins} wins last year in the ${e.confNames[ci]}. A steady program with room to climb.`
            : `${wins} wins last year in the ${e.confNames[ci]}. A small budget, a patient fan base, and nothing to lose.`,
    });
  }
  return (_XG = out);
}
function W_schoolById(id) {
  return Xl.find((h) => h.id === id) || W_catalog().find((h) => h.id === id);
}
// The tier groups for the Choose a School page: [{ tier, schools (richest first), pct }]
function W_schoolTiers() {
  const all = W_catalog(),
    g = NIL_TIERS.map((t) => ({ tier: t, schools: [] }));
  for (const s of all) g[W_nilTier(s.budget).n - 1].schools.push(s);
  g.forEach((x) => {
    x.schools.sort((a, b) => b.budget - a.budget);
    x.pct = Math.round((x.schools.length / all.length) * 1000) / 10;
  });
  return g;
}
