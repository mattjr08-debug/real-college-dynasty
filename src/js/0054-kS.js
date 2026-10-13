function kS(e) {
  let pc = new Map(),
    a = e.roster.length,
    t = Ce(e),
    // favorites (bookmarked before auto-recruit) are tried first and may cost a bit more than the even share
    fav = new Set(e.prospects.filter((v) => v.target && v.status === "Available").map((v) => v.id)),
    // item 58: while the portal window is open a high school pick cannot get an offer yet. His spot and money are
    // reserved (res) and the offer is made when the window closes, so the roster mix stays as before the lock
    // (without this, every open spot went to older transfers and long careers got much weaker).
    res = new Map(),
    pend = () => [...e.prospects.filter((v) => v.offer && v.status === "Available"), ...[...res.values()].map((z) => z.p)],
    sign = (y, nil, role) =>
      ((y.offer = { nil, role }),
      (y.target = !0),
      e.scouts > 0 &&
        y.scouted < (y.intl ? 1 : 2) &&
        (y.scouted++, e.scouts--, (y.progress += 8), (y.interest = Math.min(99, y.interest + 3))));
  // Win-now signings (season 5 dip): after a season in which players at the level of the top 8 left (graduated, drafted,
  // transferred), one pick per two of them may cost up to TUNE.winNow of the money left instead of the even share, so a
  // ready-made transfer can replace a graduating core. Not in the first offseason (the class is being built then).
  let k8 = [...e.roster].sort((x, z) => z.ovr - x.ovr)[7]?.ovr ?? 0,
    prem = TUNE.winNow && e.history.length ? Math.floor((e.departed || []).filter((d) => d.ovr >= k8).length / 2) : 0;
  for (; e.round <= 9 && e.roster.length < 15;) {
    let u = pend();
    for (; e.roster.length + u.length < 15;) {
      let o = 15 - e.roster.length - u.length,
        r = Ce(e) - [...res.values()].reduce((s, z) => s + z.nil, 0);
      if (r < 1e3) break;
      // class balance (item 16): how many players graduate in each of the next four years, counting pending offers
      let gy = [0, 0, 0, 0];
      e.roster.forEach((M) => gy[Math.max(0, Math.min(3, 4 - (M.year || 1)))]++);
      u.forEach((M) => gy[Math.max(0, Math.min(3, 4 - (M.year || 1)))]++);
      let n = Le.map((v) => e.roster.filter((M) => M.pos === v).length + u.filter((M) => M.pos === v).length),
        i = r / o,
        pool = e.prospects.filter((v) => v.status === "Available" && !v.offer && !res.has(v.id)),
        y,
        C;
      if (TUNE.autoBest) {
        // BEST PLAYERS FIRST: pick the best group the money can buy (the first 8 players come out of the same plan), and make the offer to its best player first
        let pk = W_autoPick(e, { pool, r, o, u, n, fav, pc });
        y = pk.y;
        // Depth (TUNE.autoDepth): once nothing more adds to the top ten, the open spots still go to the best real prospects we can afford, not to walk-ons.
        if (!y && TUNE.autoDepth) y = W_depthPick(e, { pool, r, n, pc });
        if (!y) break;
        C = Math.max(Math.min(y.ask, r), Math.min(r, Math.round(Math.min(y.ask * 1.3, y.ask + pk.slack * 0.5) / 1e3) * 1e3));
      } else {
        let d0 = o === 1 ? r : Math.min(r, i * 1.45),
          d = prem > 0 ? Math.max(d0, r * TUNE.winNow) : d0;
        y = pool
          .filter(
            (v) =>
              v.ask <= (fav.has(v.id) ? Math.min(r, d * 1.5) : d) &&
              (e.round < 9 || Nn(e, v, v.ask, v.ovr >= 76 ? "Starter" : "Rotation") >= 20)
          )
          .map((v) => {
            let M = Le.indexOf(v.pos),
              m = Math.max(0, 3 - n[M]);
            return {
              p: v,
              score:
                (fav.has(v.id) ? 100 + (v.rank ? (4 - v.rank) * 10 : 0) : 0) +
                m * 28 +
                TUNE.stagger * Math.max(-3, Math.min(2, 2.5 - gy[Math.max(0, Math.min(3, 4 - (v.year || 1)))])) +
                v.ovr * 0.7 +
                v.interest * 0.16 +
                (v.potential - v.ovr) * 0.15 +
                (e.round === 9 ? Nn(e, v, v.ask, v.ovr >= 76 ? "Starter" : "Rotation") * 0.45 : 0),
            };
          })
          .sort((v, M) => M.score - v.score)[0]?.p;
        if (!y) break;
        y.ask > d0 && prem--;
        C = Math.min(r, Math.round(Math.min(fav.has(y.id) ? Math.max(d, y.ask) : d, Math.max(y.ask, i * 0.85), y.ask * 1.3) / 1e3) * 1e3);
      }
      let h = e.roster.filter((v) => v.ovr >= y.ovr).length + u.filter((v) => v.ovr >= y.ovr).length,
        p = h < 5 && Xa(e) < 5 ? "Starter" : h < 9 ? "Rotation" : "Bench";
      (hsLock(e, y) ? res.set(y.id, { p: y, nil: C, role: p }) : sign(y, C, p), (u = pend()));
    }
    my(e);
    // the window closed: the reserved high school picks get their offers now
    if (!hsLock(e)) {
      for (let z of res.values()) z.p.status === "Available" && !z.p.offer && sign(z.p, z.nil, z.role);
      res.clear();
    }
  }
  if (e.roster.length >= 15) for (let u of e.prospects) delete u.offer;
  // a full roster can end the loop while the portal window is still open: finish its waves
  for (; e.pw >= 1 && e.pw <= 3;) W_pwave(e);
  let l = 0;
  for (; e.roster.length < 15 && l++ < 100;) {
    let u = Le.map((r) => e.roster.filter((n) => n.pos === r).length),
      o = [...e.walkons]
        .filter((r) => r.status === "Available")
        .sort(
          (r, n) =>
            Math.max(0, 3 - u[Le.indexOf(n.pos)]) * (TUNE.autoDepth ? 10 : 30) +
            n.ovr -
            (Math.max(0, 3 - u[Le.indexOf(r.pos)]) * (TUNE.autoDepth ? 10 : 30) + r.ovr)
        )[0];
    if (!o) break;
    py(e, o);
  }
  (e.roster.length >= 15 && e.round < 10 && (e.round = 10),
    oy(e),
    Be(
      e,
      "Recruiting automation complete",
      `Added ${e.roster.length - a} players. Roster: ${e.roster.length}/15. ${q(Math.max(0, t - Ce(e)))} spent; ${q(Ce(e))} remains. Coaching and minutes are optimized.`
    ));
}

