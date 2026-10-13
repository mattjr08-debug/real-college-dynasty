function hy(e) {
  let a = e.schema < 2;
  ((e.baseBudget ??= e.budget), (e.guaranteeIncome ??= 0), (e.signingEvents ??= []), (e.walkons ??= []));
  ((e.heat ??= 0),
    (e.fired ??= !1),
    (e.jobOffers ??= []),
    (e.tenureStart ??= 0),
    (e.tierShift ??= 0),
    (e.draft ??= []),
    (e.xfers ??= []),
    (e.negs ??= []),
    (e.alumni ??= []),
    (e.classes ??= []),
    (e.don ??= { ex: 50, co: 50 }),
    (e.diff ??= "normal"),
    (e.h2h ??= {}),
    e.rival ||
      (e.rival = (() => {
        let m = e.league
          .slice(1)
          .sort((x, y) => Math.abs(x.rating - e.school.rating) - Math.abs(y.rating - e.school.rating))[0];
        return m ? { id: m.id, name: m.name } : null;
      })()),
    (e.mkt ??= 1),
    e.rosters || W_init(e),
    W_nilInit(e),
    e.rev || W_revInit(e),
    W_coachInit(e),
    TUNE.coachRep && W_crepInit(e));
  for (let t of [...e.roster, ...e.prospects, ...e.walkons])
    ((t.faceSeed ??= TS(`${e.school.id}-${t.id}-${t.name}`)),
      (() => {
        let hh = TS(t.id + "-x");
        ((t.pers ??= ["Loyal", "Ambitious", "Patient", "Money-focused"][hh % 4]),
          (t.home ??= (hh >>> 3) & 3),
          (t.prefs ??= {
            nil: 5 + (hh % 26),
            time: 5 + ((hh >>> 4) % 26),
            dev: 5 + ((hh >>> 8) % 26),
            win: 5 + ((hh >>> 12) % 26),
            home: (hh >>> 16) % 21,
            coach: (hh >>> 20) % 21,
          }),
          (t.tend ??= { three: le(0.3 + ((t.attrs[2] || 60) - 60) * 0.006, 0.04, 0.7) }),
          (t.dev ??= ["Late bloomer", "Steady", "Steady", "Plateau", "Boom"][(hh >>> 5) % 5]),
          (t.pn ??= ((hh >>> 9) % 17) - 8));
      })(),
      (t.pos2 ??= ((x) => {
        let m = { PG: ["SG"], SG: ["PG", "SF"], SF: ["SG", "PF"], PF: ["SF", "C"], C: ["PF"] }[t.pos] || [];
        return x % 10 < 6 && m.length ? m[(x >>> 4) % m.length] : "";
      })(TS(t.id + "-2nd"))),
      (t.progress ??= t.status === "Signed" || t.status === "Committed elsewhere" ? 100 : t.offer ? 20 : 0),
      (t.origin ??= t.source === "Roster" ? (t.history.length ? "Transfer" : "High school") : t.source),
      t.status === "Signed" && !t.committedTo && (t.committedTo = e.school.name));
  if (a) {
    let t = e.prospects;
    (Vf(e),
      (e.prospects = [...t, ...e.prospects].slice(0, 560)),
      e.walkons.length || jf(e),
      (e.scouts = Math.max(e.scouts, 24)),
      (e.lineup = e.lineup
        .filter((o, r, n) => !!o && n.indexOf(o) === r && e.roster.some((i) => i.id === o && !i.redshirt))
        .slice(0, 5)),
      e.lineup.length < 5 && Hs(e));
    for (let o of e.roster)
      o.role = o.redshirt
        ? "Redshirt"
        : e.lineup.includes(o.id)
          ? "Starter"
          : o.minutes > 8
            ? "Rotation"
            : "Bench";
    [
      ...e.roster
        .filter((o) => o.promise === "Starter")
        .sort(
          (o, r) => (e.lineup.includes(r.id) ? 1 : 0) - (e.lineup.includes(o.id) ? 1 : 0) || r.ovr - o.ovr
        ),
    ]
      .slice(5)
      .forEach((o) => (o.promise = "Rotation"));
    let u = e.roster.filter((o) => o.promise === "Starter").length;
    for (let o of e.prospects) o.offer?.role === "Starter" && ++u > 5 && (o.offer.role = "Rotation");
    Be(
      e,
      "Desktop edition updated",
      "Your career now supports 15 players, guarantee games, recruiting progress, automated recruiting, and the walk-on pool. Existing season results are preserved."
    );
  }
  return ((e.schema = 2), e);
}
