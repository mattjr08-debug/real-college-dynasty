function xBoost(d, x, r) {
  return dBoost(d, x) + ({ Starter: 14, Rotation: 7 }[r] || 0);
}
function dpick(e, l) {
  let o = l.ovr,
    sc =
      o +
      (l.potential - o) * 0.3 +
      (22 - (l.age || 20)) * 0.9 +
      (l.stats && l.stats.gp ? l.stats.pts / l.stats.gp : 8) * 0.2 +
      (l.height >= 80 ? 1.2 : 0) -
      (l.year >= 4 ? 1.5 : 0),
    pk = le(Math.round(62 - (sc - 80) * 2.6 + j(e, -4, 4)), 1, 60);
  return pk <= 3
    ? `top-3 pick (#${pk})`
    : pk <= 14
      ? `lottery pick (#${pk})`
      : pk <= 30
        ? `1st round (#${pk})`
        : `2nd round (#${pk})`;
}
function dBoost(d, x) {
  return le(Math.round((x / Math.max(2e4, d.player.ask)) * 80), 0, 35);
}
function chkDraft(e) {
  if (
    (e.draft || []).some((d) => d.status === "pending") ||
    (e.xfers || []).some((d) => d.status === "pending")
  )
    throw new Error(
      "Decide on your draft and transfer-portal players first. Open the pop-up from Program HQ."
    );
  // Item 59: one of your entrants withdrew from the portal and waits for Accept or Deny
  if ((e.prospects || []).some((p) => p.wb && p.status === "Available"))
    throw new Error(
      "A player who withdrew from the portal wants to come back. Accept or deny it first (Transfer decisions on Program HQ)."
    );
}
function awardRaise(e, aw) {
  let T = {
      "National Player of the Year": 0.35,
      "All-American First Team": 0.25,
      "All-American Second Team": 0.15,
      "All-American Third Team": 0.1,
      "Conference Player of the Year": 0.25,
      "All-Conference First Team": 0.15,
      "All-Conference Second Team": 0.1,
      "Freshman of the Year": 0.15,
    },
    m = {};
  for (let a of aw) {
    let t = T[a.k];
    if (t) for (let p of a.list) p.pid && (m[p.pid] = (m[p.pid] || 0) + t);
  }
  let n = [];
  for (let p of e.roster) {
    let b = m[p.id];
    b && ((p.awardBump = Math.min(0.5, b)), n.push(`${p.name} (+${Math.round(p.awardBump * 100)}%)`));
  }
  n.length && Be(e, "NIL demands", `Award winners want raises next season: ${n.join(", ")}.`);
}
