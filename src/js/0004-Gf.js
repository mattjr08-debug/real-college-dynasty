var INTL_COUNTRIES = ["Serbia", "Australia", "Nigeria", "France", "Canada", "Lithuania", "Brazil", "Spain", "Germany", "Senegal", "Croatia", "New Zealand"];
// A made-up player's name. It never matches a real player (the R badge is only for real players), so a name that is on the real list is drawn again.
function W_pName(e) {
  let n;
  for (let k = 0; k < 8; k++) { n = jl(e, SS) + " " + jl(e, CS); if (!W_isRealName(n)) break; }
  return n;
}
function Gf(e, a, t, l = 1, u = jl(e, Le)) {
  let o = W_pName(e),
    r = Le.indexOf(u),
    n = il.map((y, h) =>
      le(
        t +
          j(e, -12, 12) +
          (r < 2
            ? [4, 5, 6, 8, 12].includes(h)
              ? 8
              : [7, 9, 10, 11, 13].includes(h)
                ? -8
                : 0
            : r > 2
              ? [7, 9, 10, 11, 13].includes(h)
                ? 8
                : [4, 5, 12].includes(h)
                  ? -8
                  : 0
              : 0),
        25,
        96
      )
    ),
    i = W_ovr(n, u),
    d = t < 51 ? 0 : t < 57 ? 1 : t < 64 ? 2 : t < 72 ? 3 : t < 80 ? 4 : 5,
    f = (d) =>
      Math.round(
        ((e.mkt || 1) *
          (e.pm?.[u] || 1) *
          (4e3 + Math.pow(Math.max(2, t - 43), 2) * 110 * (t >= 64 ? 2.1 : 1)) *
          (a === "Transfer" ? 1.15 : a === "High school" ? 0.7 : 1) *
          (a === "Roster"
            ? 1
            : ((x) =>
                (a === "High school" ? d <= 3 : d <= 2) ? Math.min(1, x) : d >= 4 ? Math.max(1, x) : x)(
                1 + le((60 - e.rep) / 60, -0.4, 1) * (0.15 + 0.06 * d)
              ) * (d >= 3 ? [1, 1, 1, 0.96, 0.92][tierOf(e)] : 1))) /
          1e3
      ) * 1e3,
    p2 =
      ne(e) < 0.6
        ? jl(e, { PG: ["SG"], SG: ["PG", "SF"], SF: ["SG", "PF"], PF: ["SF", "C"], C: ["PF"] }[u])
        : "";
  let P = {
    id: Ff(e, "p"),
    name: o,
    pos: u,
    pos2: p2,
    age: 17 + l,
    height:
      (a === "Walk-on" ? [69, 72, 75, 77, 79] : [73, 76, 79, 81, 83])[r] +
      (a === "Walk-on" ? j(e, -3, 3) : j(e, -2, 2)),
    year: l,
    number: j(e, 0, 55),
    portrait: j(e, 0, 15),
    faceSeed: j(e, 1, 2147483647),
    hsStars: d,
    pers: jl(e, ["Loyal", "Ambitious", "Patient", "Money-focused"]),
    home: j(e, 0, 4),
    prefs: {
      nil: j(e, 5, 30),
      time: j(e, 5, 30),
      dev: j(e, 5, 30),
      win: j(e, 5, 30),
      home: j(e, 0, 20),
      coach: j(e, 0, 20),
    },
    tend: {
      three: le(
        0.36 + (n[2] - 60) * 0.006 + (r < 2 ? 0.1 : r > 2 ? -0.16 : 0) + j(e, -6, 6) / 100,
        0.04,
        0.72
      ),
    },
    dev: jl(e, ["Late bloomer", "Steady", "Steady", "Plateau", "Boom"]),
    pn: j(e, -8, 8),
    intl: a === "High school" && ne(e) < 0.07,
    progress: 0,
    origin: a,
    ovr: i,
    potential: le(i + j(e, 5, 23), i, 98),
    attrs: n,
    morale: j(e, 55, 82),
    nil: a === "Roster" ? Math.round((f(d) * 0.65) / 1e3) * 1e3 : 0,
    ask: f(d),
    role: "Bench",
    promise: "Bench",
    minutes: 0,
    training: "Balanced",
    redshirt: !1,
    redshirtUsed: !1,
    injury: 0,
    stars: d,
    source: a,
    priority: jl(e, ["NIL", "Playing time", "Development", "Winning"]),
    interest: le(85 - d * 13 + (TUNE.coachRep ? W_recRep(e) : e.rep) * 0.4 + j(e, -8, 12), 5, 95),
    scouted: a === "Roster" ? 2 : 0,
    target: !1,
    status: "Available",
    stats: zs(),
    history: [],
    recent: [],
    growth: 0,
    newSigning: !1,
    talked: !1,
  };
  // International prospects (item 33) arrive with a different profile: more skill (shooting, passing), less strength and
  // athleticism, a lower rating now and a much higher ceiling. They also develop faster in their first two years (see wS).
  if (P.intl) {
    ((P.cty = jl(e, INTL_COUNTRIES)),
      (P.attrs = P.attrs.map((v, i) =>
        le(v + ([1, 2, 3, 5].includes(i) ? 5 : [12, 13, 14].includes(i) ? -6 : 0), 25, 96)
      )),
      (P.ovr = Math.max(40, W_ovr(P.attrs, u) - 2)),
      (P.potential = le(P.ovr + j(e, 9, 28), P.ovr, 98)),
      (P.tend = { ...P.tend, three: le((P.tend.three || 0.3) + 0.1, 0.04, 0.72) }));
  }
  // Stars come from potential, size, athleticism and production, not overall alone (see starRate).
  let sr = starRate(P);
  if (sr !== d) {
    ((P.interest = le(P.interest + (d - sr) * 13, 5, 95)), (P.stars = P.hsStars = sr), (P.ask = f(sr)));
    a === "Roster" && (P.nil = Math.round((P.ask * 0.65) / 1e3) * 1e3);
  }
  return P;
}
