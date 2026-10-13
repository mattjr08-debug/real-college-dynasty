function jf(e) {
  e.walkons = [];
  let pe = [0.025, 0.03, 0.04, 0.05, 0.06][tierOf(e)],
    pf = 0.005 * (tierOf(e) + 1),
    sp = {};
  if (ne(e) < pe) {
    let c = 1 + (ne(e) < 0.25 ? 1 : 0);
    for (let k = 0; k < c; k++) sp[j(e, 0, 99)] = [60, 65];
  }
  if (ne(e) < pf) {
    let c = 1 + (ne(e) < 0.25 ? 1 : 0);
    for (let k = 0; k < c; k++) sp[j(e, 0, 99)] = [66, 70];
  }
  for (let a = 0; a < 100; a++) {
    let t = ne(e),
      u = sp[a] ? j(e, sp[a][0], sp[a][1]) : t < 0.175 ? j(e, 49, 56) : j(e, 35, 48),
      o = Gf(e, "Walk-on", u, 1, PP[a % 20]),
      r = u,
      n = r - o.ovr;
    ((o.attrs = o.attrs.map((i) => le(i + n, 25, 99))),
      (o.ovr = r),
      (o.potential = le(o.potential + n, r, 98)),
      (o.nil = 0),
      (o.ask = 0),
      (o.stars = 0),
      (o.scouted = 2),
      (o.interest = fl(e, o)),
      e.walkons.push(o));
  }
}
// Chance (percent) that a walk-on says yes. TUNE.walkonFloor (90) is the least any walk-on gives, rare 60+ ones included.
function fl(e, a) {
  return Math.max(
    a.ovr >= 60 ? Math.round(le(28 + e.rep * 0.35, 28, 70)) : a.ovr >= 50 ? 85 : 98,
    TUNE.walkonFloor || 0
  );
}
function Xa(e, a = "") {
  return (
    e.roster.filter((t) => t.id !== a && t.promise === "Starter").length +
    e.prospects.filter((t) => t.id !== a && t.status === "Available" && t.offer?.role === "Starter").length
  );
}
function Xf(e, t) {
  return e.rating < t + 15 ? 0 : Math.round((5e4 + (e.rating - t - 15) * 6500) / 5e3) * 5e3;
}
function W_adj(e, m) {
  let r = ne(e),
    d = r < 0.2 ? -2 : r > 0.75 ? 2 : 0;
  (d && ((m.attrs = m.attrs.map((a) => le(a + d, 25, 99))), (m.ovr = W_ovr(m.attrs, m.pos))),
    Be(
      e,
      "Position change",
      `${m.name} has adjusted to ${m.pos}${d > 0 ? " and is thriving there (+2)" : d < 0 ? " but is struggling with it (-2)" : ", with no real change in his game"}.`
    ));
}
function fitOf(e, a) {
  return e?.pos === a ? (e.adj > 0 ? 0.3 : 0) : e?.pos2 === a ? 0.25 : 1;
}
function qf(e, a) {
  let t = Le.indexOf(e.pos),
    l = Le.indexOf(a),
    u = e.pos2 === a ? 0 : Math.abs(t - l),
    o =
      l === 0
        ? (e.attrs[4] + e.attrs[5]) / 2
        : l === 1
          ? (e.attrs[2] + e.attrs[6]) / 2
          : l === 2
            ? (e.attrs[0] + e.attrs[6]) / 2
            : l === 3
              ? (e.attrs[7] + e.attrs[11]) / 2
              : (e.attrs[7] + e.attrs[9] + e.attrs[11]) / 3;
  return (
    e.ovr * 0.75 +
    o * 0.25 -
    (e.pos2 === a ? 1.5 : u === 0 ? 0 : u === 1 ? 4 : u === 2 ? 11 : 20) -
    (e.injury ? 45 : 0)
  );
}
