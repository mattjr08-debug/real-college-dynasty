function W_day(e, a) {
  e.sch || W_sched(e);
  let d = e.schedule.filter((f) => f.played && ["Nonconference", "Conference"].includes(f.kind)).length - 1,
    pollInit = d === 0 && W_poll(e),
    inL = new Set(e.league.map((x) => x.id)),
    opp = e.opponents.find((x) => x.id === a.oppId),
    rs = (id, w) => {
      (e.sres[id] = e.sres[id] || []).push(w ? "W" : "L");
    };
  opp &&
    (!inL.has(opp.id) && (a.win ? opp.losses++ : opp.wins++, W_pst(e, opp.id, a.them, !a.win, a.opponentBox || null)),
    W_qrec(e, opp, e.school.id, !a.win, a.venue === "Home" ? "A" : a.venue === "Away" ? "H" : "N"),
    W_tot(opp, a.them, a.us, a.poss || 70),
    rs(opp.id, !a.win));
  // item 55: the two event days (first and second game of each event) are played at neutral sites by every team, and the
  // second day is a bracket: after the first day winners meet winners and losers meet losers (set up at the end of the first day)
  let ev1 = d >= 0 && d < 12 && !!(e.nc[d] && e.nc[d].rd === 1 && e.nc[d].event && e.nc[d].venue === "Neutral" && e.nc[d + 1]) && evSecond(e, d + 1),
    evN = ev1 || (d >= 0 && d < 12 && evSecond(e, d)),
    winners = [],
    losers = [];
  for (let [x0, y0] of e.sch[d] || []) {
    let x = W_t(e, x0),
      y = W_t(e, y0);
    if (!x || !y) continue;
    let g = W_game(e, x, y),
      xw = g.winner.id === x.id;
    ev1 && (winners.push(xw ? x0 : y0), losers.push(xw ? y0 : x0));
    (xw ? (x.wins++, y.losses++) : (y.wins++, x.losses++),
      !evN && x.conf === y.conf && (xw ? (x.cw++, y.cl++) : (y.cw++, x.cl++)),
      (x.sr = (x.sr || 0) + y.rating),
      (y.sr = (y.sr || 0) + x.rating),
      xw && y.rating >= 78 && (x.qw = (x.qw || 0) + 1),
      !xw && x.rating >= 78 && (y.qw = (y.qw || 0) + 1),
      !xw && y.rating <= 60 && (x.bl = (x.bl || 0) + 1),
      xw && x.rating <= 60 && (y.bl = (y.bl || 0) + 1),
      W_tot(x, g.sa, g.sb, g.poss || 70),
      W_tot(y, g.sb, g.sa, g.poss || 70),
      W_qrec(e, x, y0, xw, evN ? "N" : "H"),
      W_qrec(e, y, x0, !xw, evN ? "N" : "A"),
      rs(x0, xw),
      rs(y0, !xw));
  }
  if (ev1) {
    // your opponent in game 1 (a.oppId) lost if you won; you meet the closest-rated team among the other winners (or losers)
    let g2 = e.schedule[d + 1];
    (a.win ? losers : winners).push(a.oppId);
    let mine = a.win ? winners : losers,
      mineRating = Ps(e),
      pick = [...mine].sort((p, q) => Math.abs((W_t(e, p)?.rating || 0) - mineRating) - Math.abs((W_t(e, q)?.rating || 0) - mineRating))[0],
      o = pick && e.opponents.find((t) => t.id === pick);
    if (g2 && !g2.played && o) {
      mine.splice(mine.indexOf(pick), 1);
      Object.assign(g2, { opponent: o.name, oppId: o.id, rating: o.rating, bk: a.win ? "Championship bracket (winners)" : "Consolation bracket (losers)" });
      e.rival && o.id === e.rival.id ? (g2.rival = !0) : delete g2.rival;
      e.nc[d + 1] = { ...e.nc[d + 1], teamId: o.id };
    }
    let next = [],
      odd = [];
    for (let grp of [winners, losers]) {
      let L = [...grp];
      for (let k = L.length - 1; k > 0; k--) {
        let m = Math.floor(ne(e) * (k + 1));
        [L[k], L[m]] = [L[m], L[k]];
      }
      for (let i = 0; i + 1 < L.length; i += 2) next.push([L[i], L[i + 1]]);
      L.length % 2 && odd.push(L[L.length - 1]);
    }
    odd.length === 2 && next.push(odd);
    e.sch[d + 1] = next;
  }
  d % 3 === 2 && W_pollWeek(e);
}
