// Item 56: coach skills and contract.
// e.skills = { rec, dev, tac, cul } (0 to 99). 50 is neutral: a missing skill (old saves) counts as 50, so the effects below are
// (skill - 50) x a small factor: recruiting +0.1 signing chance a point (Nn), development +0.012 growth points a point (wS),
// tactics and culture +0.06 chemistry a point and culture +1 morale per 20 points at the rollover (wS).
// A new coach has 50 in every skill and +10 in the one that matches his specialty. Skills grow +1 a season for experience,
// plus +1 for success: tactics when the win goal is met, recruiting with a tournament berth or conference title,
// development when the top players grew on average 2 or more points, culture when the average morale ended at 65 or more.
// e.contract = { yrs: years left, len: length when signed, sal: yearly salary }, e.earn = career earnings (salary plus buyouts, less exit fees),
// all in base dollars (shown with q(), see MONEY). A school that fires you pays 60% of the salary for the years left (up to 4);
// leaving early for another job costs you 30% of the salary for the years left. Salary is NOT taken from the NIL budget.
var COACH_SKILLS = [
  { k: "rec", name: "Recruiting", perk: "Recruits are a little more likely to sign with you" },
  { k: "dev", name: "Development", perk: "Players improve a little faster each offseason" },
  { k: "tac", name: "Tactics", perk: "Better team chemistry at the start of each season" },
  { k: "cul", name: "Culture", perk: "Better chemistry and happier players" },
];
function W_skill(e, k) {
  return (e.skills && e.skills[k]) || 50;
}
function W_coachSkills(e) {
  let sp = { Recruiting: "rec", Development: "dev", Offense: "tac", Defense: "tac" }[e.specialty];
  return { rec: sp === "rec" ? 60 : 50, dev: sp === "dev" ? 60 : 50, tac: sp === "tac" ? 60 : 50, cul: 50 };
}
// yearly salary for a head coach with reputation rep at a school with this budget
function W_salary(budget, rep) {
  return Math.round((budget * 0.3 * (0.7 + (le(rep, 0, 99) / 100) * 0.8)) / 5e3) * 5e3;
}
function W_newContract(e, budget, rep, len) {
  return { yrs: len || 4, len: len || 4, sal: W_salary(budget ?? e.baseBudget ?? e.budget, rep ?? e.rep) };
}
function W_coachInit(e) {
  e.skills || (e.skills = W_coachSkills(e));
  e.contract || (e.contract = W_newContract(e));
  e.earn ??= 0;
}
// what a school owes you if it fires you now, and what leaving now would cost you
function W_buyout(e) {
  let c = e.contract;
  return c ? Math.round((0.6 * c.sal * Math.min(c.yrs, 4)) / 5e3) * 5e3 : 0;
}
function W_exitFee(e) {
  if (e.fired) return 0;   // they let you go: no exit fee
  let c = e.contract;
  return c ? Math.round((0.3 * c.sal * c.yrs) / 5e3) * 5e3 : 0;
}
// called when you are fired: the school pays the buyout. Returns the sentence for the news item.
function W_fireBuyout(e) {
  W_coachInit(e);
  let b = W_buyout(e);
  e.earn += b;
  return b ? ` Your contract had ${e.contract.yrs} year${e.contract.yrs === 1 ? "" : "s"} left, so the school pays a ${q(b)} buyout.` : "";
}
// season end: salary paid, skills grow, contract runs down and may be extended
function W_coachYear(e, a, met) {
  W_coachInit(e);
  let sk = e.skills,
    c = e.contract,
    top = [...e.roster].sort((x, y) => y.ovr - x.ovr).slice(0, 8),
    gr = top.length ? top.reduce((x, p) => x + (p.growth || 0), 0) / top.length : 0,
    up = (k, n) => (sk[k] = le((sk[k] || 50) + n, 0, 99));
  e.earn += c.sal;
  (up("rec", 1 + (e.confChampion || String(e.berth || "").includes("berth") ? 1 : 0)),
    up("dev", 1 + (gr >= 2 ? 1 : 0)),
    up("tac", 1 + (met ? 1 : 0)),
    up("cul", 1 + (En(e) >= 65 ? 1 : 0)));
  c.yrs = Math.max(0, c.yrs - 1);
  if (e.fired) return;
  if (met && c.yrs <= 2) {
    ((c.sal = Math.round((c.sal * 1.08) / 5e3) * 5e3), (c.yrs = Math.min(5, c.yrs + 2)), (c.len = c.yrs));
    Be(e, "Contract extension", `Meeting expectations earned you a new deal: ${c.yrs} years at ${q(c.sal)} a year.`);
  } else if (c.yrs === 0) {
    ((c.yrs = 1), (c.len = 1));
    Be(e, "Contract expired", `Your contract ran out without an extension. You are working year to year at ${q(c.sal)}. Meet the win goal to earn a longer deal.`);
  }
}
