function my(e) {
  if (e.round > 9)
    throw new Error("Recruiting is closed. Fill remaining roster spots from the walk-on pool.");
  // While the portal window is open, a round is one portal wave (auto-recruit can make new offers between waves)
  if (e.pw >= 1 && e.pw <= 3) return W_pwave(e);
  let before = new Map(e.prospects.map((q) => [q.id, q.status]));
  for (let a of e.prospects)
    if (a.status === "Available")
      if (a.offer) {
        let t = Nn(e, a, a.offer.nil, a.offer.role);
        if (
          ((a.progress = le(a.progress + j(e, 18, 30) + Math.round(t * 0.24) + a.scouted * 3, 0, 100)),
          a.progress >= 100 || e.round >= 8 || (e.round >= 2 && a.progress >= 60 && ne(e) < t / 250))
        ) {
          let { nil: u, role: o } = a.offer;
          ne(e) * 100 < t && e.roster.length < 15
            ? cy(e, a, u, o)
            : ((a.status = "Committed elsewhere"),
              (a.progress = 100),
              (a.decisionRound = e.round),
              (a.decisionYear = e.year),
              (a.committedTo = rivalLead(e, a)),
              delete a.offer,
              Be(
                e,
                "Recruiting decision",
                `${a.name} committed to ${a.committedTo} in round ${e.round}. Your ${q(u)} offer was released.`
              ));
        }
      } else
        e.round <= 8 &&
          ne(e) < [0.05, 0.06, 0.07, 0.09, 0.19, 0.25][a.sg ?? a.stars] + e.round * 0.004 &&
          ((a.status = "Committed elsewhere"),
          (a.progress = 100),
          (a.decisionRound = e.round),
          (a.decisionYear = e.year),
          (a.committedTo = rivalLead(e, a)));
  (W_rec(e, before),
    e.round++,
    e.round <= 8 && (e.scouts += 10),
    e.round === 9 && e.roster.length >= 15 && (e.round = 10),
    e.round === 9
      ? Be(
          e,
          "Last chance round",
          "Round 8 is over. If you still have NIL to spend, make offers to players who are still available. Their decisions are final."
        )
      : e.round > 9 &&
        Be(
          e,
          "Recruiting window closed",
          "All remaining offers have decisions. Fill open spots from the walk-on pool, then set your coaching and schedule."
        ));
}
