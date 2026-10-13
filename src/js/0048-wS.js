function wS(e) {
  ((e.departed = []),
    (e.draft = []),
    (e.xfers = []),
    (e.mkt = le(
      +((e.mkt || 1) * (1.025 + (e.don ? (e.don.ex - 50) / 3e3 : 0) + j(e, -1, 2) / 200)).toFixed(3),
      0.85,
      2
    )),
    (e.pm = W_posMkt(e))); // item 24: price by position
  let bd = W_draft(e),
    a = [],
    t = 0,
    pd = [],
    xs = new Set(),
    dr = new Set(bd.picks.filter((p) => p.you && p.y < 4).map((p) => p.id));
  for (let l of e.roster) {
    ((l.__sg = e.roster.some((q) => q.id !== l.id && q.newSigning && q.pos === l.pos && q.ovr > l.ovr)),
      (l.__bk = l.stats.gp >= 10 && l.stats.pts / l.stats.gp >= 14));
    if (
      (l.history.push({ year: e.year, team: e.school.name, stats: { ...l.stats } }),
      l.redshirt
        ? ((l.redshirtUsed = !0), (l.redshirt = !1))
        : l.med && l.stats.gp <= 9
          ? ((l.medUsed = !0),
            Be(
              e,
              "Medical hardship waiver",
              `${l.name} played only ${l.stats.gp} games before a season-ending injury. The waiver gives him this year of eligibility back.`
            ))
          : l.year++,
      delete l.med,
      delete l.susp,
      l.year > 4)
    ) {
      (e.departed.push(
        bd.ids.has(l.id) ? dep(l, `Drafted \xB7 ${W_lab(bd, l.id)} \xB7 senior`) : dep(l, "Graduated")
      ),
        W_alum(e, l, e.departed.at(-1).reason));
      continue;
    }
    let u =
      (le((65 - l.morale) / 90, 0.005, 0.75) +
        (l.stats.min < 240 && !l.redshirt ? 0.3 : 0)) *
      keepOf(e) *
      ({ Loyal: 0.55, Ambitious: 1.3, "Money-focused": 1.1 }[l.pers] || 1) +
      0.012;
    if (t < 7 && ne(e) < u) {
      (t++, xs.add(l.id));
    }
    let mpg = l.stats.gp ? l.stats.min / l.stats.gp : 0,
      pi = e.lineup.indexOf(l.id),
      pdl = l.stats.gp
        ? le(
            (mpg >= 20 ? 1 : mpg < 6 ? -1 : 0) +
              (l.morale >= 70 ? 1 : l.morale < 45 ? -1 : 0) +
              (pi >= 0 && Le[pi] !== l.pos && Le[pi] !== l.pos2 ? -1 : 0) +
              j(e, -1, 1),
            -3,
            3
          )
        : 0;
    if (pdl) {
      let np = le(l.potential + pdl, l.ovr, 99);
      np !== l.potential &&
        (pd.push(`${l.name} ${np > l.potential ? "+" : ""}${np - l.potential}`), (l.potential = np));
    }
    let o = Math.min(
        l.potential - l.ovr,
        Math.round(
          (j(e, 0, 3) +
            (e.specialty === "Development" ? 1 : 0) +
            (l.stats.min > 500 ? 1 : 0) +
            (e.staff ? W_staffLv(e, "dev") * 0.34 + (e.staff.fac || 0) * 0.15 : 0) +
            (W_skill(e, "dev") - 50) * 0.012) *
            ({ Boom: 1.5, Plateau: 0.4, "Late bloomer": l.year <= 2 ? 0.5 : 1.7 }[l.dev] || 1) *
            (l.intl ? (l.year <= 2 ? 1.5 : 1.1) : 1) *
            [1.3, 0.95, 0.6][le(l.year - 2, 0, 2)] *
            (l.pos === "C" || l.pos === "PF" ? (l.year <= 2 ? 0.85 : 1.15) : 1)
        )
      ),
      r = l.ovr;
    ((l.__dv = l.attrs.map(
      (n, i) =>
        le(n + Math.max(0, Math.round(o * (0.4 + ne(e) * 1.2)) + (l.training === il[i] ? 2 : 0) + (l.intl && l.year <= 2 && [12, 13, 14].includes(i) ? 2 : 0)), 25, 99) - n
    )),
      (l.dlog = {
        d: l.__dv,
        why: [
          l.training !== "Balanced" ? `Training focus: ${l.training}` : null,
          l.stats.min > 500 ? "Heavy minutes" : l.stats.min < 150 ? "Little playing time" : null,
          e.specialty === "Development" ? "Development-focused coaching" : null,
          e.staff && (e.staff.dev || e.staff.fac) ? "Development assistant and facilities" : null,
          l.intl && l.year <= 2 ? "International: adjusting to the college game and getting stronger" : null,
          l.dev === "Boom"
            ? "Natural growth spurt"
            : l.dev === "Plateau"
              ? "Close to his ceiling"
              : l.dev === "Late bloomer" && l.year <= 2
                ? "Late bloomer: slow early"
                : null,
        ].filter(Boolean),
      }),
      (l.attrs = l.attrs.map((n, i) => n + l.__dv[i])),
      delete l.__dv,
      (l.ovr = Math.min(l.potential, W_ovr(l.attrs, l.pos))),
      (l.growth = l.ovr - r),
      l.age++,
      (l.ask =
        Math.round(
          ((e.mkt || 1) *
            (e.pm?.[l.pos] || 1) *
            Math.max(l.nil, 4e3 + Math.pow(Math.max(2, l.ovr - 43), 2) * 110 * (l.ovr >= 64 ? 2.1 : 1)) *
            (1 + (l.awardBump || 0))) /
            1e3
        ) * 1e3),
      (l.awardBump = 0),
      (l.stats = zs()),
      (l.recent = []),
      (l.injury = 0),
      (l.newSigning = !1),
      (l.talked = !1),
      (l.promise = "None"),
      (l.morale = le(l.morale + 5 + Math.round((W_skill(e, "cul") - 50) / 20), 10, 95)),
      dr.has(l.id)
        ? e.draft.push({
            id: l.id,
            name: l.name,
            pos: l.pos,
            ovr: l.ovr,
            pot: l.potential,
            cls: ["Freshman", "Sophomore", "Junior"][l.year - 2] || "Junior",
            pick: W_lab(bd, l.id),
            chance: le(
              Math.round(
                25 +
                  (l.morale - 50) * 0.5 +
                  e.rep * 0.2 +
                  (e.chemistry || 50) * 0.15 -
                  Math.max(0, l.ovr - 78) * 1.8 +
                  ({ Loyal: 10, Patient: 3, Ambitious: -8, "Money-focused": -4 }[l.pers] || 0)
              ),
              5,
              85
            ),
            status: "pending",
            player: l,
          })
        : xs.has(l.id)
          ? e.xfers.push(xf(e, l))
          : // Testing the waters: a good underclassman who is not a projected pick may declare, work out for
            // pro teams and get feedback. Most withdraw and come back; d.chance is his own chance to return.
            l.year <= 4 &&
              l.ovr >= 68 &&
              e.draft.filter((d) => d.kind === "test").length < 2 &&
              ne(e) < 0.22 * ({ Ambitious: 1.6, Loyal: 0.4 }[l.pers] || 1)
            ? e.draft.push({
                id: l.id,
                name: l.name,
                pos: l.pos,
                ovr: l.ovr,
                pot: l.potential,
                cls: ["Freshman", "Sophomore", "Junior"][l.year - 2] || "Junior",
                kind: "test",
                pick: l.ovr >= 76 ? "fringe 2nd round" : "likely undrafted",
                chance: le(
                  Math.round(
                    72 +
                      (l.morale - 60) * 0.4 -
                      (l.ovr >= 76 ? 12 : 0) +
                      ({ Loyal: 10, Patient: 5, Ambitious: -8 }[l.pers] || 0)
                  ),
                  40,
                  92
                ),
                status: "pending",
                player: l,
              })
            : a.push(l));
  }
  // Off-court life (item 31): a player on academic watch (low GPA) may be ruled ineligible for the first games, and a player with a
  // high discipline risk may be suspended for an off-court incident. At most 2 a year, never below 8 available players. They use the
  // injury games counter like suspensions (susp 1 = discipline, 2 = academics) and the counter ticks down as games are played.
  {
    let off = 0;
    for (let l of a.filter((q) => !q.redshirt)) {
      if (off >= 2 || a.filter((q) => !q.redshirt && !q.injury).length <= 8) break;
      let g = W_gpa(l),
        ac = g < 2.4 ? (2.4 - g) * 0.9 : 0,
        ds = W_risk(l) ** 2 * 0.12 * (l.morale < 50 ? 1.6 : 1) * ({ Loyal: 0.6, Ambitious: 1.1 }[l.pers] || 1);
      if (ne(e) < ac) {
        let n = g < 2.05 ? 12 : 4;
        ((l.injury = n), (l.susp = 2), (l.morale = le(l.morale - 3, 5, 99)), off++);
        Be(e, "Academic eligibility", `${l.name} (${g.toFixed(2)} GPA) was ruled academically ineligible for the first ${n} games. His minutes will be redistributed.`);
      } else if (ne(e) < ds) {
        let n = j(e, 3, 6);
        ((l.injury = n), (l.susp = 1), (l.morale = le(l.morale - 6, 5, 99)), off++);
        Be(e, "Off-court incident", `${l.name} was suspended for the first ${n} games after an off-court incident. His minutes will be redistributed.`);
      }
    }
  }
  ((e.roster = a),
    (e.negs = a
      .filter((l) => l.nil < l.ask * 0.85 && l.nil > 0 && (l.growth >= 3 || l.__bk))
      .slice(0, 4)
      .map((l) => ({
        id: l.id,
        name: l.name,
        ovr: l.ovr,
        nil: l.nil,
        ask: l.ask,
        why: l.growth >= 3 ? "Broke out this season" : "Big production",
      }))),
    e.year++,
    (e.phase = "Offseason"),
    (e.round = 1),
    (e.elim = null),
    (e.jobOffers = []),
    (e.confBracket = null),
    (e.natBracket = null),
    (e.nitBracket = null),
    // item 23: assistants may leave or be poached, then the perks below use who is left
    W_asstYear(e),
    (e.scouts = 10 + (e.specialty === "Recruiting" ? 6 : 0) + Math.round(W_staffLv(e, "rec") * 2)),
    (e.chemistry = le(
      Math.round(65 + a.length * 2 - t * 4 + W_staffLv(e, "tac") * 2 + (W_skill(e, "tac") - 50) * 0.06 + (W_skill(e, "cul") - 50) * 0.06),
      30,
      90
    )),
    (e.bracket = []),
    (e.tournament = ""),
    (e.tournamentRound = 0),
    (e.confChampion = !1),
    (e.berth = ""),
    (e.result = ""),
    (e.signings = []),
    e.league.forEach((l) => {
      // your conference mates' records live on this copy; hand them to W_off (it read 0-0, a .500 season, every year,
      // so weak mates gained prestige and better recruits year after year and caught up by season 5)
      let o = l.id !== e.school.id && e.opponents.find((z) => z.id === l.id);
      o && ((o.wins = l.wins), (o.losses = l.losses));
      ((l.wins = 0),
        (l.losses = 0),
        (l.cw = 0),
        (l.cl = 0),
        l.id !== e.school.id && (l.rating = le(l.rating + j(e, -3, 3), 50, 88)));
    }),
    e.opponents.forEach((l) => (l.rating = le(l.rating + j(e, -2, 2), 45, 95))),
    ((e.__pt = W_off(e, bd)), Vf(e), W_pt(e, e.__pt), delete e.__pt),
    (e.pw = e.prospects.some((q) => q.fid) ? 1 : 0),
    (e.pv = TUNE.pvisits),
    (e.ov = TUNE.ovisits + ((e.staff?.rec || 0) >= 2 ? 1 : 0) + ((e.staff?.rec || 0) >= 3 ? 1 : 0)),
    (e.rel = 0),
    jf(e),
    Hs(e),
    (() => {
      let o = e.nc.reduce((l, u) => l + (e.opponents.find((r) => r.id === u.teamId)?.rating || 0), 0) / 12,
        old = e.nc,
        nn = ncFor(e),
        gi = 0;
      ((e.nc = nn.map((n, i) => {
        let k = old[i];
        if (k && k.guarantee && k.venue === "Away") {
          let op = e.opponents.find((r) => r.id === k.teamId);
          if (op && op.rating >= Ps(e) + 15 && !nn.some((z, j) => j !== i && z.teamId === k.teamId))
            return ((gi += k.guarantee), k);
        }
        return n;
      })),
        (e.guaranteeIncome = gi),
        (e.budget = e.baseBudget + gi),
        (e.ncCustom = !1));
      let n = e.nc.reduce((l, u) => l + (e.opponents.find((r) => r.id === u.teamId)?.rating || 0), 0) / 12;
      Be(
        e,
        "New nonconference schedule",
        `Your nonconference slate was rebuilt for this season. Average opponent rating: ${Math.round(o)} \u2192 ${Math.round(n)}.`
      );
    })(),
    Zf(e),
    pd.length &&
      Be(e, "Ceilings shifted", `Minutes, role fit and morale moved some potential: ${pd.join(", ")}.`),
    Be(
      e,
      "A new offseason",
      `${e.departed.filter((l) => l.reason === "Graduated").length} graduates. ${t} players are weighing the transfer portal. ${a.length} returning players. Your next chapter starts here.`
    ));
}