// Depth pick (TUNE.autoDepth): the best affordable prospect by rating and upside, weighted by his chance to sign, with a small push toward a position the roster is short at.
// Used when the plan above finds nobody who still improves the top ten, so the last spots are real players and walk-ons are only the last resort.
function W_depthPick(e, { pool, r, n, pc }) {
  const role = (v) => (v.ovr >= 76 ? "Starter" : "Rotation"),
    chance = (v) => {
      const k = e.round + ":" + v.id;
      if (!pc.has(k)) pc.set(k, Nn(e, v, v.ask, role(v)) / 100);
      return pc.get(k);
    };
  return pool
    .filter((v) => v.ask <= r && chance(v) >= (e.round < 9 ? 0.3 : 0.2))
    .map((v) => ({ v, s: (v.ovr + Math.max(0, v.potential - v.ovr) * 0.1 + 3 * Math.max(0, 3 - n[Le.indexOf(v.pos)])) * (0.55 + 0.45 * chance(v)) }))
    .sort((a, b) => b.s - a.s)[0]?.v;
}

// Auto-recruit, best players first (TUNE.autoBest). Team strength = the best ten ratings weighted by the minutes each rank plays.
// For several "price of quality" levels (from money is no object to every dollar counts) it builds a group of prospects greedily by what each adds to
// the team times his chance to sign, keeps the group that ends up strongest, and returns that group's best player so he gets his offer first.
// Eight players come out of the same plan because every missing spot is worth less than a cheap real player; walk-ons fill what is left afterwards.
function W_autoPick(e, { pool, r, o, u, n, fav, pc }) {
  // Depth (TUNE.autoDepth): the plan only values the top ten players, so it used to spend every dollar on a few top picks and left walk-ons for the other spots.
  // Set aside TUNE.depthReserve ($7K) for each spot past the tenth player (never more than 20% of the money) so those spots go to real prospects (see W_depthPick).
  const rAll = r;
  if (TUNE.autoDepth) r = rAll - Math.min(0.2 * rAll, TUNE.depthReserve * Math.max(0, e.roster.length + u.length + o - 10));
  const MW = [0.15, 0.15, 0.14, 0.14, 0.13, 0.09, 0.07, 0.06, 0.04, 0.03],
    V = (arr) => MW.reduce((t, w, k) => t + w * (arr[k] ?? 45), 0),
    eff = (v) => v.ovr + Math.max(0, v.potential - v.ovr) * TUNE.arPot,
    role = (v) => (v.ovr >= 76 ? "Starter" : "Rotation"),
    chance = (v) => {
      const k = e.round + ":" + v.id;
      if (!pc.has(k)) pc.set(k, Nn(e, v, v.ask, role(v)) / 100);
      return pc.get(k);
    },
    ins = (list, x) => {
      let k = list.findIndex((q) => q < x);
      k = k < 0 ? list.length : k;
      return [...list.slice(0, k), x, ...list.slice(k)];
    },
    cur = [...e.roster.filter((M) => !M.redshirt).map((M) => M.ovr), ...u.map(eff)].sort((x, z) => z - x);
  // bookmarked favorites come first, in their rank order
  const fp = pool
    .filter((v) => fav.has(v.id) && v.ask <= rAll && (e.round < 9 || chance(v) >= 0.2))
    .sort((x, z) => (x.rank || 9) - (z.rank || 9) || z.ovr - x.ovr)[0];
  if (fp) return { y: fp, slack: 0 };
  let cand = pool
    .filter((v) => v.ask <= r)
    .map((v) => ({ v, x: eff(v), p: chance(v), ask: v.ask, pi: Le.indexOf(v.pos) }))
    .filter((c) => c.p > 0.05 && (e.round < 9 || c.p >= 0.2))
    .sort((x, z) => z.x * z.p - x.x * x.p)
    .slice(0, 120);
  let best = null;
  for (const lam of TUNE.arLams) {
    let money = r, spots = o, list = cur, chosen = [], used = new Set(), pcnt = n.slice();
    while (spots > 0 && money >= 1e3) {
      let pick = null, ps = 0, base = V(list);
      for (const c of cand) {
        if (used.has(c) || c.ask > money) continue;
        const sc = c.p * (V(ins(list, c.x)) - base) + TUNE.arNeed * Math.max(0, 3 - pcnt[c.pi]) - (lam * c.ask) / 1e6;
        if (sc > ps) { ps = sc; pick = c; }
      }
      if (!pick) break;
      used.add(pick); chosen.push(pick); money -= pick.ask; spots--; list = ins(list, pick.x); pcnt[pick.pi]++;
    }
    const val = V(list);
    if (!best || val > best.val) best = { val, chosen, money };
  }
  if (!best || !best.chosen.length) return { y: null, slack: 0 };
  return { y: best.chosen.slice().sort((x, z) => z.x - x.x)[0].v, slack: best.money };
}
