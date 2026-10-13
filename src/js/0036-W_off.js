// Chance that a player enters the portal and his list of causes. x = { rk: depth chart rank, chg: new coach,
// wp: win share, sg: a better player signed at his position }.
function W_pcause(t, p, x) {
  let c = [
      ["Coach left or was fired", x.chg ? 0.3 : 0],
      ["Recruited over at his position", x.sg ? 0.2 : 0],
      ["Too little playing time", x.rk >= 8 ? 0.38 : x.rk >= 5 ? 0.16 : 0.03],
      ["Wants a bigger program", p.o >= t.rating + 3 ? 0.04 + (x.wp < 0.45 ? 0.1 : 0) : 0.01],
      ["Bigger NIL offer elsewhere", 0.03 + (p.o >= 70 ? 0.04 : 0) + (x.nb < -6 ? 0.04 : x.nb > 6 ? -0.015 : 0)],
      ["Personal reasons", 0.03],
    ],
    keep = c.reduce((q, z) => q * (1 - z[1]), 1);
  return { pr: 1 - keep, c };
}
// The reason shown for an entrant: one of his causes, picked in proportion to its size (r = a random 0 to 1).
function W_pwhy(c, r) {
  let x = r * c.reduce((q, z) => q + z[1], 0);
  for (let z of c) if ((x -= z[1]) < 0) return z[0];
  return c[0][0];
}
// Item 41: where portal entrants end up. Real Division I numbers: about 70% transfer inside the NCAA, about 25% leave
// it, and about 70% of power-conference entrants find no new school or move down. The power conferences are the 5 of
// 20 with the best average team rating.
var W_PST = {}; // counts for tests (window.__dbg.pstat)
function W_power(e) {
  let rt = new Map(e.opponents.map((t) => [t.id, t.rating])),
    cs = (e.confs || []).map((g) => {
      let v = g.map((id) => rt.get(id)).filter((x) => x != null);
      return [g, v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0];
    });
  cs.sort((a, b) => b[1] - a[1]);
  return new Set(cs.slice(0, 5).flatMap((z) => z[0]));
}
// r = a random 0 to 1. Power-conference entrants: 30% leave, 40% move down, 30% stay at that level. Others: 25% leave.
function W_fate(isP, r) {
  return isP ? (r < 0.3 ? "leave" : r < 0.7 ? "down" : "same") : r < 0.25 ? "leave" : "any";
}
function W_tally(g, isP, k) {
  let h = ((W_PST[g] ||= {})[isP ? "power" : "other"] ||= { n: 0 });
  (h.n++, (h[k] = (h[k] || 0) + 1));
}
// An open school for a player rated o: "same" = a power-conference school, "down" = any other, "any" = anyone. It picks
// the closest-rated of 8 random schools, so a good player ends up at a good school. open = only schools with a spot.
function W_pdest(e, o, kind, pw, skipId, open) {
  let best = null;
  for (let k = 0; k < 8; k++) {
    let c = jl(e, e.opponents);
    if (c.id === skipId || (open && e.rosters[c.id].length >= 15) || !W_nilCanAfford(e, c, o)) continue;
    if (kind === "same" ? !pw.has(c.id) : kind === "down" ? pw.has(c.id) : false) continue;
    (!best || Math.abs(c.rating - (o + 3)) < Math.abs(best.rating - (o + 3))) && (best = c);
  }
  return best;
}
function W_off(e, bd) {
  e.vac = [];
  W_nilYear(e); // AI budgets move with the market and the season just played
  // league strength: older careers move to the current TUNE.leagueBoost by raising the league's target average (the normalization at the end of this function does the lifting)
  if ((e.lb ?? 0) !== (TUNE.leagueBoost || 0)) {
    e.wm = (e.wm || 0) + (TUNE.leagueBoost || 0) - (e.lb ?? 0);
    e.lb = TUNE.leagueBoost || 0;
  }
  e.tmoves = {}; // per team: who was on the roster before the rollover, and who left (drafted, graduated, transferred); who arrived is worked out from the new roster (see TeamView)
  W_PST = {};
  // Item 50: keep the finished class of the year that just ended (your national and conference rank)
  {
    let cr = W_classRank(e, e.year),
      m = cr.me;
    m &&
      (e.classHist = [
        ...(e.classHist || []),
        { y: e.year - 1, school: e.school.name, nat: m.nat, cr: m.cr, score: m.score, n: m.n, five: m.five, four: m.four },
      ].slice(-30));
  }
  let pwr = W_power(e);
  let ro = e.rosters,
    pt = [],
    byName = {};
  e.opponents.forEach((t) => (byName[t.name] = t));
  // New signees by school (a better player signed at his position is a reason to leave)
  let sgn = {};
  for (let q of e.prospects)
    q.status === "Committed elsewhere" && q.committedTo && !q.landed && (sgn[q.committedTo] ||= []).push(q);
  // Expected win share for the prestige change: fitted on ~4,800 AI team seasons (own rating and the conference's
  // mean rating, both against the national mean). The old 0.3 + (rating - 46) / 96 ignored the conference, so teams
  // in a weak league kept gaining prestige (and recruits) and teams in a strong one kept losing it.
  let rt = new Map(e.opponents.map((t) => [t.id, t.rating])),
    am = e.opponents.reduce((q, t) => q + t.rating, 0) / e.opponents.length,
    cmOf = new Map();
  rt.set(e.school.id, Ps(e));
  for (let c of e.confs || [])
    for (let id of c) {
      let v = c.filter((x) => x !== id).map((x) => rt.get(x)).filter((x) => x != null);
      v.length && cmOf.set(id, v.reduce((q, x) => q + x, 0) / v.length);
    }
  for (let t of e.opponents) {
    let R = ro[t.id] || [],
      keep = [],
      g = t.wins + t.losses,
      wp = g ? t.wins / g : 0.5,
      exp = le(0.473 + 0.0213 * (t.rating - am) - 0.0122 * ((cmOf.get(t.id) ?? am) - am), 0.05, 0.95),
      cb = ((t.coach && t.coach.r) || 60) - 60;
    t.pr = le(Math.round((t.pr == null ? 50 : t.pr) + (wp - exp) * 22 + (wp > 0.78 ? 3 : 0)), 8, 95);
    let chg = !!t.fired;
    e.tmoves[t.id] = { y: e.year, prev: R.map((q) => q.i), out: [] };
    const mvOut = (q, y, why, extra) => e.tmoves[t.id].out.push({ i: q.i, n: q.n, p: q.p, y, o: q.o, t: q.t, f: q.f, s: { ...q.s }, why, ...extra });
    if (t.fired) {
      t.fired = !1;
      let old = t.coach && t.coach.n;
      t.coach = { n: "Coach " + jl(e, CS), r: j(e, 44, 86) };
      e.lnews.unshift({
        y: e.year,
        t: "Coaching change",
        b: `${t.name} fired ${old || "their coach"} after a ${t.wins}\u2013${t.losses} season and hired ${t.coach.n}.`,
      });
    }
    // Portal entries (items 37 and 40): each player has several separate causes (playing time, a coaching change,
    // a bigger program, money, personal reasons) that combine into one chance. TUNE.portal scales the whole thing
    // (about 5 entrants a team a year); `u` makes some teams calmer or more restless than others.
    let dk = new Map([...R].sort((a, b) => b.o - a.o).map((p, i) => [p.i, i])),
      u = 0.75 + ne(e) * 0.55,
      nEnt = 0;
    for (let p of R) {
      const y0 = p.y;
      // keep the season that just ended (the last three) before the new year resets his totals, so his card can still show his stats
      if (p.s && p.s.g > 0) p.hs = [...(p.hs || []), { y: e.year - 1, ...p.s }].slice(-3);
      p.y++;
      if (bd.ai.has(p.i)) {
        const pk = bd.picks.find((z) => z.id === p.i);
        mvOut(p, y0, "Drafted", pk ? { pk: pk.pk } : {});
        continue;
      }
      if (p.y > 4) {
        // Item 43: a graduating senior may use his last year at another school (a graduate transfer, 1 year left)
        if (p.o >= 58 && ne(e) < 0.12) {
          p.y = 4;
          p.g = 1;
          pt.push([p, t, "Graduate transfer: one year left"]);
          mvOut(p, y0, "Transferred");
        } else mvOut(p, y0, "Graduated");
        continue;
      }
      let c = W_pcause(t, p, {
        rk: dk.get(p.i),
        chg,
        wp,
        sg: (sgn[t.name] || []).some((q) => q.pos === p.p && q.ovr > p.o),
        nb: W_nilBonus(e, t),
      });
      if (R.length > 9 && nEnt < 10 && ne(e) < Math.min(0.9, c.pr * TUNE.portal * u)) {
        nEnt++;
        pt.push([p, t, W_pwhy(c.c, ne(e))]);
        mvOut(p, y0, "Transferred");
        continue;
      }
      let cf =
          [1.35, 1, 0.6][le(p.y - 2, 0, 2)] * (p.p === "C" || p.p === "PF" ? (p.y <= 2 ? 0.85 : 1.15) : 1),
        gr = le(
          Math.round(((p.t - p.o) * 0.17 + cb / 30 + (wp > 0.78 ? 1 : wp < 0.3 ? -1 : 0)) * cf + j(e, -2, 2)),
          0,
          7
        );
      p.o = Math.min(98, p.o + gr);
      p.s = { g: 0, p: 0, r: 0, a: 0, s: 0, b: 0, t: 0 };
      keep.push(p);
    }
    ro[t.id] = keep;
  }
  for (let p of e.prospects.filter(
    (q) =>
      (q.status !== "Signed" && q.origin === "High school") ||
      (q.status === "Committed elsewhere" && q.committedTo && !q.landed)
  )) {
    if (p.status === "Signed") continue;
    let t = (p.committedTo && byName[p.committedTo]) || ((p.sg ?? p.stars) >= 2 ? W_dest(e, p) : null);
    t &&
      ro[t.id] &&
      ro[t.id].push({
        i: p.id,
        n: p.name,
        p: p.pos,
        y: p.origin === "Transfer" ? Math.min(3, p.year) : 1,
        o: p.ovr,
        t: Math.max(p.ovr, p.potential),
        f: p.faceSeed,
        s: { g: 0, p: 0, r: 0, a: 0, s: 0, b: 0, t: 0 },
      });
  }
  // The best TUNE.portalShow entrants (about 170) go to your recruiting pool (W_pt). The rest land on other teams now,
  // each at the closest-rated of random schools with an open spot (W_pdest). Item 41: some leave the game, and
  // power-conference players often move down (W_fate).
  pt.sort((a, b) => b[0].o - a[0].o);
  for (let [p, t0] of pt.slice(TUNE.portalShow)) {
    let isP = pwr.has(t0.id);
    // Item 39: some change their mind and stay (TUNE.withdraw).
    if (ne(e) < TUNE.withdraw) {
      (W_tally("hidden", isP, "back"), (p.s = { g: 0, p: 0, r: 0, a: 0, s: 0, b: 0, t: 0 }), ro[t0.id].push(p));
      continue;
    }
    let f = W_fate(isP, ne(e)),
      best = f === "leave" ? null : W_pdest(e, p.o, f, pwr, t0.id, !0) || W_pdest(e, p.o, "any", pwr, t0.id, !0);
    (W_tally("hidden", isP, best ? f : "leave"),
      best && ((p.s = { g: 0, p: 0, r: 0, a: 0, s: 0, b: 0, t: 0 }), ro[best.id].push(p)));
  }
  pt = pt.slice(0, TUNE.portalShow);
  // Item 44: a coach with more than 15 players releases the extra ones into the portal; they look for a school like
  // any other entrant (W_fate) and are not shown to you.
  let released = [];
  for (let t of e.opponents) {
    let R = ro[t.id];
    while (R.length < 13) R.push(W_fr(e, t, R));
    (R.sort((a, b) => b.o - a.o),
      R.length > 15 && released.push(...R.splice(15).map((p) => [p, t])),
      (t.rating = W_tr(R)),
      (t.wins = t.losses = t.cw = t.cl = 0),
      (t.sr = 0),
      (t.qw = 0),
      (t.bl = 0),
      (t.qd = null),
      (t.pf = t.pa = t.po = 0));
  }
  for (let [p, t0] of released) {
    let isP = pwr.has(t0.id),
      f = W_fate(isP, ne(e)),
      best = f === "leave" ? null : W_pdest(e, p.o, f, pwr, t0.id, !0) || W_pdest(e, p.o, "any", pwr, t0.id, !0);
    W_tally("released", isP, best ? f : "leave");
    best &&
      ((p.s = { g: 0, p: 0, r: 0, a: 0, s: 0, b: 0, t: 0 }),
      ro[best.id].push(p),
      ro[best.id].sort((a, b) => b.o - a.o),
      (best.rating = W_tr(ro[best.id])));
  }
  {
    let m = e.opponents.reduce((q, t) => q + t.rating, 0) / e.opponents.length,
      d = Math.round((m - (e.wm || m)) * 0.9);
    if (Math.abs(d) >= 1)
      for (let t of e.opponents) {
        for (let p of ro[t.id]) ((p.o = le(p.o - d, 38, 97)), (p.t = le(Math.max(p.o, p.t - d), p.o, 98)));
        t.rating = W_tr(ro[t.id]);
      }
  }
  e.league.forEach((l) => {
    let t = e.opponents.find((z) => z.id === l.id);
    (t && l.id !== e.school.id && (l.rating = t.rating),
      (l.wins = l.losses = l.cw = l.cl = 0),
      (l.sr = l.qw = l.bl = 0),
      (l.qd = null),
      (l.pf = l.pa = l.po = 0));
  });
  ((e.sch = null), (e.sres = {}), (e.rr = null), (e.poll = null));
  let log = bd.picks.map((z) => ({
    pk: z.pk,
    id: z.id,
    n: z.n,
    t: z.t,
    p: z.p,
    o: z.o,
    y: z.y,
    you: !!z.you,
  }));
  log.length &&
    (e.draftLog.unshift({ y: e.year, picks: log, stat: bd.stat }),
    (e.draftLog = e.draftLog.slice(0, 8)),
    e.lnews.unshift({
      y: e.year,
      t: "Draft",
      b: `${log[0].n} (${log[0].t}) went first overall. ${bd.stat}.`,
    }));
  e.lnews = e.lnews.slice(0, 40);
  e.pst = W_PST; // portal counts, kept with the career so the tracker survives a reload
  return pt;
}
