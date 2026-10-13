function W_don(e, a, g) {
  let d = (e.don = e.don || { ex: 50, co: 50 }),
    u = a.wins >= g;
  ((d.ex = le(
    Math.round(
      d.ex +
        (a.wins - g) * 1.3 +
        (String(e.berth || "").includes("berth") ? 4 : 0) +
        (e.result === "National champions" ? 10 : 0)
    ),
    5,
    95
  )),
    (d.co = le(
      Math.round(
        d.co +
          (u ? 4 : -4) +
          (e.confChampion ? 4 : 0) +
          (e.result === "National champions" ? 8 : 0) -
          ((e.heat || 0) >= 1 ? 5 : 0)
      ),
      5,
      95
    )));
}
