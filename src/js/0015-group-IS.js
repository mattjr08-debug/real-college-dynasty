function IS(e, a) {
  let t = e.league[0];
  a.win ? t.wins++ : t.losses++;
  let l = e.league.find((r) => r.id === a.oppId);
  ["Nonconference", "Conference"].includes(a.kind) && l && W_tot(l, a.them, a.us, a.poss || 70);
  ["Nonconference", "Conference"].includes(a.kind) &&
    W_qrec(e, l, e.school.id, !a.win, a.venue === "Home" ? "A" : a.venue === "Away" ? "H" : "N");
  a.kind === "Conference"
    ? (a.win ? t.cw++ : t.cl++,
      l && (a.win ? (l.losses++, l.cl++) : (l.wins++, l.cw++), W_pst(e, l.id, a.them, !a.win, a.opponentBox || null)))
    : l && (a.win ? l.losses++ : l.wins++, W_pst(e, l.id, a.them, !a.win, a.opponentBox || null));
}
function Qf(e) {
  return [...e.league].sort((a, t) => t.cw - a.cw || t.wins - a.wins || t.rating - a.rating);
}
function bS(e) {
  W_ct(e);
  // leagues of 12 or more: 12 teams, seeds 1 to 4 have a bye and start in the quarterfinals (play-in round 0, then the usual 8-team bracket)
  let F = e.league.length >= 12 ? 12 : 8,
    a = Qf(e).slice(0, F),
    ph = (id) => ({ id, name: "First-round winner", short: "TBD", rating: 0, wins: 0, losses: 0, cw: 0, cl: 0 });
  ((e.seedMap = {}), a.forEach((h, k) => (e.seedMap[h.id] = k + 1)));
  while (F === 8 && a.length < 8) a.push({ id: "bye", name: "Bye", short: "BYE", rating: 0, wins: 0, losses: 0, cw: 0, cl: 0 });
  let at = a.findIndex((t) => t.id === e.school.id);
  if (
    ((e.tournament = "Conference"),
    (e.bracket =
      F === 12
        ? [
            [
              { a: a[4], b: a[11], pi: 1, slot: [1, "b"] },
              { a: a[7], b: a[8], pi: 1, slot: [0, "b"] },
              { a: a[5], b: a[10], pi: 1, slot: [3, "b"] },
              { a: a[6], b: a[9], pi: 1, slot: [2, "b"] },
            ],
            [
              { a: a[0], b: ph("cA") },
              { a: a[3], b: ph("cB") },
              { a: a[1], b: ph("cC") },
              { a: a[2], b: ph("cD") },
            ],
          ]
        : [
            [
              [0, 7],
              [3, 4],
              [1, 6],
              [2, 5],
            ].map(([t, l]) => ({ a: a[t], b: a[l] })),
          ]),
    (e.tournamentRound = 0),
    ((F === 12 && at >= 0 && at < 4) || (at === 0 && a.some((x) => x.id === "bye"))) && Rn(e, !1),
    at >= 0)
  )
    ((e.phase = "Conference tournament"),
      Be(
        e,
        "Conference tournament",
        `You earned the #${at + 1} seed${F === 12 ? (at < 4 ? " and a first-round bye. Three wins secure" : ". Four wins secure") : ". Three wins secure"} an automatic national tournament berth.`
      ));
  else {
    for (
      ;
      e.bracket[e.tournamentRound].length &&
      (Rn(e, !1),
      !(e.bracket[e.tournamentRound]?.length === 0 || e.bracket[e.tournamentRound - 1]?.length === 1));
    );
    iy(e);
  }
}
function starsOf(o) {
  return o < 51 ? 0 : o < 57 ? 1 : o < 64 ? 2 : o < 72 ? 3 : o < 80 ? 4 : 5;
}
// Star rating from the whole player: overall, how much room he has to grow (potential), size for his position,
// athleticism (speed, strength, vertical, stamina) and, if he has played, production. Each part is a small nudge
// around his overall, so the number of players at each star level stays about the same as before.
// portal = a transfer entrant. Stars for the portal are given on his current play, not on projection, so a transfer needs a few more points of overall
// than a high-school player for the same star level (TUNE.portalStar). Most portal players are therefore better than high-school players of the same class.
function starRate(p, portal) {
  let c = (v, lo, hi) => Math.max(lo, Math.min(hi, v)),
    at = p.attrs,
    size = c((p.height - [73, 76, 79, 81, 83][Math.max(0, Le.indexOf(p.pos))]) * 0.6, -2, 2),
    ath = c(((at[12] + at[13] + at[14] + at[15]) / 4 - 60) * 0.12, -3, 3),
    pot = c((p.potential - p.ovr - 14) * 0.3, -3, 3),
    last = p.stats && p.stats.gp ? p.stats : p.history && p.history.length ? p.history.at(-1).stats : null,
    prod =
      last && last.gp >= 5
        ? c(((last.pts + last.reb + last.ast + (last.stl || 0) + (last.blk || 0)) / last.gp - 14) * 0.15, -2.5, 2.5)
        : 0;
  return starsOf(p.ovr + size + ath + pot + prod - (portal && typeof TUNE !== "undefined" ? TUNE.portalStar || 0 : 0));
}
function apr(e) {
  let n = e.roster.filter((t) => !t.redshirt),
    r = [...n].sort((t, l) => l.ovr - t.ovr),
    k = 5 - Xa(e),
    w = n
      .filter((t) => !t.promise || t.promise === "None")
      .sort((t, l) => (e.lineup.includes(l.id) ? 1 : 0) - (e.lineup.includes(t.id) ? 1 : 0) || l.ovr - t.ovr),
    c = 0;
  for (let t of w) {
    let l = r.indexOf(t);
    ((t.promise =
      e.lineup.includes(t.id) && k > 0
        ? (k--, "Starter")
        : t.minutes > 8 || (t.minutes === 0 && l < 9)
          ? "Rotation"
          : "Bench"),
      c++);
  }
  c &&
    Be(
      e,
      "Roles promised",
      `${c} player${c === 1 ? "" : "s"} ${c === 1 ? "was" : "were"} promised a role that matches the current lineup and rotation.`
    );
}
// Item 43: eligibility of a transfer. All transfers can play right away in this game.
function eligLine(p) {
  return p.year >= 4
    ? "Graduate transfer \xB7 1 year of eligibility left \xB7 immediately eligible"
    : `First-year transfer \xB7 ${5 - p.year} years of eligibility left \xB7 immediately eligible`;
}
function prevLine(p) {
  let h = p.history && p.history.at(-1),
    why =
      (p.why ? ` \xB7 Entered because: ${p.why}` : "") +
      (p.status === "Available" && p.bd && p.bd.length
        ? ` \xB7 ${p.bd.length} bid${p.bd.length === 1 ? "" : "s"}, best: ${p.bd[0].n}`
        : "");
  if (!h || !h.stats || !h.stats.gp) return why ? `${(h && h.team) || "Previous school"}${why}` : "";
  let z = h.stats;
  return `${h.team || "Previous school"}: ${(z.pts / z.gp).toFixed(1)} pts, ${(z.reb / z.gp).toFixed(1)} reb, ${(z.ast / z.gp).toFixed(1)} ast a game${why}`;
}
function rsReact(t) {
  return (
    { Patient: 3, Loyal: 0, Ambitious: -14, "Money-focused": t.nil >= t.ask * 0.9 ? -2 : -10 }[t.pers] ?? 0
  );
}
var ROLEW = {
  PG: [0.04, 0.06, 0.1, 0.04, 0.16, 0.16, 0.1, 0.02, 0.06, 0.01, 0.01, 0.03, 0.1, 0.02, 0.03, 0.06],
  SG: [0.06, 0.08, 0.14, 0.05, 0.1, 0.08, 0.1, 0.03, 0.06, 0.02, 0.02, 0.03, 0.09, 0.03, 0.05, 0.06],
  SF: [0.09, 0.08, 0.09, 0.05, 0.06, 0.06, 0.09, 0.06, 0.05, 0.04, 0.05, 0.06, 0.07, 0.05, 0.05, 0.05],
  PF: [0.1, 0.05, 0.03, 0.04, 0.02, 0.03, 0.05, 0.12, 0.04, 0.08, 0.1, 0.12, 0.04, 0.08, 0.05, 0.05],
  C: [0.12, 0.03, 0.01, 0.03, 0.01, 0.02, 0.03, 0.15, 0.03, 0.12, 0.12, 0.14, 0.02, 0.09, 0.05, 0.03],
};
function W_ovr(at, pos) {
  let w = ROLEW[pos] || ROLEW.SF,
    avg = at.reduce((x, y) => x + y, 0) / at.length,
    r = at.reduce((x, y, i) => x + y * w[i], 0);
  return Math.round(avg * 0.7 + r * 0.3);
}
function dep(l, r) {
  return { name: l.name, reason: r, ovr: l.ovr, faceSeed: l.faceSeed, portrait: l.portrait, pos: l.pos };
}
