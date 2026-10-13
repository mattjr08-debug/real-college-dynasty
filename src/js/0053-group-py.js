function py(e, a) {
  ((a.target = !0),
    ne(e) * 100 < fl(e, a)
      ? cy(e, a, 0, "Bench")
      : ((a.status = "Declined"),
        (a.decisionRound = Math.min(e.round, 8)),
        (a.decisionYear = e.year),
        Be(
          e,
          "Walk-on decision",
          `${a.name} declined the walk-on invitation. Choose another player from the remaining pool.`
        )));
}
