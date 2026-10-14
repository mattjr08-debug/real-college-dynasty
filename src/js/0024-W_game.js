function W_game(e, A, B) {
  let ra = e.rosters && e.rosters[A.id],
    rb = e.rosters && e.rosters[B.id];
  if (!ra || !rb || ra.length < 6 || rb.length < 6) return ry(e, A, B);
  let M = TUNE.statCal ? [36, 31, 27, 24, 22, 17, 13, 9, 6] : [32, 30, 28, 26, 24, 18, 14, 10, 8],
    T = (R) => {
      let tp = R.filter((p) => !(p.ij > 0) || (p.ij--, !1)).slice(0, 9),
        ms = M.slice(0, tp.length),
        tot = ms.reduce((x, y) => x + y, 0);
      return tp.map((p, i) => ({
        p,
        a: W_at(p),
        ug: W_ug(p),
        m: (ms[i] * 200) / tot,
        pts: 0,
        r: 0,
        as: 0,
        st: 0,
        bl: 0,
        tp: 0,
        pf: 0,
      }));
    },
    ta = T(ra),
    tb = T(rb),
    f = (A.rating - B.rating) * 0.9,
    sc = [0, 0],
    // team momentum (+ = team A has the run), same idea as ny: it follows the scoring and fades (TUNE.mom)
    mm = 0,
    h = 70 + j(e, -3, 3),
    pn = 0,
    ft = (L, i) => {
      let x = L[i];
      return x;
    },
    pick = (L, fn, ex) => {
      let ws = L.map((z, i) => (ex === i ? 0 : fn(z)));
      let r = ne(e) * ws.reduce((x, y) => x + y, 0);
      for (let i = 0; i < L.length; i++) {
        r -= ws[i];
        if (r <= 0) return i;
      }
      return L.length - 1;
    },
    poss = (O, D, k, fx) => {
      let uw = (z) => z.m * Math.pow((z.a[0] + z.a[2] + 50) / 130, TUNE.statCal ? (TUNE.gUse || TUNE.statUse) : 2.2) * z.ug,
        si = pick(O, uw),
        S = O[si],
        ugP = TUNE.ugEff ? TUNE.ugEff * (uw(S) / O.reduce((s, z) => s + uw(z), 0) / (S.m / 200) - TUNE.ugCtr) : 0;
      if (ne(e) < 0.178) {
        ne(e) < 0.48 && D[pick(D, (z) => z.m * Math.pow(z.a[8] / 60, TUNE.statCal ? TUNE.statStl : 1.8))].st++;
        return;
      }
      if (ne(e) < 0.165) {
        D[pick(D, (z) => z.m)].pf++;
        let mk = 0;
        for (let q = 0; q < 2; q++) (mk = ne(e) < 0.45 + S.a[3] * 0.004) && (S.pts++, sc[k]++);
        // missed last free throw: a live rebound (rarely the offense's; the possession still ends)
        mk ||
          (ne(e) < 0.15
            ? O[pick(O, (z) => z.m * Math.pow(z.a[10] / 60, TUNE.gReb || 2.6))].r++
            : D[pick(D, (z) => z.m * Math.pow(z.a[11] / 60, TUNE.gReb || 2.6))].r++);
        return;
      }
      let cur = S;
      for (let c2 = 0; c2 < 3; c2++) {
        let th =
            c2 === 0 &&
            ne(e) <
              le(
                0.19 +
                  (S.a[2] - 60) * 0.006 +
                  (S.p.p === "PG" || S.p.p === "SG" ? 0.28 : S.p.p === "SF" ? 0.22 : 0.08),
                0.03,
                0.7
              ),
          g = th ? cur.a[2] : (cur.a[0] + cur.a[1]) / 2;
        if (
          ne(e) <
          le(
            (th ? 0.325 : c2 ? 0.54 : 0.485) +
              (g - 65) * 0.003 +
              fx * 0.003 -
              ugP +
              (k === 0 ? mm : -mm) * TUNE.mom -
              // lead drag: as the game goes on the leader eases off and the trailer presses (keeps margins realistic)
              (sc[k] - sc[1 - k]) * 0.0045 * (pn / h),
            0.13,
            0.78
          )
        ) {
          let pts = th ? 3 : 2;
          ((cur.pts += pts), (sc[k] += pts), th && cur.tp++);
          if (ne(e) < (TUNE.statCal ? (th ? 0.68 : 0.46) : 0.52)) {
            let ai = pick(
              O,
              (z) =>
                z.m *
                Math.pow(z.a[5] / 60, TUNE.statCal ? TUNE.statPass : 2.2) *
                (TUNE.statCal ? { PG: 5, SG: 1.5, SF: 1.1, PF: 0.7, C: 0.55 }[z.p.p] || 1 : 1),
              O.indexOf(cur)
            );
            O[ai].as++;
          }
          return;
        }
        if (ne(e) < 0.113) D[pick(D, (z) => z.m * Math.pow((z.a[9] + z.a[7]) / 120, TUNE.statCal ? TUNE.statBlk : 1.8))].bl++;
        if (ne(e) < 0.28) {
          let ri = pick(O, (z) => z.m * Math.pow(z.a[10] / 60, TUNE.gReb || 2.6));
          O[ri].r++;
          cur = O[ri];
        } else {
          D[pick(D, (z) => z.m * Math.pow(z.a[11] / 60, TUNE.gReb || 2.6))].r++;
          return;
        }
      }
    };
  for (; pn < h; pn++) {
    let s0 = sc[0] - sc[1];
    (poss(ta, tb, 0, f), poss(tb, ta, 1, -f));
    mm = le(mm * 0.82 + (sc[0] - sc[1] - s0) * 0.03, -1, 1);
  }
  let ot = 0;
  while (sc[0] === sc[1] && ot++ < 6) {
    for (let i = 0; i < 8; i++) (poss(ta, tb, 0, f), poss(tb, ta, 1, -f));
  }
  sc[0] === sc[1] && sc[0]++;
  let cr = (L, R) =>
    L.forEach((z) => {
      let s0 = z.p.s;
      (s0.g++,
        (s0.p += z.pts),
        (s0.r += z.r),
        (s0.a += z.as),
        (s0.s += z.st),
        (s0.b += z.bl),
        (s0.t += z.tp));
    });
  (cr(ta, ra), cr(tb, rb));
  let w = sc[0] > sc[1] ? A : B;
  return { a: A, b: B, sa: sc[0], sb: sc[1], winner: w, poss: h + ot * 8 };
}
