function W_ghost(a) {
  a = [...a];
  if (a.length % 2) a.splice(1, 0, null); // odd conference: a ghost team; whoever faces it has a bye
  return a;
}
function W_byeOpp(e, d) {
  const inL = new Set(e.league.map((x) => x.id)),
    c = e.opponents.filter((o) => !inL.has(o.id));
  return c.length ? c[TS(String(e.school.id) + "|" + e.year + "|" + d) % c.length] : null;
}
function W_sched(e) {
  let me = e.school.id,
    ids = e.opponents.map((t) => t.id).filter((i) => i !== me),
    cf = {},
    met = {},
    days = [];
  e.opponents.forEach((t) => (cf[t.id] = t.conf));
  ids.forEach((i) => (met[i] = new Set()));
  let groups = (e.confs || []).map((g, ci) => (ci === 0 ? e.league.map((l) => l.id) : g));
  for (let d = 0; d < 30; d++) {
    let pairs = [];
    if (d < 12 && evSecond(e, d)) {
      // second game of an event (item 55): nobody is paired in advance; W_day pairs winners with winners and losers with losers
    } else if (d < 12) {
      let occ = e.nc[d] && e.nc[d].teamId,
        pool = ids.filter((i) => i !== occ);
      for (let k = pool.length - 1; k > 0; k--) {
        let m = Math.floor(ne(e) * (k + 1));
        [pool[k], pool[m]] = [pool[m], pool[k]];
      }
      let used = new Set();
      for (let i = 0; i < pool.length; i++) {
        let x = pool[i];
        if (used.has(x)) continue;
        let y =
          pool.find((z, jx) => jx > i && !used.has(z) && cf[z] !== cf[x] && !met[x].has(z)) ||
          pool.find((z, jx) => jx > i && !used.has(z) && cf[z] !== cf[x]) ||
          pool.find((z, jx) => jx > i && !used.has(z));
        if (!y) continue;
        (used.add(x), used.add(y), met[x].add(y), met[y].add(x), pairs.push([x, y]));
      }
    } else {
      let fill = null;
      for (let g of groups) {
        if (g.length < 4) continue;
        let o = W_ghost(g),
          n = o.length,
          k = (d - 12) % (n - 1);
        for (let r = 0; r < k; r++) o = [o[0], o[n - 1], ...o.slice(1, -1)];
        for (let r = 0; r < n / 2; r++) {
          let x = o[r],
            y = o[n - 1 - r];
          if (!x || !y) {
            (x || y) === me && (fill = W_byeOpp(e, d));
            continue;
          }
          x !== me && y !== me && pairs.push([x, y]);
        }
      }
      fill && (pairs = pairs.filter((p) => p[0] !== fill.id && p[1] !== fill.id));
    }
    days.push(pairs);
  }
  ((e.sch = days), (e.sres = {}));
}
