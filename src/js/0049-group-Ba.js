function Ba(e, a, t = !1) {
  let l = (t ? e.prospects : e.roster).find((u) => u.id === a);
  if (!l) throw new Error("Player not found.");
  return l;
}
function ho(e, a, t) {
  if (typeof e != "number" || !Number.isFinite(e)) throw new Error("Enter a valid number.");
  return le(Math.round(e), a, t);
}
// Spend scouting visits on favorite (bookmarked) recruits: ranked choices first, then the most stars.
// Same effect as the "scout" action. Returns how many visits were used.
function scoutFav(e) {
  if (e.round > 8) return 0;
  let n = 0,
    fav = e.prospects
      .filter((p) => p.target && p.status === "Available" && p.scouted < (p.intl ? 1 : 2) && !hsLock(e, p))
      .sort((p, q) => (p.rank || 9) - (q.rank || 9) || (q.sg ?? q.stars) - (p.sg ?? p.stars) || q.interest - p.interest);
  for (let p of fav)
    for (; e.scouts > 0 && p.scouted < (p.intl ? 1 : 2);)
      (p.scouted++, e.scouts--, n++, (p.progress = le(p.progress + 8, 0, 99)), (p.interest = le(p.interest + 3, 0, 99)));
  // item 5: official visits go to favorites you have made an offer to (best first), only when auto-scout is used
  let offered = e.prospects
    .filter((p) => p.target && p.offer && !p.fid && !p.ov && p.status === "Available" && !hsLock(e, p))
    .sort((p, q) => (p.rank || 9) - (q.rank || 9) || (q.sg ?? q.stars) - (p.sg ?? p.stars));
  for (let p of offered) {
    if ((e.ov ?? TUNE.ovisits) < 1) break;
    ((e.ov = (e.ov ?? TUNE.ovisits) - 1), (p.ov = 1), (p.scouted = p.intl ? Math.max(p.scouted, 1) : 2));
    ((p.progress = le(p.progress + 20, 0, 99)), (p.interest = le(p.interest + 8, 0, 99)), n++);
  }
  return n;
}
function Da(e, a) {
  if (e.phase !== a) throw new Error(`This action is only available during ${a.toLowerCase()}.`);
}
