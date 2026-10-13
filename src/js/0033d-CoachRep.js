// Coach reputation (e.crep, 0-99): yours, not the school's. It follows what YOU have done (win goals beaten, tournament runs,
// titles) and comes with you when you change jobs, where program reputation (e.rep) belongs to the school.
// It matters in two places: recruits weigh the coach as well as the program (W_recRep), and job offers follow the coach (dyOffers).
function W_crepInit(e) {
  if (e.crep == null) {
    // older saves: estimate from the record so far
    const h = e.history || [];
    let c = 25;
    for (const x of h) c += W_crepDelta(x, e);
    e.crep = le(Math.round(c), 5, 99);
  }
  return e.crep;
}
// the season's contribution: beat the win goal +4, 20 wins +1, tournament berth +3, Sweet 16 +2 more, Final Four +6, title +12,
// conference title +3; fall well short of the goal -3; a plain season drifts toward 50 by a point
function W_crepDelta(x, e) {
  if (!x) return 0;
  let d = 0;
  const goal = x.goal ?? (e && e.school ? e.school.wins : 20);
  if (x.wins >= goal) d += 4;
  else if (x.wins < goal - 4) d -= 3;
  if (x.wins >= 20) d += 1;
  if (x.wins >= 25) d += 1;
  const r = x.result || "";
  if (/berth/.test(x.bt || "")) d += 3;
  if (["Sweet 16", "Elite Eight"].includes(r)) d += 2;
  if (["Final Four", "National runner-up"].includes(r)) d += 6;
  if (r === "National champions") d += 12;
  if (x.cc) d += 3;
  if (d === 0) d = 0.5 * Math.sign(50 - (e?.crep ?? 50));
  return d;
}
function W_crepSeason(e, rec) {
  const before = W_crepInit(e);
  e.crep = le(Math.round(before + W_crepDelta(rec, e)), 5, 99);
  return { before, after: e.crep };
}
// what a recruit sees: the program, lifted by a coach whose name carries further than the school's.
// A 70-rep coach at a 30-rep program recruits like a 54-rep program; at a 70-rep program like 74. Never below the program itself.
function W_recRep(e) {
  const p = e.rep, c = W_crepInit(e);
  return le(Math.round(Math.max(p, p + (c - p) * 0.6 * (TUNE.crepPull ?? 1))), 0, 99);
}
function W_crepLabel(c) {
  return c >= 85 ? "Legend" : c >= 70 ? "National name" : c >= 55 ? "Respected" : c >= 40 ? "Rising" : c >= 25 ? "Unproven" : "Unknown";
}
