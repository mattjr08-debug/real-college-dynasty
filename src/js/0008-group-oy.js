// Offense, defense and pace that the coach chose by hand are remembered in e.tacLock and are never changed by automatic coaching.
function W_autoTactics(e) {
  let a = e.roster.filter((l) => l.minutes > 0),
    t = (l) => a.reduce((u, o) => u + o.attrs[l] * o.minutes, 0) / 200,
    k = e.tacLock || {};
  (k.offense || (e.tactics.offense = t(2) > t(0) + 3 ? "Perimeter" : t(0) > t(2) + 5 ? "Inside-out" : "Balanced"),
    k.defense ||
      (e.tactics.defense =
        t(7) > t(6) + 5 ? "2\u20133 zone" : t(8) > 72 && t(15) > 72 ? "Full-court press" : "Man-to-man"),
    k.pace || (e.tactics.pace = t(12) > 73 && t(15) > 72 ? "Fast" : t(12) < 55 ? "Slow" : "Balanced"));
}
function W_keptTactics(e) {
  return ["offense", "defense", "pace"].filter((k) => e.tacLock?.[k]);
}
function oy(e) {
  (Hs(e), W_autoTactics(e));
}
