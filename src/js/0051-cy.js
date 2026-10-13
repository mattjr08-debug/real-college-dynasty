function cy(e, a, t, l) {
  let u = {
    ...a,
    attrs: [...a.attrs],
    history: a.history.map((r) => ({ ...r, stats: { ...r.stats } })),
    stats: zs(),
    recent: [],
    nil: t,
    promise: l,
    role: "Bench",
    minutes: 0,
    source: "Roster",
    status: "Signed",
    scouted: 2,
    morale: 85,
    newSigning: !0,
    progress: 100,
    decisionRound: Math.min(e.round, 8),
    decisionYear: e.year,
    committedTo: e.school.name,
  };
  (delete u.offer,
    (a.status = "Signed"),
    (a.progress = 100),
    (a.decisionRound = Math.min(e.round, 8)),
    (a.decisionYear = e.year),
    (a.committedTo = e.school.name),
    delete a.offer);
  let o = new Set(e.roster.map((r) => r.number));
  (o.has(u.number) && (u.number = Array.from({ length: 56 }, (r, n) => n).find((r) => !o.has(r)) || 0),
    e.roster.push(u),
    e.signings.push(a.name),
    (e.chemistry = Math.max(25, e.chemistry - 2)),
    e.signingEvents.push({
      id: Ff(e, "commit"),
      playerId: a.id,
      name: a.name,
      pos: a.pos,
      ovr: a.ovr,
      year: e.year,
      round: Math.min(e.round, 8),
      nil: t,
      origin: a.origin,
    }),
    (e.signingEvents = e.signingEvents.slice(-100)),
    Be(
      e,
      "Commitment secured",
      `${a.name}, ${a.pos} \xB7 ${a.ovr} OVR, committed in round ${Math.min(e.round, 8)} for ${q(t)}/year. Promised role: ${l.toLowerCase()}.`
    ));
}
