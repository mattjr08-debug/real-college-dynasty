function W_alum(e, l, fate) {
  let h = l.history || [],
    t = h.reduce((a, x) => {
      for (let k of ["gp", "pts", "reb", "ast", "stl", "blk", "tpm"]) a[k] = (a[k] || 0) + (x.stats[k] || 0);
      return a;
    }, {});
  ((e.alumni = e.alumni || []),
    e.alumni.push({
      id: l.id,
      n: l.name,
      pos: l.pos,
      ovr: l.ovr,
      y: e.year,
      fate,
      seasons: h.length,
      ...t,
      school: e.school.name,
      sid: e.school.id,
    }));
}
function W_cls(e) {
  let c = e.roster.filter((p) => p.newSigning);
  if (!c.length) return;
  let b = [...c].sort((x, y) => y.ovr - x.ovr)[0];
  ((e.classes = e.classes || []),
    e.classes.push({
      y: e.year,
      n: c.length,
      avg: Math.round(c.reduce((q, p) => q + p.ovr, 0) / c.length),
      top: `${b.name} (${b.ovr})`,
      fives: c.filter((p) => (p.hsStars || p.stars) >= 5).length,
      school: e.school.name,
      sid: e.school.id,
    }));
}
