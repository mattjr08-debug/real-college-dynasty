function Rn(e, a = !0, played = null) {
  let t = e.bracket[e.tournamentRound],
    l = [];
  for (let u of t) {
    if (u.a.id === "bye" || u.b.id === "bye") {
      // short conference: the top seed advances without playing
      ((u.winner = u.a.id === "bye" ? u.b : u.a), (u.sa = u.sb = 0), l.push(u.winner));
      continue;
    }
    if ((u.a.id === e.school.id || u.b.id === e.school.id) && a) {
      let r = u.a.id === e.school.id ? u.b : u.a,
        n = played || {
          id: Ff(e, "tour"),
          opponent: r.name,
          oppId: r.id,
          rating: r.rating,
          venue: "Neutral",
          kind: `${e.tournament} tournament`,
          played: !1,
        };
      (!played && ny(e, n),
        e.schedule.push(n),
        (u.sa = u.a.id === e.school.id ? n.us : n.them),
        (u.sb = u.a.id === e.school.id ? n.them : n.us),
        (u.winner = n.win ? (u.a.id === e.school.id ? u.a : u.b) : r));
    } else Object.assign(u, ry(e, u.a, u.b));
    l.push(u.winner);
  }
  if (t[0]?.ff || t[0]?.pi) {
    // First Four: the winners take the open places in the round of 64 (already in the bracket)
    for (let u of t) e.bracket[e.tournamentRound + 1][u.slot[0]][u.slot[1]] = u.winner;
    return (e.tournamentRound++, l);
  }
  return (
    e.tournamentRound++,
    e.bracket.push(
      l.length > 1 ? Array.from({ length: l.length / 2 }, (u, o) => ({ a: l[o * 2], b: l[o * 2 + 1] })) : []
    ),
    l
  );
}
