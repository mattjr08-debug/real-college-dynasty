// Achievements belong to the coach, not the school: once earned they are recorded in e.achieved (name -> season earned) and
// stay earned after a job change, even when the live condition no longer holds (a different roster, school tier or rivalry).
function W_ach(e) {
  const list = W_achLive(e), got = (e.achieved = e.achieved || {});
  for (const z of list) if (z[2] && got[z[0]] === undefined) got[z[0]] = e.year;
  return list.map((z) => [z[0], z[1], z[2] || got[z[0]] !== undefined, got[z[0]]]);
}
function W_achLive(e) {
  let h = e.history || [],
    aw = h.flatMap((x) => (x.awards || []).flatMap((o) => o.list.filter((p) => p.you).map((p) => o.k))),
    dp = (e.alumni || []).filter((a) => /Drafted/.test(a.fate)),
    rv = e.rival && e.h2h && e.h2h[e.rival.id];
  return [
    ["First season in the books", "Complete a season", h.length >= 1],
    ["Twenty wins", "Win 20 games in a season", h.some((x) => x.wins >= 20)],
    ["Thirty wins", "Win 30 games in a season", h.some((x) => x.wins >= 30)],
    ["Dancing", "Make the national tournament", h.some((x) => /berth/.test(x.bt || ""))],
    ["Conference champions", "Win a conference title", h.some((x) => x.cc)],
    [
      "Final Four",
      "Reach the Final Four",
      h.some((x) => ["Final Four", "National runner-up", "National champions"].includes(x.result)),
    ],
    [
      "Cutting down the nets",
      "Win a national championship",
      h.some((x) => x.result === "National champions"),
    ],
    [
      "Giant at the top",
      "Win a title at an Elite-budget school",
      h.some((x) => x.result === "National champions") && tierOf(e) === 4,
    ],
    ["Five-star haul", "Sign three 5-stars in one class", (e.classes || []).some((c) => c.fives >= 3)],
    ["Pro pipeline", "Have a player drafted", dp.length >= 1],
    [
      "Lottery ticket",
      "Have a player go in the 1st round",
      dp.some((a) => /1st round|lottery|top-3/.test(a.fate)),
    ],
    ["Coach of the Year", "Win a Coach of the Year award", aw.some((k) => /Coach/.test(k))],
    [
      "Player of the Year",
      "Have a player named Player of the Year",
      aw.some((k) => /Player of the Year/.test(k)),
    ],
    ["Moving on up", "Move up a conference", (e.tierShift || 0) > 0],
    ["New challenge", "Take a new head coaching job", (e.tenureStart || 0) > 0],
    ["Bragging rights", "Beat your rival 5 times", !!(rv && rv.w >= 5)],
    ["Veteran coach", "Coach 10 seasons", h.length >= 10],
    ["Elite roster", "Field a 90+ rated team", Ps(e) >= 90],
  ];
}
