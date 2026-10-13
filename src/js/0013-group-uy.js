function uy(e, a = 200) {
  let t = e.roster.filter((r) => !r.redshirt && r.injury === 0),
    l = t.filter((r) => r.minutes > 0),
    u = l.length >= 5 ? l : t,
    o = new Map();
  if ((u.forEach((r) => o.set(r.id, 0)), u.length < 5))
    throw new Error("At least five healthy, active players are required. Activate a redshirt or add depth.");
  for (let r = 0; r < a; r++) {
    let i = u
      .filter((d) => (o.get(d.id) || 0) < a / 5)
      .sort(
        (d, f) => (f.minutes || 1) / (1 + (o.get(f.id) || 0)) - (d.minutes || 1) / (1 + (o.get(d.id) || 0))
      )[0];
    o.set(i.id, (o.get(i.id) || 0) + 1);
  }
  return o;
}
function Ps(e) {
  let a = e.roster.filter((l) => !l.redshirt && !l.injury);
  a.length || (a = e.roster.filter((l) => !l.redshirt));
  let t = a.reduce((l, u) => l + u.minutes, 0);
  return Math.round(
    t
      ? a.reduce((l, u) => l + u.ovr * u.minutes, 0) / t
      : a.reduce((l, u) => l + u.ovr, 0) / Math.max(1, a.length)
  );
}
// Player tendencies: how he plays, not how good he is. "three" is stored on the player; the others are
// worked out from his attributes plus a fixed per-player hash (no randomness, so old saves get them too).
// Each is a weight around 1 that only changes WHO on the floor takes the shot, passes, rebounds or gambles.
function W_tend(p) {
  let h = TS(p.id + "-tend"),
    r = (k) => ((h >>> (k * 5)) % 31) / 30,
    at = p.attrs || [];
  return {
    three: p.tend?.three ?? 0.3,
    usage: le(0.75 + ((p.ovr || 60) - 70) * 0.01 + ((at[4] || 60) - 60) * 0.004 + r(0) * 0.3, 0.7, 1.35),
    pass: le(0.7 + ((at[5] || 60) - 60) * 0.008 + r(1) * 0.35, 0.6, 1.45),
    crash: le(0.7 + ((at[10] || 60) - 60) * 0.008 + r(2) * 0.35, 0.6, 1.45),
    gamble: le(0.7 + ((at[8] || 60) - 60) * 0.008 + r(3) * 0.35, 0.6, 1.45),
    clutch: le(0.8 + r(4) * 0.45 + (p.pers === "Ambitious" ? 0.1 : 0), 0.8, 1.35),
  };
}
// Single-game bests after one of your games: the player's career highs (p.hi) and the program records
// (e.recs, shown on Career history). c = his box-score line, g = the game.
var RECK = [
  ["pts", "Points"],
  ["reb", "Rebounds"],
  ["ast", "Assists"],
  ["stl", "Steals"],
  ["blk", "Blocks"],
  ["tpm", "Three-pointers"],
];
function W_recs(e, p, c, g) {
  let hi = (p.hi = p.hi || {}),
    R = (e.recs = e.recs || {});
  for (let [k] of RECK) {
    let v = c[k] || 0;
    if (!v) continue;
    (!hi[k] || v > hi[k].v) && (hi[k] = { v: v, o: g.opponent, y: e.year });
    (!R[k] || v > R[k].v) && (R[k] = { v: v, n: p.name, o: g.opponent, y: e.year });
  }
}
function W_teamRecs(e, g) {
  let R = (e.recs = e.recs || {}),
    mg = g.us - g.them;
  (!R.team || g.us > R.team.v) && (R.team = { v: g.us, o: g.opponent, y: e.year, s: `${g.us}–${g.them}` });
  mg > 0 && (!R.margin || mg > R.margin.v) && (R.margin = { v: mg, o: g.opponent, y: e.year, s: `${g.us}–${g.them}` });
}
// Item 31: off-court life. Grade point average and discipline risk come from a fixed per-player hash (no randomness, nothing stored,
// so old saves get them too). GPA runs about 1.9 to 3.9 (average 2.9) and grows a little each year in school; risk is 0 to 1.
function W_gpa(p) {
  let h = TS(p.id + "-gpa");
  return +le(1.9 + ((h % 100) / 100 + ((h >>> 8) % 100) / 100) + ((p.year || 1) - 1) * 0.04, 1.9, 4).toFixed(2);
}
function W_risk(p) {
  return (TS(p.id + "-disc") % 100) / 100;
}
// Short labels for the player profile
function tendTags(p) {
  let t = W_tend(p),
    lv = (v) => (v >= 1.15 ? "High" : v <= 0.85 ? "Low" : "Average");
  return [
    ["Three-point shooter", `${Math.round(t.three * 100)}% of his shots are threes`],
    ["Shot creator", `${lv(t.usage)}: how often he looks for his own shot`],
    ["Playmaker", `${lv(t.pass)}: how often he sets up teammates`],
    ["Crashes the glass", `${lv(t.crash)}: chases offensive rebounds`],
    ["Gambles on defense", `${lv(t.gamble)}: jumps passing lanes for steals, and fouls a bit more`],
    ["Wants the ball late", `${lv(t.clutch)}: takes over in close games`],
    ["Academics", `${W_gpa(p).toFixed(2)} GPA: ${W_gpa(p) < 2.4 ? "on academic watch, may be ruled ineligible" : W_gpa(p) >= 3.3 ? "a strong student" : "in good standing"}`],
    ["Off-court", `${W_risk(p) >= 0.8 ? "Higher risk of discipline trouble" : W_risk(p) <= 0.3 ? "Stays out of trouble" : "Normal"}`],
  ];
}
function po(e, a, t) {
  let l = ne(e) * a.reduce((u, o) => u + Math.max(0.01, t(o)), 0);
  for (let u of a) if (((l -= Math.max(0.01, t(u))), l <= 0)) return u;
  return a[a.length - 1];
}
function ry(e, a, t) {
  let l = Math.round(66 + (a.rating - t.rating) * 0.6 + j(e, -13, 13)),
    u = Math.round(66 + (t.rating - a.rating) * 0.6 + j(e, -13, 13)),
    o = l === u ? l + 1 : l;
  return { a, b: t, sa: o, sb: u, winner: o > u ? a : t, poss: 70 };
}
// foulOut: personal fouls that put a player out of the game (college rule: 5; the old engine used the NBA's 6)
// sf / nf: chance per possession of a foul on a shot (2 free throws) / of a foul away from the shot (free throws only in the bonus)
// bonus1 / bonus2: team fouls in a half for a one-and-one / two shots (men's college: 7 and 10)
// timeouts: per team per game; toRun: net run that makes a coach call one; toBoost: shot-chance bonus for 2 possessions after one
// toCarry: timeouts a team may carry into the second half (men's college rule as remembered, not re-checked online); toLate: seconds left when the trailing coach starts stopping the clock
// heat: shot-chance change for a fully hot (+) or cold (-) shooter, 0 turns streaks off; mom: shot-chance change at full team momentum
// shotClock: seconds before a violation; scShift: shot-chance change for a late (24+ s) or quick (10 s or less) possession;
// closeSecs / blowSecs: clock time left for the close-game and blowout rules; hackSecs: trailing team fouls on purpose inside this
// portal: scales how many players enter the portal (about 5 a team a year); portalShow: entrants shown to you (best by rating);
// ovisits: official visits you can give high school recruits each offseason; ovBonus: signing-chance points a visit adds (item 5)
// withdraw: chance an entrant changes his mind and stays; pvisits: your campus visits in one portal window (an estimate)
// netCr: bonus for finishing first (x1), second (x0.6) or third (x0.3) in the conference standings;
// rivalry: rating gap multiplier in rivalry games (1 = off);
// winNow: share of the money left that auto-recruit may spend on one player after a season in which several top-8-level players left (0 = off);
// stagger: auto-recruit score per step of class balance (a class year that already has 3+ players graduating together is avoided; empty ones are favored), 0 = off;
// netCn: bonus for each team a conference has above 10 (bigger leagues send more teams);
// netW / netR: weight of win % and of team rating in W_net; netSos / netCs / netQ1 / netQ2: how much the tournament ranking (W_net) credits a hard schedule, a strong conference, and wins over the top (Q1) and next (Q2) quadrant
// tend: 1 = player tendencies change who shoots/passes/rebounds/steals in ny; 0 = off (the old engine)
// portalStar: overall points a transfer needs over a high-school player for the same star level (portal stars are given on current play, not projection)
// programScope: 1 = season records carry their school (Career history can show the current program only); 0 keeps the original records (legacy tests)
// walkonFloor: the least chance (percent) any walk-on, rare ones included, has of saying yes to an invitation (0 = the original 28-70 for rare ones, 85 for 50-59)
// spPen: shot-chance penalty per priority rank, now 0: a priority player keeps his normal percentages on more shots (he used to shoot up to 2 points worse, which made his averages look worse, not better)
// coachRep: 1 = coach reputation (e.crep) counts for recruits and job offers; crepPull = how much of the coach-program gap recruits feel (0.6 of it)
// statCal: 1 = player stat ranges like D1 (more assists, concentrated on guards; stars score more)
// teams: 360 = a full-size Division I (31 conferences) for new careers; 200 = the old small league (old saves keep it, e.nt unset)
// nilBudgets: 1 = every school has its own NIL budget and tier; nilAI: how strongly money steers AI recruiting (0 = not at all)
var TUNE = { nilBudgets: 1, nilAI: 0.15, threeAdj: 1.12, teams: REAL_N, statCal: 1, statUse: 5, statStl: 7, statBlk: 10, statPass: 3.6, portalStar: 2.5, coachRep: 1, crepPull: 1, programScope: 1, walkonFloor: 90, leagueBoost: REAL_ON ? 0 : 2.9, autoDepth: 1, depthReserve: 7000, autoBest: 1, arPot: 0.1, arNeed: 0.5, arLams: [0, 1, 2, 4, 8, 16, 32, 64], spBoost: [1.55, 1.38, 1.24, 1.13, 1.06], spPen: [0, 0, 0, 0, 0], u: 1, f: 0.003, o2: 0.505, o3: 0.335, d2: 0.505, d3: 0.335, sk: 0.0008, b: 0.2, tend: 1, portal: 1.5, portalShow: 170, withdraw: 0.05, pvisits: 3, ovisits: 5, ovBonus: 8, foulOut: 5, sf: 0.11, nf: 0.216, bonus1: 7, bonus2: 10, timeouts: 4, toRun: 4, toBoost: 0.012, toCarry: 3, toLate: 180, shotClock: 30, heat: 0.07, mom: 0.04, scShift: 0.03, closeSecs: 240, blowSecs: 430, hackSecs: 50, pollStep: 0.3, stagger: 1, winNow: 0.35, rivalry: 0.85, netCr: 60, netCn: 9, netW: 65, netR: 0.45, netSos: 0.5, netCs: 0.45, netQ1: 2, netQ2: 0.6 };
