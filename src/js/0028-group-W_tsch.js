function W_tsch(e, id) {
  let out = [],
    me = e.school.name;
  for (let d = 0; d < 30; d++) {
    let pr = ((e.sch && e.sch[d]) || []).find((z) => z[0] === id || z[1] === id),
      u = e.schedule[d],
      r = e.sres && e.sres[id] && e.sres[id][d],
      opp = null;
    if (pr) {
      let o = W_t(e, pr[0] === id ? pr[1] : pr[0]);
      opp = o && o.name;
    } else if (u && u.oppId === id) opp = me;
    // item 55: both games of each early-season event are played at a neutral site by every team
    let nv = d < 12 && opp && e.nc && e.nc[d] && e.nc[d].event && e.nc[d].venue === "Neutral" && (e.nc[d].rd === 1 || evSecond(e, d));
    out.push({ d: d + 1, k: d < 12 ? "Nonconference" : "Conference", opp: opp ? opp + (nv ? " (neutral site)" : "") : "\u2014", r: r || "" });
  }
  return out;
}
