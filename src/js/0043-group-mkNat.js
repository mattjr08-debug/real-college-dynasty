// Builds the national tournament rounds. With ff ({a, b}: ids of the First Four teams) the field is 68 teams:
// round 0 is the four First Four games and round 1 the round of 64 with four "First Four winner" places that Rn fills in.
// Without ff it is a plain 64-team field with one round (old saves).
// The four regions play in different cities, and the host cities change every year.
var NAT_CITIES = ["Washington", "Houston", "Chicago", "Los Angeles", "Atlanta", "Boston", "Dallas", "Seattle"],
  NAT_FINAL_CITIES = ["Indianapolis", "Phoenix", "San Antonio", "New Orleans", "Minneapolis", "Atlanta"];
function natRegions(year) {
  return ["East", "South", "Midwest", "West"].map((n, i) => ({ n, c: NAT_CITIES[(year + i * 2) % 8] }));
}
// "East Region (Washington), South Region (Houston), ..." and where the Final Four is played
function natRegionText(year) {
  return (
    natRegions(year)
      .map((r) => r.n + " (" + r.c + ")")
      .join(", ") +
    ". Final Four: " +
    NAT_FINAL_CITIES[year % 6]
  );
}
// Item 47: the NIT, a second postseason event for the best 32 teams left out of the national tournament (seeds 1 to 8, four teams each).
var NIT_NAMES = ["First round", "Second round", "Quarterfinals", "Semifinals", "Final"];
// Where one of your seasons ended in the NIT, read from the saved bracket (me: true marks your games). null when you were not in the NIT.
function nitFinish(x) {
  if (!x) return null;
  if (x.result === "NIT champions") return "NIT champions";
  if (x.result === "NIT runner-up") return "NIT runner-up";
  let last = -1;
  (x.nit || []).forEach((r, i) => { if ((r || []).some((g) => g.me)) last = i; });
  if (last < 0) return null;
  return "NIT " + (["first round", "second round", "quarterfinals", "semifinals", "final"][last] || "round " + (last + 1));
}
function mkNit(e, ts) {
  ts.forEach((h, k) => (e.seedMap[h.id] = Math.floor(k / 4) + 1));
  let g = [];
  for (let rg = 0; rg < 4; rg++)
    for (let [x, y] of [
      [1, 8],
      [4, 5],
      [3, 6],
      [2, 7],
    ])
      g.push({ a: ts[(x - 1) * 4 + rg], b: ts[(y - 1) * 4 + rg] });
  return [g];
}
// plays the whole NIT between computer teams and keeps the result in e.nitBracket (the national tournament state is left alone)
function runNit(e, ts) {
  let b0 = e.bracket,
    r0 = e.tournamentRound,
    t0 = e.tournament;
  ((e.bracket = mkNit(e, ts)), (e.tournamentRound = 0), (e.tournament = "NIT"));
  while (e.bracket[e.tournamentRound]?.length) Rn(e, !1);
  ((e.nitBracket = cbk(e, e.bracket)), (e.bracket = b0), (e.tournamentRound = r0), (e.tournament = t0));
}
// Round names for the national tournament; the list starts with "First Four" when the first round holds First Four games.
function natNames(ff) {
  let n = ["Round of 64", "Round of 32", "Sweet 16", "Elite Eight", "Final Four", "Championship"];
  return ff ? ["First Four", ...n] : n;
}
function mkNat(e, ts, user, r, ff) {
  let ss = [...ts],
    pa = [],
    pb = [];
  if (ff) {
    let play = (t) => ff.a.has(t.id) || ff.b.has(t.id),
      direct = ss.filter((t) => !play(t)),
      ph = (id) => ({ id, name: "First Four winner", short: "TBD", rating: 0, wins: 0, losses: 0, cw: 0, cl: 0 });
    ((pa = ss.filter((t) => ff.a.has(t.id))), (pb = ss.filter((t) => ff.b.has(t.id))));
    ss = [...direct.slice(0, 46), ph("ffA0"), ph("ffA1"), ...direct.slice(46)];
    ss.splice(62, 0, ph("ffB0"), ph("ffB1"));
  }
  e.seedMap = {};
  ss.forEach((h, k) => (e.seedMap[h.id] = Math.floor(k / 4) + 1));
  if (ff) {
    pa.forEach((t) => (e.seedMap[t.id] = 12));
    pb.forEach((t) => (e.seedMap[t.id] = 16));
  }
  let ord = [
      [1, 16],
      [8, 9],
      [5, 12],
      [4, 13],
      [6, 11],
      [3, 14],
      [7, 10],
      [2, 15],
    ],
    g = [];
  for (let rg = 0; rg < 4; rg++)
    for (let [x, y] of ord) g.push({ a: ss[(x - 1) * 4 + rg], b: ss[(y - 1) * 4 + rg] });
  if (!ff) return [g];
  let at = (id) => {
    let gi = g.findIndex((u) => u.a.id === id || u.b.id === id);
    return [gi, g[gi].a.id === id ? "a" : "b"];
  };
  return [
    [
      { a: pa[0], b: pa[3], ff: 1, slot: at("ffA0") },
      { a: pa[1], b: pa[2], ff: 1, slot: at("ffA1") },
      { a: pb[0], b: pb[3], ff: 1, slot: at("ffB0") },
      { a: pb[1], b: pb[2], ff: 1, slot: at("ffB1") },
    ],
    g,
  ];
}
