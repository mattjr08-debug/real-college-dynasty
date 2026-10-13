function W_ct(e) {
  ((e.confWinners = {}), (e.ctRes = {}));
  (e.confs || []).forEach((g, ci) => {
    if (!ci) return;
    // leagues of 12 or more play a 12-team tournament: seeds 1 to 4 have a bye, 5 to 12 play first-round games
    let F = g.length >= 12 ? 12 : 8,
      ts = g
        .map((id) => e.opponents.find((t) => t.id === id))
        .filter(Boolean)
        .sort((a, b) => b.cw - a.cw || b.wins - a.wins || b.rating - a.rating)
        .slice(0, F);
    if (ts.length < F) {
      ts[0] && (e.confWinners[ci] = ts[0].id);
      return;
    }
    let mk = (x, y) => {
        let r = ry(e, x, y);
        return {
          a: x.name,
          b: y.name,
          sa: r.sa,
          sb: r.sb,
          w: r.winner.name,
          wo: r.winner,
          sda: ts.indexOf(x) + 1,
          sdb: ts.indexOf(y) + 1,
        };
      },
      pi =
        F === 12
          ? [
              [4, 11],
              [7, 8],
              [5, 10],
              [6, 9],
            ].map(([x, y]) => mk(ts[x], ts[y]))
          : null,
      q = pi
        ? [
            [0, pi[1].wo],
            [3, pi[0].wo],
            [1, pi[3].wo],
            [2, pi[2].wo],
          ].map(([x, w]) => mk(ts[x], w))
        : [
            [0, 7],
            [3, 4],
            [1, 6],
            [2, 5],
          ].map(([x, y]) => mk(ts[x], ts[y])),
      s2 = [mk(q[0].wo, q[1].wo), mk(q[2].wo, q[3].wo)],
      f = [mk(s2[0].wo, s2[1].wo)];
    ((e.confWinners[ci] = f[0].wo.id),
      (e.ctRes[ci] = (pi ? [pi, q, s2, f] : [q, s2, f]).map((r, ri) =>
        r.map(({ wo: w, ...z }) => (pi && ri === 0 ? { ...z, pi: 1 } : z))
      )));
  });
  let up = Object.entries(e.confWinners)
    .map(([ci, id]) => {
      let t = e.opponents.find((z) => z.id === id),
        top = e.opponents
          .filter((z) => e.confs[ci].includes(z.id))
          .sort((a, b) => b.cw - a.cw || b.wins - a.wins)[0];
      return t && top && t.id !== top.id ? t.name : null;
    })
    .filter(Boolean);
  up.length &&
    e.lnews.unshift({
      y: e.year,
      t: "Conference tournament upsets",
      b: `${up.slice(0, 3).join(", ")} won their conference tournaments from outside the top seed.`,
    });
}
