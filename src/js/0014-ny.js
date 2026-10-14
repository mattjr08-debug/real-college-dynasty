function ny(e, a, op) {
  let t = uy(e),
    l = e.roster.filter((m) => t.has(m.id)),
    u = l.map((m) => ({ ...zs(), id: m.id, name: m.name, pos: m.pos, gp: 1, min: t.get(m.id) })),
    o = l.reduce((m, c) => m + c.ovr * (t.get(c.id) || 0), 0) / 200,
    r =
      e.tactics.offense === "Perimeter"
        ? l.reduce((m, c) => m + (c.attrs[2] - c.ovr) * (t.get(c.id) || 0), 0) / 200
        : e.tactics.offense === "Inside-out"
          ? l.reduce((m, c) => m + (c.attrs[0] + c.attrs[10] - 2 * c.ovr) * (t.get(c.id) || 0), 0) / 400
          : 0,
    n =
      e.lineup.reduce(
        (m, c, L) =>
          m +
          fitOf(
            e.roster.find((g) => g.id === c),
            Le[L]
          ),
        0
      ) * 0.65,
    i =
      o +
      (r * 0.25 +
        W_fit(e).s * 0.8 +
        (e.chemistry - 55) * 0.09 +
        (En(e) - 65) * 0.04 +
        (e.specialty === "Offense" || e.specialty === "Defense" ? 2 + e.level * 0.25 : 0) -
        n) *
        TUNE.b,
    d = a.venue === "Home" ? 6 : a.venue === "Away" ? -6 : 0,
    // a rivalry game is closer than the ratings say (TUNE.rivalry, item 55); a neutral site has no home-court edge (d = 0)
    f = (i - a.rating + d - TUNE.u) * (a.rival ? TUNE.rivalry : 1),
    // rs: resuming a live game after one of your timeouts (Game Day pauses there when op.pause is set). Everything the
    // game had drawn at random (length, clock) is restored from e.live, so a pause without changes does not shift the game.
    rs = !!(op && op.resume && e.live),
    stop = 0,
    h = rs ? e.live.h : (e.tactics.pace === "Fast" ? 76 : e.tactics.pace === "Slow" ? 64 : 70) + j(e, -3, 3),
    p = 0,
    C = 0,
    px = 0,
    fo = new Set(),
    fy = {},
    // team fouls in the current half (0 = us, 1 = them); reset at halftime (college rule, see TUNE.sf / TUNE.nf)
    tf = [0, 0],
    hb = rs ? e.live.hb : op && op.half === 2 && e.live ? e.live.done : Math.floor(h / 2),
    // substitution waves: tmf = this possession's playing-time factor per player (see waves()), fs/fn = their sum and count
    tmf = new Map(),
    fs = {},
    fn = 0,
    st5 = new Set(
      [...l]
        .sort((x, y) => (t.get(y.id) || 0) - (t.get(x.id) || 0))
        .slice(0, 5)
        .map((x) => x.id)
    ),
    prevOn = null,
    // streaks: htm = each player's heat (-1 ice cold .. +1 hot), hotF = who has already been called hot/cold on the play-by-play,
    // mo = team momentum (+ = our side has the run), both fade every possession and a timeout kills the momentum
    htm = {},
    hotF = {},
    mo = 0,
    hv = false,
    // timeouts: left for each side, the current net scoring run (+ = we are on it), last possession each side used one,
    // and how many more possessions the team that just had a timeout plays settled
    tos = [TUNE.timeouts, TUNE.timeouts],
    rn = 0,
    lastTo = [-9, -9],
    bo = [0, 0],
    td = new Map(l.map((m) => [m.id, W_tend(m)])),
    tw = (id, k) => (TUNE.tend ? td.get(id)?.[k] || 1 : 1),
    // Shot priority (Coaching > Shot priority): up to five players the owner wants shooting the most, in order. Blank list = factor 1 and penalty 0 = exactly the old game.
    shotPri = new Map((e.shotPriority || []).slice(0, 5).map((id, i) => [id, i])),
    shotPriW = (id) => (shotPri.has(id) ? TUNE.spBoost[shotPri.get(id)] : 1),
    shotPriPen = (id) => (shotPri.has(id) ? TUNE.spPen[shotPri.get(id)] : 0),
    lg = op && (op.half || rs) ? ((op.half === 2 || rs) && e.live ? e.live.log : []) : null,
    // live play-by-play line (t: "us"/"opp", x: text, p: points, m: possession number for the game clock)
    // game clock: two 20-minute halves and 5-minute overtimes. Every possession pair (one each) gets a share of its period,
    // drawn at random and scaled so the period adds up to exactly 1200 (300) seconds: sd(n, total) = [start, length] per pair.
    sd = (n, total) => {
      let r = Array.from({ length: n }, () => 0.5 + ne(e)),
        s = r.reduce((x, y) => x + y, 0) || 1,
        c = 0;
      return r.map((x) => {
        let b = c;
        c += (x * total) / s;
        return [b, (x * total) / s];
      });
    },
    seg1 = rs ? e.live.sg[0] : sd(Math.max(1, hb), 1200),
    seg2 = rs ? e.live.sg[1] : sd(Math.max(1, h - hb), 1200),
    seg3 = rs ? e.live.sg[2] : sd(8, 300),
    clkNow = rs ? e.live.ck[0] : 1200,
    qNow = rs ? e.live.ck[1] : 1,
    // live play-by-play line (t: "us"/"opp", x: text, p: points, m: possession number, k: seconds left in the period, q: period)
    pb = (t, x, pt) => lg && lg.push({ t: t, x: x, p: pt || 0, m: px, k: Math.round(clkNow), q: qNow });
  rs && ((tf = e.live.tf), e.live.on && (prevOn = new Set(e.live.on)));
  op &&
    (op.half === 2 || rs) &&
    e.live &&
    ((u = e.live.u),
    (p = e.live.p),
    (fo = new Set(e.live.fo || [])),
    (fy = e.live.fy || {}),
    (px = e.live.done),
    e.live.fs &&
      ((fs = e.live.fs),
      (fn = e.live.fn),
      (tos = e.live.tos),
      (rn = e.live.rn),
      (lastTo = e.live.lastTo),
      (bo = e.live.bo),
      (htm = e.live.htm || {}),
      (hotF = e.live.hotF || {}),
      (mo = e.live.mo || 0)));
  // A made shot warms a shooter up, a miss cools him down (TUNE.heat is how much that changes his next shot)
  function heat(L, made) {
    let x = le((htm[L.id] || 0) + (made ? 0.3 : -0.2), -1, 1);
    htm[L.id] = x;
    if (!hotF[L.id] && Math.abs(x) >= 0.7) {
      hotF[L.id] = x > 0 ? 1 : -1;
      pb("us", x > 0 ? `${L.name} is heating up` : `${L.name} has gone cold`);
    } else if (hotF[L.id] && Math.abs(x) < 0.4) hotF[L.id] = 0;
  }
  // Playing-time factor per player for this possession. Starters (the five with the most minutes) play a longer first
  // stint and the closing stretch of each half, the bench comes in as a wave in between, and foul trouble sits a player
  // down. The factors average about 1 over a half, so the planned minutes still hold.
  function waves() {
    let xh = px < hb ? px / hb : px < h ? (px - hb) / Math.max(1, h - hb) : 1,
      sf = px >= h ? 1.3 : xh < 0.28 ? 1.2 : xh < 0.45 ? 0.5 : xh < 0.82 ? 1 : 1.2,
      S = 0;
    st5.forEach((id) => (S += t.get(id) || 0));
    let bf = S < 195 ? le((200 - S * sf) / (200 - S), 0.1, 3) : 1;
    for (let m of l) {
      let x = st5.has(m.id) ? (S < 195 ? sf : 1) : bf,
        pf = u.find((z) => z.id === m.id)?.pf || 0;
      // foul trouble: 2 fouls early or 3 in the first half, 4 before the late stretch of the second
      if (px < hb ? (pf >= 2 && xh < 0.75) || pf >= 3 : px < h && pf >= 4 && xh < 0.5) x *= 0.3;
      tmf.set(m.id, x);
      fs[m.id] = (fs[m.id] || 0) + x;
    }
    fn++;
    // log a substitution wave when two or more players of the unit on the floor change
    let on = new Set(
      l
        .filter((m) => !fo.has(m.id))
        .sort((x, y) => tm(y.id) - tm(x.id))
        .slice(0, 5)
        .map((m) => m.id)
    );
    if (prevOn) {
      let ins = l.filter((m) => on.has(m.id) && !prevOn.has(m.id)),
        outs = l.filter((m) => !on.has(m.id) && prevOn.has(m.id));
      ins.length >= 2 && pb("us", `Substitutions: ${ins.map((m) => m.name).join(", ")} in for ${outs.map((m) => m.name).join(", ")}`);
    }
    prevOn = on;
  }
  function tm(id) {
    return (t.get(id) || 0) * (tmf.get(id) ?? 1);
  }
  // Free throws for us after a foul on them: n shots, or a one-and-one (second shot only after a make)
  function ftUs(L, g, n, oneAndOne, lp) {
    let mk = 0;
    for (let I = 0; I < n; I++) {
      if (I && oneAndOne && !mk) break;
      g.fta++;
      (mk = ne(e) < 0.45 + L.attrs[3] * 0.004)
        ? (g.ftm++, g.pts++, pb("us", `${L.name} makes a free throw`, 1))
        : pb("us", `${L.name} misses a free throw`);
    }
    // missed last free throw: a live rebound, rarely ours (the possession still ends)
    if (!mk && ne(e) < 0.15) {
      let D = po(
        e,
        lp,
        (B) =>
          tm(B.id) * Math.pow(B.attrs[10] / 60, 2.6) * Math.pow(Math.max(TUNE.statCal ? 0.85 : 0.6, (B.height - 66) / 12), TUNE.statCal ? 1.9 : 1.5)
      );
      u.find((B) => B.id === D.id).reb++;
    }
  }
  // Free throws for them after a foul on us (same shape as ftUs)
  function ftOpp(n, oneAndOne, lp) {
    let mk = 0;
    for (let I = 0; I < n; I++) {
      if (I && oneAndOne && !mk) break;
      (mk = ne(e) < 0.73) ? (p++, pb("opp", `${a.opponent} makes a free throw`, 1)) : pb("opp", `${a.opponent} miss a free throw`);
    }
    // their missed last free throw: usually our defensive rebound
    if (!mk && ne(e) < 0.85) {
      let D = po(
        e,
        lp,
        (B) =>
          tm(B.id) * Math.pow(B.attrs[11] / 60, 2.6) * Math.pow(Math.max(TUNE.statCal ? 0.85 : 0.6, (B.height - 66) / 12), TUNE.statCal ? 1.9 : 1.5)
      );
      u.find((B) => B.id === D.id).reb++;
    }
  }
  // A foul away from the shot (already counted in tf). Team fouls count per half; from the 7th the fouled team shoots a
  // one-and-one, from the 10th two shots (NCAA men's rule as we know it, not re-checked online). Returns true when it
  // ended the possession with free throws; before the bonus the play simply goes on.
  function bonusTrip(side, lp, L, g) {
    if (tf[side] < TUNE.bonus1) return false;
    let two = tf[side] >= TUNE.bonus2;
    if (side === 0) {
      pb("opp", `${a.opponent} in the bonus: ${two ? "two shots" : "one-and-one"}`);
      ftOpp(2, !two, lp);
    } else {
      pb("us", `${L.name} in the bonus: ${two ? "two shots" : "one-and-one"}`);
      ftUs(L, g, 2, !two, lp);
    }
    return true;
  }
  function v(m) {
    for (let c = 0; c < m; c++) {
      let lp = l.filter((x) => !fo.has(x.id));
      lp.length < 5 && (lp = l);
      // halftime: team fouls reset, and at most TUNE.toCarry timeouts carry over (item 28)
      px === hb && ((tf = [0, 0]), (tos = tos.map((x) => Math.min(x, TUNE.toCarry))));
      waves();
      let us0 = u.reduce((x, y) => x + y.pts, 0),
        p0 = p,
        df = us0 - p,
        // where the game clock stands at the start of this possession pair, and how long each team holds the ball
        per = px < hb ? 1 : px < h ? 2 : 3,
        sg = per === 1 ? seg1[px] : per === 2 ? seg2[Math.min(seg2.length - 1, px - hb)] : seg3[(px - h) % 8],
        lefP = (per === 3 ? 300 : 1200) - sg[0],
        lefG = per === 1 ? lefP + 1200 : lefP,
        lu = sg[1] * (0.4 + 0.2 * ne(e)),
        lo = sg[1] - lu,
        cl = lefG <= TUNE.closeSecs && Math.abs(df) <= 6,
        gb = lefG <= TUNE.blowSecs && Math.abs(df) >= 18,
        // trailing team fouls on purpose in the last minute (the leader goes to the line once they are in the bonus)
        hack = lefG <= TUNE.hackSecs && df !== 0 && Math.abs(df) <= 9,
        // lead drag (like W_game, weaker): as the game goes on the leader eases off and the trailer presses
        ld = df * 0.002 * (px / h);
      px++;
      let sw = (I) => {
          let b =
            tm(I.id) * Math.pow((I.attrs[0] + I.attrs[2] + 50) / 130, TUNE.statCal ? (TUNE.nUse || TUNE.statUse) : 2.2) * tw(I.id, "usage") * shotPriW(I.id) * (1 + 0.25 * (htm[I.id] || 0) * (TUNE.heat ? 1 : 0));
          return cl
            ? b * Math.pow(I.ovr / 70, 3) * tw(I.id, "clutch")
            : gb
              ? tm(I.id) * 0.6 + b * 0.4
              : b;
        },
        ff = () => {
          let D = po(
              e,
              lp,
              (B) => tm(B.id) * (1 + Math.max(0, 80 - B.attrs[7]) / 60) * (0.5 + 0.5 * tw(B.id, "gamble"))
            ),
            z = u.find((Z) => Z.id === D.id);
          (tf[0]++,
            (z.pf = (z.pf || 0) + 1),
            z.pf >= TUNE.foulOut && !fo.has(D.id) && (fo.add(D.id), (fy[D.id] = px)));
        },
        L = po(e, lp, sw),
        g = u.find((I) => I.id === L.id);
      clkNow = lefP;
      qNow = per;
      if (lu >= TUNE.shotClock) (g.to++, pb("us", `Shot clock violation on ${L.name}`));
      else if (ne(e) < 0.178) (g.to++, pb("us", `${L.name} turns it over`));
      else if (ne(e) < TUNE.sf) {
        // foul on a shot: two free throws, and it counts as a team foul on them
        (tf[1]++, ftUs(L, g, 2, false, lp));
      } else if (hack && df > 0 && ne(e) < 0.85 && (tf[1]++, pb("opp", `${a.opponent} foul on purpose`), bonusTrip(1, lp, L, g))) {
        // trailing team fouls to stop the clock and they are in the bonus: free throws instead of a shot
      } else if (ne(e) < TUNE.nf && (tf[1]++, bonusTrip(1, lp, L, g))) {
        // foul away from the shot with them in the bonus: the possession became free throws
      } else {
        for (let sc = 0; sc < 3; sc++) {
          let I =
            sc === 0 &&
            ne(e) <
              le(
                (L.tend ? L.tend.three : 0.34) *
                  (e.tactics.offense === "Perimeter" ? 1.3 : e.tactics.offense === "Inside-out" ? 0.7 : 1.03) *
                  (TUNE.statCal ? TUNE.threeAdj : 1),
                0.03,
                0.75
              );
          (g.fga++, I && g.tpa++);
          let G = I ? L.attrs[2] : (L.attrs[0] + L.attrs[1]) / 2,
            w = le(
              (I ? TUNE.o3 : sc ? 0.56 : TUNE.o2) +
                (G - 65) * TUNE.sk +
                f * TUNE.f * (gb ? 0.4 : 1) -
                ld -
                shotPriPen(L.id) -
                (TUNE.statCal ? Math.max(0, g.min - 30) * 0.0035 : Math.max(0, g.min - 32) * 0.0022) +
                (bo[0] > 0 ? TUNE.toBoost : 0) +
                (htm[L.id] || 0) * TUNE.heat +
                mo * TUNE.mom +
                // shot clock: a late shot (24+ seconds in) is harder, a quick one (10 or less) easier
                (sc === 0 ? (lu >= 24 ? -TUNE.scShift : lu <= 10 ? TUNE.scShift : 0) : 0) +
                (cl ? (L.ovr - 70) * 0.002 : 0),
              0.13,
              0.78
            );
          if (((hv = ne(e) < w), TUNE.heat && heat(L, hv), hv)) {
            let sx = `${L.name} ${I ? "hits a three" : sc ? "puts it back in" : ["scores inside", "hits a jumper", "finishes at the rim", "scores on a drive"][(px + L.attrs[0]) % 4]}`;
            if ((g.fgm++, (g.pts += I ? 3 : 2), I && g.tpm++, ne(e) < (TUNE.statCal ? (I ? 0.68 : 0.46) : 0.52))) {
              let D = po(
                e,
                lp.filter((B) => B.id !== L.id),
                (B) => tm(B.id) * Math.pow(B.attrs[5] / 60, TUNE.statCal ? TUNE.statPass : 2.2) * (TUNE.statCal ? ({ PG: 5, SG: 1.5, SF: 1.1, PF: 0.7, C: 0.55 }[B.pos] || 1) : 1) * tw(B.id, "pass")
              );
              (u.find((B) => B.id === D.id).ast++, (sx += ` (assist: ${D.name})`));
            }
            pb("us", sx, I ? 3 : 2);
            break;
          } else if ((pb("us", `${L.name} misses ${I ? "a three" : "a jumper"}`), ne(e) < 0.28)) {
            let D = po(
              e,
              lp,
              (B) =>
                tm(B.id) *
                Math.pow(B.attrs[10] / 60, 2.6) *
                Math.pow(Math.max(TUNE.statCal ? 0.85 : 0.6, (B.height - 66) / 12), TUNE.statCal ? 1.9 : 1.5) *
                tw(B.id, "crash")
            );
            ((g = u.find((B) => B.id === D.id)), g.reb++, (L = D), pb("us", `${D.name} grabs the offensive rebound`));
          } else {
            pb("opp", `${a.opponent} rebound`);
            break;
          }
        }
      }
      let oto = 0.178 + (e.tactics.defense === "Full-court press" ? 0.03 : 0);
      clkNow = lefP - lu;
      if (lo >= TUNE.shotClock) pb("opp", `${a.opponent} shot clock violation`);
      else if (ne(e) < oto) {
        let sx =
          ne(e) < 0.48 &&
          po(
            e,
            u,
            (I) => tm(I.id) * Math.pow(e.roster.find((r) => r.id === I.id).attrs[8] / 60, TUNE.statCal ? TUNE.statStl : 1.8) * tw(I.id, "gamble")
          );
        (sx && sx.stl++, pb(sx ? "us" : "opp", sx ? `${sx.name} steals the ball` : `${a.opponent} turn it over`));
      } else if (ne(e) < TUNE.sf) {
        (ff(), ftOpp(2, false, lp));
      } else if (hack && df < 0 && ne(e) < 0.85 && (ff(), pb("us", "Your team fouls on purpose"), bonusTrip(0, lp))) {
        // we trail late and foul to stop the clock; they are in the bonus: free throws instead of a shot
      } else if (ne(e) < TUNE.nf && (ff(), bonusTrip(0, lp))) {
        // foul away from the shot with us in the bonus: the possession became free throws
      } else {
        for (let sc = 0; sc < 3; sc++) {
          let I = sc === 0 && ne(e) < 0.37,
            G =
              e.tactics.defense === "2\u20133 zone"
                ? I
                  ? 0.018
                  : -0.018
                : e.tactics.defense === "Full-court press"
                  ? 0.012
                  : 0;
          if (ne(e) < le((I ? TUNE.d3 : sc ? 0.56 : TUNE.d2) - f * TUNE.f * (gb ? 0.4 : 1) + ld + G + (bo[1] > 0 ? TUNE.toBoost : 0) - mo * TUNE.mom + (sc === 0 ? (lo >= 24 ? -TUNE.scShift : lo <= 10 ? TUNE.scShift : 0) : 0), 0.17, 0.78)) {
            ((p += I ? 3 : 2), pb("opp", `${a.opponent} ${I ? "hit a three" : sc ? "score on a putback" : "score"}`, I ? 3 : 2));
            break;
          } else {
            let bk =
              ne(e) < 0.113 &&
              po(
                e,
                u,
                (D) =>
                  tm(D.id) *
                  Math.pow(
                    (e.roster.find((r) => r.id === D.id).attrs[9] +
                      e.roster.find((r) => r.id === D.id).attrs[7]) /
                      120,
                    TUNE.statCal ? TUNE.statBlk : 1.8
                  )
              );
            (bk && bk.blk++,
              pb(bk ? "us" : "opp", bk ? `${bk.name} blocks the shot` : `${a.opponent} miss ${I ? "a three" : "a jumper"}`));
            if (ne(e) < 0.72) {
              let D = po(
                e,
                lp,
                (B) =>
                  tm(B.id) *
                  Math.pow(B.attrs[11] / 60, 2.6) *
                  Math.pow(Math.max(TUNE.statCal ? 0.85 : 0.6, (B.height - 66) / 12), TUNE.statCal ? 1.9 : 1.5)
              );
              (u.find((B) => B.id === D.id).reb++, pb("us", `${D.name} rebound`));
              break;
            }
            pb("opp", `${a.opponent} offensive rebound`);
          }
        }
      }
      // Timeouts. Each coach calls one after a TUNE.toRun-point run by the other side, the trailing coach stops the clock late in a
      // close game after the leader scores, and the rules below (item 28) use up timeouts before the half and in the last minutes. A timeout ends the run and the team that called it plays the next two
      // possessions a little more settled (TUNE.toBoost).
      let gu = u.reduce((x, y) => x + y.pts, 0) - us0,
        go = p - p0,
        net = gu - go,
        dn = us0 + gu - p,
        late = lefG <= 120 && Math.abs(dn) <= 6;
      clkNow = lefP - lu - lo;
      rn = net === 0 ? (gu ? 0 : rn) : Math.sign(net) === Math.sign(rn) ? rn + net : net;
      // streaks fade, and a basket swings the team momentum toward the scorer
      mo = le(mo * 0.82 + net * 0.03, -1, 1);
      for (let k in htm) htm[k] *= 0.93;
      bo[0] > 0 && bo[0]--;
      bo[1] > 0 && bo[1]--;
      for (let s = 0; s < 2; s++) {
        let hurt = s === 0 ? -rn : rn,
          trail = s === 0 ? dn < 0 : dn > 0,
          scoredOn = s === 0 ? go > 0 : gu > 0,
          // item 28: the trailing coach stops the clock after the other side scores in the last TUNE.toLate seconds (within 10),
          // the leader sometimes calls one in the last minute to set up a play, and a coach with more than TUNE.toCarry left
          // uses one late in the first half rather than lose it (only toCarry carry over to the second half)
          lateNeed = (per > 1 ? lefG <= TUNE.toLate && Math.abs(dn) <= 10 : late) && trail && scoredOn,
          leadUse = per > 1 && lefG <= 60 && dn !== 0 && Math.abs(dn) <= 6 && !trail && scoredOn,
          halfUse = per === 1 && hb - px <= 3 && tos[s] > TUNE.toCarry;
        // your timeout style (Game Day, halftime or a timeout): Quick calls one after a shorter run, Save keeps two for the finish; Normal is the original rule
        let tmo = s === 0 ? e.tactics.tmo : "",
          runNeed = TUNE.toRun + (tmo === "Quick" ? -1 : tmo === "Save" ? 3 : 0),
          keep = tmo === "Save" ? 2 : 0,
          special = lateNeed || leadUse || halfUse;
        if (
          tos[s] > 0 &&
          (tos[s] > keep || lateNeed) &&
          px - lastTo[s] > (special ? 1 : 3) &&
          (hurt >= runNeed || special) &&
          ne(e) < (lateNeed ? (tmo === "Save" ? 0.8 : 0.6) : leadUse ? 0.35 : halfUse ? 0.6 : 0.75)
        ) {
          (tos[s]--, (lastTo[s] = px), (bo[s] = 2), (rn = 0), (mo *= 0.2));
          pb(
            s === 0 ? "us" : "opp",
            `Timeout, ${s === 0 ? "your team" : a.opponent} (${tos[s]} left)${lateNeed ? "" : leadUse ? " to set up a play" : halfUse ? " before the half" : ` after a ${Math.abs(hurt)}-0 run`}`
          );
          // Game Day: stop at your own timeout (not on the last possession of a half, and not in overtime)
          s === 0 && op && op.pause && px < h && px !== hb && (stop = 1);
        }
      }
      if (stop) break;
    }
  }
  // the live game's state between calls: halftime (ph "half") or one of your timeouts (ph "to")
  function save(ph) {
    e.live = {
      gid: a.id,
      u: u,
      p: p,
      done: px,
      hb: hb,
      h: h,
      log: lg,
      fo: [...fo],
      fy: fy,
      n1: ph === "half" ? lg.length : (e.live && e.live.n1) || 0,
      fs: fs,
      fn: fn,
      tos: tos,
      rn: rn,
      lastTo: lastTo,
      bo: bo,
      htm: htm,
      hotF: hotF,
      mo: mo,
      tf: tf,
      on: prevOn ? [...prevOn] : null,
      sg: [seg1, seg2, seg3],
      ck: [clkNow, qNow],
      ph: ph,
    };
  }
  if (op && (op.half === 1 || ((op.half === 2 || rs) && e.live))) {
    op.half === 2 && !rs && (e.live.h = h);
    for (let m of l)
      u.find((z) => z.id === m.id) ||
        u.push({ ...zs(), id: m.id, name: m.name, pos: m.pos, gp: 1, min: t.get(m.id) });
    if (px < hb) return (v(hb - px), save(stop ? "to" : "half"));
    if ((v(h - px), stop)) return save("to");
  } else v(h);
  let M = u.reduce((m, c) => m + c.pts, 0);
  for (; M === p && C < 8;) (C++, v(8), (M = u.reduce((m, c) => m + c.pts, 0)));
  if ((M === p && (u[0].ftm++, u[0].fta++, u[0].pts++, M++), C)) {
    let m = uy(e, 200 + C * 25);
    u.forEach((c) => (c.min = m.get(c.id) || c.min));
  }
  u.forEach((z) => {
    // fouled out: only the part of the game he played; otherwise his average playing-time factor (foul trouble sat him down)
    fy[z.id]
      ? (z.min = Math.max(1, Math.round((z.min * fy[z.id]) / Math.max(1, px))))
      : fn && z.min && !C && (z.min = Math.max(1, Math.round((z.min * (fs[z.id] || fn)) / fn)));
  });
  W_finishPlayed(e, a, { l, t, u, us: M, them: p, ot: C, poss: h + C * 8,
    tmo: [TUNE.timeouts - tos[0], TUNE.timeouts - tos[1]] });
}

