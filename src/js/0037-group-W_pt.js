function W_pt(e, pt) {
  pt.sort((a, b) => b[0].o - a[0].o);
  let shown = pt.slice(0, TUNE.portalShow),
    pwr = W_power(e);
  for (let [k, [p, t, why]] of shown.entries()) {
    let q = W_mkp(e, p, t);
    // fid = the school he left; pwv = the portal wave when other schools decide on him (best players first);
    // fate = where he ends up if you do not sign him (item 41: leave, move down, same level)
    ((q.fid = t.id), (q.why = why), (q.fate = W_fate(pwr.has(t.id), ne(e))), (q.pwv = k < shown.length * 0.25 ? 1 : k < shown.length * 0.6 ? 2 : 3), W_showBids(e, q, pwr), e.prospects.push(q));
  }
  e.prospects = e.prospects.slice(0, 560);
}
// A portal prospect from a compact player p ({n,f,o,t,y,p,s}) who left school t.
function W_mkp(e, p, t) {
  {
    const PS = p.s && p.s.g > 0 ? p.s : (p.hs || []).at(-1) || p.s;   // this season, else the last real season
    let q = Gf(e, "Transfer", p.o, Math.min(p.g ? 4 : 3, p.y), p.p),
      d = p.o - q.ovr;
    // Item 43: a player with one year left (a graduate transfer) asks for less
    (p.g && (q.ask = Math.round((q.ask * 0.75) / 1e3) * 1e3), (q.name = p.n),
      (q.faceSeed = p.f),
      (q.attrs = q.attrs.map((a) => le(a + d, 25, 99))),
      (q.ovr = p.o),
      (q.potential = Math.max(p.o, p.t)),
      (q.history = [
        {
          year: e.year - 1,
          team: t.name,
          stats: {
            ...zs(),
            gp: PS.g,
            min: PS.g * 27,
            pts: PS.p,
            reb: PS.r,
            ast: PS.a,
            stl: PS.s,
            blk: PS.b,
            to: PS.t,
          },
        },
      ]),
      TUNE.portalStar && (q.sg = starRate(q)),
      (q.stars = starRate(q, !0)),
      (q.hsStars = q.stars));
    return q;
  }
}
// A player of yours who enters the portal joins the pool, so you can still bring him back with an offer. If nobody
// else takes him he may withdraw and return to you (W_pwave).
function W_userEntrant(e, d) {
  if (!(e.pw >= 1 && e.pw <= 3)) return;
  let l = d.player,
    h = (l.history || []).at(-1),
    s = (h && h.stats) || {},
    q = W_mkp(
      e,
      {
        n: l.name,
        f: l.faceSeed,
        o: l.ovr,
        t: l.potential,
        y: Math.min(3, l.year),
        p: l.pos,
        s: { g: s.gp || 0, p: s.pts || 0, r: s.reb || 0, a: s.ast || 0, s: s.stl || 0, b: s.blk || 0, t: s.tpm || 0 },
      },
      e.school
    );
  ((q.fid = e.school.id), (q.why = d.why), (q.fate = W_fate(!1, ne(e))), (q.pwv = 2), (q.nil = l.nil || 0), e.prospects.push(q));
}
// Put a transfer on an AI school's roster now (15 players at most; the weakest are dropped).
function W_place(e, a, t) {
  let R = e.rosters[t.id];
  if (!R) return;
  R.push({
    i: a.id,
    n: a.name,
    p: a.pos,
    y: Math.min(4, a.year),
    o: a.ovr,
    t: Math.max(a.ovr, a.potential),
    f: a.faceSeed,
    s: { g: 0, p: 0, r: 0, a: 0, s: 0, b: 0, t: 0 },
    hs: ((h) => (h && h.stats && h.stats.gp ? [{ y: h.year, g: h.stats.gp, p: h.stats.pts, r: h.stats.reb, a: h.stats.ast, s: h.stats.stl || 0, b: h.stats.blk || 0, t: h.stats.to || 0 }] : undefined))((a.history || []).at(-1)),
  });
  R.sort((x, y) => y.o - x.o);
  R.length > 15 && R.splice(15);
  t.rating = W_tr(R);
  let l = e.league.find((z) => z.id === t.id);
  l && l.id !== e.school.id && (l.rating = t.rating);
}
function tn0(e, id) {
  return (e.opponents.find((z) => z.id === id) || {}).name || (id === e.school.id ? e.school.name : "his old school");
}
// Item 42: the schools that would bid for an entrant, best fit first. A school only bids if it can afford at least 60%
// of his NIL ask (its budget comes from prestige and team rating). The fit score adds money, program strength, coach,
// a need at his position and being in his old conference. kind picks the level: "same" = power conference only,
// "down" = everyone else, "any" = anyone.
function W_bids(e, a, kind, pwr) {
  let from = e.confs && e.confs.find((g) => g.includes(a.fid)),
    out = [];
  for (let k = 0; k < 7; k++) {
    let c = jl(e, e.opponents);
    if (c.id === a.fid || out.some((z) => z.id === c.id)) continue;
    if (kind === "same" ? !pwr.has(c.id) : kind === "down" ? pwr.has(c.id) : false) continue;
    let cap = Math.max(0, ((c.pr == null ? 50 : c.pr) * 0.6 + c.rating * 0.4 - 30) * 16000);
    if (cap < (a.ask || 0) * 0.6) continue;
    let R = e.rosters[c.id] || [];
    out.push({
      id: c.id,
      n: c.name,
      s:
        30 * Math.min(1, cap / Math.max(1, a.ask || 1)) +
        c.rating * 0.35 +
        (c.pr == null ? 50 : c.pr) * 0.15 +
        (R.filter((z) => z.p === a.pos && z.o >= a.ovr - 3).length < 2 ? 8 : 0) +
        (from && from.includes(c.id) ? 4 : 0) +
        (((c.coach && c.coach.r) || 60) - 60) * 0.15,
    });
  }
  return out.sort((x, y) => y.s - x.s);
}
// Shown on the entrant: up to 3 current bids.
function W_showBids(e, a, pwr) {
  a.bd =
    a.fate === "leave"
      ? []
      : W_bids(e, a, a.fate || "any", pwr)
          .slice(0, 3)
          .map((z) => ({ n: z.n, s: Math.round(z.s) }));
}
// One wave of the transfer portal window (item 38). Your offers move forward like in a recruiting round and are
// decided when they reach 100 or in the last wave. Everyone else is decided by other schools in his own wave
// (pwv): the best players go first and to the schools that rank highest on his list (rivalLead).
// Item 59: ask = the player clicked "Advance portal wave". Then one of your own entrants who withdraws is NOT signed
// back at once: he waits (wb) for your Accept or Deny in the Transfer portal watch pop-up. Auto-recruit, "Start season"
// and auto-play (ask false) keep the old automatic return, so nothing waits for a click.
function W_pwave(e, ask) {
  if (!(e.pw >= 1 && e.pw <= 3)) return;
  W_PST = e.pst || (e.pst = {});
  let w = e.pw,
    mine = [],
    back = [],
    gone = [],
    pwr = W_power(e),
    taken = [];
  for (let a of e.prospects) {
    if (a.status !== "Available" || !a.fid || a.wb) continue;
    if (a.offer) {
      let t = Nn(e, a, a.offer.nil, a.offer.role);
      a.progress = le(a.progress + j(e, 18, 30) + Math.round(t * 0.24) + a.scouted * 3, 0, 100);
      if (!(a.progress >= 100 || w >= 3 || (w >= 2 && a.progress >= 60 && ne(e) < t / 250))) continue;
      let { nil: u, role: o } = a.offer,
        // Item 42: the best rival bid cuts your chance by up to 30% (nothing when it is weak)
        top = a.fate === "leave" ? null : W_bids(e, a, a.fate || "any", pwr)[0],
        comp = top ? le(1 - (top.s - 60) / 100, 0.7, 1) : 1;
      if (ne(e) * 100 < t * comp && e.roster.length < 15) {
        cy(e, a, u, o);
        mine.push(a);
        continue;
      }
      delete a.offer;
      Be(e, "Portal decision", `${a.name} chose another school over your ${q(u)} offer.`);
    } else if (a.pwv > w) continue;
    // Item 39: an entrant who gets no offer he likes sometimes changes his mind and stays (TUNE.withdraw).
    if (ne(e) < TUNE.withdraw) {
      if (a.fid === e.school.id) {
        if (e.roster.length < 15) {
          if (ask) {
            a.wb = 1;
            Be(e, "He withdrew from the portal", `${a.name} found no offer he liked and wants to come back. Accept or deny it in the Transfer portal watch pop-up.`);
            continue;
          }
          cy(e, a, a.nil || 0, "Rotation");
          Be(e, "He withdrew from the portal", `${a.name} found no offer he liked and is coming back to your program.`);
          continue;
        }
      } else {
        let t0 = e.opponents.find((z) => z.id === a.fid);
        if (t0) {
          ((a.status = "Committed elsewhere"),
            (a.progress = 100),
            (a.decisionRound = 1),
            (a.decisionYear = e.year),
            (a.committedTo = t0.name),
            (a.landed = 1),
            delete a.offer,
            W_place(e, a, t0),
            W_tally("shown", pwr.has(a.fid), "back"),
            back.push(a));
          continue;
        }
      }
    }
    (W_pland(e, a, pwr) ? taken : gone).push(a);
  }
  for (let a of e.prospects) a.fid && a.status === "Available" && W_showBids(e, a, pwr);
  taken.sort((x, y) => y.ovr - x.ovr);
  back.length &&
    Be(
      e,
      "Portal withdrawals",
      `${back.length} entrants found nothing they liked and went back to their schools, including ${back
        .slice(0, 3)
        .map((a) => `${a.name} (${a.ovr}) to ${a.committedTo}`)
        .join(", ")}.`
    );
  Be(
    e,
    `Portal wave ${w} of 3`,
    taken.length
      ? `${taken.length} entrants committed${gone.length ? ` and ${gone.length} left college basketball` : ""}. Biggest: ${taken
          .slice(0, 3)
          .map((a) => `${a.name} (${a.ovr}) to ${a.committedTo}`)
          .join(", ")}.${mine.length ? ` You signed ${mine.map((a) => a.name).join(", ")}.` : ""}`
      : `No entrants committed this wave${gone.length ? `; ${gone.length} left college basketball` : ""}.${mine.length ? ` You signed ${mine.map((a) => a.name).join(", ")}.` : ""}`
  );
  // Item 45: League news (Headlines) gets the biggest commitments of every wave and a summary when the window closes
  taken.length &&
    e.lnews.unshift({
      y: e.year,
      t: "Transfer portal",
      b: `Wave ${w}: ${taken
        .slice(0, 3)
        .map((a) => `${a.name} (${a.ovr}, ${a.pos}) from ${tn0(e, a.fid)} to ${a.committedTo}`)
        .join("; ")}.`,
    });
  e.pw++;
  if (e.pw > 3) {
    Be(
      e,
      "Portal window closed",
      "The transfer portal window is over. High school recruiting rounds are next; unsigned entrants are gone."
    );
    let st = e.pst || {},
      sum = (k) =>
        ["hidden", "shown", "released"].reduce(
          (n, g) => n + ["power", "other"].reduce((m, c) => m + (((st[g] || {})[c] || {})[k] || 0), 0),
          0
        ),
      N0 = sum("n"),
      big = e.prospects
        .filter((a) => a.fid && a.landed && a.committedTo !== "Left college basketball")
        .sort((x, y) => y.ovr - x.ovr)
        .slice(0, 3);
    N0 &&
      e.lnews.unshift({
        y: e.year,
        t: "Transfer portal",
        b: `The portal window closed. About ${N0} players entered: ${Math.round(((N0 - sum("leave") - sum("back")) / N0) * 100)}% found a new school, ${Math.round((sum("leave") / N0) * 100)}% left college basketball and ${Math.round((sum("back") / N0) * 100)}% withdrew.${big.length ? ` Biggest commitments: ${big.map((a) => `${a.name} (${a.ovr}) to ${a.committedTo}`).join("; ")}.` : ""}`,
      });
  }
  e.lnews = e.lnews.slice(0, 60);
}
// Where an entrant who is not signed ends up (W_pwave, and "Deny" for one of yours who wanted to come back).
// Item 41: not everyone lands. He leaves the game, moves down a level, or finds a school at his level.
// Returns the school, or null if he left college basketball.
function W_pland(e, a, pwr) {
  let isP = pwr.has(a.fid),
    f = a.fate || "any",
    // Item 42: the best bid wins him; with no affordable bid he drops to whoever has room.
    bid = f === "leave" ? null : W_bids(e, a, f, pwr)[0],
    t =
      f === "leave"
        ? null
        : (bid && e.opponents.find((z) => z.id === bid.id)) ||
          W_pdest(e, a.ovr, f, pwr, a.fid) ||
          W_pdest(e, a.ovr, "any", pwr, a.fid);
  W_tally("shown", isP, t ? f : "leave");
  ((a.status = "Committed elsewhere"),
    (a.progress = 100),
    (a.decisionRound = 1),
    (a.decisionYear = e.year),
    (a.committedTo = t ? t.name : "Left college basketball"),
    (a.landed = 1),
    delete a.offer,
    t && W_place(e, a, t));
  return t;
}
// Item 58: the high school class is locked (no offers, scouting or official visits) while the portal window is open,
// so the portal is settled first. p omitted = is the window open at all. High school rounds already wait for the window (my).
const HS_LOCK_MSG = "High school class opens when the portal closes.";
function hsLock(e, p) {
  return e.pw >= 1 && e.pw <= 3 && (!p || p.origin === "High school");
}
function regOf(e) {
  let m = String(e.school.city || "")
      .split(", ")
      .pop(),
    R = {
      SE: ["MS", "GA", "FL", "SC", "NC", "AL", "TN", "VA", "LA", "AR", "KY"],
      SW: ["TX", "AZ", "NM", "OK"],
      W: ["CA", "WA", "OR", "NV", "UT", "CO", "ID"],
      MW: ["OH", "MI", "IL", "IN", "WI", "MN", "IA", "MO", "KS", "NE"],
      NE: ["NY", "PA", "NJ", "MA", "CT", "MD", "DC", "DE", "RI", "NH", "VT", "ME"],
    };
  return ["SE", "SW", "W", "MW", "NE"].findIndex((k) => R[k].includes(m));
}
function rivalsOf(e, p) {
  let h = TS(p.id + e.year),
    n = e.opponents.length,
    rk = [...e.opponents].sort((a, b) => b.rating - a.rating),
    top = Math.min(n, [90, 80, 70, 55, 38, 24][(p.sg ?? p.stars) || 0]),
    out = [];
  for (let k = 0; k < 3; k++) {
    h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
    let t = rk[h % top];
    if (t && !out.some((z) => z.n === t.name))
      out.push({
        n: t.name,
        s: Math.round(t.rating * 0.45 + ((h >>> 8) % 28) + e.round * 3 + (p.decommit ? 4 : 0)),
      });
  }
  return out;
}
function rivalLead(e, p) {
  let r = [...(p.rv || rivalsOf(e, p))].sort((a, b) => b.s - a.s)[0];
  return r ? r.n : jl(e, ONX);
}
function W_rv(e, before) {
  for (let p of e.prospects) {
    if (p.status !== "Available") continue;
    ((p.rv = p.rv || rivalsOf(e, p)),
      p.rv.forEach((r) => (r.s += j(e, 1, 4) + ((p.sg ?? p.stars) >= 4 ? 1 : 0))),
      p.offer && !p.__ro && ((p.__ro = 1), ([...p.rv].sort((a, b) => b.s - a.s)[0].s += 5)),
      !p.offer && (p.__ro = 0));
    let me = Math.round(p.progress * 0.6 + p.interest * 0.4) + (p.offer ? 8 : 0),
      top = [...p.rv].sort((a, b) => b.s - a.s)[0],
      ld = top && top.s > me ? top.n : "You";
    (p.ld &&
      p.ld !== ld &&
      (p.target || p.offer) &&
      Be(
        e,
        "Recruiting battle",
        ld === "You"
          ? `You moved ahead of ${top.n} for ${p.name}.`
          : `${ld} moved ahead of you for ${p.name}.`
      ),
      (p.ld = ld));
  }
}
function prefAdj(e, a) {
  let p = a.prefs || {},
    pr = a.home === regOf(e) ? (p.home || 0) * 0.2 : 0,
    wn = e.rep >= 50 ? (p.win || 0) * 0.1 : -(p.win || 0) * 0.06,
    dv = e.specialty === "Development" ? (p.dev || 0) * 0.1 : 0,
    co = (p.coach || 0) * (e.level || 1) * 0.02;
  return pr + wn + dv + co;
}
function topPrefs(p) {
  let n = {
    nil: "NIL",
    time: "Playing time",
    dev: "Development",
    win: "Winning",
    home: "Staying close to home",
    coach: "Coaching staff",
  };
  return Object.entries(p.prefs || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map((z) => n[z[0]]);
}
