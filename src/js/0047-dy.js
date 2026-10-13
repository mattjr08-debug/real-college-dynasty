function dy(e) {
  e.phase = "Season review";
  let a = dl(e),
    t = Dn(e),
    l = e.rep,
    u = a.wins >= _s(e);
  (W_don(e, a, _s({ ...e, rep: l })),
    W_cls(e),
    W_fire(e),
    (e.__hl = { ...W_hl(e), pre: e.pre, cf: Qf(e).findIndex((t) => t.id === e.school.id) + 1 }),
    (e.lastBudget = e.baseBudget),
    (e.rep = le(
      e.rep +
        (u ? 5 : a.wins >= e.school.wins ? 1 : -2) +
        (e.confChampion ? 5 : 0) +
        (e.result === "National champions" ? 15 : e.berth.includes("berth") ? 4 : 0),
      5,
      99
    )),
    (() => {
      e.rev || W_revInit(e);
      let r = e.rev,
        gg = a.wins + a.losses,
        wp = gg ? a.wins / gg : 0.5,
        tw = e.schedule.filter((f) => f.played && f.win && /tournament/.test(f.kind)).length,
        ch = e.result === "National champions";
      ((e.revPrev = { ...r }),
        (r.donors = Math.round(
          r.donors * (0.92 + ((e.don.ex + e.don.co) / 100) * 0.12) + (e.confChampion ? 2e4 : 0)
        )),
        (r.tickets = Math.round(r.tickets * (0.9 + wp * 0.25))),
        (r.media = Math.round(r.media * (0.97 + (e.rep / 99) * 0.1) + (ch ? 8e4 : 0))),
        // item 25: the conference also shares the national tournament "units" its teams earn: 5,000 for each win by a conference mate
        (r.tourney = tw * 18e3 + (ch ? 6e4 : 0) + 5e3 * W_confWins(e)));
      // item 7: media money follows the market and is renegotiated every 4th season; the conference share follows the league's strength rank
      let mk = e.mkt || 1,
        seasons = e.history.length + 1,
        deal = seasons % 4 === 0,
        dealMul = deal ? le(1.05 + (e.rep - 50) / 500 + j(e, -3, 3) / 100, 0.95, 1.25) : 1,
        cf = W_confMult(e);
      ((r.media = Math.round(r.media * (mk / (r.mk || mk)) * dealMul)),
        (r.mk = mk),
        (r.conf = Math.round((r.conf * cf.mult) / (r.cm || cf.mult))),
        (r.cm = cf.mult),
        deal &&
          Be(
            e,
            "New media-rights deal",
            `Your media and merchandise income was renegotiated: ${dealMul >= 1 ? "+" : ""}${Math.round((dealMul - 1) * 100)}% on top of market growth. Your conference ranks ${cf.rank} of ${cf.n}, which sets its payout.`
          ),
        (e.baseBudget = Math.round((r.donors + r.tickets + r.media + r.conf + r.tourney) / 1e3) * 1e3));
    })(),
    (e.budget = e.baseBudget + e.guaranteeIncome),
    (e.level = 1 + Math.floor(e.history.length / 2)));
  let o = [...e.roster].sort((n, i) => i.stats.pts - n.stats.pts)[0],
    r = o ? `${o.name} \xB7 Team MVP` : "";
  (e.history.push({
    year: e.year,
    ...(TUNE.programScope ? { sid: e.school.id, school: e.school.name } : {}),
    ...a,
    cw: t.wins,
    cl: t.losses,
    rep: e.rep,
    budget: e.budget,
    award: r,
    result: e.result || "Season complete",
    cc: !!e.confChampion,
    hl: null,
    tsos: Math.round(
      e.schedule
        .filter((f) => f.played && ["Nonconference", "Conference"].includes(f.kind))
        .reduce((x, f) => x + f.rating, 0) /
        Math.max(
          1,
          e.schedule.filter((f) => f.played && ["Nonconference", "Conference"].includes(f.kind)).length
        )
    ),
    bt: String(e.berth || ""),
    leader: o?.name || "",
    recruits: [...e.signings],
    hl: e.__hl,
    games: e.schedule
      .filter((f) => f.played)
      .map((f) => ({
        o: f.opponent,
        v: f.venue,
        k: f.kind,
        us: f.us,
        t: f.them,
        w: f.win,
        ot: f.ot || 0,
        r: f.rating,
      })),
    conf: e.confBracket || null,
    nat: e.natBracket || (e.tournament === "National" ? cbk(e, e.bracket) : null),
    nit: e.nitBracket || (e.tournament === "NIT" ? cbk(e, e.bracket) : null),
    players: e.roster.map((n) => ({ name: n.name, pos: n.pos, ovr: n.ovr, stats: { ...n.stats } })),
  }),
    dyJob(e, a, l),
    TUNE.coachRep && (e.history.at(-1).goal = _s({ ...e, rep: l })),
    TUNE.coachRep && (e.__crep = W_crepSeason(e, e.history.at(-1))),
    dyOffers(e, a, l),
    W_coachYear(e, a, u),
    (e.history.at(-1).awards = dyAwards(e, a, _s({ ...e, rep: l }))),
    awardRaise(e, e.history.at(-1).awards),
    Be(
      e,
      u ? "Expectations exceeded" : "Season evaluation",
      `${a.wins} wins against a goal of ${_s({ ...e, rep: l })}. ${TUNE.coachRep ? "Program reputation" : "Reputation"} ${l} \u2192 ${e.rep}.${TUNE.coachRep && e.__crep ? ` Your reputation as a coach ${e.__crep.before} \u2192 ${e.__crep.after} (${W_crepLabel(e.__crep.after)}).` : ""} Next year\u2019s NIL budget: ${q(e.budget)}.`
    ),
    (e.school.wins = a.wins));
}
