// Archetype: a style label worked out from position, attributes and shot tendency (nothing is stored, so old saves get it too).
// Attribute slots: 0 finishing, 1 midrange, 2 three, 4 handling, 5 passing, 6 perimeter D, 7 interior D, 9 blocks, 10/11 rebounding, 12 speed, 14 vertical.
function W_arch(p) {
  let a = p.attrs || [],
    g = (i) => a[i] || 50,
    guard = p.pos === "PG" || p.pos === "SG",
    big = p.pos === "PF" || p.pos === "C",
    three = p.tend?.three ?? 0.3;
  if (guard && g(4) >= 70 && g(5) >= 66) return "Lead guard";
  if (big && (g(7) >= 72 || g(9) >= 72)) return "Rim protector";
  if (big && (g(2) >= 62 || three >= 0.4)) return "Stretch big";
  if (big && Math.max(g(10), g(11)) >= 72) return "Glass cleaner";
  if (big) return "Post scorer";
  if (g(2) >= 68 && g(6) >= 66) return "3-and-D wing";
  if (guard && Math.max(g(0), g(1), g(2)) >= 70) return "Scoring guard";
  if (g(0) >= 68 && Math.max(g(12), g(14)) >= 68) return "Slasher";
  if (g(2) >= 68) return "Sharpshooter";
  if (g(6) >= 70) return "Perimeter stopper";
  return guard ? "Combo guard" : "Two-way forward";
}
function W_fit(e) {
  let L5 = e.lineup.map((id) => e.roster.find((p) => p.id === id)).filter(Boolean),
    n = [],
    s0 = 0,
    ck = (ok, g, b, w) => {
      ok ? ((s0 += w), n.push({ g: 1, t: g })) : ((s0 -= w * 1.3), n.push({ g: 0, t: b }));
    };
  ck(
    L5.filter((p) => p.attrs[2] >= 72).length >= 2,
    "Spacing: two or more real shooters",
    "Spacing: not enough three-point shooting",
    1.2
  );
  ck(
    L5.some((p) => p.attrs[4] >= 72),
    "A true ball handler runs the offense",
    "No one in the lineup handles the ball well",
    1.2
  );
  ck(
    L5.some((p) => p.attrs[9] >= 72 || p.attrs[7] >= 78),
    "Rim protection inside",
    "No rim protection",
    1.1
  );
  ck(
    L5.some((p) => Math.max(p.attrs[10], p.attrs[11]) >= 75),
    "Strong on the glass",
    "Weak rebounding",
    1
  );
  ck(
    L5.filter((p) => p.attrs[6] >= 72).length >= 2,
    "Solid perimeter defense",
    "Perimeter defense is a weakness",
    0.9
  );
  // Archetype balance: a creator and a finisher inside, and not a lineup of five of the same style
  let ar = L5.map(W_arch),
    cnt = {};
  ar.forEach((x) => (cnt[x] = (cnt[x] || 0) + 1));
  ck(
    ar.some((x) => x === "Lead guard" || x === "Scoring guard") &&
      ar.some((x) => x === "Rim protector" || x === "Stretch big" || x === "Post scorer" || x === "Glass cleaner"),
    "Roles fit: a guard to create and a big to finish",
    "Roles clash: no guard to create or no big man to finish",
    0.6
  );
  ck(Math.max(0, ...Object.values(cnt)) <= 2, "Mixed styles in the lineup", "Too many players with the same style", 0.6);
  let ah = L5.length ? L5.reduce((x, p) => x + p.height, 0) / L5.length : 75;
  ck(ah >= 77, "Good size across the lineup", "Undersized lineup", 0.8);
  return { s: Math.max(-5, Math.min(5, s0)), n };
}
// Item 22: scouting report on the next opponent, worked out from the same derived attributes the game engine uses (W_at).
// Categories are averages over the rotation (best 8, weighted by the usual minutes). Returns null when the opponent has no roster.
var SCOUT_CATS = [
  ["Inside scoring", [0]],
  ["Three-point shooting", [2]],
  ["Ball handling and passing", [4, 5]],
  ["Perimeter defense", [6, 8]],
  ["Interior defense", [7, 9]],
  ["Rebounding", [10, 11]],
  ["Speed and athleticism", [12, 14]],
];
function W_scout(e, g) {
  let R = e.rosters && g && e.rosters[g.oppId];
  if (!R || R.length < 6) return null;
  let M = [32, 30, 28, 26, 24, 18, 14, 10],
    prof = (rows) => {
      let tot = rows.reduce((x, r) => x + r.m, 0) || 1;
      return SCOUT_CATS.map(([, ix]) => rows.reduce((x, r) => x + (ix.reduce((y, k) => y + (r.a[k] || 50), 0) / ix.length) * r.m, 0) / tot);
    },
    opp = R.slice(0, 8).map((p, i) => ({ p, a: W_at(p), m: M[i] })),
    mine = e.roster
      .filter((p) => !p.redshirt && p.injury === 0)
      .sort((a, b) => b.minutes - a.minutes)
      .slice(0, 8)
      .map((p) => ({ a: p.attrs, m: Math.max(1, p.minutes) })),
    po = prof(opp),
    pm = mine.length ? prof(mine) : po,
    mean = po.reduce((x, y) => x + y, 0) / po.length,
    order = po.map((v, i) => [v - mean, i]).sort((a, b) => b[0] - a[0]),
    str = order.slice(0, 2).map(([, i]) => SCOUT_CATS[i][0]),
    weak = order.slice(-2).map(([, i]) => SCOUT_CATS[i][0]).reverse(),
    gap = (i) => po[i] - pm[i],
    why = [],
    offense = "Balanced",
    defense = "Man-to-man",
    pace = "Balanced";
  if (po[3] - po[4] >= 3) (offense = "Perimeter"), why.push("Their interior defense is stronger than their perimeter defense, so attack from outside.");
  else if (po[4] - po[3] >= 3) (offense = "Inside-out"), why.push("Their perimeter defense is stronger than their interior defense, so attack inside.");
  if (po[2] < mean - 3) (defense = "Full-court press"), why.push("Their ball handlers are shaky: pressure them.");
  else if (po[0] > po[1] + 3 && po[5] >= mean) (defense = "2–3 zone"), why.push("They live inside: a zone packs the paint.");
  if ((pm[6] - po[6]) >= 3) (pace = "Fast"), why.push("You are quicker: run.");
  else if ((po[6] - pm[6]) >= 3) (pace = "Slow"), why.push("They are quicker: slow it down.");
  why.length || why.push("No clear edge either way: keep the balanced plan.");
  let keys = R.slice(0, 3).map((p) => ({ name: p.n, pos: p.p, ovr: p.o, arch: W_arch({ attrs: W_at(p), pos: p.p }) }));
  return { str, weak, offense, defense, pace, why, keys, edge: SCOUT_CATS.map(([n], i) => [n, Math.round(gap(i))]) };
}
