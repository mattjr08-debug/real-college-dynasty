(function (scope) {
  function createMatch(e, g, helpers) {
    const { W_at, W_tend, TS } = helpers;
    const Le = ["PG", "SG", "SF", "PF", "C"],
      le = (n, a, b) => Math.max(a, Math.min(b, n));
    let active = e.roster.filter((p) => !p.redshirt && !p.injury),
      mine = e.lineup
        .map((id) => active.find((p) => p.id === id))
        .filter(Boolean);
    for (let p of [...active].sort(
      (a, b) => b.minutes - a.minutes || b.ovr - a.ovr,
    ))
      if (mine.length < 5 && !mine.includes(p)) mine.push(p);
    if (mine.length !== 5)
      throw new Error("Five healthy players are needed to play.");
    let roster = e.rosters?.[g.oppId];
    if (!roster || roster.length < 5)
      throw new Error("The opponent needs a full roster to play.");
    let chosen = [];
    for (let pos of Le) {
      let p = [...roster]
        .filter((p) => !chosen.includes(p))
        .sort((a, b) => (b.p === pos) - (a.p === pos) || b.o - a.o)[0];
      chosen.push(p);
    }
    const opponentPlayer = (p) => ({
      id: p.i,
      name: p.n,
      pos: p.p,
      ...(p.skinColor?{skinColor:p.skinColor}:{}),
      ...(p.hairColor?{hairColor:p.hairColor}:{}),
      appearanceSeed: p.faceSeed ?? TS(String(p.i)),
      height:
        p.height ??
        p.h ??
        { PG: 73, SG: 76, SF: 79, PF: 81, C: 83 }[p.p] +
          (TS(String(p.i) + "-height") % 5) -
          2,
      ovr: p.o,
      attrs: W_at(p),
      tend: {
        three: le(
          // Same shooting/position curve as career players; compact opponents use a stable ID hash for variation.
          0.36 +
            (W_at(p)[2] - 60) * 0.006 +
            (Le.indexOf(p.p) < 2 ? 0.1 : Le.indexOf(p.p) > 2 ? -0.16 : 0) +
            ((TS(String(p.i) + "-three") % 13) - 6) / 100,
          0.04,
          0.72,
        ),
      },
    });
    let opponent = chosen.map(opponentPlayer);
    let profile = (p) => ({
      id: p.id,
      name: p.name,
      pos: p.pos,
      ...(p.skinColor?{skinColor:p.skinColor}:{}),
      ...(p.hairColor?{hairColor:p.hairColor}:{}),
      appearanceSeed: p.faceSeed ?? p.appearanceSeed ?? TS(String(p.id)),
      height:
        p.height ?? { PG: 73, SG: 76, SF: 79, PF: 81, C: 83 }[p.pos] ?? 79,
      ovr: p.ovr,
      attrs: [...p.attrs],
      tendencies: W_tend(p),
    });
    const opp=e.opponents.find(p=>p.id===g.oppId)||e.league?.find(p=>p.id===g.oppId)||{id:g.oppId,name:g.opponent,short:g.opponent};
    const opponentSchool=helpers.hqOppSchool?helpers.hqOppSchool(opp):{...opp,color:opp.color||`hsl(${TS(String(opp.id))%360} 58% 40%)`};
    const branding=school=>({color:school.color||'#163e63',secondaryColor:school.secondaryColor||'#eeeeea',logo:helpers.logoFor?'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style="color:${school.color||'#163e63'}">${helpers.logoFor(school)}</svg>`):school.logo||null});
    return {
      homeTeam:g.venue==='Away'?1:g.venue==='Neutral'?null:0,
      gid: g.id,
      year: e.year,
      seed: e.rng,
      tactics: {offense:e.tactics?.offense || "Balanced",defense:e.tactics?.defense || "Man-to-man",pace:e.tactics?.pace || "Balanced",tmo:e.tactics?.tmo || "Normal"},
      timeoutRules: {total:helpers.TUNE?.timeouts ?? 4,carry:helpers.TUNE?.toCarry ?? 3},
      teams: [
        {
          ...branding(e.school),
          name: e.school.name,
          short: e.school.short || e.school.name,
          players: mine.map(profile),
          bench: active.filter(p=>!mine.includes(p)).map(profile),
        },
        {
          ...branding(opponentSchool),
          name: g.opponent,
          short: e.opponents.find((p) => p.id === g.oppId)?.short || g.opponent,
          players: opponent.map(profile),
          bench: roster.filter(p=>!chosen.includes(p)).map(opponentPlayer).map(profile),
        },
      ],
    };
  }

  scope.CollegeDynastyBasketballAdapter = { createMatch };
})(typeof window !== "undefined" ? window : globalThis);
