// Shared season bookkeeping for simulated and directly played games.
function W_finishPlayed(e, a, result) {
  let { l, t, u, us: M, them: p, ot: C, poss, tmo } = result;
  Object.assign(a, {
    played: true,
    us: M,
    them: p,
    win: M > p,
    box: u,
    ot: C,
    poss,
    tmo,
  });
  W_teamRecs(e, a);
  for (let m of e.roster) {
    let c = u.find((L) => L.id === m.id);
    if (c) {
      for (let L of Object.keys(m.stats)) m.stats[L] += c[L];
      W_recs(e, m, c, a);
      (m.recent.unshift({
        opponent: a.opponent,
        pts: c.pts,
        reb: c.reb,
        ast: c.ast,
        stl: c.stl,
        blk: c.blk,
        min: c.min,
      }),
        (m.recent = m.recent.slice(0, 8)));
    }
    if (!m.redshirt && m.injury === 0) {
      let I = (c?.min || 0) >= wt(m.promise) - 3 ? 1.4 : -2.4;
      (m.promise === "Starter" && !e.lineup.includes(m.id) && (I -= 1.1),
        m.promise &&
          m.promise !== "None" &&
          (m.promise === "Starter"
            ? e.lineup.includes(m.id)
            : (c?.min || 0) >= wt(m.promise)) &&
          (I += 0.8),
        m.pers === "Ambitious" &&
          (c?.min || 0) < wt(m.promise) - 3 &&
          (I -= 0.8),
        m.pers === "Patient" && I < 0 && (I += 0.5),
        (I += a.win ? 1 : -0.5),
        m.nil < m.ask * 0.6 && (I -= 0.7),
        (m.morale = le(m.morale + I, 5, 99)));
    }
    (m.injury > 0 && m.injury--,
      m.injury === 0 && m.susp && delete m.susp,
      m.adj > 0 && --m.adj === 0 && W_adj(e, m));
  }
  ((() => {
    let df = { relaxed: 0.65, hardcore: 1.45 }[e.diff] || 1,
      hp = l.filter((m) => m.injury === 0 && (t.get(m.id) || 0) > 0);
    if (hp.length > 7)
      for (let m of hp) {
        let mn = t.get(m.id) || 0,
          ih = m.ih || { n: 0, g: 0, major: 0 },
          pr =
            0.007 *
            df *
            (mn / 28) *
            (1 + 0.32 * Math.min(ih.n || 0, 5) + 0.25 * (ih.major || 0)) *
            ((m.age || 20) >= 22 ? 1.15 : 1) *
            (1.18 - (m.attrs[15] || 60) / 250);
        if (ne(e) < pr) {
          let r = ne(e),
            g =
              r < 0.03 * (1 + (ih.n || 0) * 0.3)
                ? j(e, 26, 40)
                : r < 0.07 + 0.05 * Math.min(ih.n || 0, 4)
                  ? j(e, 8, 24)
                  : j(e, 1, 4);
          ((m.injury = g),
            (m.ih = {
              n: (ih.n || 0) + 1,
              g: (ih.g || 0) + g,
              major: (ih.major || 0) + (g >= 8 ? 1 : 0),
            }));
          // Medical hardship waiver: a season-ending injury in the first half of the season gives the year back (once).
          g >= 26 &&
            !m.medUsed &&
            e.schedule.filter((f) => f.played).length <= 15 &&
            (m.med = 1);
          g >= 26 &&
            ne(e) < 0.4 &&
            (m.attrs = m.attrs.map((q, ix) =>
              [12, 13, 14, 15].includes(ix) ? le(q - 3, 25, 99) : q,
            ));
          Be(
            e,
            "Injury report",
            `${m.name} will miss ${g} games${m.ih.n > 1 ? `. It is injury number ${m.ih.n} here.` : "."}${g >= 26 ? " It is a season-ending injury." : ""} His minutes will be redistributed while he recovers.`,
          );
          break;
        }
      }
  })(),
    // Suspensions: about one every one to two seasons (measured 0.75 a season), 1 to 3 games, for a violation of team rules.
    (() => {
      if (ne(e) >= 0.017) return;
      let c = e.roster.filter((m) => !m.redshirt && m.injury === 0);
      if (c.length <= 8) return;
      let m = jl(e, c),
        g = j(e, 1, 3);
      ((m.injury = g),
        (m.susp = 1),
        (m.morale = le(m.morale - 4, 5, 99)),
        Be(
          e,
          "Suspension",
          `${m.name} was suspended for ${g} game${g === 1 ? "" : "s"} for a violation of team rules. His minutes will be redistributed.`,
        ));
    })(),
    (e.chemistry = le(e.chemistry + 0.55, 20, 99)),
    (() => {
      e.h2h = e.h2h || {};
      let k = (e.h2h[a.oppId] = e.h2h[a.oppId] || { w: 0, l: 0 });
      a.win ? k.w++ : k.l++;
      e.rival &&
        a.oppId === e.rival.id &&
        Be(
          e,
          a.win ? "Rivalry win" : "Rivalry loss",
          `${a.win ? "You beat" : "You lost to"} your rival ${e.rival.name}. Series: ${k.w}\u2013${k.l}.`,
        );
    })(),
    (a.kind === "Conference" || a.kind === "Nonconference") &&
      (IS(e, a),
      W_day(e, a),
      e.schedule.filter((f) => f.played).length % 7 === 0 && W_story(e)),
    Be(
      e,
      `${a.win ? "Victory" : "Final"}: ${M}\u2013${p}${C ? " \xB7 OT" : ""}`,
      `${a.win ? "Defeated" : "Lost to"} ${a.opponent}. ${[...u].sort((m, c) => c.pts - m.pts)[0].name} led the team with ${Math.max(...u.map((m) => m.pts))} points.`,
    ));
}
