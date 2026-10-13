function W_board(c, rnd) {
  let F = c.filter((z) => z.y === 1).sort((a, b) => b.v - a.v),
    O = c.filter((z) => z.y !== 1).sort((a, b) => b.v - a.v),
    take = (fq, tot) => {
      let g = F.splice(0, Math.min(fq, F.length));
      g.push(...O.splice(0, Math.max(0, tot - g.length)));
      g.length < tot && g.push(...F.splice(0, tot - g.length));
      return g.sort((a, b) => b.v - a.v);
    },
    nl = Math.round(14 * (0.55 + 0.25 * rnd())),
    nf = Math.round(30 * (0.4 + 0.2 * rnd())),
    lot = take(nl, 14),
    lf = lot.filter((z) => z.y === 1).length,
    f2 = take(Math.max(0, nf - lf), 16),
    rest = [...F, ...O].sort((a, b) => b.v - a.v).slice(0, 30),
    picks = [...lot, ...f2, ...rest].map((z, i) => ({ ...z, pk: i + 1 }));
  return {
    picks,
    lotFr: lf,
    lotN: lot.length,
    firstFr: lf + f2.filter((z) => z.y === 1).length,
    firstN: lot.length + f2.length,
  };
}
