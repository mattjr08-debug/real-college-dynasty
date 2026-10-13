function AS(e, played = null) {
  let a = Rn(e, !0, played),
    t = a.some((u) => u.id === e.school.id),
    l = a.length === 1 && t;
  ((() => {
    let g = e.bracket[e.tournamentRound - 1]?.find((u) => u.a.id === e.school.id || u.b.id === e.school.id);
    if (g && !t) {
      let m = g.a.id === e.school.id;
      e.elim = {
        kind: e.tournament,
        round: (e.tournament === "National"
          ? natNames(e.bracket[0]?.[0]?.ff)
          : e.tournament === "NIT"
            ? NIT_NAMES
            : [...(e.bracket[0]?.[0]?.pi ? ["First round"] : []), "Quarterfinals", "Semifinals", "Championship"])[e.tournamentRound - 1],
        opp: (m ? g.b : g.a).name,
        us: m ? g.sa : g.sb,
        them: m ? g.sb : g.sa,
        seed: e.seedMap?.[e.school.id],
      };
    }
  })(),
    (e.nwin = null),
    (() => {
      if (e.tournament === "National" && t && !l) {
        let g = e.bracket[e.tournamentRound - 1]?.find(
          (u) => u.a.id === e.school.id || u.b.id === e.school.id
        );
        if (g) {
          let m = g.a.id === e.school.id,
            o = m ? g.b : g.a,
            N = natNames(e.bracket[0]?.[0]?.ff),
            su = e.seedMap?.[e.school.id],
            so = e.seedMap?.[o.id];
          e.nwin = {
            round: N[e.tournamentRound - 1],
            next: N[e.tournamentRound],
            opp: o.name,
            us: m ? g.sa : g.sb,
            them: m ? g.sb : g.sa,
            su,
            so,
            upset: !!(su && so && so < su),
          };
        }
      }
    })());
  if (e.tournament === "Conference") {
    if (
      (l &&
        ((e.confChampion = !0),
        Be(
          e,
          "Conference champions",
          `${e.school.name} cut down the nets. Your national tournament place is secured.`
        )),
      !t || a.length === 1)
    ) {
      for (; e.bracket[e.tournamentRound].length;) Rn(e, !1);
      iy(e);
    }
  } else if (!t || l) {
    let nit = e.tournament === "NIT",
      u = nit
        ? [...NIT_NAMES.slice(0, -1), "NIT runner-up"]
        : [...natNames(e.bracket[0]?.[0]?.ff).slice(0, -1), "National runner-up"];
    for (
      e.result = l
        ? nit
          ? "NIT champions"
          : "National champions"
        : u[e.tournamentRound - 1] || (nit ? "NIT" : "National tournament");
      e.bracket[e.tournamentRound].length;
    )
      Rn(e, !1);
    dy(e);
  }
}
