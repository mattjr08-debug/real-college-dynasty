function W_draft(e, mock) {
  let c = [],
    rnd = mock ? () => ((e.year * 7919 + 13) % 100) / 100 : () => ne(e),
    // national tournament wins this season, by team name (a deep run raises draft stock)
    tw = (() => {
      let w = {},
        nb = e.natBracket || (e.tournament === "National" ? cbk(e, e.bracket) : null);
      for (let r of nb || []) for (let g of r) g.w && !g.ff && (w[g.w] = (w[g.w] || 0) + 1);
      return w;
    })(),
    // good players get the full boost (+1 draft value per win, +6 for a title run); weaker ones half.
    // Upperclassmen who are close to the cut also become more likely to be drafted.
    ok = (z) => (
      (z.tw = tw[z.t] || 0),
      z.y === 1
        ? z.o >= 70 && (mock || rnd() < 0.92)
        : z.y < 4
          ? z.o >= 84 - Math.min(3, z.tw >> 1) && (mock || rnd() < 0.6)
          : z.o >= 76 - Math.min(3, z.tw >> 1)
    ),
    dv = (z) => W_dv(z) + z.tw * (z.o >= 78 ? 1 : 0.5);
  for (let t of e.opponents)
    for (let p of e.rosters[t.id] || []) {
      let z = {
        id: p.i,
        n: p.n,
        t: t.name,
        p: p.p,
        o: p.o,
        pot: p.t,
        y: p.y,
        ppg: p.s.g ? p.s.p / p.s.g : 0,
        ai: 1,
      };
      ok(z) && ((z.v = dv(z)), c.push(z));
    }
  for (let l of e.roster) {
    if (l.redshirt) continue;
    let z = {
      id: l.id,
      n: l.name,
      t: e.school.name,
      p: l.pos,
      o: l.ovr,
      pot: l.potential,
      y: l.year,
      ppg: l.stats.gp ? l.stats.pts / l.stats.gp : 0,
      ih: l.ih,
      you: 1,
    };
    ok(z) && ((z.v = dv(z)), c.push(z));
  }
  c.sort((a, b) => b.v - a.v);
  let bd = W_board(c.slice(0, 120), rnd);
  ((bd.ids = new Set(bd.picks.map((z) => z.id))),
    (bd.ai = new Set(bd.picks.filter((z) => z.ai).map((z) => z.id))),
    (bd.stat = `Freshmen: ${bd.lotFr} of ${bd.lotN} lottery picks (${Math.round((100 * bd.lotFr) / Math.max(1, bd.lotN))}%) and ${bd.firstFr} of ${bd.firstN} first-round picks (${Math.round((100 * bd.firstFr) / Math.max(1, bd.firstN))}%)`));
  return bd;
}
