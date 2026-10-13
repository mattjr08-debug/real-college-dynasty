function W_rec(e, before) {
  W_rv(e, before);
  for (let q of e.prospects)
    if (
      q.status === "Committed elsewhere" &&
      before.get(q.id) === "Committed elsewhere" &&
      e.round <= 8 &&
      ne(e) < 0.012
    ) {
      let f = q.committedTo;
      ((q.status = "Available"),
        (q.progress = 35),
        (q.interest = Math.min(95, q.interest + 8)),
        (q.decommit = 1),
        delete q.committedTo,
        q.target && Be(e, "Decommitment", `${q.name} decommitted from ${f} and reopened his recruitment.`));
    }
  let lost = e.prospects.filter(
    (q) => before.get(q.id) === "Available" && q.status === "Committed elsewhere" && q.rank > 0
  );
  if (lost.length && e.roster.length < 15) {
    let nx = e.prospects
      .filter((q) => q.status === "Available" && q.rank > 0 && !q.offer)
      .sort((x, y) => x.rank - y.rank)[0];
    nx &&
      Ce(e) >= nx.ask &&
      ((nx.offer = { nil: nx.ask, role: "Rotation" }),
      (nx.target = !0),
      Be(
        e,
        "Backup plan",
        `${lost[0].name} committed elsewhere, so your staff offered ${nx.name}, your next choice.`
      ));
  }
}
