function W_story(e) {
  let all = Object.entries(e.rosters || {})
      .flatMap(([id, R]) =>
        R.filter((p) => p.s.g >= 8).map((p) => ({
          n: p.n,
          t: (e.opponents.find((z) => z.id === id) || {}).name,
          ppg: p.s.p / p.s.g,
        }))
      )
      .sort((a, b) => b.ppg - a.ppg),
    tm = e.opponents.filter((t) => t.wins + t.losses >= 12),
    hot = [...tm].sort((a, b) => a.wins / (a.wins + a.losses) - b.wins / (b.wins + b.losses))[0],
    sur = [...tm].sort(
      (a, b) =>
        b.wins / (b.wins + b.losses) -
        0.3 -
        ((b.rating - 46) / 48) * 0.5 -
        (a.wins / (a.wins + a.losses) - 0.3 - ((a.rating - 46) / 48) * 0.5)
    )[0],
    g = e.schedule.filter((f) => f.played).length,
    out = [];
  all[0] &&
    out.push({
      t: "Breakout star",
      b: `${all[0].n} of ${all[0].t} is averaging ${all[0].ppg.toFixed(1)} points a game.`,
    });
  hot &&
    hot.wins / (hot.wins + hot.losses) < 0.35 &&
    out.push({
      t: "Hot seat",
      b: `${hot.coach ? hot.coach.n : "The coach"} at ${hot.name} is under pressure after a ${hot.wins}\u2013${hot.losses} start.`,
    });
  sur &&
    sur.wins / (sur.wins + sur.losses) > 0.7 &&
    out.push({
      t: "Surprise team",
      b: `${sur.name} is ${sur.wins}\u2013${sur.losses} and nobody saw it coming.`,
    });
  for (let o of out.slice(0, 2)) e.lnews.unshift({ y: e.year, t: o.t, b: o.b, g });
  e.lnews = e.lnews.slice(0, 40);
}
