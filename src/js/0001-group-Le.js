var Le = ["PG", "SG", "SF", "PF", "C"],
  xS = ["Freshman", "Sophomore", "Junior", "Senior"],
  Ns = ["Starter", "Rotation", "Bench"],
  Us = ["Recruiting", "Development", "Offense", "Defense"],
  il = [
    "Finishing",
    "Midrange",
    "Three-point",
    "Free throws",
    "Handling",
    "Passing",
    "Perimeter defense",
    "Interior defense",
    "Steals",
    "Blocks",
    "Off. rebounding",
    "Def. rebounding",
    "Speed",
    "Strength",
    "Vertical",
    "Stamina",
  ],
  Xl = REAL_XL,
  zs = () => ({
    gp: 0,
    min: 0,
    pts: 0,
    reb: 0,
    ast: 0,
    stl: 0,
    blk: 0,
    to: 0,
    fgm: 0,
    fga: 0,
    tpm: 0,
    tpa: 0,
    ftm: 0,
    fta: 0,
  }),
  le = (e, a, t) => Math.max(a, Math.min(t, e)),
  // Item 6: every money value in the game logic stays in "base dollars" (a small school is about 250,000). MONEY turns
  // base dollars into the dollars shown on screen (real programs: about $1M for a small school, $10M+ for the top).
  // The saves and all balance numbers are unchanged. Any number the player types goes back through / MONEY.
  MONEY = 4,
  q = (e) => {
    let v = e * MONEY,
      sg = v < 0 ? "-" : "";
    v = Math.abs(v);
    return v >= 1e6 ? `${sg}$${(v / 1e6).toFixed(2)}M` : `${sg}$${Math.round(v / 1e3)}K`;
  },
  qs = (e) => `${Math.floor(e / 12)}\u2032${e % 12}\u2033`,
  Bn = (e, a) => (e.stats.gp ? (e.stats[a] / e.stats.gp).toFixed(1) : "\u2014"),
  Hf = (e) => (e >= 70 ? "Happy" : e >= 50 ? "Neutral" : e >= 30 ? "Unhappy" : "Transfer risk"),
  Pf = (e) => (e.morale >= 70 ? "Low" : e.morale >= 50 ? "Moderate" : e.morale >= 30 ? "High" : "Very high"),
  wt = (e) => (e === "Starter" ? 26 : e === "Rotation" ? 16 : 6),
  go = (e) => e.roster.reduce((a, t) => a + t.nil, 0),
  kt = (e) =>
    e.prospects.filter((a) => a.status === "Available").reduce((a, t) => a + (t.offer?.nil || 0), 0),
  // Players who might still be kept (draft / portal decisions pending) keep their salary reserved, so keeping one never makes the budget negative.
  pendNil = (e) =>
    [...(e.draft || []), ...(e.xfers || [])]
      .filter((d) => d.status === "pending")
      .reduce((a, d) => a + (d.player?.nil || 0), 0),
  Ce = (e) => e.budget - go(e) - kt(e) - pendNil(e) - W_staffCostOf(e),
  // Past seasons for display: a sophomore, junior or senior who has no saved seasons (never played, or came in with the
  // starting roster) gets empty "0 GP" rows with the school name, so the Previous seasons lists are never blank.
  pHist = (e, p) => {
    let h = p.history || [],
      need = Math.max(0, (p.year || 1) - 1 - h.length),
      first = h.length ? h[0].year : e.year,
      team = p.origin === "Transfer" ? "Previous school" : e.school.name,
      z = zs;
    return [...Array.from({ length: need }, (_, i) => ({ year: first - need + i, team, stats: z() })), ...h];
  },
  dl = (e) => ({
    wins: e.schedule.filter((a) => a.played && a.win).length,
    losses: e.schedule.filter((a) => a.played && !a.win).length,
  }),
  Dn = (e) => ({
    wins: e.schedule.filter((a) => a.kind === "Conference" && a.played && a.win).length,
    losses: e.schedule.filter((a) => a.kind === "Conference" && a.played && !a.win).length,
  }),
  En = (e) => Math.round(e.roster.reduce((a, t) => a + t.morale, 0) / Math.max(1, e.roster.length)),
  // Win goal. Tenure bonus +0, +2, +3, +4 in seasons 1 to 4 of a job, then +1: after the first class graduates,
  // expectations come from reputation (8 + rep/8). See "Win goal" in CLAUDE.md and tests/longcareer.js.
  _s = (e) =>
    Math.min(
      26,
      Math.max(
        [12, 13, 13, 15, 17][tierOf(e)] +
          ((n) => (n <= 3 ? Math.min(4, Math.round(n * 1.5)) : 1))(
            Math.max(0, e.year - 2026 - (e.tenureStart || 0))
          ),
        8 + Math.floor(e.rep / 8)
      )
    ),
  Zl = (e) => xS[Math.min(3, e.year - 1)],
  Tt = (e) =>
    e.source === "Roster" || e.scouted >= 2
      ? String(e.ovr)
      : `${Math.max(35, e.ovr - 6)}\u2013${Math.min(99, e.ovr + 6)}`;
