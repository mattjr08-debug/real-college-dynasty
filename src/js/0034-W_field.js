var FIELD_SIZE = 68;
function W_field(e, withUser) {
  let all = W_all(e).filter((t) => withUser || t.id !== e.school.id),
    autos = [];
  (e.confs || []).forEach((g, ci) => {
    let ts = all
      .filter((t) => g.includes(t.id))
      .sort((a, b) => b.cw - a.cw || b.wins - a.wins || b.rating - a.rating);
    if (ci === 0) {
      let w = e.confWinnerId && all.find((t) => t.id === e.confWinnerId);
      w ? autos.push(w) : ts[0] && autos.push(ts[0]);
    } else {
      let w = e.confWinners && e.confWinners[ci] && all.find((t) => t.id === e.confWinners[ci]);
      w ? autos.push(w) : ts[0] && autos.push(ts[0]);
    }
  });
  let ids = new Set(autos.map((t) => t.id)),
    rest = all.filter((t) => !ids.has(t.id)).sort((a, b) => W_net(b) - W_net(a)),
    at = rest.slice(0, FIELD_SIZE - autos.length),
    field = [...autos, ...at].sort((a, b) => W_net(b) - W_net(a)),
    // First Four: the 4 weakest at-large teams play for two 12-seed places, the 4 weakest automatic qualifiers for two 16-seed places
    ffa = new Set(at.slice(-4).map((t) => t.id)),
    ffb = new Set(
      [...autos]
        .sort((a, b) => W_net(a) - W_net(b))
        .slice(0, 4)
        .map((t) => t.id)
    );
  return { field, autos, rest, ids, at, ff: { a: ffa, b: ffb } };
}
