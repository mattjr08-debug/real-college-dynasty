function GameDay({ g: e, run: run, onClose: onClose }) {
  let nx = e.schedule.find((o) => !o.played),
    lv = e.live && nx && e.live.gid === nx.id ? e.live : null,
    last = [...e.schedule].filter((o) => o.played).at(-1),
    // after a reload (or re-opening) the saved replay of the game just played is shown again
    reopen = !lv && last && e.lastLive && e.lastLive.gid === last.id ? e.lastLive : null,
    [done, setDone] = (0, N.useState)(reopen ? !0 : null),
    hd = !lv && done && last ? last : nx,
    // the replayed log: first half while live, the whole game once the second half has been simulated
    ll = !lv && done && last && e.lastLive && e.lastLive.gid === last.id ? e.lastLive : null,
    full = lv ? lv.log || [] : ll ? ll.log : [],
    n1 = lv ? (lv.log || []).length : ll ? ll.n1 : 0,
    // how many plays are on screen (re-opening Game Day mid-game skips straight to halftime)
    [shown, setShown] = (0, N.useState)(() => (lv ? (lv.log || []).length : reopen ? reopen.log.length : 0)),
    [spd, setSpd] = (0, N.useState)(CFG.pbpSpeed || 160),
    target = full.length,
    playing = (lv || ll) && shown < target,
    // to: stopped at one of your timeouts (not halftime); tp: stop at your timeouts (Game Day setting, on unless turned off)
    to = !!(lv && lv.ph === "to"),
    [tp, setTp] = (0, N.useState)(CFG.toPause !== false),
    tpBox = (0, s.jsxs)("label", {
      className: "muted",
      style: { display: "flex", gap: 6, alignItems: "center", marginTop: 10 },
      children: [
        (0, s.jsx)("input", {
          type: "checkbox",
          "aria-label": "Stop at my timeouts",
          checked: tp,
          onChange: (z) => {
            (setTp(z.target.checked), (CFG.toPause = z.target.checked), saveCfg());
          },
        }),
        "Stop at my timeouts (make substitutions and tactic changes there, as at halftime)",
      ],
    }),
    h1 = lv ? (lv.hb ?? lv.done) : ll ? ll.h1 : 35,
    hT = lv ? lv.h : ll ? ll.h : 70;
  (0, N.useEffect)(() => {
    if (!playing) return;
    let t = setTimeout(() => setShown((x) => Math.min(target, x + 1)), spd);
    return () => clearTimeout(t);
  }, [playing, shown, spd, target]);
  let vis = full.slice(0, Math.min(shown, target)),
    sc = 0,
    so = 0,
    rows = vis.map((z) => {
      z.t === "us" ? (sc += z.p) : (so += z.p);
      return { ...z, a: sc, b: so };
    }),
    cur = rows.at(-1),
    // game clock from the possession number
    clk = (m, z) => {
      if (m === void 0) return "20:00";
      // plays from the engine's game clock carry the seconds left in the period (older replays fall back to the estimate)
      if (z && z.k !== void 0) {
        let sec = Math.max(0, z.k);
        return `${z.q > 2 ? "OT " : ""}${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
      }
      let half2 = m > h1,
        span = half2 ? Math.max(1, hT - h1) : Math.max(1, h1),
        k = half2 ? m - h1 : m;
      if (half2 && m > hT) return "OT";
      let sec = Math.max(0, Math.round(1200 * (1 - k / span)));
      return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
    },
    per = !cur ? "1ST HALF" : cur.m > hT ? "OVERTIME" : cur.m > h1 ? "2ND HALF" : "1ST HALF",
    me = e.school.short || e.school.name,
    them = hd ? hd.opponent : "Opponent",
    half = lv && !playing,
    fin = done && last && !lv && !playing,
    // look-and-feel item 6 (display only): opponent logo and color, shot clock and momentum read from the play log
    oppT = hd && (e.league.find((z) => z.id === hd.oppId) || e.opponents.find((z) => z.id === hd.oppId)),
    oppS = oppT ? hqOppSchool(oppT) : { id: them, name: them, short: "", mascot: "", color: "#9aa3b5" },
    prev = rows.at(-2),
    // the shot clock when the last play happened: 30 minus the time since the play before it (same period only)
    shot = cur && prev && cur.k !== void 0 && prev.k !== void 0 && cur.q === prev.q ? Math.max(0, Math.min(30, 30 - (prev.k - cur.k))) : null,
    // momentum: net points over the last 12 plays, -12..+12 mapped onto the bar (50% = even)
    mom = rows.slice(-12).reduce((x, z) => x + (z.p ? (z.t === "us" ? z.p : -z.p) : 0), 0),
    momPct = 50 + (Math.max(-12, Math.min(12, mom)) / 12) * 50,
    board = (lbl) =>
      (0, s.jsxs)("div", {
        className: "gd-board",
        style: { "--opp": oppS.color },
        children: [
          (0, s.jsxs)("div", {
            className: "gd-team us",
            children: [
              (0, s.jsx)("div", { className: "gd-logo", children: (0, s.jsx)(SchoolLogo, { school: e.school }) }),
              (0, s.jsxs)("div", {
                className: "gd-team-txt",
                children: [(0, s.jsx)("span", { children: e.school.name }), (0, s.jsx)("strong", { children: fin ? last.us : sc })],
              }),
            ],
          }),
          (0, s.jsxs)("div", {
            className: "gd-clock" + (half || fin ? " pause" : ""),
            children: [
              (0, s.jsx)("small", { children: lbl }),
              (0, s.jsx)("b", { children: fin ? "FINAL" : half && !to ? "HALFTIME" : clk(cur?.m, cur) }),
              !fin &&
                !(half && !to) &&
                (0, s.jsxs)("span", {
                  className: "gd-shot",
                  title: "Shot clock when the last play happened",
                  children: [(0, s.jsx)("i", { children: "SHOT" }), shot == null ? "–" : String(Math.round(shot)).padStart(2, "0")],
                }),
            ],
          }),
          (0, s.jsxs)("div", {
            className: "gd-team them",
            children: [
              (0, s.jsxs)("div", {
                className: "gd-team-txt",
                children: [(0, s.jsx)("span", { children: them }), (0, s.jsx)("strong", { children: fin ? last.them : so })],
              }),
              (0, s.jsx)("div", { className: "gd-logo", children: (0, s.jsx)(SchoolLogo, { school: oppS }) }),
            ],
          }),
          rows.length > 0 &&
            (0, s.jsxs)("div", {
              className: "gd-mom",
              title: "Momentum: points over the last 12 plays",
              children: [
                (0, s.jsx)("span", { children: "MOMENTUM" }),
                (0, s.jsx)("div", {
                  className: "gd-mom-bar",
                  role: "img",
                  "aria-label": `Momentum ${mom > 0 ? "with " + me : mom < 0 ? "with " + them : "even"}`,
                  children: (0, s.jsx)("i", { style: { width: `${momPct}%` } }),
                }),
              ],
            }),
        ],
      }),
    // small icon for each play-by-play line, read from its text
    ico = (z) =>
      z.p
        ? ["make", "+" + z.p]
        : /timeout/i.test(z.x)
          ? ["tmo", "T"]
          : /foul|bonus/i.test(z.x)
            ? ["foul", "F"]
            : /miss|block/i.test(z.x)
              ? ["miss", "✕"]
              : /turn|steal|violation/i.test(z.x)
                ? ["tov", "TO"]
                : /substitution/i.test(z.x)
                  ? ["sub", "⇄"]
                  : /rebound/i.test(z.x)
                    ? ["reb", "R"]
                    : ["info", "•"],
    // item 22: scouting report with a suggested approach (before tip-off and at halftime)
    scoutBox = (game) => {
      let sc = game && W_scout(e, game);
      if (!sc) return null;
      let same = e.tactics.offense === sc.offense && e.tactics.defense === sc.defense && e.tactics.pace === sc.pace;
      return (0, s.jsxs)("div", {
        className: "scout-box",
        children: [
          (0, s.jsx)("h3", { style: { marginTop: 14 }, children: "Scouting report: " + game.opponent }),
          (0, s.jsx)("p", {
            className: "muted",
            children: "Key players: " + sc.keys.map((k) => k.name + " (" + k.pos + ", " + k.ovr + ", " + k.arch + ")").join(" · "),
          }),
          (0, s.jsxs)("p", { children: [(0, s.jsx)("b", { children: "Strengths: " }), sc.str.join(", "), " ", (0, s.jsx)("b", { children: " Weaknesses: " }), sc.weak.join(", ")] }),
          (0, s.jsxs)("p", {
            children: [
              (0, s.jsx)("b", { children: "Suggested approach: " }),
              sc.offense + " offense, " + sc.defense + ", " + sc.pace.toLowerCase() + " pace. ",
              (0, s.jsx)("span", { className: "muted", children: sc.why.join(" ") }),
            ],
          }),
          !same &&
            (0, s.jsx)(X, {
              onClick: () => {
                run({ type: "tactics", key: "offense", value: sc.offense });
                run({ type: "tactics", key: "defense", value: sc.defense });
                run({ type: "tactics", key: "pace", value: sc.pace });
              },
              children: "Use the suggested approach",
            }),
        ],
      });
    },
    feed = (ttl) =>
      (0, s.jsxs)(s.Fragment, {
        children: [
          (0, s.jsx)("h3", { className: "gd-feed-title", children: ttl }),
          (0, s.jsx)("div", {
            className: "season-list gd-feed",
            children: [...rows]
              .slice(-60)
              .reverse()
              .map((z, i) =>
                (0, s.jsxs)(
                  "div",
                  {
                    className: `season-game ${z.p ? "score" : ""} ${z.t}`,
                    children: [
                      (0, s.jsx)("span", { className: "muted gd-time", children: clk(z.m, z) }),
                      (0, s.jsx)("span", { className: "gd-play", children: [(0, s.jsx)("i", { className: "gd-ico " + ico(z)[0], "aria-hidden": "true", children: ico(z)[1] }, "i"), z.x] }),
                      (0, s.jsx)("b", { children: z.p ? `${z.a}–${z.b}` : "" }),
                    ],
                  },
                  rows.length - i
                )
              ),
          }),
        ],
      });
  return (0, s.jsxs)("div", {
    className: "ceremony gameday",
    children: [
      (0, s.jsxs)("div", {
        className: "ceremony-head",
        children: [
          (0, s.jsx)("div", { className: "ceremony-icon", children: (0, s.jsx)(bt, { size: 26 }) }),
          (0, s.jsxs)("div", {
            children: [
              (0, s.jsx)("p", { className: "eyebrow", children: "GAME DAY" }),
              (0, s.jsx)("h2", {
                children: hd ? `${hd.venue === "Away" ? "at" : "vs"} ${hd.opponent}` : "No game scheduled",
              }),
              (0, s.jsx)("p", {
                className: "ceremony-sub",
                children: hd
                  ? `${W_gdate(e, Math.max(0, e.schedule.indexOf(hd)))} · ${hd.event || hd.kind}${hd.venue === "Neutral" ? " · neutral site" : ""}${hd.rival ? " · RIVALRY GAME" : ""} · ${hd.rating} OVR · your team ${Ps(e)} OVR`
                  : "",
              }),
            ],
          }),
        ],
      }),
      (0, s.jsxs)("div", {
        className: "ceremony-scroll",
        children: [
          playing
            ? (0, s.jsxs)(s.Fragment, { children: [board(per), feed(cur && cur.m > h1 ? "Live: second half" : "Live: first half")] })
            : half
              ? (0, s.jsxs)(s.Fragment, {
                  children: [
                    board(to ? "TIMEOUT" : "END OF 1ST HALF"),
                    (0, s.jsx)("div", {
                      className: "stat-trio",
                      children: [
                        [to ? "TIMEOUT" : "HALFTIME", `${me} ${sc} – ${so} ${them}`],
                        [
                          "LEADING SCORER",
                          (() => {
                            let b = [...lv.u].sort((x, y) => y.pts - x.pts)[0];
                            return b ? `${b.name} (${b.pts})` : "—";
                          })(),
                        ],
                        ["LINEUP FIT", `${W_fit(e).s >= 0 ? "+" : ""}${W_fit(e).s.toFixed(1)}`],
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
                    (0, s.jsxs)("section", {
                      className: "gd-half-panel" + (to ? " timeout" : ""),
                      "aria-label": to ? "Timeout adjustments" : "Halftime adjustments",
                      children: [
                    (0, s.jsx)("h3", { style: { marginTop: 14 }, children: to ? "Timeout adjustments" : "Halftime adjustments" }),
                    (0, s.jsx)("div", {
                      className: "rp-grid",
                      children: [
                        ["offense", "Offense", ["Balanced", "Perimeter", "Inside-out"]],
                        ["defense", "Defense", ["Man-to-man", "2–3 zone", "Full-court press"]],
                        ["pace", "Pace", ["Slow", "Balanced", "Fast"]],
                      ]
                        // the number of possessions is set at tip-off and halftime, so pace can only change at halftime
                        .filter((z) => !to || z[0] !== "pace")
                        .map(([k, l, o]) =>
                        (0, s.jsxs)(
                          "div",
                          {
                            children: [
                              (0, s.jsx)("small", { children: l.toUpperCase() }),
                              (0, s.jsx)("select", {
                                value: e.tactics[k],
                                onChange: (z) => {
                                  run({ type: "tactics", key: k, value: z.target.value });
                                },
                                children: o.map((z) => (0, s.jsx)("option", { value: z, children: z }, z)),
                              }),
                            ],
                          },
                          k
                        )
                      ),
                    }),
                    (0, s.jsx)("div", {
                      className: "rp-grid",
                      children: (0, s.jsxs)("div", {
                        children: [
                          (0, s.jsx)("small", { children: "TIMEOUTS (" + (lv.tos ? lv.tos[0] : 4) + " LEFT)" }),
                          (0, s.jsx)("select", {
                            "aria-label": "Timeout style",
                            value: e.tactics.tmo || "Normal",
                            onChange: (z) => {
                              run({ type: "tactics", key: "tmo", value: z.target.value });
                            },
                            children: [
                              ["Quick", "Call them early (after a 3-0 run)"],
                              ["Normal", "Normal (after a 4-0 run)"],
                              ["Save", "Save two for the finish"],
                            ].map((z) => (0, s.jsx)("option", { value: z[0], children: z[1] }, z[0])),
                          }),
                        ],
                      }),
                    }),
                      ],
                    }),
                    (0, s.jsx)("h3", { style: { marginTop: 14 }, children: "Substitutions" }),
                    (0, s.jsx)("div", {
                      className: "season-list",
                      children: e.lineup
                        .map((id) => e.roster.find((r) => r.id === id))
                        .filter(Boolean)
                        .map((pl) => {
                          let bx = lv.u.find((z) => z.id === pl.id),
                            bench = e.roster.filter((r) => !e.lineup.includes(r.id) && !r.redshirt && !r.injury);
                          return (0, s.jsxs)(
                            "div",
                            {
                              className: "season-game",
                              children: [
                                (0, s.jsx)("span", { className: "gd-play", children: pl.name + " · " + pl.pos + " · " + pl.ovr + " OVR" }),
                                (0, s.jsx)("span", { className: "muted", children: bx ? bx.pts + " pts · " + (bx.pf || 0) + " fouls" : "" }),
                                (0, s.jsxs)("select", {
                                  "aria-label": "Sit " + pl.name + " and put in",
                                  value: "",
                                  onChange: (z) => z.target.value && run({ type: "liveSub", out: pl.id, in: z.target.value }),
                                  children: [
                                    (0, s.jsx)("option", { value: "", children: "Sub in…" }, "x"),
                                    ...bench.map((r) => (0, s.jsx)("option", { value: r.id, children: r.name + " (" + r.pos + ", " + r.ovr + ")" }, r.id)),
                                  ],
                                }),
                              ],
                            },
                            pl.id
                          );
                        }),
                    }),
                    scoutBox(nx),
                    W_fit(e).n.filter((z) => !z.g).length > 0 &&
                      (0, s.jsx)("p", {
                        className: "muted",
                        children:
                          "Lineup problems: " +
                          W_fit(e)
                            .n.filter((z) => !z.g)
                            .map((z) => z.t)
                            .join("; "),
                      }),
                    tpBox,
                    feed(to ? "Play by play so far" : "First-half play by play"),
                  ],
                })
              : fin
                ? (0, s.jsxs)(s.Fragment, {
                    children: [
                      board(last.win ? "WIN" : "LOSS"),
                      (0, s.jsx)("div", {
                        className: "stat-trio",
                        children: (() => {
                          let b = last.box || [],
                            S = (k) => b.reduce((x, y) => x + (y[k] || 0), 0),
                            pc = (m, a) => (a ? Math.round((100 * m) / a) + "%" : "—"),
                            top = [...b].sort((x, y) => y.pts - x.pts)[0],
                            rb = [...b].sort((x, y) => y.reb - x.reb)[0],
                            as = [...b].sort((x, y) => y.ast - x.ast)[0];
                          return [
                            ["FINAL", `${last.us}–${last.them}${last.ot ? " OT" : ""}`],
                            [
                              "SHOOTING",
                              `${pc(S("fgm"), S("fga"))} FG · ${pc(S("tpm"), S("tpa"))} 3P · ${pc(S("ftm"), S("fta"))} FT`,
                            ],
                            ["TEAM TOTALS", `${S("reb")} reb · ${S("ast")} ast · ${S("to")} TO`],
                            ["TOP SCORER", top ? `${top.name} (${top.pts})` : "—"],
                            ["TOP REBOUNDER", rb ? `${rb.name} (${rb.reb})` : "—"],
                            ["TOP PASSER", as ? `${as.name} (${as.ast})` : "—"],
                          ].map((z) =>
                            (0, s.jsxs)(
                              "div",
                              {
                                children: [
                                  (0, s.jsx)("small", { children: z[0] }),
                                  (0, s.jsx)("strong", { style: { fontSize: "1rem" }, children: z[1] }),
                                ],
                              },
                              z[0]
                            )
                          );
                        })(),
                      }),
                      (0, s.jsx)("p", {
                        className: "ceremony-body",
                        children: last.win
                          ? "A win is a win. See how it moved your resume on the Season center."
                          : "A tough one. Check your lineup fit and your injuries before the next game.",
                      }),
                      rows.length > 0 && feed("Play by play"),
                    ],
                  })
                : (0, s.jsxs)(s.Fragment, {
                    children: [
                      (0, s.jsx)("p", {
                        className: "ceremony-body",
                        children: nx
                          ? "Tip off and watch the game play by play. At halftime, and at each of your own timeouts if you like, you can change your tactics, make substitutions and set your timeout style, then play on."
                          : "Play the season first.",
                      }),
                      nx && tpBox,
                      scoutBox(nx),
                    ],
                  }),
        ],
      }),
      (0, s.jsx)("div", {
        className: "ceremony-foot",
        children: (0, s.jsxs)("div", {
          className: "row gap",
          children: [
            (0, s.jsx)(X, { onClick: onClose, children: "Close" }),
            playing
              ? (0, s.jsxs)(s.Fragment, {
                  children: [
                    (0, s.jsx)("select", {
                      "aria-label": "Play-by-play speed",
                      value: spd,
                      onChange: (z) => {
                        (setSpd(+z.target.value), (CFG.pbpSpeed = +z.target.value), saveCfg());
                      },
                      children: [
                        [450, "Slow"],
                        [160, "Normal"],
                        [50, "Fast"],
                      ].map((z) => (0, s.jsx)("option", { value: z[0], children: z[1] }, z[0])),
                    }),
                    (0, s.jsx)(X, {
                      primary: !0,
                      onClick: () => setShown(target),
                      children: lv ? (to ? "Skip to the timeout" : "Skip to halftime") : "Skip to the final",
                    }),
                  ],
                })
              : lv
                ? (0, s.jsxs)(s.Fragment, {
                    children: [
                      (0, s.jsx)(X, {
                        onClick: () => {
                          run({ type: "autoCoach" });
                        },
                        children: "Auto-set coaching",
                      }),
                      (0, s.jsx)(X, {
                        primary: !0,
                        onClick: () => {
                          (setDone(!0), setShown(n1), run({ type: "liveFinish", pause: tp }));
                        },
                        children: to ? "Resume play" : "Play the second half",
                      }),
                    ],
                  })
                : nx &&
                  e.phase === "Regular season" &&
                  (0, s.jsx)(X, {
                    primary: !0,
                    onClick: () => {
                      (setDone(null), setShown(0), run({ type: "liveStart", pause: tp }));
                    },
                    children: done ? "Next game: tip off" : "Tip off",
                  }),
          ],
        }),
      }),
    ],
  });
}