// The simulator and playable court share ALL postgame effects. No extra game is simulated.
function W_finishPlayed(e, a, result) {
  const { l, t, u, us: M, them: p, ot: C, poss, tmo } = result;
  Object.assign(a, { played: !0, us: M, them: p, win: result.win ?? (M > p), box: u, ot: C, poss, tmo });
  W_teamRecs(e, a);
  for (let m of e.roster) {
    let c = u.find((L) => L.id === m.id);
    if (c) {
      for (let L of Object.keys(m.stats)) m.stats[L] += c[L];
      W_recs(e, m, c, a);
      (m.recent.unshift({ opponent: a.opponent, pts: c.pts, reb: c.reb, ast: c.ast, stl: c.stl, blk: c.blk, min: c.min }),
        (m.recent = m.recent.slice(0, 8)));
    }
    if (!m.redshirt && m.injury === 0) {
      let I = (c?.min || 0) >= wt(m.promise) - 3 ? 1.4 : -2.4;
      (m.promise === "Starter" && !e.lineup.includes(m.id) && (I -= 1.1),
        m.promise &&
          m.promise !== "None" &&
          (m.promise === "Starter" ? e.lineup.includes(m.id) : (c?.min || 0) >= wt(m.promise)) &&
          (I += 0.8),
        m.pers === "Ambitious" && (c?.min || 0) < wt(m.promise) - 3 && (I -= 0.8),
        m.pers === "Patient" && I < 0 && (I += 0.5),
        (I += a.win ? 1 : -0.5),
        m.nil < m.ask * 0.6 && (I -= 0.7),
        (m.morale = le(m.morale + I, 5, 99)));
    }
    (m.injury > 0 && m.injury--, m.injury === 0 && m.susp && delete m.susp, m.adj > 0 && --m.adj === 0 && W_adj(e, m));
  }
  ((() => {
    let df = { relaxed: 0.65, hardcore: 1.45 }[e.diff] || 1,
      hp = l.filter((m) => m.injury === 0 && (t.get(m.id) || 0) > 0);
    if (hp.length > 7)
      for (let m of hp) {
        let mn = t.get(m.id) || 0,
          ih = m.ih || { n: 0, g: 0, major: 0 },
          pr =
            0.007 *
            df *
            (mn / 28) *
            (1 + 0.32 * Math.min(ih.n || 0, 5) + 0.25 * (ih.major || 0)) *
            ((m.age || 20) >= 22 ? 1.15 : 1) *
            (1.18 - (m.attrs[15] || 60) / 250);
        if (ne(e) < pr) {
          let r = ne(e),
            g =
              r < 0.03 * (1 + (ih.n || 0) * 0.3)
                ? j(e, 26, 40)
                : r < 0.07 + 0.05 * Math.min(ih.n || 0, 4)
                  ? j(e, 8, 24)
                  : j(e, 1, 4);
          ((m.injury = g),
            (m.ih = { n: (ih.n || 0) + 1, g: (ih.g || 0) + g, major: (ih.major || 0) + (g >= 8 ? 1 : 0) }));
          // Medical hardship waiver: a season-ending injury in the first half of the season gives the year back (once).
          g >= 26 && !m.medUsed && e.schedule.filter((f) => f.played).length <= 15 && (m.med = 1);
          g >= 26 &&
            ne(e) < 0.4 &&
            (m.attrs = m.attrs.map((q, ix) => ([12, 13, 14, 15].includes(ix) ? le(q - 3, 25, 99) : q)));
          Be(
            e,
            "Injury report",
            `${m.name} will miss ${g} games${m.ih.n > 1 ? `. It is injury number ${m.ih.n} here.` : "."}${g >= 26 ? " It is a season-ending injury." : ""} His minutes will be redistributed while he recovers.`
          );
          break;
        }
      }
  })(),
    // Suspensions: about one every one to two seasons (measured 0.75 a season), 1 to 3 games, for a violation of team rules.
    (() => {
      if (ne(e) >= 0.017) return;
      let c = e.roster.filter((m) => !m.redshirt && m.injury === 0);
      if (c.length <= 8) return;
      let m = jl(e, c),
        g = j(e, 1, 3);
      ((m.injury = g),
        (m.susp = 1),
        (m.morale = le(m.morale - 4, 5, 99)),
        Be(
          e,
          "Suspension",
          `${m.name} was suspended for ${g} game${g === 1 ? "" : "s"} for a violation of team rules. His minutes will be redistributed.`
        ));
    })(),
    (e.chemistry = le(e.chemistry + 0.55, 20, 99)),
    (() => {
      e.h2h = e.h2h || {};
      let k = (e.h2h[a.oppId] = e.h2h[a.oppId] || { w: 0, l: 0 });
      a.win ? k.w++ : k.l++;
      e.rival &&
        a.oppId === e.rival.id &&
        Be(
          e,
          a.win ? "Rivalry win" : "Rivalry loss",
          `${a.win ? "You beat" : "You lost to"} your rival ${e.rival.name}. Series: ${k.w}\u2013${k.l}.`
        );
    })(),
    (a.kind === "Conference" || a.kind === "Nonconference") &&
      (IS(e, a), W_day(e, a), e.schedule.filter((f) => f.played).length % 7 === 0 && W_story(e)),
    Be(
      e,
      `${a.win ? "Victory" : "Final"}: ${M}\u2013${p}${C ? " \xB7 OT" : ""}`,
      `${a.win ? "Defeated" : "Lost to"} ${a.opponent}. ${[...u].sort((m, c) => c.pts - m.pts)[0].name} led the team with ${Math.max(...u.map((m) => m.pts))} points.`
    ));
}
