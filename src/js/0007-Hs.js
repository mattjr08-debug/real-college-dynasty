// Minute presets for Hs. Balanced is the original rotation. s = starter base, b = bench base,
// n = bench players used, x = extra minutes for the three best players.
var MINP = {
  Balanced: { s: 28, b: 12, n: 4, note: "The normal rotation: starters play about 30 minutes, four bench players share the rest." },
  Starters: { s: 34, b: 10, n: 3, note: "Ride your starting five for about 34 minutes each, with a short three-man bench." },
  "Star player": { s: 27, b: 11, n: 4, x: 11, top: 1, note: "One star plays about 38 minutes. Pick him with the Star button in the minutes table; otherwise your best player is the star. Everyone else fills in around him." },
  Stars: { s: 27, b: 10, n: 4, x: 8, note: "Your three best players play about 35 minutes. Everyone else fills in around them." },
  "Deep bench": { s: 24, b: 16, n: 5, note: "A ten-man rotation. Fresher legs and more players happy with their minutes." },
  Development: { s: 26, b: 13, n: 4, note: "Young players with high potential get extra minutes so they grow faster." },
};
function Hs(e, keep) {
  let a = e.roster.filter((d) => !d.redshirt),
    P = MINP[e.minPreset] ? e.minPreset : "Balanced",
    Q = MINP[P],
    yb = (d) => (d.year <= 2 ? Math.max(0, d.potential - d.ovr) * 0.5 + (3 - d.year) * 2 : 0),
    t = new Map();
  // keep: leave a valid starting five alone and only redo the minutes
  if (
    !(
      keep &&
      e.lineup.length === 5 &&
      new Set(e.lineup).size === 5 &&
      e.lineup.every((d) => a.some((f) => f.id === d))
    )
  ) {
    t.set(0, { score: 0, ids: [] });
    for (let d of a) {
      let f = new Map(t);
      for (let [y, h] of t)
        for (let p = 0; p < 5; p++) {
          if (y & (1 << p)) continue;
          let C = y | (1 << p),
            v = h.score + qf(d, Le[p]);
          if (!f.has(C) || v > f.get(C).score) {
            let M = [...h.ids];
            ((M[p] = d.id), f.set(C, { score: v, ids: M }));
          }
        }
      t = f;
    }
    let l =
      t.get(31) ||
      [...t.values()].sort(
        (d, f) => f.ids.filter(Boolean).length - d.ids.filter(Boolean).length || f.score - d.score
      )[0];
    e.lineup = (l?.ids || []).filter(Boolean);
  }
  let u = a.filter((d) => !d.injury),
    o = u.length >= 5 ? u : a,
    r = o
      .filter((d) => !e.lineup.includes(d.id))
      .sort((d, f) => (P === "Development" ? f.ovr + yb(f) - (d.ovr + yb(d)) : f.ovr - d.ovr));
  e.roster.forEach((d) => {
    ((d.minutes = 0), (d.role = d.redshirt ? "Redshirt" : e.lineup.includes(d.id) ? "Starter" : "Bench"));
  });
  let n = e.lineup.map((d) => e.roster.find((f) => f.id === d)).filter((d) => o.includes(d)),
    RS = e.rotSize >= 5 && e.rotSize <= 13 ? e.rotSize - 5 : Q.n,
    BB = RS === Q.n ? Q.b : Math.max(5, Math.min(Q.b, Math.round((200 - 5 * Q.s - (Q.x || 0)) / Math.max(1, RS)))),
    i = [...n, ...r.slice(0, RS)],
    st = Q.x
      ? new Set(P === "Star player" && i.some((f) => f.id === e.starId) ? i.filter((f) => f.id === e.starId) : [...i].sort((d, f) => f.ovr - d.ovr).slice(0, Q.top || 3))
      : new Set(),
    // how much a player deserves the next minute (Balanced uses the original formula)
    kf = (y) =>
      (qf(y, y.pos) + y.attrs[15] * 0.08) *
      (P === "Stars" || P === "Star player" ? Math.pow(y.ovr / 70, 4) : P === "Development" ? 1 + yb(y) / 25 : 1);
  if (i.length >= 5) {
    let d = 0;
    for (let f of i) ((f.minutes = (n.includes(f) ? Q.s : BB) + (st.has(f) ? Q.x : 0)), (d += f.minutes));
    for (; d < 200;) {
      let f = [...i]
        .filter((y) => y.minutes < 40)
        .sort((y, h) => kf(h) / (h.minutes + 1) - kf(y) / (y.minutes + 1))[0];
      (f.minutes++, d++);
    }
    for (; d > 200;) {
      let f = [...i].sort((y, h) => h.minutes - y.minutes)[0];
      (f.minutes--, d--);
    }
  }
  for (let d of e.roster)
    !d.redshirt && !e.lineup.includes(d.id) && (d.role = d.minutes > 8 ? "Rotation" : "Bench");
}
