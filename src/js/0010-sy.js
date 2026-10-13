function sy(e, a, t, l = Date.now()) {
  let u = W_schoolById(e) || Xl[0],
    o = {
      schema: 2,
      baseBudget: u.budget,
      guaranteeIncome: 0,
      walkons: [],
      signingEvents: [],
      rng: l >>> 0,
      seq: 0,
      year: 2026,
      school: u,
      coach: a.trim().slice(0, 32) || "Coach Jackson",
      specialty: Us.includes(t) ? t : "Development",
      level: 1,
      phase: "Offseason",
      round: 1,
      scouts: 10,
      budget: u.budget,
      rep: u.rep,
      chemistry: 48,
      roster: [],
      prospects: [],
      departed: [],
      league: [],
      schedule: [],
      nc: [],
      opponents: [],
      lineup: [],
      tactics: { offense: "Balanced", defense: "Man-to-man", pace: "Balanced" },
      history: [],
      news: [],
      bracket: [],
      tournament: "",
      tournamentRound: 0,
      confChampion: !1,
      berth: "",
      result: "",
      signings: [],
      lastBudget: u.budget,
    };
  for (let i = 0; i < (REAL_ON ? 0 : 72); i++)
    o.opponents.push({
      id: `t${i}`,
      name: On[i],
      short: On[i]
        .split(" ")
        .map((d) => d[0])
        .join(""),
      rating: le(50 + Math.floor(i * 0.57) + [0, 1, 3, 5, 7][tierOf({ school: u })] + j(o, -4, 4), 46, 94),
      wins: 0,
      losses: 0,
      cw: 0,
      cl: 0,
    });
  u.generated && (o.opponents = o.opponents.filter((x) => x.id !== u.id));
  TUNE.teams && TUNE.teams !== 200 && (o.nt = TUNE.teams);
  W_teams(o);
  o.league = [
    { id: u.id, name: u.name, short: u.short, rating: u.rating, wins: 0, losses: 0, cw: 0, cl: 0 },
    ...confTeams(o, tierOf({ school: u }), u.id, LEAGUE_SIZE[tierOf({ school: u })]),
  ];
  let r = j(o, 3, 5),
    n = Math.round(j(o, 0, 5) * keepOf({ school: u }));
  const rr = REAL_ON && REAL_TEAMS[u.name];
  if (rr) {
    // the real 2026-27 roster, rated from last year's stats and recruiting rank
    rr.r.slice(0, 15).forEach((row) => o.roster.push(W_realPlayer(o, row, u.name)));
    for (let k = o.roster.length; k < 10; k++) o.roster.push(Gf(o, "Roster", Math.max(45, Math.min(...o.roster.map((p) => p.ovr)) - 5), j(o, 1, 2), Le[k % 5]));
  } else
  for (let i = 0; i < 15; i++) {
    let d = Gf(o, "Roster", u.rating + j(o, -6, 7), i < r ? 4 : j(o, 1, 3), Le[i % 5]);
    i < r
      ? o.departed.push({ name: d.name, reason: "Graduated", ovr: d.ovr })
      : i < r + n
        ? o.departed.push({ name: d.name, reason: "Entered transfer portal", ovr: d.ovr })
        : o.roster.push(d);
  }
  // Starting contracts must leave room in the budget (they used to total more than it at 17 of 30 schools,
  // so Auto-recruit showed negative NIL). Scale them down so they use at most 80% of the budget.
  let cn = o.roster.reduce((x, p) => x + p.nil, 0);
  if (cn > u.budget * 0.8)
    o.roster.forEach((p) => (p.nil = Math.round((p.nil * u.budget * 0.8) / cn / 1e3) * 1e3));
  return (
    W_init(o),
    (o.mkt = 1),
    W_revInit(o),
    W_coachInit(o),
    (o.rival = (() => {
      let m = o.league
        .slice(1)
        .sort((x, y) => Math.abs(x.rating - u.rating) - Math.abs(y.rating - u.rating))[0];
      return m ? { id: m.id, name: m.name } : null;
    })()),
    (o.nc = ncFor(o)),
    Vf(o),
    jf(o),
    Hs(o),
    Zf(o),
    o.roster.forEach((i) => (i.promise = "None")),
    Be(
      o,
      "Your rebuild starts now",
      rr
        ? `${u.wins}\u2013${rr.l} last season (#${rr.tr} in the final Torvik ratings). This is your real 2026-27 roster, each player rated from last year\u2019s stats and recruiting rank. Fill the open spots before opening night.`
        : `${u.wins}\u2013${30 - u.wins} last season. ${r} seniors graduated and ${n} players transferred. Build a roster of at least 8 players before opening night.`
    ),
    o
  );
}
