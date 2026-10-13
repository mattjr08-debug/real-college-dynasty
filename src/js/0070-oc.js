function oc() {
  let [e, a] = (0, N.useState)(null),
    [t, l] = (0, N.useState)(0),
    [u, o] = (0, N.useState)(!1),
    [r, n] = (0, N.useState)(!1),
    [i, d] = (0, N.useState)(""),
    [f, y] = (0, N.useState)(!1),
    [h, p] = (0, N.useState)(""),
    [C, v] = (0, N.useState)("HQ"),
    [M, m] = (0, N.useState)(null),
    [c, L] = (0, N.useState)(null),
    [g, I] = (0, N.useState)(!1),
    [G, w] = (0, N.useState)(!1),
    [D, B] = (0, N.useState)(!1),
    [W, Ta] = (0, N.useState)(!1),
    [fu, Qs] = (0, N.useState)([]),
    [lostRec, setLostRec] = (0, N.useState)([]),
    [seasonView, setSeasonView] = (0, N.useState)(!1),
    [tourAlert, setTourAlert] = (0, N.useState)(null),
    [injAlert, setInjAlert] = (0, N.useState)([]),
    [offersOpen, setOffersOpen] = (0, N.useState)(!1),
    offersShown = (0, N.useRef)(""),
    [moveOpen, setMoveOpen] = (0, N.useState)(!1),
    [awardsOpen, setAwardsOpen] = (0, N.useState)(!1),
    [draftOpen, setDraftOpen] = (0, N.useState)(!1),
    [draftExtra, setDraftExtra] = (0, N.useState)({}),
    [elimAlert, setElimAlert] = (0, N.useState)(null),
    [champOpen, setChampOpen] = (0, N.useState)(!1),
    [xferOpen, setXferOpen] = (0, N.useState)(!1),
    [negOpen, setNegOpen] = (0, N.useState)(!1),
    [liveOpen, setLiveOpen] = (0, N.useState)(!1),
    [courtOpen, setCourtOpen] = (0, N.useState)(!1),
    [tutStep, setTutStep] = (0, N.useState)(CFG.tut === "done" ? -1 : 0),
    [xferExtra, setXferExtra] = (0, N.useState)({}),
    [xferRole, setXferRole] = (0, N.useState)({}),
    [retAlert, setRetAlert] = (0, N.useState)([]),
    [seasonTab, setSeasonTab] = (0, N.useState)("Games"),
    [coachOpen, setCoachOpen] = (0, N.useState)(!1),
    [teamViewId, setTeamViewId] = (0, N.useState)(null),
    [fpl, setFpl] = (0, N.useState)(null),
    [startAsk, setStartAsk] = (0, N.useState)(!1),
    [startOpts, setStartOpts] = (0, N.useState)({ auto: !0, fin: !0 }),
    [simAsk, setSimAsk] = (0, N.useState)(null),
    [winAlert, setWinAlert] = (0, N.useState)(null),
    [openedAlert, setOpenedAlert] = (0, N.useState)(null),
    Yn = (0, N.useRef)(!1),
    Ll = (0, N.useRef)(null),
    wo = async () => {
      y(!1);
      try {
        let z = await tc("/api/career", { cache: "no-store" }),
          ve = await z.json();
        if (!z.ok) throw new Error(ve.error);
        (a(ve.game), l(ve.revision), p(ve.savedAt || ""), o(!0), d(""), (Ll.current = null));
      } catch (z) {
        (d(z instanceof Error ? z.message : "Could not load career."), y(!0), o(!0));
      }
    };
  (0, N.useEffect)(() => {
    // Job offers pop-up: once for each new set of offers, also after a reload (it used to appear only when offers arrived during this session)
    const key = e?.jobOffers?.length ? `${e.year}:${e.jobOffers.join(",")}` : "";
    if (key && key !== offersShown.current && CFG.pop.offers && !e?.fired) { offersShown.current = key; setOffersOpen(!0); }   // when fired, the fired window lists the offers itself
    if (!key) offersShown.current = "";
  }, [e?.jobOffers?.join(","), e?.year]);
  (0, N.useEffect)(() => {
    wo();
  }, []);
  let sc = async (z) => {
      if (Yn.current) return !1;
      ((Yn.current = !0), n(!0), d(""));
      try {
        let ve = await tc("/api/career", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(z),
          }),
          $a = await ve.json();
        if (!ve.ok)
          throw (ve.status === 400 && (Ll.current = null), new Error($a.error || "Could not save action."));
        try {
          e &&
            z.action.type !== "create" &&
            ((window.__undo = JSON.stringify({ game: e, revision: 0, savedAt: new Date().toISOString() })),
            (window.__undoLabel = z.action.type));
        } catch {}
        let jy = new Set(e?.signingEvents.map((Kn) => Kn.id) || []),
          nc = z.action.type === "create" ? [] : $a.game?.signingEvents.filter((Kn) => !jy.has(Kn.id)) || [];
        let lostNew = [...$a.game.prospects, ...$a.game.walkons]
          .map((Kn) => {
            let o = [...(e?.prospects || []), ...(e?.walkons || [])].find((Ln) => Ln.id === Kn.id);
            return o &&
              o.status === "Available" &&
              (o.target || o.offer) &&
              (Kn.status === "Committed elsewhere" || Kn.status === "Declined")
              ? {
                  id: Kn.id,
                  name: Kn.name,
                  pos: Kn.pos,
                  origin: Kn.origin,
                  rating: Tt(Kn),
                  stars: Kn.stars,
                  where:
                    Kn.status === "Declined"
                      ? "Declined your walk-on invitation"
                      : `Committed to ${Kn.committedTo || "another school"}`,
                  offer: o.offer ? o.offer.nil : 0,
                  round: Kn.decisionRound,
                }
              : null;
          })
          .filter(Boolean);
        let tA = null,
          iA = [],
          mvA = !1,
          awA = !1,
          drA = !1,
          elA = null,
          chA = !1,
          xfA = !1,
          rtA = [],
          wnA = null,
          opA = null;
        if (
          (e &&
            $a.game.school.id !== e.school.id &&
            ($a.game.xfers || []).some((d) => d.status === "pending") &&
            CFG.pop.xfer &&
            setXferOpen(!0),
          e && $a.game.school.id === e.school.id)
        ) {
          let ng = $a.game;
          (ng.nwin &&
            (!e.nwin || e.nwin.round !== ng.nwin.round) &&
            ng.nwin.round !== "Championship" &&
            (wnA = ng.nwin),
            e.phase === "Offseason" &&
              ng.phase === "Regular season" &&
              (opA = {
                goal: _s(ng),
                conf: ng.school.league,
                pre: ng.pre,
                first: ng.schedule[0],
                sos: Math.round(
                  ng.schedule
                    .filter((f) => ["Nonconference", "Conference"].includes(f.kind))
                    .reduce((x, f) => x + f.rating, 0) /
                    Math.max(
                      1,
                      ng.schedule.filter((f) => ["Nonconference", "Conference"].includes(f.kind)).length
                    )
                ),
                me: Ps(ng),
              }),
            ng.elim && !e.elim && (elA = ng.elim),
            ng.phase === "Season review" &&
              e.phase !== "Season review" &&
              ng.result === "National champions" &&
              (chA = !0),
            ng.phase === "Offseason" &&
              e.phase !== "Offseason" &&
              ((ng.xfers || []).some((d) => d.status === "pending") && (xfA = !0),
              (ng.negs || []).length && setNegOpen(!0)),
            ["Regular season", "Conference tournament", "National tournament"].includes(ng.phase) &&
              (rtA = ng.roster
                .filter((p) => p.injury === 0 && e.roster.find((o) => o.id === p.id && !o.susp)?.injury > 0)
                .map((p) => ({
                  id: p.id,
                  name: p.name,
                  pos: p.pos,
                  ovr: p.ovr,
                  starter: ng.lineup.includes(p.id),
                }))));
          (ng.phase === "Season review" &&
            e.phase !== "Season review" &&
            ng.history.at(-1)?.awards?.length &&
            (awA = !0),
            ng.phase === "Offseason" &&
              e.phase !== "Offseason" &&
              ((ng.draft || []).length || (ng.departed || []).some((d) => /^Drafted/.test(d.reason))) &&
              (drA = !0));
          ng.phase === "Offseason" && e.phase !== "Offseason" && moveInfo(ng) && (mvA = !0);
          if (ng.phase !== e.phase) {
            if (ng.phase === "Conference tournament") {
              let sd =
                  Qf(ng)
                    .slice(0, ng.league.length >= 12 ? 12 : 8)
                    .findIndex((Kn) => Kn.id === ng.school.id) + 1,
                gm = [...ng.bracket[0], ...(ng.bracket[1] || [])].find((Kn) => Kn.a.id === ng.school.id || Kn.b.id === ng.school.id),
                op = gm ? (gm.a.id === ng.school.id ? gm.b : gm.a) : null;
              tA = {
                kind: "Conference",
                title: "You\u2019re in the conference tournament",
                line: `#${sd} seed \u00B7 three wins from the title`,
                seed: sd,
                opR: op?.rating,
                me: Ps(ng),
                opp: op?.name,
                body: "Win three games to cut down the nets and lock up an automatic national tournament berth.",
              };
            } else if (ng.phase === "National tournament") {
              let op = ng.bracket[0]?.[0]?.ff
                ? (() => {
                    let gm = [...ng.bracket[0], ...(ng.bracket[1] || [])].find(
                      (Kn) => Kn.a.id === ng.school.id || Kn.b.id === ng.school.id
                    );
                    return gm && (gm.a.id === ng.school.id ? gm.b : gm.a);
                  })()
                : ng.tournament === "NIT"
                  ? (() => {
                      let gm = ng.bracket[0]?.find((Kn) => Kn.a.id === ng.school.id || Kn.b.id === ng.school.id);
                      return gm && (gm.a.id === ng.school.id ? gm.b : gm.a);
                    })()
                  : ng.bracket[0]?.[0]?.b;
              tA = {
                kind: ng.tournament === "NIT" ? "NIT" : "National",
                title: ng.tournament === "NIT" ? "You\u2019re in the NIT" : "You\u2019re going dancing",
                line: ng.berth,
                seed: ng.seedMap?.[ng.school.id],
                opR: op?.rating,
                me: Ps(ng),
                opp: op?.name,
                body:
                  ng.tournament === "NIT"
                    ? "Five wins make you NIT champions. One loss ends the run."
                    : "Six wins from a national championship. One loss ends the run.",
              };
            }
          }
          if (["Regular season", "Conference tournament", "National tournament"].includes(ng.phase))
            iA = ng.roster
              .filter((Kn) => Kn.injury > 0 && !Kn.susp && !(e.roster.find((Ln) => Ln.id === Kn.id)?.injury > 0))
              .map((Kn) => ({
                id: Kn.id,
                name: Kn.name,
                pos: Kn.pos,
                ovr: Kn.ovr,
                games: Kn.injury,
                starter: ng.lineup.includes(Kn.id),
              }));
        }
        return (
          nc.length && (m(null), Qs(nc), Sfx.p("sign")),
          e &&
            $a.game.school.id === e.school.id &&
            (() => {
              let a1 = e.schedule.filter((f) => f.played).length,
                g2 = $a.game.schedule.filter((f) => f.played),
                a2 = g2.length;
              a2 > a1 && Sfx.p(g2[a2 - 1].win ? "win" : "loss");
            })(),
          chA ? Sfx.p("fanfare") : elA ? Sfx.p("buzzer") : iA.length && Sfx.p("whistle"),
          lostNew.length && CFG.pop.lost && setLostRec(lostNew),
          tA && CFG.pop.tour && setTourAlert(tA),
          iA.length && CFG.pop.injury && setInjAlert(iA),
          mvA && CFG.pop.move && setMoveOpen(!0),
          awA && CFG.pop.awards && setAwardsOpen(!0),
          drA && CFG.pop.draft && setDraftOpen(!0),
          elA && CFG.pop.elim && setElimAlert(elA),
          chA && CFG.pop.champ && setChampOpen(!0),
          // item 59: a portal withdrawal waiting for Accept / Deny opens the same pop-up
          (xfA ||
            ($a.game.prospects.some((Kn) => Kn.wb && Kn.status === "Available") &&
              !(e?.prospects || []).some((Kn) => Kn.wb && Kn.status === "Available"))) &&
            CFG.pop.xfer &&
            setXferOpen(!0),
          rtA.length && CFG.pop.ret && setRetAlert(rtA),
          wnA && CFG.pop.win && setWinAlert(wnA),
          opA && CFG.pop.start && setOpenedAlert(opA),
          $a.game.jobOffers?.length && !e?.jobOffers?.length && CFG.pop.offers && setOffersOpen(!0),
          a($a.game),
          l($a.revision),
          p($a.savedAt),
          (Ll.current = null),
          !0
        );
      } catch (ve) {
        return (
          d(
            ve instanceof Error ? ve.message : "Connection interrupted. Retry to safely complete the action."
          ),
          !1
        );
      } finally {
        ((Yn.current = !1), n(!1));
      }
    },
    Xe = async (z) => {
      if (Ll.current) return (d("Retry or reload the previous action before continuing."), !1);
      // Settings > Game > "Always auto-set coaching": re-optimize before every game
      CFG.autoCoach &&
        (z.type === "sim" || z.type === "liveStart" || z.type === "startSeason") &&
        (z = { ...z, auto: !0, every: !0 });
      CFG.autoScout && z.type === "recruitRound" && (z = { ...z, autoScout: !0 });
      ["autoCoach", "minPreset", "autoRotation", "rotSize"].includes(z.type) && (window.__minDirty = !1);
      let ve = {
        action: z,
        revision: t,
        requestId:
          typeof crypto.randomUUID == "function" ? crypto.randomUUID() : Date.now() + "-" + Math.random(),
      };
      return ((Ll.current = ve), sc(ve));
    };
  gy(e, Xe);
  (window.__favs = new Set((e && e.favPlayers) || []), (window.__favRun = Xe)); // the star on player boxes reads and toggles favorites through these
  let cu = (z) => {
      // after you change minutes by hand, Coaching only lets you leave once they add up to 200
      if (e && C === "Rotation" && z !== "Rotation" && window.__minDirty) {
        let tot = e.roster.reduce((x, p) => x + p.minutes, 0);
        if (tot !== 200)
          return d(
            `Your rotation adds up to ${tot} of 200 minutes (${tot > 200 ? tot - 200 + " too many" : 200 - tot + " too few"}). Balance it to exactly 200, or pick a minutes plan, before leaving Coaching.`
          );
        window.__minDirty = !1;
      }
      (v(z), Ta(!1), i.startsWith("Your rotation adds up") && d(""));
    },
    askSim = (c) => {
      let inj = e.roster.filter((p) => p.injury > 0 && (e.lineup.includes(p.id) || p.minutes > 0));
      inj.length || c !== 1 ? setSimAsk({ c, inj: inj.map((p) => p.name) }) : Xe({ type: "sim", count: c });
    };
  if (!u)
    return (0, s.jsxs)("div", {
      className: "boot",
      children: [
        (0, s.jsx)(It, { size: 42 }),
        (0, s.jsx)("h1", { children: "COLLEGE DYNASTY" }),
        (0, s.jsx)("p", { children: "Opening the coach\u2019s office\u2026" }),
        (0, s.jsx)(Ga, { className: "spin" }),
      ],
    });
  if (f && !e)
    return (0, s.jsxs)("div", {
      className: "boot",
      children: [
        (0, s.jsx)(lc, {
          game: e,
          reload: () => {
            wo();
          },
          error: d,
        }),
        (0, s.jsx)(St, { size: 42 }),
        (0, s.jsx)("h1", { children: "CAREER UNAVAILABLE" }),
        (0, s.jsx)("p", { children: i }),
        (0, s.jsx)(X, {
          onClick: () => {
            wo();
          },
          primary: !0,
          children: "Retry loading",
        }),
        (0, s.jsx)(X, {
          onClick: () => {
            window.confirm(
              "Start a new career? The save that could not be opened will be set aside (not deleted) and you will pick a new school."
            ) && (clearBrokenSave(), wo());
          },
          children: "Start a new career",
        }),
      ],
    });
  let Qn =
      e &&
      (e.roster.find((z) => z.id === M) ||
        e.prospects.find((z) => z.id === M) ||
        e.walkons.find((z) => z.id === M)),
    rc = e?.schedule.find((z) => z.id === c);
  return (0, s.jsxs)(uc.Provider, {
    value: r,
    children: [
      (0, s.jsx)(lc, {
        game: e,
        reload: () => {
          (wo(), m(null), L(null), I(!1));
        },
        error: d,
      }),
      !e || g
        ? (0, s.jsx)(XC, {
            busy: r,
            existing: !!e,
            onCancel: () => I(!1),
            onStart: async (z, ve, $a) => {
              (await Xe({ type: "create", schoolId: z, coach: ve, specialty: $a })) && (I(!1), v("HQ"));
            },
          })
        : (0, s.jsxs)("div", {
            className: "app-shell",
            style: { "--team": e.school.color, "--on-team": onTeam(e.school.color) },
            children: [
              (0, s.jsxs)("aside", {
                className: `sidebar ${W ? "open" : ""}`,
                children: [
                  (0, s.jsxs)("a", {
                    className: "brand",
                    href: "#",
                    onClick: (z) => {
                      (z.preventDefault(), cu("HQ"));
                    },
                    children: [
                      (0, s.jsx)("div", { className: "brand-mark", children: (0, s.jsx)(It, { size: 30 }) }),
                      (0, s.jsxs)("div", {
                        children: ["DYNASTY", (0, s.jsx)("span", { children: "COLLEGE BASKETBALL" })],
                      }),
                    ],
                  }),
                  (0, s.jsxs)("div", {
                    className: "program-mini crest-hero",
                    children: [
                      (0, s.jsx)("div", {
                        className: "crest-big",
                        children: (0, s.jsx)(SchoolLogo, { school: e.school }),
                      }),
                      (0, s.jsxs)("div", {
                        className: "crest-name",
                        children: [
                          (0, s.jsx)("strong", { children: e.school.name }),
                          (0, s.jsx)("span", { children: e.school.mascot }),
                        ],
                      }),
                    ],
                  }),
                  (0, s.jsx)("p", { className: "nav-label", children: "YOUR PROGRAM" }),
                  (0, s.jsx)("nav", {
                    children: Py.filter((z) => !["Portal", "Board", "Walkons"].includes(z.id)).map((z) =>
                      (0, s.jsxs)(
                        "button",
                        {
                          className:
                            C === z.id ||
                            (z.id === "Recruiting" && ["Portal", "Board", "Walkons"].includes(C))
                              ? "active"
                              : "",
                          onClick: () => cu(z.id),
                          children: [
                            (0, s.jsx)(z.icon, { size: 19 }),
                            (0, s.jsx)("span", { children: z.label }),
                            z.id === "Roster" && (0, s.jsx)("small", { children: e.roster.length }),
                            z.id === "Recruiting" &&
                              e.prospects.some((ve) => ve.offer) &&
                              (0, s.jsx)("span", { className: "notification" }),
                          ],
                        },
                        z.id
                      )
                    ),
                  }),
                  (0, s.jsxs)("div", {
                    className: "coach-block",
                    role: "button",
                    tabIndex: 0,
                    title: "Coach accolades",
                    style: { cursor: "pointer" },
                    onClick: () => setCoachOpen(!0),
                    children: [
                      (0, s.jsx)("div", {
                        className: "coach-initial",
                        children: e.coach.replace("Coach ", "")[0],
                      }),
                      (0, s.jsxs)("div", {
                        children: [
                          (0, s.jsx)("em", { children: "HEAD COACH" }),
                          (0, s.jsx)("strong", { children: e.coach }),
                          (0, s.jsxs)("span", { children: [e.specialty, " \xB7 Level ", e.level] }),
                        ],
                      }),
                    ],
                  }),
                  (0, s.jsx)("button", {
                    className: "help-link",
                    onClick: () => B(!0),
                    children: "How to play",
                  }),
                  (0, s.jsx)("button", {
                    className: "help-link muted",
                    onClick: () => w(!0),
                    children: "New career",
                  }),
                ],
              }),
              (0, s.jsxs)("div", {
                className: "workspace",
                children: [
                  (0, s.jsxs)("header", {
                    className: "topbar",
                    children: [
                      (0, s.jsxs)("div", {
                        className: "topbar-left",
                        children: [
                          (0, s.jsx)("button", {
                            className: "icon-btn mobile-only",
                            onClick: () => Ta(!W),
                            "aria-label": "Toggle navigation",
                            children: (0, s.jsx)(Os, { size: 23 }),
                          }),
                          (0, s.jsxs)("div", {
                            className: "score-bug",
                            children: [
                              (0, s.jsxs)("span", {
                                className: "season-tag",
                                children: [e.year, "\u2014", String(e.year + 1).slice(2)],
                              }),
                              (0, s.jsx)("span", { className: "bug-phase", children: e.phase }),
                              (0, s.jsxs)("span", {
                                className: "bug-record",
                                title: e.phase === "Offseason" ? "Last season's record" : "Overall record",
                                children: [
                                  (0, s.jsx)("small", { children: e.phase === "Offseason" ? "LAST" : "REC" }),
                                  (() => {
                                    const rc2 = e.phase === "Offseason" ? W_lastRecord(e) : dl(e);
                                    return rc2 ? `${rc2.wins}\u2013${rc2.losses}` : "\u2013";
                                  })(),
                                ],
                              }),
                            ],
                          }),
                          e.phase === "Offseason" &&
                            (0, s.jsxs)(he, {
                              tone: "orange",
                              children:
                                e.pw >= 1 && e.pw <= 3
                                  ? ["PORTAL WAVE ", e.pw, " / 3"]
                                  : e.round === 9
                                    ? "LAST CHANCE"
                                    : ["ROUND ", Math.min(8, e.round), " / 8"],
                            }),
                        ],
                      }),
                      (0, s.jsxs)("div", {
                        className: "save-status",
                        title: h ? `Last saved ${new Date(h).toLocaleString()}` : "",
                        children: [
                          r ? (0, s.jsx)(Ga, { size: 15, className: "spin" }) : (0, s.jsx)(Ct, { size: 15 }),
                          (0, s.jsx)("span", { children: r ? "Saving\u2026" : Oy() }),
                        ],
                      }),
                    ],
                  }),
                  (0, s.jsxs)("main", {
                    className: "main",
                    children: [
                      (0, s.jsxs)("div", {
                        className: "page-heading",
                        children: [
                          (0, s.jsxs)("div", {
                            children: [
                              (0, s.jsxs)("p", {
                                className: "eyebrow",
                                children: [e.school.league, " / ", e.school.mascot],
                              }),
                              (0, s.jsx)("h1", { children: Py.find((z) => z.id === C)?.label }),
                            ],
                          }),
                          (0, s.jsx)("div", {
                            className: "heading-actions",
                            children: (0, s.jsxs)(s.Fragment, {children: [
                              W_courtGame(e) && !e.live && (0, s.jsx)(X, {primary: !0,
                                onClick: () => setCourtOpen(!0), children: "Play Game"}),
                              e.phase === "Offseason"
                                ? (0, s.jsxs)(s.Fragment, {
                                    children: [
                                      (0, s.jsx)(X, {
                                        onClick: () => cu("Schedule"),
                                        children: "View schedule",
                                      }),
                                      (0, s.jsxs)(X, {
                                        primary: !0,
                                        onClick: () => setStartAsk(!0),
                                        children: [(0, s.jsx)(bt, { size: 16 }), "Begin season"],
                                      }),
                                    ],
                                  })
                                : e.phase === "Season review"
                                  ? (0, s.jsx)(X, {
                                      primary: !0,
                                      onClick: () => {
                                        Xe({ type: "nextYear" });
                                      },
                                      children: "Next offseason",
                                    })
                                  : (0, s.jsxs)(X, {
                                      primary: !0,
                                      onClick: () => askSim(1),
                                      children: [
                                        (0, s.jsx)(bt, { size: 16 }),
                                        e.phase.includes("tournament") ? "Play next round" : "Sim next game",
                                      ],
                                    }),
                            ]}),
                          }),
                        ],
                      }),
                      C === "HQ" &&
                        (0, s.jsx)(ZC, {
                          g: e,
                          run: Xe,
                          navigate: cu,
                          select: m,
                          openBox: L,
                          openSeason: () => {
                            (setSeasonTab("Games"), setSeasonView(!0));
                          },
                          openOffers: () => setOffersOpen(!0),
                          openMove: () => setMoveOpen(!0),
                          openDraft: () => setDraftOpen(!0),
                          openXfer: () => setXferOpen(!0),
                          openNeg: () => setNegOpen(!0),
                        }),
                      C === "Roster" && (0, s.jsx)(YC, { g: e, select: m, run: Xe, navigate: cu }),
                      ["Recruiting", "Portal", "Board", "Walkons"].includes(C) &&
                        (0, s.jsx)("div", {
                          className: "toolbar",
                          children: (0, s.jsx)("div", {
                            className: "chips",
                            children: [
                              ["Recruiting", "High school"],
                              ["Portal", "Transfer portal"],
                              ["Board", "My recruits"],
                              ["Walkons", "Walk-on pool"],
                            ].map(([n, l]) =>
                              (0, s.jsx)(
                                "button",
                                { className: C === n ? "active" : "", onClick: () => cu(n), children: l },
                                n
                              )
                            ),
                          }),
                        }),
                      (C === "Recruiting" || C === "Portal") &&
                        (0, s.jsx)(
                          QC,
                          { g: e, source: C === "Portal" ? "Transfer" : "High school", run: Xe, select: m },
                          C
                        ),
                      C === "Board" && (0, s.jsx)(u0, { g: e, run: Xe, select: m }),
                      C === "Walkons" && (0, s.jsx)(o0, { g: e, run: Xe, select: m }),
                      C === "Rotation" && (0, s.jsx)(KC, { g: e, run: Xe, select: m }),
                      C === "Schedule" && (0, s.jsx)(JC, { g: e, run: Xe, openBox: L }),
                      C === "Season" &&
                        (0, s.jsx)($C, {
                          g: e,
                          run: Xe,
                          openBox: L,
                          select: m,
                          askSim: askSim,
                          openLive: () => setLiveOpen(!0),
                        }),
                      C === "NIL" && (0, s.jsx)(e0, { g: e, select: m, run: Xe }),
                      C === "History" && (0, s.jsx)(a0, { g: e, run: Xe }),
                      C === "News" && (0, s.jsx)(NewsPage, { g: e, run: Xe }),
                      C === "Settings" && (0, s.jsx)(SettingsPage, { g: e, run: Xe }),
                    ],
                  }),
                  (0, s.jsxs)("footer", {
                    className: "footer",
                    children: [
                      (0, s.jsx)("span", { children: "COLLEGE DYNASTY" }),
                      (0, s.jsx)("span", { children: "Real programs. Your legacy." }),
                    ],
                  }),
                ],
              }),
            ],
          }),
      i &&
        (0, s.jsxs)("div", {
          className: "error-toast",
          role: "alert",
          children: [
            (0, s.jsx)(St, { size: 20 }),
            (0, s.jsxs)("div", {
              children: [
                i,
                (0, s.jsxs)("div", {
                  className: "row gap",
                  children: [
                    i.includes("Promise a role to every active player") &&
                      (0, s.jsx)(X, {
                        small: !0,
                        primary: !0,
                        onClick: () => {
                          Xe({ type: "autoPromise" });
                        },
                        children: "Auto-promise the rest",
                      }),
                    Ll.current &&
                      (0, s.jsx)(X, {
                        small: !0,
                        onClick: () => {
                          sc(Ll.current);
                        },
                        children: "Retry action",
                      }),
                    (0, s.jsx)(X, {
                      small: !0,
                      onClick: () => {
                        wo();
                      },
                      children: "Reload career",
                    }),
                  ],
                }),
              ],
            }),
            (0, s.jsx)("button", {
              "aria-label": "Dismiss error",
              className: "icon-btn",
              onClick: () => d(""),
              children: (0, s.jsx)(mo, { size: 18 }),
            }),
          ],
        }),
      Qn && e && (0, s.jsx)(t0, { p: Qn, g: e, run: Xe, select: m, onClose: () => m(null) }, Qn.id),
      rc &&
        e &&
        (0, s.jsx)(l0, {
          m: rc,
          g: e,
          select: (z) => {
            (L(null), m(z));
          },
          onClose: () => L(null),
        }),
      fu.length > 0 &&
        e &&
        (0, s.jsx)(Ao, {
          title: "Commitment secured",
          onClose: () => Qs([]),
          wide: !0,
          children: (0, s.jsxs)("div", {
            className: "commit-celebration",
            children: [
              (0, s.jsx)("div", {
                className: "celebration-confetti",
                "aria-hidden": "true",
                children: "\u2726 \u2022 \u2726 \u2022 \u2726",
              }),
              (0, s.jsx)(ba, { size: 44 }),
              (0, s.jsxs)("p", { className: "eyebrow", children: ["WELCOME TO ", e.school.short] }),
              (0, s.jsx)("h2", {
                children: fu.length === 1 ? "COMMITTED!" : `${fu.length} NEW COMMITMENTS!`,
              }),
              (0, s.jsx)("p", { children: "The next chapter of your rebuild starts here." }),
              (0, s.jsx)("div", {
                className: "commit-list",
                children: fu.map((z) => {
                  let ve = e.roster.find(($a) => $a.id === z.playerId);
                  return (0, s.jsxs)(
                    "button",
                    {
                      className: "commit-player",
                      onClick: () => {
                        (Qs([]), m(z.playerId));
                      },
                      children: [
                        ve && (0, s.jsx)(Ja, { p: ve, size: "small" }),
                        (0, s.jsxs)("div", {
                          children: [
                            (0, s.jsxs)("strong", {
                              children: [z.name, " ", (0, s.jsxs)("span", { children: [z.ovr, " OVR"] })],
                            }),
                            (0, s.jsxs)("p", {
                              children: [z.pos, " \xB7 ", z.origin, " \xB7 ", q(z.nil), "/year"],
                            }),
                            (0, s.jsxs)("small", { children: ["Committed ", z.year, ", round ", z.round] }),
                          ],
                        }),
                        (0, s.jsx)(Ct, { size: 23 }),
                      ],
                    },
                    z.id
                  );
                }),
              }),
              (0, s.jsx)(X, {
                primary: !0,
                onClick: () => {
                  (Qs([]), cu("Board"));
                },
                children: "View my recruiting class",
              }),
            ],
          }),
        }),
      awardsOpen &&
        e &&
        e.history.at(-1)?.awards &&
        !tourAlert &&
        !elimAlert &&
        !champOpen &&
        injAlert.length === 0 &&
        fu.length === 0 &&
        (0, s.jsx)(Ao, {
          title: "Season awards",
          onClose: () => setAwardsOpen(!1),
          wide: !0,
          children: (0, s.jsx)(AwardsCeremony, {
            g: e,
            onClose: () => setAwardsOpen(!1),
            onSeason: () => {
              (setAwardsOpen(!1), setSeasonView(!0));
            },
          }),
        }),
      retAlert.length > 0 &&
        !tourAlert &&
        !elimAlert &&
        injAlert.length === 0 &&
        fu.length === 0 &&
        (0, s.jsx)(Ao, {
          title: "Back from injury",
          onClose: () => setRetAlert([]),
          wide: !0,
          children: (0, s.jsxs)("div", {
            className: "alert-modal",
            children: [
              (0, s.jsx)("p", { className: "eyebrow", children: "BACK FROM INJURY" }),
              (0, s.jsx)("h2", {
                children:
                  retAlert.length === 1
                    ? "A player is healthy again"
                    : `${retAlert.length} players are healthy again`,
              }),
              (0, s.jsx)("p", {
                children:
                  "Do you want the game to re-set your lineup and minutes, or would you rather do it yourself?",
              }),
              (0, s.jsx)("div", {
                className: "lost-list",
                children: retAlert.map((z) =>
                  (0, s.jsx)(
                    "div",
                    {
                      className: "lost-player",
                      children: (0, s.jsxs)("div", {
                        children: [
                          (0, s.jsxs)("strong", {
                            children: [z.name, " ", (0, s.jsxs)("span", { children: [z.ovr, " OVR"] })],
                          }),
                          (0, s.jsx)("p", { children: `${z.pos} \u00B7 cleared to play` }),
                        ],
                      }),
                    },
                    z.id
                  )
                ),
              }),
              (0, s.jsxs)("div", {
                className: "row gap",
                children: [
                  (0, s.jsx)(X, { onClick: () => setRetAlert([]), children: "Dismiss" }),
                  (0, s.jsx)(X, {
                    onClick: () => {
                      (setRetAlert([]), cu("Rotation"));
                    },
                    children: "I\u2019ll set it myself",
                  }),
                  (0, s.jsx)(X, {
                    primary: !0,
                    onClick: () => {
                      (setRetAlert([]), Xe({ type: "autoCoach" }));
                    },
                    children: "Auto-set coaching",
                  }),
                ],
              }),
            ],
          }),
        }),
      xferOpen &&
        e &&
        !draftOpen &&
        !seasonView &&
        !awardsOpen &&
        !tourAlert &&
        !elimAlert &&
        injAlert.length === 0 &&
        fu.length === 0 &&
        (0, s.jsx)(Ao, {
          title: "Transfer portal watch",
          onClose: () => setXferOpen(!1),
          wide: !0,
          children: (() => {
            let xl = e.xfers || [],
              pend = xl.filter((d) => d.status === "pending"),
              wbl = e.prospects.filter((d) => d.wb && d.status === "Available");
            return (0, s.jsxs)("div", {
              className: "alert-modal",
              children: [
                (0, s.jsx)("p", {
                  className: "eyebrow",
                  children:
                    xl.length && xl.every((d) => d.kind === "follow") && !wbl.length
                      ? "YOUR FORMER PLAYERS"
                      : "TRANSFER PORTAL WATCH",
                }),
                (0, s.jsx)("h2", {
                  children:
                    wbl.length && !pend.length
                      ? wbl.length === 1
                        ? `${wbl[0].name} withdrew from the portal and wants to come back`
                        : `${wbl.length} players withdrew from the portal and want to come back`
                      : xl.length && xl.every((d) => d.kind === "follow")
                      ? pend.length
                        ? "Some of your old players want to follow you"
                        : "Your former players"
                      : pend.length
                        ? pend.length === 1
                          ? "One of your players is thinking about leaving"
                          : `${pend.length} of your players are thinking about leaving`
                        : "Transfer portal results",
                }),
                (0, s.jsx)("p", {
                  children: pend.length
                    ? "You get one conversation with each. Offering extra NIL and promising a bigger role both improve your odds. The extra money is only spent if he stays."
                    : wbl.length
                      ? "He found no offer he liked in the portal. Accept to take him back at his NIL, or deny it: then he signs with another school or leaves college basketball."
                      : "Everyone has made a decision.",
                }),
                (0, s.jsx)(HowItWorks, { kind: "portal" }),
                wbl.length > 0 &&
                  (0, s.jsx)("div", {
                    className: "lost-list wb-list",
                    children: wbl.map((d) => {
                      let open = 15 - e.roster.length,
                        n = d.nil || 0,
                        short = n > Ce(e);
                      return (0, s.jsxs)(
                        "div",
                        {
                          className: "lost-player",
                          children: [
                            (0, s.jsxs)("div", {
                              children: [
                                (0, s.jsxs)("strong", {
                                  children: [d.name, " ", (0, s.jsxs)("span", { children: [d.ovr, " OVR"] })],
                                }),
                                (0, s.jsx)("p", { children: `${d.pos} · ${Zl(d)} · withdrew from the portal and wants to come back` }),
                                (0, s.jsx)("small", {
                                  children: `Asks ${q(n)} / yr · NIL available ${q(Ce(e))} · ${open} open roster spot${open === 1 ? "" : "s"}`,
                                }),
                                (short || open < 1) &&
                                  (0, s.jsx)("small", {
                                    className: "bad-text",
                                    children: open < 1
                                      ? " Your roster is full: deny him or open a spot first."
                                      : ` Not enough NIL: his ${q(n)} does not fit in your ${q(Ce(e))}. Free up NIL or deny him.`,
                                  }),
                              ],
                            }),
                            (0, s.jsxs)("div", {
                              className: "draft-actions",
                              children: [
                                (0, s.jsxs)("div", {
                                  className: "row gap",
                                  children: [
                                    (0, s.jsx)(X, {
                                      small: !0,
                                      primary: !0,
                                      disabled: short || open < 1,
                                      onClick: () => {
                                        Xe({ type: "wbDecision", id: d.id, accept: !0 });
                                      },
                                      children: "Accept",
                                    }),
                                    (0, s.jsx)(X, {
                                      small: !0,
                                      className: "cut-btn",
                                      onClick: () => {
                                        Xe({ type: "wbDecision", id: d.id, accept: !1 });
                                      },
                                      children: "Deny",
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        },
                        d.id
                      );
                    }),
                  }),
                (0, s.jsx)("div", {
                  className: "lost-list",
                  children: xl.map((d) => {
                    let ex = xferExtra[d.id] || 0,
                      rl = xferRole[d.id] || "None";
                    return (0, s.jsxs)(
                      "div",
                      {
                        className: "lost-player",
                        children: [
                          (0, s.jsxs)("div", {
                            children: [
                              (0, s.jsxs)("strong", {
                                children: [d.name, " ", (0, s.jsxs)("span", { children: [d.ovr, " OVR"] })],
                              }),
                              (0, s.jsx)("p", { children: `${d.pos} \u00B7 ${d.cls} \u00B7 ${d.why}` }),
                              (0, s.jsx)("small", {
                                children:
                                  d.status === "pending"
                                    ? "Waiting on you"
                                    : d.status === "Returned"
                                      ? "He's staying"
                                      : d.kind === "follow"
                                        ? "You let him go"
                                        : "He entered the portal",
                              }),
                            ],
                          }),
                          d.status === "pending" &&
                            (0, s.jsxs)("div", {
                              className: "draft-actions",
                              children: [
                                (0, s.jsxs)("label", {
                                  className: "draft-extra",
                                  children: [
                                    (0, s.jsx)("span", { children: "Promise a role" }),
                                    (0, s.jsx)("select", {
                                      value: rl,
                                      onChange: (z) => setXferRole((h) => ({ ...h, [d.id]: z.target.value })),
                                      children: ["None", "Starter", "Rotation", "Bench"].map((z) =>
                                        (0, s.jsx)(
                                          "option",
                                          { value: z, children: z === "None" ? "No promise" : z },
                                          z
                                        )
                                      ),
                                    }),
                                  ],
                                }),
                                (0, s.jsxs)("label", {
                                  className: "draft-extra",
                                  children: [
                                    (0, s.jsx)("span", { children: "Extra NIL" }),
                                    (0, s.jsx)("select", {
                                      value: ex,
                                      onChange: (z) =>
                                        setXferExtra((h) => ({ ...h, [d.id]: +z.target.value })),
                                      children: [0, 1e4, 25e3, 5e4, 1e5]
                                        .filter((z) => z === 0 || z <= Ce(e) + d.player.nil)
                                        .map((z) =>
                                          (0, s.jsx)(
                                            "option",
                                            { value: z, children: z ? `+${q(z)} / yr` : "No extra" },
                                            z
                                          )
                                        ),
                                    }),
                                  ],
                                }),
                                (0, s.jsxs)("div", {
                                  className: "row gap",
                                  children: [
                                    (0, s.jsxs)(X, {
                                      small: !0,
                                      primary: !0,
                                      onClick: () => {
                                        Xe({
                                          type: "xferDecision",
                                          ids: [d.id],
                                          stay: !0,
                                          extra: ex,
                                          role: rl,
                                        });
                                      },
                                      children: [
                                        "Try to keep him (",
                                        le(d.chance + xBoost(d, ex, rl), 5, 95),
                                        "%)",
                                      ],
                                    }),
                                    (0, s.jsx)(X, {
                                      small: !0,
                                      className: "cut-btn",
                                      onClick: () => {
                                        Xe({ type: "xferDecision", ids: [d.id], stay: !1 });
                                      },
                                      children: "Let him go",
                                    }),
                                  ],
                                }),
                                (0, s.jsx)("small", {
                                  children: `Now ${q(d.player.nil)} / yr \u00B7 NIL available ${q(Ce(e) + d.player.nil)}`,
                                }),
                              ],
                            }),
                        ],
                      },
                      d.id
                    );
                  }),
                }),
                (0, s.jsxs)("div", {
                  className: "row gap",
                  children: [
                    (0, s.jsx)(X, {
                      onClick: () => setXferOpen(!1),
                      children: pend.length || wbl.length ? "Decide later" : "Close",
                    }),
                    pend.length > 1 &&
                      (0, s.jsx)(X, {
                        className: "cut-btn",
                        onClick: () => {
                          Xe({ type: "xferDecision", ids: pend.map((d) => d.id), stay: !1 });
                        },
                        children: "Let everyone go",
                      }),
                  ],
                }),
              ],
            });
          })(),
        }),
      draftOpen &&
        e &&
        !seasonView &&
        !awardsOpen &&
        !tourAlert &&
        injAlert.length === 0 &&
        fu.length === 0 &&
        (0, s.jsx)(Ao, {
          title: "Draft day",
          onClose: () => setDraftOpen(!1),
          wide: !0,
          children: (() => {
            let dl2 = e.draft || [],
              pend = dl2.filter((d) => d.status === "pending"),
              sen = (e.departed || []).filter((d) => /senior$/.test(d.reason));
            return (0, s.jsxs)("div", {
              className: "alert-modal",
              children: [
                (0, s.jsx)("p", { className: "eyebrow", children: "DRAFT DAY" }),
                (0, s.jsx)("h2", {
                  children: pend.length
                    ? pend.length === 1
                      ? "One of your players declared"
                      : `${pend.length} of your players declared`
                    : "Draft results",
                }),
                (0, s.jsx)("p", {
                  children: pend.length
                    ? "Underclassmen with pro offers can be talked into coming back. You get one try each, and offering extra NIL improves your odds. The extra money is only spent if he stays. Players testing the waters are not projected picks: they work out for pro teams, and most withdraw and come back even if you leave the decision to them. Seniors have already moved on."
                    : "Everyone has made a decision.",
                }),
                (0, s.jsx)(HowItWorks, { kind: "draft" }),
                (0, s.jsxs)("div", {
                  className: "lost-list",
                  children: [
                    dl2.map((d) =>
                      (0, s.jsxs)(
                        "div",
                        {
                          className: "lost-player",
                          children: [
                            (0, s.jsxs)("div", {
                              children: [
                                (0, s.jsxs)("strong", {
                                  children: [d.name, " ", (0, s.jsxs)("span", { children: [d.ovr, " OVR"] })],
                                }),
                                (0, s.jsx)("p", {
                                  children:
                                    d.kind === "test"
                                      ? `${d.pos} \u00B7 ${d.cls} \u00B7 testing the waters \u00B7 pro feedback: ${d.pick}`
                                      : `${d.pos} \u00B7 ${d.cls} \u00B7 projected ${d.pick}`,
                                }),
                                (0, s.jsx)("small", {
                                  children:
                                    d.status === "pending"
                                      ? "Waiting on you"
                                      : d.status === "Returned"
                                        ? d.kind === "test"
                                          ? "He withdrew from the draft and is coming back"
                                          : "He's coming back"
                                        : d.status === "Turned pro"
                                          ? "Stayed in the draft and turned pro"
                                          : "Drafted",
                                }),
                              ],
                            }),
                            d.status === "pending" &&
                              (0, s.jsxs)("div", {
                                className: "draft-actions",
                                children: [
                                  (0, s.jsxs)("label", {
                                    className: "draft-extra",
                                    children: [
                                      (0, s.jsx)("span", { children: "Extra NIL if he stays" }),
                                      (0, s.jsx)("select", {
                                        value: draftExtra[d.id] || 0,
                                        onChange: (z) =>
                                          setDraftExtra((h) => ({ ...h, [d.id]: +z.target.value })),
                                        children: [0, 1e4, 25e3, 5e4, 1e5, 15e4]
                                          .filter((z) => z === 0 || z <= Ce(e) + d.player.nil)
                                          .map((z) =>
                                            (0, s.jsx)(
                                              "option",
                                              { value: z, children: z ? `+${q(z)} / yr` : "No extra" },
                                              z
                                            )
                                          ),
                                      }),
                                    ],
                                  }),
                                  (0, s.jsxs)("div", {
                                    className: "row gap",
                                    children: [
                                      (0, s.jsxs)(X, {
                                        small: !0,
                                        primary: !0,
                                        onClick: () => {
                                          Xe({
                                            type: "draftDecision",
                                            ids: [d.id],
                                            stay: !0,
                                            extra: draftExtra[d.id] || 0,
                                          });
                                        },
                                        children: [
                                          "Try to keep him (",
                                          le(d.chance + dBoost(d, draftExtra[d.id] || 0), 5, 95),
                                          "%)",
                                        ],
                                      }),
                                      (0, s.jsx)(X, {
                                        small: !0,
                                        className: "cut-btn",
                                        onClick: () => {
                                          Xe({ type: "draftDecision", ids: [d.id], stay: !1 });
                                        },
                                        children: d.kind === "test" ? `Let him decide (${d.chance}% he returns)` : "Let him go",
                                      }),
                                    ],
                                  }),
                                  (0, s.jsx)("small", {
                                    children: `Now ${q(d.player.nil)} / yr \u00B7 NIL available ${q(Ce(e) + d.player.nil)}`,
                                  }),
                                ],
                              }),
                          ],
                        },
                        d.id
                      )
                    ),
                    sen.map((d, i) =>
                      (0, s.jsx)(
                        "div",
                        {
                          className: "lost-player",
                          children: (0, s.jsxs)("div", {
                            children: [
                              (0, s.jsxs)("strong", {
                                children: [d.name, " ", (0, s.jsxs)("span", { children: [d.ovr, " OVR"] })],
                              }),
                              (0, s.jsx)("p", {
                                children: d.reason.replace(" \u00B7 senior", "") + " \u00B7 senior",
                              }),
                              (0, s.jsx)("small", { children: "Seniors can't be convinced to stay" }),
                            ],
                          }),
                        },
                        "s" + i
                      )
                    ),
                  ],
                }),
                (0, s.jsxs)("div", {
                  className: "row gap",
                  children: [
                    (0, s.jsx)(X, {
                      onClick: () => setDraftOpen(!1),
                      children: pend.length ? "Decide later" : "Close",
                    }),
                    pend.length > 1 &&
                      (0, s.jsx)(X, {
                        className: "cut-btn",
                        onClick: () => {
                          Xe({ type: "draftDecision", ids: pend.map((d) => d.id), stay: !1 });
                        },
                        children: "Let everyone go",
                      }),
                  ],
                }),
              ],
            });
          })(),
        }),
      moveOpen &&
        e &&
        moveInfo(e) &&
        !seasonView &&
        !awardsOpen &&
        !draftOpen &&
        !tourAlert &&
        injAlert.length === 0 &&
        !offersOpen &&
        fu.length === 0 &&
        (0, s.jsx)(Ao, {
          title: "Conference invitation",
          onClose: () => setMoveOpen(!1),
          wide: !0,
          children: (() => {
            let mi = moveInfo(e),
              rf = mi.ref,
              goalNow = _s(e),
              goalNext = _s({ ...e, tierShift: (e.tierShift || 0) + 1 }),
              gap = Math.round(((tierAvg(mi.t2, "budget") - tierAvg(mi.t, "budget")) * 0.5) / 1e3) * 1e3;
            return (0, s.jsxs)("div", {
              className: "alert-modal",
              children: [
                (0, s.jsx)("p", { className: "eyebrow", children: "CONFERENCE INVITATION" }),
                (0, s.jsx)("h2", { children: `Move up to the ${rf.difficulty.split(" \u00B7")[0]} level?` }),
                (0, s.jsxs)("p", {
                  children: [
                    "Your reputation (",
                    e.rep,
                    ") has caught up with the programs in ",
                    rf.league,
                    ". You can step up from ",
                    e.school.league,
                    " now, before you start your next season.",
                  ],
                }),
                (0, s.jsxs)("div", {
                  className: "lost-list",
                  children: [
                    (0, s.jsxs)("div", {
                      className: "lost-player",
                      children: [
                        (0, s.jsxs)("div", {
                          children: [
                            (0, s.jsx)("strong", { children: "What you get" }),
                            (0, s.jsxs)("p", {
                              children: [
                                "+",
                                q(gap),
                                " NIL budget from conference revenue \u00B7 better recruiting pull and fewer transfers out",
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, s.jsx)("div", {
                      className: "lost-player",
                      children: (0, s.jsxs)("div", {
                        children: [
                          (0, s.jsx)("strong", { children: "What it costs" }),
                          (0, s.jsxs)("p", {
                            children: [
                              "Win goal ",
                              goalNow,
                              " \u2192 ",
                              goalNext,
                              " \u00B7 tougher conference opponents \u00B7 grace period resets to ",
                              [5, 4, 3, 3, 2][mi.t2],
                              " seasons",
                            ],
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
                (0, s.jsxs)("div", {
                  className: "row gap",
                  children: [
                    (0, s.jsx)(X, { onClick: () => setMoveOpen(!1), children: "Not yet" }),
                    (0, s.jsxs)(X, {
                      primary: !0,
                      onClick: () => {
                        (setMoveOpen(!1), Xe({ type: "moveUp" }));
                      },
                      children: ["Move up to ", rf.league],
                    }),
                  ],
                }),
              ],
            });
          })(),
        }),
      courtOpen && e && (0, s.jsx)(CourtsideGame, {career: e, run: Xe, onClose: () => setCourtOpen(!1)}),
      liveOpen &&
        e &&
        e.phase === "Regular season" &&
        (0, s.jsx)(Ao, {
          title: "Game day",
          onClose: () => setLiveOpen(!1),
          wide: !0,
          children: (0, s.jsx)(GameDay, { g: e, run: Xe, onClose: () => setLiveOpen(!1) }),
        }),
      negOpen &&
        e &&
        (e.negs || []).length > 0 &&
        !xferOpen &&
        !draftOpen &&
        !awardsOpen &&
        !seasonView &&
        !tourAlert &&
        fu.length === 0 &&
        (0, s.jsx)(Ao, {
          title: "Contract talks",
          onClose: () => setNegOpen(!1),
          wide: !0,
          children: (0, s.jsxs)("div", {
            className: "alert-modal",
            children: [
              (0, s.jsx)("p", { className: "eyebrow", children: "CONTRACT TALKS" }),
              (0, s.jsx)("h2", { children: "Your best players want a raise" }),
              (0, s.jsx)("p", {
                children:
                  "Breakout seasons and big production mean bigger asks. Every raise comes out of the NIL you could spend on recruits.",
              }),
              (0, s.jsx)("div", {
                className: "lost-list",
                children: e.negs.map((d) =>
                  (0, s.jsxs)(
                    "div",
                    {
                      className: "lost-player",
                      children: [
                        (0, s.jsxs)("div", {
                          children: [
                            (0, s.jsxs)("strong", {
                              children: [d.name, " ", (0, s.jsxs)("span", { children: [d.ovr, " OVR"] })],
                            }),
                            (0, s.jsx)("p", {
                              children: `${d.why} · now ${q(d.nil)} / yr, wants ${q(d.ask)}`,
                            }),
                          ],
                        }),
                        (0, s.jsxs)("div", {
                          className: "row gap",
                          children: [
                            (0, s.jsxs)(X, {
                              small: !0,
                              primary: !0,
                              onClick: () => {
                                Xe({ type: "negotiate", id: d.id, accept: !0 });
                              },
                              children: ["Give the raise (+", q(d.ask - d.nil), ")"],
                            }),
                            (0, s.jsx)(X, {
                              small: !0,
                              className: "cut-btn",
                              onClick: () => {
                                Xe({ type: "negotiate", id: d.id, accept: !1 });
                              },
                              children: "Decline",
                            }),
                          ],
                        }),
                      ],
                    },
                    d.id
                  )
                ),
              }),
              (0, s.jsx)("div", {
                className: "row gap",
                children: [
                  (0, s.jsx)(X, { onClick: () => setNegOpen(!1), children: "Decide later" }, "later"),
                  e.negs.length > 1 &&
                    (0, s.jsx)(
                      X,
                      {
                        className: "cut-btn",
                        onClick: () => {
                          Xe({ type: "negotiateAll", accept: !1 });
                        },
                        children: "Decline all",
                      },
                      "all"
                    ),
                ],
              }),
            ],
          }),
        }),
      tutStep >= 0 &&
        e &&
        e.history.length === 0 &&
        e.year === 2026 &&
        e.phase === "Offseason" &&
        !startAsk &&
        !xferOpen &&
        !draftOpen &&
        fu.length === 0 &&
        (0, s.jsx)(Ao, {
          title: "Getting started",
          onClose: () => {
            ((CFG.tut = "done"), saveCfg(), setTutStep(-1));
          },
          wide: !0,
          children: (() => {
            let T = [
                [
                  "Welcome, coach",
                  "You took over a program that needs a rebuild. Your first offseason is the most important one. This quick tour shows the five things to do before opening night.",
                  "HQ",
                  "Program HQ",
                ],
                [
                  "1. Build a roster",
                  "You need at least 8 players. Open Recruiting to scout high school recruits, check the transfer portal, and pick up free walk-ons. Pitch what a recruit cares about to win him over.",
                  "Recruiting",
                  "Go to Recruiting",
                ],
                [
                  "2. Set your lineup",
                  "On Coaching, pick five starters, give out 200 minutes and choose a system. Auto-set coaching does all of it. The fit chips tell you what your lineup is missing.",
                  "Rotation",
                  "Go to Coaching",
                ],
                [
                  "3. Promise roles",
                  "Every active player needs a promised role before the season starts. The Begin season pop-up can auto-set coaching and promises for you.",
                  "Roster",
                  "Go to My roster",
                ],
                [
                  "4. Play the season",
                  "Sim a game, a week, or use Game day for a live game with adjustments at halftime and at your timeouts. Watch the Top 25 on League news and your tournament r\u00e9sum\u00e9 on Season center. Good luck.",
                  "Season",
                  "Go to Season center",
                ],
              ],
              t = T[Math.min(tutStep, T.length - 1)],
              last = tutStep >= T.length - 1,
              end = () => {
                ((CFG.tut = "done"), saveCfg(), setTutStep(-1));
              };
            return (0, s.jsxs)("div", {
              className: "alert-modal",
              children: [
                (0, s.jsx)("p", {
                  className: "eyebrow",
                  children: `GETTING STARTED \u00B7 ${tutStep + 1} OF ${T.length}`,
                }),
                (0, s.jsx)("h2", { children: t[0] }),
                (0, s.jsx)("p", { children: t[1] }),
                (0, s.jsx)("div", {
                  className: "bar",
                  style: { height: 6, background: "#ffffff12", borderRadius: 4 },
                  children: (0, s.jsx)("div", {
                    style: {
                      width: ((tutStep + 1) / T.length) * 100 + "%",
                      height: 6,
                      borderRadius: 4,
                      background: "var(--team,var(--orange))",
                    },
                  }),
                }),
                (0, s.jsxs)("div", {
                  className: "row gap",
                  children: [
                    (0, s.jsx)(X, { onClick: end, children: "Skip tutorial" }),
                    tutStep > 0 &&
                      (0, s.jsx)(X, { onClick: () => setTutStep(tutStep - 1), children: "Back" }),
                    t[2] !== "HQ" && (0, s.jsx)(X, { onClick: () => cu(t[2]), children: t[3] }),
                    (0, s.jsx)(X, {
                      primary: !0,
                      onClick: () => (last ? end() : setTutStep(tutStep + 1)),
                      children: last ? "Finish" : "Next",
                    }),
                  ],
                }),
              ],
            });
          })(),
        }),
      startAsk &&
        e &&
        e.phase === "Offseason" &&
        (0, s.jsx)(Ao, {
          title: "Before the season",
          onClose: () => setStartAsk(!1),
          wide: !0,
          children: (() => {
            let po = e.prospects.filter((p) => p.offer && p.status === "Available").length,
              inj = e.roster.filter((p) => p.injury > 0 && (e.lineup.includes(p.id) || p.minutes > 0)),
              o = startOpts,
              auto = o.auto || inj.length > 0,
              blocked = po > 0 && !o.fin;
            return (0, s.jsxs)("div", {
              className: "alert-modal",
              children: [
                (0, s.jsx)("p", { className: "eyebrow", children: "OPENING NIGHT" }),
                (0, s.jsx)("h2", { children: "Ready to start the season?" }),
                (0, s.jsx)("p", {
                  children: `Your goal is ${_s(e)} wins. Once the season starts, recruiting closes.`,
                }),
                (0, s.jsxs)("div", {
                  className: "lost-list",
                  children: [
                    (0, s.jsxs)("label", {
                      className: "set-row",
                      children: [
                        (0, s.jsxs)("div", {
                          children: [
                            (0, s.jsx)("strong", { children: "Auto-set my coaching" }),
                            (0, s.jsx)("small", {
                              children: inj.length
                                ? `${inj.map((p) => p.name).join(", ")} ${inj.length === 1 ? "is" : "are"} injured and still in your rotation, so this is required.`
                                : "Best lineup, 200 minutes and tactics, plus a promise for anyone who still needs one.",
                            }),
                          ],
                        }),
                        (0, s.jsx)("input", {
                          type: "checkbox",
                          checked: auto,
                          disabled: inj.length > 0,
                          onChange: (z) => setStartOpts((h) => ({ ...h, auto: z.target.checked })),
                        }),
                      ],
                    }),
                    po > 0 &&
                      (0, s.jsxs)("label", {
                        className: "set-row",
                        children: [
                          (0, s.jsxs)("div", {
                            children: [
                              (0, s.jsx)("strong", {
                                children: `Finish recruiting: resolve my ${po} pending offer${po === 1 ? "" : "s"}`,
                              }),
                              (0, s.jsx)("small", {
                                children:
                                  "Simulates the remaining recruiting rounds so every outstanding offer gets an answer. No new offers are made.",
                              }),
                            ],
                          }),
                          (0, s.jsx)("input", {
                            type: "checkbox",
                            checked: o.fin,
                            onChange: (z) => setStartOpts((h) => ({ ...h, fin: z.target.checked })),
                          }),
                        ],
                      }),
                  ],
                }),
                blocked &&
                  (0, s.jsx)("p", {
                    className: "muted",
                    children: "Withdraw your pending offers on My recruits, or tick the box above, to start.",
                  }),
                (0, s.jsxs)("div", {
                  className: "row gap",
                  children: [
                    (0, s.jsx)(X, { onClick: () => setStartAsk(!1), children: "Not yet" }),
                    (0, s.jsx)(X, {
                      primary: !0,
                      disabled: blocked,
                      onClick: () => {
                        (setStartAsk(!1), Xe({ type: "startSeason", auto: auto, finish: po > 0 && o.fin }));
                      },
                      children: "Start the season",
                    }),
                  ],
                }),
              ],
            });
          })(),
        }),
      simAsk &&
        e &&
        (0, s.jsx)(Ao, {
          title: "Simulate",
          onClose: () => setSimAsk(null),
          children: (0, s.jsx)("div", {
            className: "alert-modal",
            children: simAsk.inj.length
              ? (0, s.jsxs)(s.Fragment, {
                  children: [
                    (0, s.jsx)("p", { className: "eyebrow", children: "INJURED PLAYER IN YOUR ROTATION" }),
                    (0, s.jsx)("h2", {
                      children:
                        simAsk.inj.length === 1
                          ? `${simAsk.inj[0]} is hurt`
                          : `${simAsk.inj.length} players are hurt`,
                    }),
                    (0, s.jsx)("p", {
                      children: `${simAsk.inj.join(", ")} ${simAsk.inj.length === 1 ? "is" : "are"} still assigned minutes. Update your coaching before you simulate: let the game do it, or adjust it yourself.`,
                    }),
                    (0, s.jsxs)("div", {
                      className: "row gap",
                      children: [
                        (0, s.jsx)(X, { onClick: () => setSimAsk(null), children: "Cancel" }),
                        (0, s.jsx)(X, {
                          onClick: () => {
                            (setSimAsk(null), cu("Rotation"));
                          },
                          children: "I\u2019ll adjust it myself",
                        }),
                        (0, s.jsx)(X, {
                          primary: !0,
                          onClick: () => {
                            let c = simAsk.c;
                            (setSimAsk(null), Xe({ type: "sim", count: c, auto: !0 }));
                          },
                          children: "Auto-set coaching and simulate",
                        }),
                      ],
                    }),
                  ],
                })
              : (0, s.jsxs)(s.Fragment, {
                  children: [
                    (0, s.jsx)("p", { className: "eyebrow", children: "CONFIRM" }),
                    (0, s.jsx)("h2", {
                      children:
                        simAsk.c === "season"
                          ? "Simulate the rest of the regular season?"
                          : "Simulate the next week?",
                    }),
                    (0, s.jsx)("p", {
                      children:
                        "You won\u2019t be able to change your lineup or minutes between these games.",
                    }),
                    (0, s.jsxs)("div", {
                      className: "row gap",
                      children: [
                        (0, s.jsx)(X, { onClick: () => setSimAsk(null), children: "Cancel" }),
                        (0, s.jsx)(X, {
                          primary: !0,
                          onClick: () => {
                            let c = simAsk.c;
                            (setSimAsk(null), Xe({ type: "sim", count: c }));
                          },
                          children: "Simulate",
                        }),
                      ],
                    }),
                  ],
                }),
          }),
        }),
      openedAlert &&
        e &&
        !simAsk &&
        (0, s.jsx)(Ao, {
          title: "Season started",
          onClose: () => setOpenedAlert(null),
          wide: !0,
          children: (0, s.jsxs)("div", {
            className: "ceremony",
            children: [
              (0, s.jsxs)("div", {
                className: "ceremony-head",
                children: [
                  (0, s.jsx)("div", { className: "ceremony-icon", children: (0, s.jsx)(bt, { size: 26 }) }),
                  (0, s.jsxs)("div", {
                    children: [
                      (0, s.jsx)("p", { className: "eyebrow", children: "THE SEASON IS UNDERWAY" }),
                      (0, s.jsx)("h2", { children: `${e.year}\u2013${String(e.year + 1).slice(2)} season` }),
                      (0, s.jsx)("p", {
                        className: "ceremony-sub",
                        children: `${e.school.name} \u00B7 ${openedAlert.conf}`,
                      }),
                    ],
                  }),
                ],
              }),
              (0, s.jsx)("div", {
                className: "ceremony-scroll",
                children: (0, s.jsx)("div", {
                  className: "stat-trio",
                  children: [
                    ["PRESEASON POLL", openedAlert.pre ? `#${openedAlert.pre.nat} nationally` : "—"],
                    [
                      "MEDIA PICK",
                      openedAlert.pre
                        ? `${openedAlert.pre.conf === 1 ? "1st" : openedAlert.pre.conf === 2 ? "2nd" : openedAlert.pre.conf === 3 ? "3rd" : openedAlert.pre.conf + "th"} of ${openedAlert.pre.n} in the conference`
                        : "—",
                    ],
                    ["WIN GOAL", `${openedAlert.goal} wins`],
                    ["TEAM RATING", `${openedAlert.me} OVR`],
                    ["SCHEDULE STRENGTH", `${openedAlert.sos} avg opp`],
                    [
                      "FIRST GAME",
                      openedAlert.first
                        ? `${openedAlert.first.venue === "Away" ? "at" : "vs"} ${openedAlert.first.opponent}`
                        : "\u2014",
                    ],
                  ].map((z) =>
                    (0, s.jsxs)(
                      "div",
                      {
                        children: [
                          (0, s.jsx)("small", { children: z[0] }),
                          (0, s.jsx)("strong", { children: z[1] }),
                        ],
                      },
                      z[0]
                    )
                  ),
                }),
              }),
              (0, s.jsx)("div", {
                className: "ceremony-foot",
                children: (0, s.jsx)("div", {
                  className: "row gap",
                  children: (0, s.jsx)(X, {
                    primary: !0,
                    onClick: () => setOpenedAlert(null),
                    children: "Let\u2019s go",
                  }),
                }),
              }),
            ],
          }),
        }),
      winAlert &&
        e &&
        !elimAlert &&
        !tourAlert &&
        !champOpen &&
        fu.length === 0 &&
        (0, s.jsx)(Ao, {
          title: "You advance",
          onClose: () => setWinAlert(null),
          wide: !0,
          children: (0, s.jsxs)("div", {
            className: "ceremony",
            children: [
              (0, s.jsxs)("div", {
                className: "ceremony-head",
                children: [
                  (0, s.jsx)("div", { className: "ceremony-icon", children: (0, s.jsx)(ba, { size: 26 }) }),
                  (0, s.jsxs)("div", {
                    children: [
                      (0, s.jsx)("p", {
                        className: "eyebrow",
                        children: `${winAlert.round.toUpperCase()} WIN`,
                      }),
                      (0, s.jsx)("h2", {
                        children: winAlert.upset ? `You upset the #${winAlert.so} seed!` : "You advance!",
                      }),
                      (0, s.jsx)("p", {
                        className: "ceremony-sub",
                        children: `${winAlert.us}\u2013${winAlert.them} over ${winAlert.opp}`,
                      }),
                    ],
                  }),
                ],
              }),
              (0, s.jsxs)("div", {
                className: "ceremony-scroll",
                children: [
                  (0, s.jsx)("div", {
                    className: "stat-trio",
                    children: [
                      ["YOUR SEED", winAlert.su ? `#${winAlert.su}` : "\u2014"],
                      ["BEAT", `${winAlert.opp}${winAlert.so ? ` (#${winAlert.so})` : ""}`],
                      ["NEXT UP", winAlert.next || "\u2014"],
                    ].map((z) =>
                      (0, s.jsxs)(
                        "div",
                        {
                          children: [
                            (0, s.jsx)("small", { children: z[0] }),
                            (0, s.jsx)("strong", { children: z[1] }),
                          ],
                        },
                        z[0]
                      )
                    ),
                  }),
                  (0, s.jsx)("p", {
                    className: "ceremony-body",
                    children: winAlert.upset
                      ? `Nobody had you winning that one. A #${winAlert.su || "lower"} seed just knocked off a #${winAlert.so}.`
                      : "One more win and the road gets even tougher.",
                  }),
                ],
              }),
              (0, s.jsx)("div", {
                className: "ceremony-foot",
                children: (0, s.jsxs)("div", {
                  className: "row gap",
                  children: [
                    (0, s.jsx)(X, { onClick: () => setWinAlert(null), children: "Keep going" }),
                    (0, s.jsx)(X, {
                      primary: !0,
                      onClick: () => {
                        (setWinAlert(null), cu("Season"));
                      },
                      children: "See the bracket",
                    }),
                  ],
                }),
              }),
            ],
          }),
        }),
      e && (0, s.jsx)(LinkLayer, { g: e, openTeam: setTeamViewId, openForeign: setFpl, openOwn: (p) => m(p.id) }),
      teamViewId && e && (0, s.jsx)(TeamView, { g: e, id: teamViewId, onClose: () => setTeamViewId(null), openPlayer: setFpl }),
      fpl && e && (0, s.jsx)(ForeignPlayerCard, { g: e, pl: fpl, onClose: () => setFpl(null), openTeam: (id) => { setFpl(null); setTeamViewId(id); } }),
      coachOpen &&
        e &&
        (0, s.jsx)(Ao, {
          title: "Coach accolades",
          onClose: () => setCoachOpen(!1),
          wide: !0,
          children: (0, s.jsx)(CoachModal, { g: e, onClose: () => setCoachOpen(!1) }),
        }),
      seasonView &&
        e &&
        (0, s.jsx)(SeasonModal, {
          g: e,
          tab0: seasonTab,
          onClose: () => {
            (setSeasonView(!1), setSeasonTab("Games"));
          },
        }),
      tourAlert &&
        !elimAlert &&
        fu.length === 0 &&
        (0, s.jsx)(Ao, {
          title: tourAlert.title,
          onClose: () => setTourAlert(null),
          wide: !0,
          children: (0, s.jsx)(TourCeremony, {
            a: tourAlert,
            onClose: () => setTourAlert(null),
            onGo: () => {
              (setTourAlert(null), cu("Season"));
            },
          }),
        }),
      elimAlert &&
        fu.length === 0 &&
        (0, s.jsx)(Ao, {
          title: "Eliminated",
          onClose: () => setElimAlert(null),
          wide: !0,
          children: (0, s.jsx)(ElimCeremony, {
            a: elimAlert,
            onClose: () => setElimAlert(null),
            onGo: () => {
              (setSeasonTab(
                elimAlert.kind === "National" ? "National tournament" : elimAlert.kind === "NIT" ? "NIT" : "Conference tournament"
              ),
                setElimAlert(null),
                setSeasonView(!0));
            },
          }),
        }),
      champOpen &&
        e &&
        !elimAlert &&
        !tourAlert &&
        fu.length === 0 &&
        (0, s.jsx)(Ao, {
          title: "National champions",
          onClose: () => setChampOpen(!1),
          wide: !0,
          children: (0, s.jsx)(ChampCelebration, {
            g: e,
            onClose: () => setChampOpen(!1),
            onSeason: () => {
              (setSeasonTab("National tournament"), setChampOpen(!1), setSeasonView(!0));
            },
          }),
        }),
      injAlert.length > 0 &&
        !tourAlert &&
        fu.length === 0 &&
        (0, s.jsx)(Ao, {
          title: "Injury report",
          onClose: () => setInjAlert([]),
          wide: !0,
          children: (0, s.jsxs)("div", {
            className: "alert-modal",
            children: [
              (0, s.jsx)("p", { className: "eyebrow", children: "INJURY REPORT" }),
              (0, s.jsx)("h2", {
                children: injAlert.length === 1 ? "A player is hurt" : `${injAlert.length} players are hurt`,
              }),
              (0, s.jsx)("p", {
                children: "Update your lineup and minutes so the rotation still works while they recover.",
              }),
              (0, s.jsx)("div", {
                className: "lost-list",
                children: injAlert.map((z) =>
                  (0, s.jsx)(
                    "div",
                    {
                      className: "lost-player",
                      children: (0, s.jsxs)("div", {
                        children: [
                          (0, s.jsxs)("strong", {
                            children: [z.name, " ", (0, s.jsxs)("span", { children: [z.ovr, " OVR"] })],
                          }),
                          (0, s.jsxs)("p", {
                            children: [
                              z.pos,
                              " \u00B7 out ",
                              z.games,
                              " game",
                              z.games === 1 ? "" : "s",
                              z.starter ? " \u00B7 STARTER" : "",
                            ],
                          }),
                        ],
                      }),
                    },
                    z.id
                  )
                ),
              }),
              (0, s.jsxs)("div", {
                className: "row gap",
                children: [
                  (0, s.jsx)(X, { onClick: () => setInjAlert([]), children: "Dismiss" }),
                  (0, s.jsx)(X, {
                    onClick: () => {
                      (setInjAlert([]), cu("Rotation"));
                    },
                    children: "Go to coaching",
                  }),
                  (0, s.jsx)(X, {
                    primary: !0,
                    onClick: () => {
                      (setInjAlert([]), Xe({ type: "autoCoach" }));
                    },
                    children: "Auto-set coaching",
                  }),
                ],
              }),
            ],
          }),
        }),
      offersOpen &&
        e &&
        !e.fired &&
        e.jobOffers?.length > 0 &&
        !seasonView &&
        !awardsOpen &&
        !draftOpen &&
        !tourAlert &&
        injAlert.length === 0 &&
        fu.length === 0 &&
        (0, s.jsx)(Ao, {
          title: "Job offers",
          onClose: () => setOffersOpen(!1),
          wide: !0,
          children: (0, s.jsxs)("div", {
            className: "alert-modal",
            children: [
              (0, s.jsx)("p", { className: "eyebrow", children: "JOB OFFERS" }),
              (0, s.jsx)("h2", { children: "Other programs want you" }),
              (0, s.jsx)("p", {
                className: "muted",
                children: `Offers follow your coach reputation: ${W_crepInit(e)}/99, ${W_crepLabel(W_crepInit(e))}. Winning, tournament runs and awards raise it; it comes with you to any job.`,
              }),
              (0, s.jsxs)("p", {
                children: [
                  "Your season got noticed. Taking a job means leaving ",
                  e.school.name,
                  " and starting fresh with a new roster and new expectations.",
                ],
              }),
              (0, s.jsx)("div", {
                className: "lost-list",
                children: e.jobOffers.map((z) => {
                  let h = Xl.find((Kn) => Kn.id === z);
                  return h
                    ? (0, s.jsxs)(
                        "div",
                        {
                          className: "offer-card",
                          children: [
                            (0, s.jsx)("div", {
                              className: "crest has-logo",
                              children: (0, s.jsx)(SchoolLogo, { school: h }),
                            }),
                            (0, s.jsxs)("div", {
                              children: [
                                (0, s.jsx)("strong", { children: h.name }),
                                (0, s.jsx)("p", { children: `${h.mascot} \u00B7 ${h.city}` }),
                                (0, s.jsx)("p", {
                                  className: "muted",
                                  children: `Offer: 4 years at about ${q(W_salary(h.budget, e.rep))} a year. Leaving ${e.school.name} early costs ${q(W_exitFee(e))} in exit fees.`,
                                }),
                                (0, s.jsx)("small", {
                                  children: `${q(h.budget)} NIL budget \u00B7 ${h.difficulty} \u00B7 win goal about ${[12, 13, 13, 15, 17][tierOf({ school: h })]}${(e.vac || []).includes(h.id) ? " \u00B7 job just opened" : ""}`,
                                }),
                              ],
                            }),
                            (0, s.jsx)(X, {
                              primary: !0,
                              onClick: () => {
                                window.confirm(
                                  `Take the ${h.name} job? You leave ${e.school.name} and start fresh with a new roster. Exit fees: ${q(W_exitFee(e))}.`
                                ) && (setOffersOpen(!1), Xe({ type: "acceptJob", school: h.id }));
                              },
                              children: "Accept job",
                            }),
                          ],
                        },
                        h.id
                      )
                    : null;
                }),
              }),
              (0, s.jsx)("div", {
                className: "row gap",
                children: (0, s.jsxs)(X, {
                  onClick: () => setOffersOpen(!1),
                  children: ["Stay at ", e.school.name],
                }),
              }),
            ],
          }),
        }),
      lostRec.length > 0 &&
        fu.length === 0 &&
        e &&
        !e.fired &&
        (0, s.jsx)(Ao, {
          title: "Recruiting update",
          onClose: () => setLostRec([]),
          wide: !0,
          children: (0, s.jsxs)("div", {
            className: "lost-recruits",
            children: [
              (0, s.jsx)("p", {
                className: "eyebrow",
                children: lostRec.length === 1 ? "WE LOST A RECRUIT" : `WE LOST ${lostRec.length} RECRUITS`,
              }),
              (0, s.jsx)("h2", { children: lostRec.length === 1 ? "One got away" : "Some got away" }),
              (0, s.jsx)("p", {
                children:
                  "These players you were tracking made their decision and will not be joining your program.",
              }),
              (0, s.jsx)("div", {
                className: "lost-list",
                children: lostRec.slice(0, 8).map((z) =>
                  (0, s.jsxs)(
                    "div",
                    {
                      className: "lost-player",
                      children: [
                        (0, s.jsxs)("div", {
                          children: [
                            (0, s.jsxs)("strong", {
                              children: [z.name, " ", (0, s.jsxs)("span", { children: [z.rating, " OVR"] })],
                            }),
                            (0, s.jsxs)("p", {
                              children: [z.pos, " \xB7 ", z.origin, z.stars ? ` \xB7 ${z.stars}-star` : ""],
                            }),
                            (0, s.jsxs)("small", {
                              children: [
                                z.where,
                                z.round ? ` \xB7 round ${z.round}` : "",
                                z.offer ? ` \xB7 your ${q(z.offer)} offer was released` : "",
                              ],
                            }),
                          ],
                        }),
                        (0, s.jsx)(X, {
                          small: !0,
                          className: "cut-btn",
                          title: "Take him off my recruits page",
                          onClick: async () => {
                            (await Xe({ type: "removeBoard", id: z.id })) &&
                              setLostRec((l) => l.filter((q) => q.id !== z.id));
                          },
                          children: "Remove",
                        }),
                      ],
                    },
                    z.id
                  )
                ),
              }),
              lostRec.length > 8 &&
                (0, s.jsxs)("p", { className: "muted", children: ["and ", lostRec.length - 8, " more."] }),
              (0, s.jsxs)("div", {
                className: "row gap",
                children: [
                  (0, s.jsx)(X, { onClick: () => setLostRec([]), children: "Keep going" }),
                  (0, s.jsx)(X, {
                    className: "cut-btn",
                    title: "Take all of them off my recruits page",
                    onClick: () => {
                      (Xe({ type: "removeBoardMany", ids: lostRec.map((z) => z.id) }), setLostRec([]));
                    },
                    children: lostRec.length === 1 ? "Remove" : "Remove all",
                  }),
                  (0, s.jsx)(X, {
                    primary: !0,
                    onClick: () => {
                      (setLostRec([]), cu("Recruiting"));
                    },
                    children: "Back to recruiting",
                  }),
                ],
              }),
            ],
          }),
        }),
      e?.fired &&
        !G &&
        !g &&
        (0, s.jsxs)(Ao, {
          title: "You have been fired",
          onClose: () => {},
          children: [
            (0, s.jsx)("h2", { children: "You\u2019ve been fired" }),
            (0, s.jsx)("p", {
              children: e.firedMsg || "The athletic director has decided to move in a new direction.",
            }),
            // landing spots: programs willing to hire you keep the career going (history, achievements, former players, reputation)
            e.jobOffers?.length
              ? (0, s.jsxs)(s.Fragment, {
                  children: [
                    (0, s.jsxs)("p", {
                      children: [
                        (0, s.jsx)("strong", { children: e.jobOffers.length === 1 ? "One program still wants you." : `${e.jobOffers.length} programs still want you.` }),
                        " Take one and your career continues: your history, achievements, former players and reputation as a coach come with you.",
                      ],
                    }),
                    (0, s.jsx)("div", {
                      className: "lost-list",
                      children: e.jobOffers.map((z) => {
                        let h = Xl.find((Kn) => Kn.id === z);
                        return h
                          ? (0, s.jsxs)(
                              "div",
                              {
                                className: "offer-card",
                                children: [
                                  (0, s.jsx)("div", { className: "crest has-logo", children: (0, s.jsx)(SchoolLogo, { school: h }) }),
                                  (0, s.jsxs)("div", {
                                    children: [
                                      (0, s.jsx)("strong", { children: h.name }),
                                      (0, s.jsx)("p", { children: `${h.mascot} \u00B7 ${h.city}` }),
                                      (0, s.jsx)("p", { className: "muted", children: `Offer: 4 years at about ${q(W_salary(h.budget, Math.max(e.rep, e.crep || 0)))} a year. No exit fee: ${e.school.name} let you go.` }),
                                      (0, s.jsx)("small", { children: `${q(h.budget)} NIL budget \u00B7 ${h.difficulty} \u00B7 win goal about ${[12, 13, 13, 15, 17][tierOf({ school: h })]}` }),
                                    ],
                                  }),
                                  (0, s.jsx)(X, { primary: !0, onClick: () => Xe({ type: "acceptJob", school: h.id }), children: "Accept job" }),
                                ],
                              },
                              h.id
                            )
                          : null;
                      }),
                    }),
                  ],
                })
              : (0, s.jsx)("p", { children: "No program is willing to hire you right now. Your career at this level is over: start a new one and build a reputation again." }),
            (0, s.jsx)("div", {
              className: "row gap",
              children: (0, s.jsx)(X, {
                primary: !e.jobOffers?.length,
                onClick: () => {
                  I(!0);
                },
                children: e.jobOffers?.length ? "Start a new career instead" : "Start a new career",
              }),
            }),
          ],
        }),
      G &&
        (0, s.jsxs)(Ao, {
          title: "Start a new career",
          onClose: () => w(!1),
          children: [
            (0, s.jsx)("h2", { children: "Start a new career?" }),
            (0, s.jsx)("p", {
              children: "Your current career will be replaced when you confirm your new school.",
            }),
            (0, s.jsxs)("div", {
              className: "row gap",
              children: [
                (0, s.jsx)(X, { onClick: () => w(!1), children: "Keep playing" }),
                (0, s.jsx)(X, {
                  primary: !0,
                  onClick: () => {
                    (w(!1), I(!0));
                  },
                  children: "Choose a new school",
                }),
              ],
            }),
          ],
        }),
      D &&
        (0, s.jsxs)(Ao, {
          title: "How to play",
          onClose: () => B(!1),
          children: [
            (0, s.jsx)("p", { className: "eyebrow", children: "THE COACH\u2019S HANDBOOK" }),
            (0, s.jsx)("h2", { children: "Build your dynasty." }),
            (0, s.jsxs)("ol", {
              className: "instructions",
              children: [
                (0, s.jsxs)("li", {
                  children: [
                    (0, s.jsx)("strong", { children: "Fill your roster." }),
                    " You need 8 to 15 players. Scout recruits, pitch what they care about, and send offers. The best recruits have rival schools chasing them, so check who is leading. Use Choice 1, 2 and 3 on My recruits for backup plans.",
                  ],
                }),
                (0, s.jsxs)("li", {
                  children: [
                    (0, s.jsx)("strong", { children: "Spend your NIL wisely." }),
                    " Offers reserve money and roster spots. Big programs pay full price for stars, small ones pay a premium. Donors give more when you win and the program is excited.",
                  ],
                }),
                (0, s.jsxs)("li", {
                  children: [
                    (0, s.jsx)("strong", { children: "Set your team up." }),
                    " Pick five starters, 200 minutes and a system. Players out of position lose rating. The lineup-fit chips show whether your five can shoot, handle, defend, rebound and protect the rim.",
                  ],
                }),
                (0, s.jsxs)("li", {
                  children: [
                    (0, s.jsx)("strong", { children: "Keep players happy." }),
                    " Promise roles, give raises when they break out, and watch their personalities. Loyal players stay, ambitious ones leave if blocked. Offseason pop-ups handle the draft, the transfer portal and contract talks.",
                  ],
                }),
                (0, s.jsxs)("li", {
                  children: [
                    (0, s.jsx)("strong", { children: "Draft and portal." }),
                    " After the season, underclassmen that pro teams like declare for the draft and unhappy players enter the transfer portal. You get one conversation with each, where extra NIL and a promised role raise the odds that he stays. Anyone you let go leaves for good. Players from other schools in the portal can be recruited under Recruiting > Transfer portal. Each of those pop-ups has a “How the draft works” or “How the transfer portal works” box, and the Draft decisions and Transfer decisions buttons on Program HQ reopen them.",
                  ],
                }),
                (0, s.jsxs)("li", {
                  children: [
                    (0, s.jsx)("strong", { children: "Play the season." }),
                    " Sim games or a whole week, and react to injuries. The Top 25 is on League news. The Season center shows around the nation, your tournament r\u00e9sum\u00e9 and the bubble.",
                  ],
                }),
                (0, s.jsxs)("li", {
                  children: [
                    (0, s.jsx)("strong", { children: "Chase March." }),
                    " Win your conference tournament for an automatic bid, or build a strong r\u00e9sum\u00e9 for an at-large spot. The 68-team field is seeded 1 to 16 in four regions; the last four at-large teams and the last four automatic qualifiers play First Four games first.",
                  ],
                }),
                (0, s.jsxs)("li", {
                  children: [
                    (0, s.jsx)("strong", { children: "Meet expectations." }),
                    " Each school has a win goal and something it values, like a title or a tournament trip. Miss it after your grace period and you can be fired. Win big and other schools will call.",
                  ],
                }),
                (0, s.jsxs)("li", {
                  children: [
                    (0, s.jsx)("strong", { children: "Move up." }),
                    " When your reputation reaches the next level you can join a tougher conference with more money. Your nonconference schedule always follows your reputation and team strength.",
                  ],
                }),
                (0, s.jsxs)("li", {
                  children: [
                    (0, s.jsx)("strong", { children: "Build a legacy." }),
                    " Awards, retired jerseys, draft picks and achievements pile up under the coach icon and Career history. Settings has music, sound effects, pop-up toggles, difficulty, undo and save slots.",
                  ],
                }),
              ],
            }),
            (0, s.jsx)("p", {
              className: "muted",
              children:
                "Your offline career saves in this browser on this computer. Use Export career to back it up before moving this HTML file or clearing browser data. Import career restores an exported save. The online game and this desktop edition have separate saves. The My recruits page tracks decisions and commitments. Auto-recruit advances rounds and uses the walk-on pool to complete a balanced 15-player roster. Guarantee road games fund extra NIL immediately and renew with the following season\u2019s schedule. Removing a contract removes its funding, so already committed money must remain covered. Scouting uses two visits to reveal exact ratings. A redshirt preserves one season of eligibility.",
            }),
          ],
        }),
    ],
  });
}
