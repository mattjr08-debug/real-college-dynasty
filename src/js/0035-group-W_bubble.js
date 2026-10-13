function W_bubble(e) {
  let f = W_field(e, !0),
    out = f.rest.slice(f.at.length),
    last = f.at.slice(-4).reverse(),
    n = out.slice(0, 4),
    nx = out.slice(4, 8),
    me = e.school.id,
    rk = f.field.findIndex((t) => t.id === me);
  return { f, last, firstOut: n, nextOut: nx, rank: rk, inField: rk >= 0, auto: f.ids.has(me) };
}
