function Vf(e, later) {
  e.prospects = [];
  // High school class: a star pyramid of 300 (7% five-star, 27% four, 37% three, 20% two, 7% one, 3% unranked).
  // Rating ranges per star level are unchanged. The 80 transfers after it are unchanged.
  let tq = [],
    HS = 300;
  [
    [5, 20],
    [4, 80],
    [3, 110],
    [2, 60],
    [1, 20],
    [0, 10],
  ].forEach(([q, n]) => {
    for (let k = 0; k < n; k++) tq.push(q);
  });
  for (let k = tq.length - 1; k > 0; k--) {
    let m = Math.floor(ne(e) * (k + 1));
    [tq[k], tq[m]] = [tq[m], tq[k]];
  }
  // Real College Dynasty: after the first season the portal holds only REAL players (the best entrants from the real rosters, see W_pt); no made-up transfers
  for (let a = 0; a < HS + (REAL_ON && later ? 0 : 80); a++) {
    let t = a < HS ? "High school" : "Transfer",
      l = ne(e),
      u =
        t === "Transfer"
          ? l < 0.3
            ? j(e, 80, 88)
            : l < 0.7
              ? j(e, 71, 79)
              : j(e, 60, 70)
          : [j(e, 43, 50), j(e, 51, 56), j(e, 57, 63), j(e, 64, 71), j(e, 72, 79), j(e, 80, 88)][tq[a]],
      o = t === "Transfer" && REAL_ON && typeof REAL_PORTAL !== "undefined" && REAL_PORTAL[a - HS] ? W_realPortalP(e, REAL_PORTAL[a - HS]) : Gf(e, t, u, t === "Transfer" ? j(e, 2, 4) : 1, a < HS ? PH[a % PH.length] : Le[a % 5]);
    // The final star rating (starRate: size, athleticism, upside) can differ from the planned level; try again
    // a few times so the class keeps its shape.
    for (let k = 0; t !== "Transfer" && o.stars !== tq[a] && k < 8; k++)
      o = Gf(
        e,
        t,
        [j(e, 43, 50), j(e, 51, 56), j(e, 57, 63), j(e, 64, 71), j(e, 72, 79), j(e, 80, 88)][tq[a]],
        1,
        PH[a % PH.length]
      );
    (t === "Transfer" && TUNE.portalStar && ((o.sg = o.stars), (o.stars = o.hsStars = starRate(o, !0))),
      t === "Transfer" && o.year >= 4 && (o.ask = Math.round((o.ask * 0.75) / 1e3) * 1e3),
      t === "Transfer" && !(o.history && o.history.length) &&
      (o.history = [
        {
          year: e.year - 1,
          team: jl(e, e.opponents).name,
          stats: {
            ...zs(),
            gp: 30,
            min: 30 * j(e, 12, 32),
            pts: 30 * j(e, 4, 20),
            reb: 30 * j(e, 2, 9),
            ast: 30 * j(e, 1, 5),
          },
        },
      ]),
      e.prospects.push(o));
  }
  // Assign NIL market values and recruiting/portal rankings to all prospects
  W_nilAssignMarkets(e, e.prospects);
}