function ne(e) {
  return ((e.rng = (Math.imul(1664525, e.rng) + 1013904223) >>> 0), e.rng / 4294967296);
}
function j(e, a, t) {
  return a + Math.floor(ne(e) * (t - a + 1));
}
function jl(e, a) {
  return a[j(e, 0, a.length - 1)];
}
function Ff(e, a) {
  return (e.seq++, `${a}${e.seq}`);
}
function potRange(e) {
  let h = 0;
  for (const c of String(e.id)) h = (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0;
  let d = 2 + (h % 5),
    lo = Math.max(e.ovr, e.potential - d),
    hi = Math.min(99, e.potential + (8 - d));
  return lo + "\u2013" + hi;
}
function tierOf(e) {
  let b = e.school.budget;
  return le((b < 4e5 ? 0 : b < 6e5 ? 1 : b < 1e6 ? 2 : b < 15e5 ? 3 : 4) + (e.tierShift || 0), 0, 4);
}
function tierAvg(t, k) {
  let a = Xl.filter((h) => tierOf({ school: h }) === t);
  return a.reduce((x, h) => x + h[k], 0) / Math.max(1, a.length);
}
function moveInfo(e) {
  let t = tierOf(e);
  if (REAL_ON || t >= 4 || e.phase !== "Offseason" || e.fired) return null; // real conferences: no invented "move up a conference"
  let th = Math.round(tierAvg(t + 1, "rep"));
  return e.rep >= th ? { t, t2: t + 1, th, ref: Xl.find((h) => tierOf({ school: h }) === t + 1) } : null;
}
function graceOf(e) {
  return Math.max(1, [5, 4, 3, 3, 2][tierOf(e)] + ({ relaxed: 1, hardcore: -1 }[e.diff] || 0));
}
function keepOf(e) {
  return [1, 0.92, 0.85, 0.78, 0.7][tierOf(e)];
}
function jobStatus(e) {
  if (e.fired) return "Fired";
  let n = e.history.length - (e.tenureStart || 0),
    g = graceOf(e);
  return n < g
    ? `Grace period \u00B7 ${g - n} season${g - n === 1 ? "" : "s"} left`
    : (e.heat || 0) >= 1
      ? "On the hot seat"
      : "Grace period over";
}
function W_focus(e, a, g) {
  let f = {
    delta: "dev",
    lake: "dev",
    mesa: "conf",
    coastal: "conf",
    mission: "conf",
    metro: "conf",
    cascadia: "tour",
    peachtree: "tour",
    capital: "tour",
    lone: "tour",
  }[e.school.id];
  return f === "conf"
    ? !!e.confChampion
    : f === "tour"
      ? String(e.berth || "").includes("berth")
      : f === "dev"
        ? a.wins >= g - 3 && e.rep >= e.school.rep
        : !1;
}
