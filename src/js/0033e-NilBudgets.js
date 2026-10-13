// Six-tier NIL budgets for every school (October 2026).
//   - The 30 schools you can pick keep the budget in their data (your own money stays on the revenue model: donors, tickets, media...).
//   - Every other school gets its own budget: its conference's baseline (the conferences are ranked by strength and take the baselines
//     below in order, strongest first) times a persistent "financial support" factor, scaled so the conference averages stay at the baseline.
//   - Budgets drift a few percent a year (market growth, a little for winning, rare larger jumps).
//   - AI schools respect them: stars cost real money, a team over its budget cannot sign stars, a poor team's best players are easier to
//     poach, and a wealthy program attracts recruits a bit more (TUNE.nilAI).
// All money here is in base dollars like the rest of the game (shown with q(), see MONEY).
var NIL_BASE = [9.7, 8.6, 8.5, 8.2, 8.0, 3.5, 3.5, 3.2, 3.2, 2.8, 2.0, 1.8, 1.5, 1.4, 1.4, 1.2, 1.2, 1.1, 1.1, 0.95, 0.9, 0.85, 0.8, 0.8, 0.7, 0.7, 0.6, 0.45, 0.4, 0.4, 0.35]; // $ millions shown
var NIL_TIERS = [
  { n: 1, name: "Elite High-Major", min: 15 },
  { n: 2, name: "High-Major", min: 7 },
  { n: 3, name: "Upper Mid-Major", min: 3 },
  { n: 4, name: "Mid-Major", min: 1.5 },
  { n: 5, name: "Lower Mid-Major", min: 0.5 },
  { n: 6, name: "Low-Major", min: 0 },
];
// budget in base dollars -> tier object (1 = richest)
function W_nilTier(base) {
  const shown = ((base || 0) * MONEY) / 1e6;
  return NIL_TIERS.find((t) => shown >= t.min) || NIL_TIERS[5];
}
function W_nilTierText(base) {
  const t = W_nilTier(base);
  return `Tier ${t.n} · ${t.name}`;
}
function W_gauss(e) {
  return Math.sqrt(-2 * Math.log(Math.max(1e-9, ne(e)))) * Math.cos(2 * Math.PI * ne(e));
}
function W_nilSet(e, t, v) {
  t.budget = Math.min(7e6, Math.max(8e3, Math.round(v / 1e3) * 1e3)); // $32K to $28M shown
  const l = (e.league || []).find((z) => z.id === t.id);
  l && (l.budget = t.budget);
}
// Give every school without a budget one. Safe to call again (only fills the gaps), so old saves are migrated when they load.
function W_nilInit(e) {
  if (!TUNE.nilBudgets || !e.opponents || !e.opponents.some((t) => t.budget == null)) return;
  const byId = new Map(e.opponents.map((t) => [t.id, t])),
    confs = e.confs && e.confs.length ? e.confs : [e.opponents.map((t) => t.id)],
    meanR = confs.map((c) => {
      const v = c.map((id) => (id === e.school.id ? e.school.rating : byId.get(id)?.rating)).filter((x) => x != null);
      return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0;
    }),
    order = meanR.map((m, i) => [m, i]).sort((a, b) => b[0] - a[0]).map((z) => z[1]);
  order.forEach((ci, rank) => {
    const idx = confs.length > 1 ? Math.round((rank * (NIL_BASE.length - 1)) / (confs.length - 1)) : 3,
      baseline = (NIL_BASE[idx] * 1e6) / MONEY,
      shown = baseline * MONEY,
      // spread of financial support: the richest leagues have a few blue bloods far above the rest; the poorest vary the most in relative terms
      sigma = shown >= 7e6 ? 0.1 : shown >= 2.5e6 ? 0.5 : shown >= 1.3e6 ? 0.4 : 0.5,
      elite = shown >= 8.4e6 ? 0.18 : shown >= 7e6 ? 0.12 : 0,
      ids = confs[ci],
      teams = ids.map((id) => byId.get(id)).filter(Boolean);
    let fixed = ids.includes(e.school.id) ? e.baseBudget || e.budget || 0 : 0,
      raw = [];
    for (const t of teams) {
      const xl = Xl.find((h) => h.id === t.id);
      if (t.budget != null) fixed += t.budget;
      else if (xl) (fixed += xl.budget, W_nilSet(e, t, xl.budget));
      else
        raw.push([
          t,
          (elite && ne(e) < elite ? 1.85 + ne(e) * 0.65 : Math.exp(sigma * W_gauss(e) - (sigma * sigma) / 2)) * (1 + (t.rating - 70) / 250),
        ]);
    }
    const n = ids.length,
      sumRaw = raw.reduce((a, z) => a + z[1], 0),
      k = sumRaw ? Math.min(1.8, Math.max(0.55, (baseline * n - fixed) / (baseline * sumRaw))) : 1;
    for (const [t, f] of raw) W_nilSet(e, t, REAL_ON ? REAL_ADJB(baseline * f * k) : baseline * f * k);
  });
  W_nilStats(e);
  e.nilMk = e.mkt || 1;
}
// median budget (cached on the career) used to compare a school with the rest of the country
function W_nilStats(e) {
  const v = e.opponents.map((t) => t.budget).filter((x) => x != null).sort((a, b) => a - b);
  e.nilMed = v.length ? v[Math.floor(v.length / 2)] : 0;
}
// Once a year (offseason rollover, before the teams reset): budgets follow the market, win a little, and rarely jump.
function W_nilYear(e) {
  if (!TUNE.nilBudgets || !e.opponents.some((t) => t.budget != null)) return;
  const mk = e.mkt || 1,
    grow = e.nilMk ? mk / e.nilMk - 1 : 0.025;
  for (const t of e.opponents) {
    if (t.budget == null) continue;
    const g = t.wins + t.losses,
      wp = g ? t.wins / g : 0.5;
    let d = grow + (wp - 0.5) * 0.06 + W_gauss(e) * 0.025;
    d = Math.max(-0.05, Math.min(0.1, d));
    // rare larger moves: a new donor, a facility, a media deal (more likely upward, and small programs get more chances to grow)
    if (ne(e) < 0.04) d += (ne(e) < 0.65 ? 1 : -1) * (0.1 + ne(e) * 0.15);
    else if (t.budget * MONEY < 1.5e6 && ne(e) < 0.04) d += 0.12 + ne(e) * 0.15;
    W_nilSet(e, t, t.budget * (1 + d));
  }
  e.nilMk = mk;
  W_nilStats(e);
}
// A rough price for a player rated o (the same shape as the asking price in Gf).
function W_nilCost(e, o) {
  return Math.round((e.mkt || 1) * (4e3 + Math.pow(Math.max(2, o - 43), 2) * 110 * (o >= 64 ? 2.1 : 1)) * 0.65);
}
// Recruiting pull of a school's money, in "prestige points": wealthy +, poor -
function W_nilBonus(e, t) {
  if (!TUNE.nilAI || !TUNE.nilBudgets || t.budget == null || !e.nilMed) return 0;
  return TUNE.nilAI * Math.max(-12, Math.min(12, 6 * Math.log2(t.budget / e.nilMed)));
}
// Can this school sign a player rated o? One player may take at most 35% of the whole budget, so nobody spends everything on one star.
function W_nilCanAfford(e, t, o) {
  if (!TUNE.nilAI || !TUNE.nilBudgets || t.budget == null) return true;
  return W_nilCost(e, o) <= t.budget * 0.35;
}
