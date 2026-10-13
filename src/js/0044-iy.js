function iy(e) {
  e.confBracket = cbk(e, e.bracket);
  let fin = e.bracket[e.bracket.length - 1],
    lastR = [...e.bracket].reverse().find((r) => r && r.length),
    cw = lastR && lastR.length === 1 ? lastR[0].winner : null;
  e.confWinnerId = cw ? cw.id : null;
  let ub = W_field(e, !0),
    inF = ub.field.some((t) => t.id === e.school.id),
    auto = ub.ids.has(e.school.id) && (e.confChampion || ub.autos.some((t) => t.id === e.school.id));
  // Selection Sunday: the committee reveals the field (NET order, quadrant records) before any national tournament game
  {
    let nm = (t) => t.name,
      r4 = (a) => a.map(nm).join(", ");
    Be(
      e,
      "Selection Sunday: the field of 68 is set",
      `No. 1 seeds: ${r4(ub.field.slice(0, 4))}. Last four in: ${r4(ub.at.slice(-4))}. First four out: ${r4(ub.rest.slice(ub.at.length, ub.at.length + 4))}. ${natRegionText(e.year)}.`
    );
  }
  // the best 32 teams that missed the field play the NIT (item 47)
  let nit = ub.rest.slice(ub.at.length, ub.at.length + 32);
  if (!inF) {
    ((e.berth = "Not selected"),
      (e.result = "Season complete"),
      (e.tournament = "National"),
      (e.tournamentRound = 0));
    {
      let nf = W_field(e, !1),
        ts = nf.field.map((h) => ({ ...h })),
        ys = mkNat(e, ts, null, 0, nf.ff);
      for (e.bracket = ys; e.bracket[e.tournamentRound]?.length;) Rn(e, !1);
      e.natBracket = cbk(e, e.bracket);
    }
    if (nit.some((t) => t.id === e.school.id)) {
      // you made the NIT: the national tournament was played without you, now your own bracket starts
      let seed = nit.findIndex((t) => t.id === e.school.id),
        nb = mkNit(
          e,
          nit.map((h) => (h.id === e.school.id ? { ...h, rating: Ps(e) } : { ...h }))
        ),
        g = nb[0].find((u) => u.a.id === e.school.id || u.b.id === e.school.id);
      ((e.berth = `NIT bid \xB7 #${Math.floor(seed / 4) + 1} seed`),
        (e.phase = "National tournament"),
        (e.tournament = "NIT"),
        (e.tournamentRound = 0),
        (e.bracket = nb),
        Be(
          e,
          "You\u2019re in the NIT",
          `The national tournament passed you by, but the NIT wants you as a #${Math.floor(seed / 4) + 1} seed. First-round matchup: ${(g.a.id === e.school.id ? g.b : g.a).name}. Five wins make you NIT champions.`
        ));
      return;
    }
    runNit(e, nit);
    dy(e);
    return;
  }
  let ts = ub.field.map((h) => (h.id === e.school.id ? { ...h, rating: Ps(e) } : { ...h })),
    y = mkNat(e, ts, null, 0, ub.ff),
    mine = (u) => u.a.id === e.school.id || u.b.id === e.school.id,
    inFF = !!y[0][0].ff && y[0].some(mine),
    r = e.seedMap[e.school.id],
    gm = (inFF ? y[0] : y[y.length - 1]).find(mine),
    f = gm.a.id === e.school.id ? gm.b : gm.a;
  let gi = inFF ? y[0].find(mine).slot[0] : y[y.length - 1].findIndex(mine),
    reg = natRegions(e.year)[Math.floor(gi / 8)];
  ((e.berth = `${auto ? "Automatic berth" : "At-large berth"} \xB7 #${r} seed${reg ? " \xB7 " + reg.n + " Region (" + reg.c + ")" : ""}`),
    (e.phase = "National tournament"),
    (e.tournament = "National"),
    (e.tournamentRound = 0),
    (e.bracket = y),
    // a team that is not in a First Four game does not wait for it: the four games are played now
    y[0][0].ff && !inFF && Rn(e, !1),
    runNit(e, nit),
    Be(
      e,
      "You\u2019re going dancing",
      `${e.berth}. First-round matchup: ${f.name}. ${inFF ? "Win the First Four game, then six more wins make you national champions." : "Six wins from a national championship."}`
    ));
}
