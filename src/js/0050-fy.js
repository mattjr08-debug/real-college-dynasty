function fy(e, a) {
  switch (a.type) {
    case "target": {
      let t = Ba(e, a.id, !0);
      t.target = !t.target;
      break;
    }
    case "scout": {
      Da(e, "Offseason");
      let t = Ba(e, a.id, !0);
      if (t.status !== "Available") throw new Error("This player has already made a decision.");
      if (hsLock(e, t)) throw new Error(HS_LOCK_MSG);
      if (e.round > 8) throw new Error("Scouting is closed for this offseason.");
      if (e.scouts < 1) throw new Error("No scouting visits remaining.");
      if (t.scouted >= (t.intl ? 1 : 2))
        throw new Error(
          t.intl ? "International prospects can only be scouted so far." : "This player is fully scouted."
        );
      (t.scouted++,
        e.scouts--,
        (t.progress = le(t.progress + 8, 0, 99)),
        (t.target = !0),
        (t.interest = le(t.interest + 3, 0, 99)));
      break;
    }
    case "offer": {
      chkDraft(e);
      if ((Da(e, "Offseason"), e.round > 9)) throw new Error("The recruiting window has closed.");
      let t = Ba(e, a.id, !0);
      if (t.status !== "Available") throw new Error("This player is no longer available.");
      if (hsLock(e, t)) throw new Error(HS_LOCK_MSG);
      if (t.wb) throw new Error("He withdrew from the portal and wants to come back: accept or deny it in the Transfer portal watch pop-up.");
      let l = ho(a.nil, 0, 5e6),
        u = String(a.role);
      if (!Ns.includes(u)) throw new Error("Choose a valid role.");
      if (l > Ce(e) + (t.offer?.nil || 0)) throw new Error("This offer exceeds your available NIL budget.");
      if (u === "Starter" && Xa(e, t.id) >= 5)
        throw new Error(
          "Only five starter promises are allowed, including pending offers. Change an existing promise or offer a rotation role."
        );
      if (
        e.roster.length +
          e.prospects.filter((o) => o.offer && o.id !== t.id && o.status === "Available").length >=
        15
      )
        throw new Error("All 15 roster spots are occupied or reserved by offers.");
      ((t.offer = { nil: l, role: u }), (t.target = !0));
      break;
    }
    case "withdraw": {
      (Da(e, "Offseason"), delete Ba(e, a.id, !0).offer);
      break;
    }
    case "visit": {
      // Item 42: a campus visit for a portal entrant (TUNE.pvisits per portal window, an estimate).
      Da(e, "Offseason");
      if (!(e.pw >= 1 && e.pw <= 3)) throw new Error("Campus visits are only possible while the portal window is open.");
      let t = Ba(e, a.id, !0);
      if (!t.fid || t.status !== "Available") throw new Error("Only open portal entrants can visit.");
      if (t.vis) throw new Error("He has already visited.");
      if ((e.pv || 0) < 1) throw new Error("No campus visits left in this portal window.");
      (e.pv--,
        (t.vis = 1),
        (t.scouted = 2),
        (t.target = !0),
        (t.progress = le(t.progress + 15, 0, 99)),
        (t.interest = le(t.interest + 6, 0, 99)),
        Be(e, "Campus visit", `${t.name} visited campus. ${e.pv} campus visit${e.pv === 1 ? "" : "s"} left this window.`));
      break;
    }
    case "staff": {
      // Item 23: set the level (0 to 3) of an assistant or of the facilities. The yearly cost comes out of the available NIL.
      Da(e, "Offseason");
      let k = STAFF_ROLES.find((r) => r.k === a.key),
        lv = Math.round(a.level);
      if (!k) throw new Error("Unknown staff role.");
      if (!(lv >= 0 && lv <= 3)) throw new Error("Choose a level from 0 to 3.");
      // an assistant (not facilities) needs a person: level 0 lets him go, a level above 0 changes his level; hiring is "hireAsst"
      if (k.k !== "fac" && lv > 0 && !e.asst?.[k.k]) throw new Error("Hire an assistant first.");
      let cur = e.staff?.[k.k] || 0,
        extra = W_staffLevelCost(e, k.k, lv) - W_staffLevelCost(e, k.k, cur);
      if (extra > Ce(e)) throw new Error("Not enough available NIL for that.");
      let gone = k.k !== "fac" && lv === 0 ? e.asst?.[k.k] : null;
      ((e.staff = { ...(e.staff || {}), [k.k]: lv }),
        gone && (e.asst[k.k] = null),
        Be(e, "Staff", lv ? `${k.name} set to level ${lv}. Staff and facilities now cost ${q(W_staffCostOf(e))} a year.` : `${k.name} ${gone ? gone.name + " let go" : "cut"}. Staff and facilities now cost ${q(W_staffCostOf(e))} a year.`));
      break;
    }
    case "hireAsst": {
      // Item 23: hire a named assistant from this offseason's candidates at a level (1 to 3); he replaces the one in the chair, if any
      Da(e, "Offseason");
      let k = STAFF_ROLES.find((r) => r.k === a.key && r.k !== "fac"),
        lv = Math.round(a.level);
      if (!k) throw new Error("Unknown assistant role.");
      if (!(lv >= 1 && lv <= 3)) throw new Error("Choose a level from 1 to 3.");
      let who = (e.asstPool || W_asstPool(e))[k.k]?.find((c) => c.id === a.id);
      if (!who) throw new Error("That candidate is no longer available.");
      let old = e.asst?.[k.k],
        extra = W_staffLevelCost(e, k.k, lv, who) - W_staffLevelCost(e, k.k, e.staff?.[k.k] || 0, old || null);
      if (extra > Ce(e)) throw new Error("Not enough available NIL for that.");
      ((e.asst = { ...(e.asst || {}), [k.k]: { ...who, yrs: 1 } }),
        (e.staff = { ...(e.staff || {}), [k.k]: lv }),
        (e.asstPool = { ...(e.asstPool || W_asstPool(e)), [k.k]: (e.asstPool || W_asstPool(e))[k.k].filter((c) => c.id !== who.id) }),
        Be(e, "Staff", `${who.name} (rating ${who.rating}) hired as ${k.name.toLowerCase()} at level ${lv}${old ? `, replacing ${old.name}` : ""}. Staff and facilities now cost ${q(W_staffCostOf(e))} a year.`));
      break;
    }
    case "officialVisit": {
      // Item 5: an official visit for a high school recruit (TUNE.ovisits a year). It reveals him fully and counts a lot.
      Da(e, "Offseason");
      let t = Ba(e, a.id, !0);
      if (t.status !== "Available") throw new Error("This player has already made a decision.");
      if (t.fid) throw new Error("Transfer portal entrants use campus visits.");
      if (hsLock(e, t)) throw new Error(HS_LOCK_MSG);
      if (e.round > 8) throw new Error("Official visits are closed for this offseason.");
      if (t.ov) throw new Error("He has already made an official visit.");
      if ((e.ov ?? TUNE.ovisits) < 1) throw new Error("No official visits left this offseason.");
      ((e.ov = (e.ov ?? TUNE.ovisits) - 1),
        (t.ov = 1),
        (t.scouted = t.intl ? Math.max(t.scouted, 1) : 2),
        (t.target = !0),
        (t.progress = le(t.progress + 20, 0, 99)),
        (t.interest = le(t.interest + 8, 0, 99)),
        Be(e, "Official visit", `${t.name} visited campus. ${e.ov} official visit${e.ov === 1 ? "" : "s"} left this offseason.`));
      break;
    }
    case "portalWave": {
      chkDraft(e);
      Da(e, "Offseason");
      if (!(e.pw >= 1 && e.pw <= 3)) throw new Error("The transfer portal window is closed.");
      W_pwave(e, !0);
      break;
    }
    case "wbDecision": {
      // Item 59: one of your portal entrants withdrew and wants to come back. Accept signs him at his NIL; Deny sends him
      // where any unsigned entrant goes (another school, or out of college basketball).
      Da(e, "Offseason");
      let t = e.prospects.find((p) => p.id === a.id && p.wb && p.status === "Available");
      if (!t) throw new Error("That player is no longer waiting on you.");
      if (a.accept) {
        if (e.roster.length >= 15) throw new Error("Your roster is full (15 players). Deny him or open a spot first.");
        let n = t.nil || 0;
        if (n > Ce(e))
          throw new Error(`Not enough available NIL to take him back: he asks ${q(n)} a year and you have ${q(Ce(e))}. Free up NIL or deny him.`);
        (delete t.wb, cy(e, t, n, "Rotation"), Be(e, "He withdrew from the portal", `${t.name} withdrew from the portal and is back in your program.`));
      } else {
        W_PST = e.pst || (e.pst = {});
        delete t.wb;
        let s0 = W_pland(e, t, W_power(e));
        Be(e, "Portal decision", s0 ? `You turned ${t.name} away. He signed with ${s0.name}.` : `You turned ${t.name} away. He left college basketball.`);
      }
      break;
    }
    case "recruitRound": {
      chkDraft(e);
      if (e.pw >= 1 && e.pw <= 3 && !a.auto)
        throw new Error("The transfer portal window is still open. Advance the portal wave first.");
      (Da(e, "Offseason"), a.autoScout && scoutFav(e), my(e));
      break;
    }
    case "autoScout": {
      Da(e, "Offseason");
      if (e.round > 8) throw new Error("Scouting is closed for this offseason.");
      let n = scoutFav(e);
      Be(
        e,
        "Auto-scout",
        n
          ? `Used ${n} scouting visit${n === 1 ? "" : "s"} on your favorite recruits. ${e.scouts} left.`
          : "No favorite recruits needed scouting, or you have no visits left. Mark recruits with the bookmark to make them favorites."
      );
      break;
    }
    case "walkon": {
      chkDraft(e);
      if (
        (e.phase !== "Regular season" && Da(e, "Offseason"),
        e.roster.length + e.prospects.filter((l) => l.offer && l.status === "Available").length >= 15)
      )
        throw new Error("All 15 roster spots are filled or reserved.");
      let t = a.id
        ? e.walkons.find((l) => l.id === a.id)
        : [...e.walkons]
            .filter((l) => l.status === "Available" && (!a.pos || l.pos === a.pos))
            .sort((l, u) => u.ovr - l.ovr)[0];
      if (!t || t.status !== "Available") throw new Error("Choose an available walk-on from the pool.");
      py(e, t);
      break;
    }
    case "autoRecruit": {
      chkDraft(e);
      (Da(e, "Offseason"), kS(e));
      break;
    }
    case "autoCoach": {
      (oy(e),
        Be(
          e,
          "Coaching optimized",
          "The strongest positional lineup, a 200-minute rotation, and matching team tactics have been set." +
            (W_keptTactics(e).length
              ? ` Your own ${W_keptTactics(e).join(", ")} setting${W_keptTactics(e).length > 1 ? "s" : ""} stayed as you chose.`
              : "")
        ));
      break;
    }
    case "autoRotation": {
      Hs(e);
      break;
    }
    case "favPlayer": {
      let k = String(a.id || ""),
        f = e.favPlayers || [];
      if (!k) throw new Error("Choose a player.");
      e.favPlayers = f.includes(k) ? f.filter((z) => z !== k) : [...f, k];
      break;
    }
    case "favAlum": {
      let k = String(a.key || ""),
        f = e.favAlum || [];
      if (!k) throw new Error("Choose a former player.");
      e.favAlum = f.includes(k) ? f.filter((z) => z !== k) : [...f, k];
      break;
    }
    case "minPreset": {
      if (!MINP[a.value]) throw new Error("Choose a minutes plan.");
      ((e.minPreset = a.value), Hs(e, !0));
      break;
    }
    case "rotSize": {
      // how many players share the 200 minutes (5 to 13); 0 = the plan's own rotation
      let n = Math.round(Number(a.value) || 0);
      if (n && (n < 5 || n > 13)) throw new Error("Choose 5 to 13 players.");
      (n ? (e.rotSize = n) : delete e.rotSize, Hs(e, !0));
      break;
    }
    case "starPlayer": {
      // make one player the star (about 38 minutes, the rest fill in around him); pressing his button again goes back to the balanced plan
      let t = Ba(e, a.id);
      if (t.redshirt) throw new Error("Activate this player before making him your star.");
      if (e.minPreset === "Star player" && e.starId === t.id) ((e.minPreset = "Balanced"), delete e.starId);
      else ((e.starId = t.id), (e.minPreset = "Star player"));
      Hs(e, !0);
      break;
    }
    case "minutes": {
      let t = Ba(e, a.id);
      if (t.redshirt) throw new Error("Activate this player before assigning minutes.");
      ((t.minutes = ho(a.minutes, 0, 40)),
        (t.role = e.lineup.includes(t.id) ? "Starter" : t.minutes > 8 ? "Rotation" : "Bench"));
      break;
    }
    case "starter": {
      let t = Ba(e, a.id);
      if (t.redshirt) throw new Error("A redshirt cannot start.");
      let l = ho(a.slot, 0, 4),
        u = e.lineup[l],
        o = e.lineup.indexOf(t.id);
      (o >= 0 && (u ? (e.lineup[o] = u) : (e.lineup[o] = "")),
        (e.lineup[l] = t.id),
        e.roster.forEach(
          (r) =>
            (r.role = r.redshirt
              ? "Redshirt"
              : e.lineup.includes(r.id)
                ? "Starter"
                : r.minutes > 8
                  ? "Rotation"
                  : "Bench")
        ));
      break;
    }
    case "training": {
      let t = Ba(e, a.id),
        l = String(a.focus);
      if (l !== "Balanced" && !il.includes(l)) throw new Error("Choose a training focus.");
      t.training = l;
      break;
    }
    case "promise": {
      let t = Ba(e, a.id),
        l = String(a.role);
      if (!Ns.includes(l)) throw new Error("Choose a valid role.");
      if (l === "Starter" && Xa(e, t.id) >= 5)
        throw new Error("Only five players can be promised starting roles.");
      ((t.promise = l),
        Be(
          e,
          "Role conversation",
          `${t.name} was promised a ${l.toLowerCase()} role and ${wt(l)}+ minutes. His morale will follow actual playing time.`
        ));
      break;
    }
    case "talk": {
      let t = Ba(e, a.id);
      if (!t.talked)
        ((t.talked = !0),
          (t.morale = le(t.morale + 4, 0, 99)),
          Be(
            e,
            "Player meeting",
            `${t.name} appreciated the conversation. Keeping your promises will matter more than reassurance.`
          ));
      else
        throw new Error(
          "You have already held this season\u2019s morale meeting. Address his concerns through minutes and NIL."
        );
      break;
    }
    case "nil": {
      Da(e, "Offseason");
      let t = Ba(e, a.id),
        l = ho(a.nil, 0, 5e6);
      if (l <= t.nil) throw new Error("Enter an amount above the current NIL commitment.");
      if (l - t.nil > Ce(e)) throw new Error("Not enough available NIL.");
      let u = l - t.nil;
      ((t.nil = l), (t.morale = le(t.morale + Math.min(10, (u / Math.max(1, t.ask)) * 25), 0, 99)));
      break;
    }
    case "redshirt": {
      // Offseason: any time. In season (Regular season): a player who has not played a game yet can start a redshirt year, and a redshirted player can be activated.
      if (e.live) throw new Error("Finish the live game first.");
      let t = Ba(e, a.id),
        ins = e.phase !== "Offseason";
      if (ins && e.phase !== "Regular season")
        throw new Error("Redshirts can be set in the offseason, or early in the season for a player who has not played yet.");
      if (t.redshirtUsed && !t.redshirt) throw new Error("This player has already used a redshirt season.");
      if (ins && !t.redshirt) {
        const gp = (t.stats && t.stats.gp) || 0;
        if (gp > 0) throw new Error(`${t.name} has already played ${gp} game${gp === 1 ? "" : "s"} this season, so he cannot redshirt now.`);
        if (e.roster.filter((l) => !l.redshirt && l.id !== t.id).length < 8)
          throw new Error("You need at least 8 active players during the season. Activate a redshirt or add a player first.");
      }
      const wasMinutes = t.minutes || 0,
        wasStarter = e.lineup.includes(t.id);
      ((t.redshirt = !t.redshirt),
        t.redshirt
          ? ((t.minutes = 0),
            (t.role = "Redshirt"),
            (e.lineup = e.lineup.map((l) => (l === t.id ? "" : l))),
            (() => {
              let r = rsReact(t);
              ((t.morale = le(t.morale + r, 5, 99)),
                Be(
                  e,
                  "Redshirt plan",
                  `${t.name} ${r > 0 ? "welcomed" : r === 0 ? "accepted" : "was unhappy about"} the plan to redshirt and develop this season${r < -8 ? "; he may be a transfer risk" : ""}.`
                ));
            })())
          : (t.role = "Bench"));
      // started in season: his minutes go to the rest of the rotation (or the lineup is refilled), the same as when a player is cut mid-season
      if (ins && t.redshirt)
        wasStarter
          ? Hs(e)
          : (() => {
              let rot = e.roster.filter((l) => !l.redshirt && l.minutes > 0);
              rot.length || (rot = e.roster.filter((l) => !l.redshirt));
              for (let m = wasMinutes, k = 0; m > 0 && k < 400; k++) {
                let p = rot[k % rot.length];
                p.minutes < 40 && (p.minutes++, m--);
              }
            })();
      break;
    }
    case "removeRecruit": {
      let t = Ba(e, a.id, !0);
      if (t.status === "Signed") throw new Error("This player has already joined your program.");
      e.scouts += t.scouted || 0;
      e.prospects = e.prospects.filter((l) => l.id !== t.id);
      break;
    }
    case "removeBoardMany": {
      for (let id of a.ids || []) {
        let t = e.prospects.find((l) => l.id === id) || e.walkons.find((l) => l.id === id);
        if (!t || t.status === "Signed" || (t.offer && t.status === "Available")) continue;
        (delete t.offer, (t.target = !1));
        if (e.prospects.some((l) => l.id === t.id) && t.scouted > 0) {
          ((e.scouts += t.scouted), (t.scouted = 0));
        }
      }
      break;
    }
    case "removeBoard": {
      let t = e.prospects.find((l) => l.id === a.id) || e.walkons.find((l) => l.id === a.id);
      if (!t) throw new Error("Player not found.");
      if (t.status === "Signed") throw new Error("This player has already joined your program.");
      (delete t.offer, (t.target = !1));
      if (e.prospects.some((l) => l.id === t.id) && t.scouted > 0) {
        ((e.scouts += t.scouted), (t.scouted = 0));
      }
      break;
    }
    case "autoPromise": {
      (Da(e, "Offseason"), apr(e));
      break;
    }
    case "acceptJob": {
      if (!(e.jobOffers || []).includes(a.school)) throw new Error("That job offer is no longer available.");
      W_coachInit(e);
      // item 56: skills and career earnings come with you; leaving early costs an exit fee and you sign a new contract
      W_ach(e);   // record every achievement earned at this school before the career object is rebuilt
      let keep = { skills: { ...e.skills }, fee: e.fired ? 0 : W_exitFee(e), rep: e.rep, achieved: { ...(e.achieved || {}) }, crep: TUNE.coachRep ? W_crepInit(e) : undefined,
          // your former players, recruiting classes and favorites are yours too (All time in Career history)
          alumni: (e.alumni || []).map((x) => ({ ...x, school: x.school || e.school.name, sid: x.sid || e.school.id })), classes: (e.classes || []).map((c) => ({ ...c, school: c.school || e.school.name, sid: c.sid || e.school.id })), favAlum: [...(e.favAlum || [])], favPlayers: [...(e.favPlayers || [])] },
        o = sy(a.school, e.coach, e.specialty, (e.rng + e.year * 7919) >>> 0);
      keep.earn = e.earn - keep.fee;
      ((o.year = e.year + 1),
        (o.level = e.level),
        (o.history = e.history),
        (o.tenureStart = e.history.length),
        (o.jobOffers = []));
      let t = Xl.find((l) => l.id === a.school),
        ot = tierOf(e),
        on = e.school.name,
        fol = e.roster
          .filter((l) => !l.redshirt && l.year < 4)
          .sort((l, u) => u.ovr - l.ovr)
          .slice(0, 4)
          .map(
            (l) => (
              l.history.push({ year: e.year, team: on, stats: { ...l.stats } }),
              (l.stats = zs()),
              (l.recent = []),
              (l.injury = 0),
              (l.promise = "None"),
              (l.role = "Bench"),
              (l.minutes = 0),
              l
            )
          );
      for (let l of Object.keys(e)) delete e[l];
      (Object.assign(e, o),
        // item 48: player ids count up from 0 in every career (Ff), so a follower's old id can belong to a player of the new
        // roster; keeping him then put two players with one id on the roster, which the load check rejects ("could not be opened")
        fol.forEach((l) => (l.id = Ff(e, "p"))),
        (e.xfers = fol.map((l) => ({
          ...xf(e, l),
          kind: "follow",
          why: `Wants to follow you from ${on}`,
          chance: le(
            Math.round(32 + (l.morale - 50) * 0.6 + Math.max(0, tierOf(e) - ot) * 6 + e.rep * 0.1),
            10,
            85
          ),
        }))),
        (e.skills = keep.skills),
        (e.earn = keep.earn),
        (e.achieved = keep.achieved),
        (keep.crep !== undefined && (e.crep = keep.crep)),
        (e.alumni = keep.alumni),
        (e.classes = keep.classes),
        (e.favAlum = keep.favAlum),
        (e.favPlayers = keep.favPlayers),
        // the new program starts its own history; its last season is the record it had when you took the job
        (e.jobYear = e.year),
        (e.prevRec = { wins: t.wins, losses: Math.max(0, 30 - t.wins), school: t.name, year: e.year - 1, est: !0 }),
        (e.contract = W_newContract(e, e.baseBudget, Math.max(keep.rep, keep.crep ?? 0), 4)),
        Be(
          e,
          "New job",
          `${e.coach} accepted the ${t.name} head coaching job: ${e.contract.len} years at ${q(e.contract.sal)} a year.${keep.fee ? ` Leaving early cost ${q(keep.fee)} in exit fees.` : ""}`
        ));
      break;
    }
    case "moveUp": {
      Da(e, "Offseason");
      let mi = moveInfo(e);
      if (!mi) throw new Error("Your program is not ready to move up yet.");
      let rf = mi.ref,
        gap = Math.round(((tierAvg(mi.t2, "budget") - tierAvg(mi.t, "budget")) * 0.5) / 1e3) * 1e3;
      ((e.tierShift = (e.tierShift || 0) + 1),
        (e.school.league = rf.league),
        (e.school.difficulty = rf.difficulty),
        (e.baseBudget += gap),
        e.rev && (e.rev.conf += gap),
        (e.budget = e.baseBudget + e.guaranteeIncome),
        (e.tenureStart = e.history.length),
        (e.heat = 0));
      let t2 = mi.t2;
      ((e.league = [
        { ...e.league[0], wins: 0, losses: 0, cw: 0, cl: 0 },
        ...confTeams(e, t2, e.school.id, LEAGUE_SIZE[t2]),
      ]),
        W_conf(e),
        e.rev && (e.rev.cm = W_confMult(e).mult),
        e.ncCustom || (e.nc = ncFor(e)),
        Zf(e),
        Be(
          e,
          "New conference",
          `${e.school.name} joined ${rf.league}. Expectations are higher, the conference is tougher, and conference revenue adds ${q(gap)} to your NIL budget.`
        ));
      break;
    }
    case "draftDecision": {
      Da(e, "Offseason");
      for (let id of a.ids || []) {
        let d = (e.draft || []).find((l) => l.id === id && l.status === "pending");
        if (!d) continue;
        let ex = a.stay ? Math.max(0, Math.min(2e5, Math.round(a.extra || 0))) : 0;
        if (ex > 0 && ex > Ce(e) + (d.player.nil || 0)) throw new Error("Not enough available NIL for that offer.");
        // A player testing the waters decides for himself when you let him go: he returns with d.chance.
        let tst = d.kind === "test",
          ok =
            a.stay && (a.ids || []).length === 1
              ? ne(e) * 100 < le(d.chance + dBoost(d, ex), 5, 95)
              : tst && ne(e) * 100 < d.chance && e.roster.length < 15;
        if (ok) {
          if (e.roster.length >= 15)
            throw new Error("Your roster is full. Free up a spot before bringing him back.");
          ((d.player.nil += ex),
            (d.player.promise = "None"),
            e.roster.push(d.player),
            (d.status = "Returned"),
            (() => {
              let z = ((e.draftLog[0] && e.draftLog[0].picks) || []).find((q) => q.id === d.id);
              z && (z.ret = !0);
            })(),
            Hs(e),
            Be(
              e,
              "He\u2019s staying",
              tst
                ? `${d.name} tested the waters, heard "${d.pick}" from pro teams and withdrew from the draft${ex ? ` after you added ${q(ex)} to his NIL deal` : ""}.`
                : `${d.name} turned down the draft and is coming back${ex ? ` after you added ${q(ex)} to his NIL deal` : ""}.`
            ));
        } else if (tst)
          ((d.status = "Turned pro"),
            W_alum(e, d.player, "Turned pro \xB7 undrafted"),
            e.departed.push(dep(d.player, "Turned pro \xB7 undrafted")),
            Be(e, "Turned pro", `${d.name} stayed in the draft after testing the waters and signed a pro contract.`));
        else
          ((d.status = "Drafted"),
            W_alum(e, d.player, `Drafted \xB7 ${d.pick}`),
            e.departed.push(dep(d.player, `Drafted \xB7 ${d.pick}`)),
            Be(
              e,
              "Drafted",
              `${d.name} left for the draft${a.stay ? " after you tried to keep him" : ""} (${d.pick}).`
            ));
      }
      break;
    }
    case "xferDecision": {
      Da(e, "Offseason");
      for (let id of a.ids || []) {
        let d = (e.xfers || []).find((l) => l.id === id && l.status === "pending");
        if (!d) continue;
        let ex = a.stay ? Math.max(0, Math.min(2e5, Math.round(a.extra || 0))) : 0,
          rl = ["Starter", "Rotation", "Bench"].includes(a.role) ? a.role : "None";
        if (ex > 0 && ex > Ce(e) + (d.player.nil || 0)) throw new Error("Not enough available NIL for that offer.");
        if (a.stay && rl === "Starter" && Xa(e) >= 5)
          throw new Error("Five players are already promised a starting role.");
        if (a.stay && (a.ids || []).length === 1 && ne(e) * 100 < le(d.chance + xBoost(d, ex, rl), 5, 95)) {
          if (e.roster.length >= 15)
            throw new Error("Your roster is full. Free up a spot before keeping him.");
          ((d.player.nil += ex),
            (d.player.promise = rl),
            e.roster.push(d.player),
            (d.status = "Returned"),
            Hs(e),
            Be(
              e,
              d.kind === "follow" ? "He\u2019s following you" : "He\u2019s staying",
              `${d.name} ${d.kind === "follow" ? "is following you" : "decided against the transfer portal"}${rl !== "None" ? ` after you promised a ${rl.toLowerCase()} role` : ""}.`
            ));
        } else
          ((d.status = "Left"),
            d.kind !== "follow" &&
              (W_alum(e, d.player, "Transferred"),
              W_userEntrant(e, d),
              e.departed.push(dep(d.player, `Transferred \u00B7 ${d.why}`)),
              Be(
                e,
                "Transfer portal",
                `${d.name} entered the transfer portal${a.stay ? " after you tried to keep him" : ""}.`
              )));
      }
      break;
    }
    case "setRole": {
      let t = e.roster.find((l) => l.id === a.id);
      if (!t || t.redshirt) throw new Error("Player not found.");
      let r = a.role;
      if (!["Starter", "Rotation", "Bench"].includes(r)) throw new Error("Choose a role.");
      if (r === "Starter") {
        if (t.injury > 0) throw new Error("He is injured.");
        if (e.lineup.includes(t.id)) break;
        let k = Le.indexOf(t.pos),
          o = e.roster.find((l) => l.id === e.lineup[k]);
        ((e.lineup[k] = t.id),
          (t.role = "Starter"),
          (t.minutes = Math.max(t.minutes, 26)),
          o && o.id !== t.id && ((o.role = "Rotation"), (o.minutes = Math.min(o.minutes || 15, 16))));
      } else {
        if (e.lineup.includes(t.id)) {
          let k = e.lineup.indexOf(t.id),
            b = e.roster
              .filter((l) => !l.redshirt && !l.injury && !e.lineup.includes(l.id))
              .sort((x, y) => qf(y, Le[k]) - qf(x, Le[k]))[0];
          if (!b) throw new Error("You need someone to take his place in the starting five.");
          ((e.lineup[k] = b.id), (b.role = "Starter"), (b.minutes = Math.max(b.minutes, 26)));
        }
        ((t.role = r), (t.minutes = r === "Rotation" ? 15 : 6));
      }
      break;
    }
    case "pitch": {
      Da(e, "Offseason");
      let t = Ba(e, a.id, !0);
      if (t.status !== "Available") throw new Error("This player has already made a decision.");
      if (e.round > 8) throw new Error("Recruiting visits are closed.");
      let K = {
          "Playing time": "time",
          Development: "dev",
          Winning: "win",
          NIL: "nil",
          Coaching: "coach",
          "Close to home": "home",
        },
        k = K[a.kind];
      if (!k) throw new Error("Choose a pitch.");
      t.pitched = t.pitched || {};
      if (t.pitched[a.kind]) throw new Error("You already made that pitch to him.");
      if (e.scouts < 1) throw new Error("No scouting visits remaining.");
      let w = (t.prefs || {})[k] || 0,
        g = k === "home" && t.home !== regOf(e) ? 1 : Math.round(3 + w * 0.28);
      (e.scouts--,
        (t.pitched[a.kind] = 1),
        ((t.rv || (t.rv = rivalsOf(e, t))).sort((x, y) => y.s - x.s)[0].s += 2),
        (t.target = !0),
        (t.interest = le(t.interest + g, 0, 99)),
        (t.progress = le(t.progress + Math.round(g / 2), 0, 99)),
        Be(
          e,
          "Recruiting pitch",
          `${t.name} ${w >= 20 ? "loved" : w >= 12 ? "liked" : "shrugged at"} your pitch about ${a.kind.toLowerCase()} (+${g} interest).`
        ));
      break;
    }
    case "rankRecruit": {
      let t = Ba(e, a.id, !0),
        r = Math.max(0, Math.min(3, Math.round(a.rank || 0)));
      (r &&
        e.prospects.forEach((q) => {
          q.rank === r && (q.rank = 0);
        }),
        (t.rank = r));
      break;
    }
    case "changePos": {
      let t = e.roster.find((l) => l.id === a.id);
      if (!t || !Le.includes(a.pos) || a.pos === t.pos) throw new Error("Choose a different position.");
      ((t.pos2 = t.pos),
        (t.pos = a.pos),
        (t.adj = 10),
        Be(
          e,
          "Position change",
          `${t.name} is moving to ${a.pos}. It will take about ten games to adjust, and the results are not guaranteed.`
        ));
      break;
    }
    case "negotiate": {
      let n = (e.negs || []).find((l) => l.id === a.id),
        t = e.roster.find((l) => l.id === a.id);
      if (!n || !t) throw new Error("That negotiation is over.");
      if (a.accept) {
        if (t.ask - t.nil > Ce(e)) throw new Error("You do not have enough available NIL for that raise.");
        ((t.nil = t.ask),
          (t.morale = le(t.morale + 6, 5, 99)),
          Be(e, "Contract talks", `${t.name} signed a raise to ${q(t.nil)} a year.`));
      } else
        ((t.morale = le(t.morale - (t.pers === "Money-focused" ? 10 : 6), 5, 99)),
          Be(e, "Contract talks", `${t.name} was not happy that you turned down his request.`));
      e.negs = e.negs.filter((l) => l.id !== a.id);
      break;
    }
    case "negotiateAll": {
      for (let n of [...(e.negs || [])])
        e.roster.some((l) => l.id === n.id) && fy(e, { type: "negotiate", id: n.id, accept: !1 });
      e.negs = [];
      break;
    }
    case "setDiff": {
      ["relaxed", "normal", "hardcore"].includes(a.value) && (e.diff = a.value);
      break;
    }
    case "liveStart": {
      if (e.phase !== "Regular season") throw new Error("Live games are for the regular season.");
      if (e.live) throw new Error("A live game is already in progress.");
      let g = e.schedule.find((o) => !o.played);
      if (!g) throw new Error("No game to play.");
      // pause: also stop at your own timeouts (Game Day), not only at halftime
      (a.auto && oy(e), ny(e, g, { half: 1, pause: !!a.pause }));
      break;
    }
    case "liveSub": {
      // substitution at halftime or at one of your timeouts: swap two players' minutes (and the starting spot) for the rest of the game
      if (!e.live) throw new Error("Substitutions are made at halftime or a timeout of a live game.");
      let o = Ba(e, a.out),
        i = Ba(e, a.in);
      if (i.redshirt || i.injury > 0) throw new Error(i.name + " cannot play right now.");
      let m = o.minutes;
      ((o.minutes = i.minutes), (i.minutes = m));
      let k = e.lineup.indexOf(o.id);
      (k >= 0 && (e.lineup[k] = i.id),
        e.roster.forEach(
          (r) =>
            (r.role = r.redshirt ? "Redshirt" : e.lineup.includes(r.id) ? "Starter" : r.minutes > 8 ? "Rotation" : "Bench")
        ));
      break;
    }
    case "liveFinish": {
      // plays on from halftime or from one of your timeouts, up to the next stop (a timeout, halftime) or the final
      let g = e.schedule.find((o) => !o.played);
      if (!e.live || !g || e.live.gid !== g.id) throw new Error("No live game in progress.");
      ny(e, g, e.live.ph === "to" ? { resume: 1, pause: !!a.pause } : { half: 2, pause: !!a.pause });
      if (!g.played) break;
      // kept so Game Day can replay the game (saved with the career, so a reload keeps it)
      e.lastLive = { gid: g.id, log: e.live.log, n1: e.live.n1 || 0, h1: e.live.hb ?? e.live.done, h: e.live.h };
      (delete e.live, e.schedule.some((o) => !o.played) || bS(e));
      break;
    }
    case "applyJob": {
      if (!["Season review", "Offseason"].includes(e.phase))
        throw new Error("Job applications open after the season ends.");
      if (!(e.vac || []).includes(a.school)) throw new Error("That job is no longer open.");
      let h = Xl.find((z) => z.id === a.school),
        ch = le(
          Math.round(35 + (e.rep - h.rep) * 1.6 + e.history.filter((x) => x.wins >= 20).length * 3),
          5,
          90
        );
      if (ne(e) * 100 < ch) {
        ((e.jobOffers = e.jobOffers || []).includes(h.id) || e.jobOffers.push(h.id),
          Be(e, "Job offer", `${h.name} offered you their head coaching job.`));
      } else
        (Be(e, "Job application", `${h.name} hired someone else.`),
          (e.vac = e.vac.filter((z) => z !== h.id)));
      break;
    }
    case "cut": {
      if (e.live) throw new Error("Finish the live game first.");
      let t = Ba(e, a.id),
        ins = e.phase !== "Offseason";
      // during the season the team still has to field a rotation
      if (ins && e.roster.filter((l) => !l.redshirt && l.id !== t.id).length < 8)
        throw new Error("You need at least 8 active players during the season. Activate a redshirt first.");
      ((e.roster = e.roster.filter((l) => l.id !== t.id)),
        (e.lineup = e.lineup.map((l) => (l === t.id ? "" : l))),
        Be(
          e,
          "Player released",
          `${t.name} was cut from the roster. ${q(t.nil)} in NIL was returned to your budget.`
        ),
        ins &&
          (e.lineup.includes("")
            ? Hs(e)
            : (() => {
                // hand his minutes to the rest of the rotation, one at a time
                let rot = e.roster.filter((l) => !l.redshirt && l.minutes > 0);
                rot.length || (rot = e.roster.filter((l) => !l.redshirt));
                for (let m = t.minutes, k = 0; m > 0 && k < 400; k++) {
                  let p = rot[k % rot.length];
                  p.minutes < 40 && (p.minutes++, m--);
                }
              })()));
      break;
    }
    case "release": {
      // Item 44: release a player into the portal to open a roster spot. The first release is free; each one after
      // that costs reputation (the number released so far) and the rest of the team loses morale and chemistry.
      Da(e, "Offseason");
      if (!(e.pw >= 1 && e.pw <= 3))
        throw new Error("You can release a player into the portal only while the portal window is open.");
      let t = e.roster.find((l) => l.id === a.id);
      if (!t) throw new Error("Player not found.");
      if (e.roster.length <= 8) throw new Error("You need at least 8 players.");
      ((e.roster = e.roster.filter((l) => l.id !== t.id)),
        (e.lineup = e.lineup.map((l) => (l === t.id ? "" : l))),
        W_alum(e, t, "Released into the portal"),
        e.departed.push(dep(t, "Released into the portal")),
        W_userEntrant(e, { player: t, why: "Released by the coach" }),
        (e.rel = (e.rel || 0) + 1));
      if (e.rel >= 2) {
        e.rep = le(e.rep - e.rel, 0, 100);
        e.roster.forEach((l) => (l.morale = le(l.morale - 3, 5, 100)));
        e.chemistry = Math.max(25, e.chemistry - 2);
      }
      Be(
        e,
        "Released into the portal",
        e.rel >= 2
          ? `${t.name} was released into the transfer portal. Releasing ${e.rel} players cost you ${e.rel} reputation and the team lost morale.`
          : `${t.name} was released into the transfer portal. The first release this offseason has no penalty.`
      );
      break;
    }
    case "shotPriority": {
      // The players to feed the ball to, in order (up to five). An empty list is the normal game.
      let ids = [];
      for (let id of Array.isArray(a.ids) ? a.ids : []) {
        id = String(id);
        if (id && !ids.includes(id) && e.roster.some((p) => p.id === id)) ids.push(id);
      }
      e.shotPriority = ids.slice(0, 5);
      break;
    }
    case "tactics": {
      let t = String(a.key),
        l = String(a.value);
      if (
        !{
          offense: ["Balanced", "Perimeter", "Inside-out"],
          defense: ["Man-to-man", "2\u20133 zone", "Full-court press"],
          pace: ["Slow", "Balanced", "Fast"],
          tmo: ["Quick", "Normal", "Save"],
        }[t]?.includes(l)
      )
        throw new Error("Choose a valid coaching system.");
      ((e.tactics[t] = l), ["offense", "defense", "pace"].includes(t) && (e.tacLock = { ...e.tacLock, [t]: !0 }));
      break;
    }
    case "tacticsMode": {
      let t = String(a.key);
      if (!["offense", "defense", "pace"].includes(t)) throw new Error("Choose a valid coaching system.");
      if (a.keep) e.tacLock = { ...e.tacLock, [t]: !0 };
      else {
        let l = { ...e.tacLock };
        (delete l[t], (e.tacLock = l), W_autoTactics(e));
      }
      break;
    }
    case "schedule": {
      Da(e, "Offseason");
      let t = ho(a.index, 0, 11),
        l = e.opponents.find((d) => d.id === a.teamId);
      if (!l) throw new Error("Choose an opponent.");
      if (e.nc[t].rd === 2 && e.nc[t].event) throw new Error("The second game of an event is decided by the first one.");
      let u = String(a.venue);
      if (!["Home", "Away", "Neutral"].includes(u)) throw new Error("Choose a venue.");
      let o = a.guarantee === void 0 ? !!e.nc[t].guarantee : !!a.guarantee,
        r = o && u === "Away" ? Xf(l, Ps(e)) : 0;
      if (o && a.guarantee === !0 && !r)
        throw new Error(
          `Guarantee games need a road game against an opponent rated at least ${Ps(e) + 15} (15 above your team overall of ${Ps(e)}).`
        );
      if (r && e.nc.some((d, f) => f !== t && d.teamId === l.id))
        throw new Error("Each guarantee opponent can only be booked once per season.");
      if (e.nc.some((d, f) => f !== t && d.teamId === l.id && d.guarantee))
        throw new Error("This opponent is already contracted for a guarantee game.");
      let n = e.guaranteeIncome - (e.nc[t].guarantee || 0) + r,
        i = e.baseBudget + n;
      // Only a change that lowers guarantee income can break a commitment. A team in debt may still move games around, drop a home game for
      // another, or add a guarantee game (which brings money in).
      if (n < e.guaranteeIncome && i < go(e) + kt(e))
        throw new Error(
          "That guarantee money is already committed. Withdraw offers before reducing schedule income."
        );
      ((e.nc[t] = { teamId: l.id, venue: u, guarantee: r, ...(u === "Neutral" && e.nc[t].event ? { event: e.nc[t].event, rd: e.nc[t].rd } : {}) }),
        (e.ncCustom = !0),
        (e.guaranteeIncome = n),
        (e.budget = i),
        Zf(e));
      break;
    }
    case "startSeason": {
      chkDraft(e);
      Da(e, "Offseason");
      // the portal window must be closed before the season starts (its last waves decide every entrant)
      for (; e.pw >= 1 && e.pw <= 3;) W_pwave(e);
      if (a.finish && e.round <= 9) for (; e.round <= 9;) my(e);
      if ((a.auto && (oy(e), apr(e)), e.roster.filter((t) => !t.redshirt).length < 8))
        throw new Error("You need at least 8 active players. Recruit players or add walk-ons.");
      {
        let np = e.roster.filter((t) => !t.redshirt && (!t.promise || t.promise === "None"));
        if (np.length)
          throw new Error(
            `Promise a role to every active player before the season starts. Still missing: ${np
              .slice(0, 3)
              .map((t) => t.name)
              .join(", ")}${np.length > 3 ? ` and ${np.length - 3} more` : ""}.`
          );
      }
      if (
        e.lineup.length !== 5 ||
        new Set(e.lineup).size !== 5 ||
        e.lineup.some((t) => !e.roster.some((l) => l.id === t && !l.redshirt))
      )
        throw new Error("Assign all five starting positions.");
      if (e.roster.reduce((t, l) => t + l.minutes, 0) !== 200)
        throw new Error(
          "Your rotation must total exactly 200 minutes. Use Auto-set coaching for a quick setup."
        );
      if (kt(e) > 0 || e.prospects.some((t) => t.offer && t.status === "Available"))
        throw new Error("Resolve or withdraw outstanding recruiting offers first.");
      W_sched(e);
      ((() => {
        let all = W_all(e).sort((x, y) => W_score(y) - W_score(x)),
          me = Ps(e);
        e.pre = {
          nat: all.findIndex((t) => t.id === e.school.id) + 1,
          conf: e.league.filter((t) => t.id !== e.school.id && t.rating > me).length + 1,
          n: e.league.length,
          goal: _s(e),
        };
      })(),
        (e.phase = "Regular season"),
        (e.round = 9),
        Be(
          e,
          "Opening night",
          `${e.school.name} begin their ${e.year}\u2013${String(e.year + 1).slice(2)} campaign. Your goal: ${_s(e)} wins.`
        ),
        (e.nwin = null));
      break;
    }
    case "courtFinish":
      W_saveCourt(e, a);
      break;
    case "sim": {
      if (e.live) throw new Error("Finish the live game first.");
      if (!["Regular season", "Conference tournament", "National tournament"].includes(e.phase))
        throw new Error("Start your season before simulating.");
      a.auto && oy(e);
      let t = a.count === "season" ? 50 : ho(a.count || 1, 1, 7);
      for (let l = 0; l < t; l++)
        if (e.phase === "Regular season") {
          let u = e.schedule.find((o) => !o.played);
          a.every && l > 0 && oy(e);
          if ((u && ny(e, u), !e.schedule.some((o) => !o.played))) {
            bS(e);
            break;
          }
        } else if (e.phase.includes("tournament")) {
          AS(e);
          break;
        } else break;
      break;
    }
    case "nextYear": {
      if (e.fired) throw new Error("You have been fired. Start a new career to keep coaching.");
      (Da(e, "Season review"), wS(e));
      break;
    }
    default:
      throw new Error("Unknown game action.");
  }
  return e;
}
