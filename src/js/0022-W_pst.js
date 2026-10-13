function W_pst(e, id, pts, win, box = null) {
  let R = e.rosters && e.rosters[id];
  if (!R) return;
  if (box) {
    for (const row of box) {
      const p = R.find(p => p.i === row.id);
      if (p) { const z=p.s; z.g++; z.p+=row.pts; z.r+=row.reb; z.a+=row.ast; z.s+=row.stl; z.b+=row.blk; z.t+=row.tpm; }
    }
    return;
  }
  let top = R.slice(0, 9),
    pw = { PG: [0.6, 2], SG: [0.7, 1.2], SF: [1, 0.8], PF: [1.4, 0.6], C: [1.7, 0.5] },
    wp = top.map((p, i) => Math.pow(p.o / 60, 3) * (i < 5 ? 1 : 0.45)),
    W = wp.reduce((x, y) => x + y, 0),
    wr = top.map((p, i) => pw[p.p][0] * Math.pow(p.o / 60, 2) * (i < 5 ? 1 : 0.5)),
    WR = wr.reduce((x, y) => x + y, 0),
    wa = top.map((p, i) => pw[p.p][1] * Math.pow(p.o / 60, 2) * (i < 5 ? 1 : 0.5)),
    WA = wa.reduce((x, y) => x + y, 0);
  top.forEach((p, i) => {
    let s0 = p.s,
      sh = ((pts * wp[i]) / W) * (0.82 + ne(e) * 0.36);
    (s0.g++,
      (s0.p += Math.round(sh)),
      (s0.r += Math.round(((33 * wr[i]) / WR) * (0.8 + ne(e) * 0.4))),
      (s0.a += Math.round(((14 * wa[i]) / WA) * (0.8 + ne(e) * 0.4))),
      (s0.s += ne(e) < (7 * wp[i]) / W ? 1 : 0),
      (s0.b += ne(e) < (3.2 * (p.p === "C" ? 3 : p.p === "PF" ? 2 : 0.5) * wp[i]) / W / 2 ? 1 : 0),
      (s0.t += Math.round((sh * 0.22) / 3)));
  });
}
