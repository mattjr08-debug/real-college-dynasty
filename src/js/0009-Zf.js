function Zf(e) {
  e.schedule = e.nc.map((l, u) => {
    let o = e.opponents.find((r) => r.id === l.teamId);
    return {
      id: `${e.year}-n${u}`,
      opponent: o.name,
      oppId: o.id,
      rating: o.rating,
      venue: l.venue,
      kind: "Nonconference",
      guarantee: l.guarantee || 0,
      played: !1,
      ...(l.event ? { event: l.event } : {}),
      ...(l.event && l.rd ? { rd: l.rd } : {}),
      ...(e.rival && o.id === e.rival.id ? { rival: !0 } : {}),
    };
  });
  // 18 conference games whatever the size n (even): the round robin has n - 1 rounds, the 18 games are rounds 1 to n - 1 and then the
  // first rounds again (n = 10: everyone twice; n = 16: 3 teams twice). The second time through, the venues are the other way round.
  let a = W_ghost(e.league.map((l) => l.id)),
    n = a.length;
  for (let l = 0; l < 18; l++) {
    let r = l % (n - 1),
      pass = Math.floor(l / (n - 1));
    if (r === 0) a = W_ghost(e.league.map((q) => q.id));
    let u = a[a.length - 1],
      o = u == null ? W_byeOpp(e, 12 + l) : e.league.find((q) => q.id === u);
    if (!o) {
      a = [a[0], a[a.length - 1], ...a.slice(1, -1)];
      continue;
    }
    (e.schedule.push({
      id: `${e.year}-c${l}`,
      opponent: o.name,
      oppId: o.id,
      rating: o.rating,
      venue: (r % 2 ? "Away" : "Home") === "Home" === (pass % 2 === 0) ? "Home" : "Away",
      kind: u == null ? "Nonconference" : "Conference", // odd-sized conference: this is the bye day
      played: !1,
      ...(e.rival && o.id === e.rival.id ? { rival: !0 } : {}),
    }),
      (a = [a[0], a[a.length - 1], ...a.slice(1, -1)]));
  }
}
