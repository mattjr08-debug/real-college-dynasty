function $C({ g: e, run: a, openBox: t, select: l, askSim: askSim, openLive: openLive }) {
  let [sct, setSct] = (0, N.useState)(
      e.bracket.length > 0 && (e.phase === "Conference tournament" || e.phase === "National tournament")
        ? "Tournament bracket"
        : "Standings & leaders"
    ),
    u = dl(e),
    o = e.schedule.filter((f) => f.played),
    r = e.schedule.find((f) => !f.played),
    n = ["Regular season", "Conference tournament", "National tournament"].includes(e.phase),
    i = e.bracket[e.tournamentRound]?.find((f) => f.a.id === e.school.id || f.b.id === e.school.id),
    d = i ? (i.a.id === e.school.id ? i.b : i.a) : null;
  return (0, s.jsxs)(s.Fragment, {
    children: [
      (0, s.jsxs)("div", {
        className: "season-control",
        children: [
          (0, s.jsxs)("div", {
            children: [
              (0, s.jsx)("p", { className: "eyebrow", children: e.phase.toUpperCase() }),
              (0, s.jsx)("h2", {
                children:
                  e.phase === "Season review"
                    ? e.result || "Season complete"
                    : e.phase.includes("tournament")
                      ? `${e.tournament} \xB7 ${e.tournament === "National" ? natNames(e.bracket[0]?.[0]?.ff)[e.tournamentRound] : e.tournament === "NIT" ? NIT_NAMES[e.tournamentRound] : [...(e.bracket[0]?.[0]?.pi ? ["First round"] : []), "Quarterfinal", "Semifinal", "Championship"][e.tournamentRound]}`
                      : `${u.wins} WINS. ${u.losses} LOSSES.`,
              }),
              (0, s.jsx)("p", {
                children:
                  e.phase === "Offseason"
                    ? "Finish your offseason checklist and begin the season."
                    : e.phase === "Season review"
                      ? `${e.berth || "Your season is in the books."} \xB7 Next year\u2019s NIL: ${q(e.budget)}`
                      : d
                        ? `Next matchup: ${d.name} \xB7 ${d.rating} OVR`
                        : r
                          ? `Next: ${r.venue === "Away" ? "at" : "vs"} ${r.opponent}`
                          : "Your postseason awaits.",
              }),
            ],
          }),
          (0, s.jsx)("div", {
            className: "sim-buttons",
            children:
              e.phase === "Season review"
                ? (0, s.jsx)(X, {
                    primary: !0,
                    onClick: () => {
                      a({ type: "nextYear" });
                    },
                    children: "Begin next offseason",
                  })
                : (0, s.jsxs)(s.Fragment, {
                    children: [
                      (0, s.jsxs)(X, {
                        primary: !0,
                        disabled: !n,
                        onClick: () => {
                          askSim(1);
                        },
                        children: [
                          (0, s.jsx)(bt, { size: 16 }),
                          e.phase.includes("tournament") ? "Sim next round" : "Sim game",
                        ],
                      }),
                      (0, s.jsx)(X, {
                        disabled: e.phase !== "Regular season",
                        onClick: () => {
                          askSim(7);
                        },
                        children: "Sim week",
                      }),
                      (0, s.jsx)(X, {
                        disabled: e.phase !== "Regular season",
                        onClick: () => {
                          openLive();
                        },
                        children: "Game day (live)",
                      }),
                      (0, s.jsxs)(X, {
                        disabled: e.phase !== "Regular season",
                        onClick: () => {
                          askSim("season");
                        },
                        children: [(0, s.jsx)(Fl, { size: 16 }), "Sim regular season"],
                      }),
                    ],
                  }),
          }),
        ],
      }),
      e.phase === "Season review" &&
        (0, s.jsxs)("div", {
          className: "review-strip",
          children: [
            (0, s.jsx)(ba, { size: 30 }),
            (0, s.jsxs)("div", {
              children: [
                (0, s.jsx)("strong", { children: e.history.at(-1)?.award }),
                (0, s.jsxs)("p", {
                  children: [
                    e.confChampion ? "Conference champions \xB7 " : "",
                    "Reputation ",
                    e.rep,
                    "/99 \xB7 NIL budget ",
                    q(e.lastBudget),
                    " \u2192 ",
                    q(e.budget),
                  ],
                }),
              ],
            }),
            (0, s.jsx)(he, { tone: "orange", children: e.history.at(-1)?.result }),
          ],
        }),
      (0, s.jsx)("div", {
        className: "toolbar",
        children: (0, s.jsx)("div", {
          className: "chips",
          children: [
            "Standings & leaders",
            ...(e.bracket.length > 0 ? ["Tournament bracket"] : []),
            "Tournament résumé",
            "Bubble watch",
            "Conference tournaments",
            "Around the nation",
            "Team schedules",
            "Game results",
          ].map((d) =>
            (0, s.jsx)(
              "button",
              { className: d === sct ? "active" : "", onClick: () => setSct(d), children: d },
              d
            )
          ),
        }),
      }),
      sct === "Tournament résumé" && (0, s.jsx)(ResumePanel, { g: e }),
      sct === "Bubble watch" && (0, s.jsx)(BubblePanel, { g: e }),
      sct === "Conference tournaments" && (0, s.jsx)(ConfTourneys, { g: e }),
      sct === "Around the nation" && (0, s.jsx)(NationPanel, { g: e }),
      sct === "Team schedules" && (0, s.jsx)(TeamSchedules, { g: e }),
      (sct === "Standings & leaders" || (sct === "Tournament bracket" && !e.bracket.length)) &&
        (0, s.jsxs)("div", {
          className: "season-columns",
          children: [
            (0, s.jsx)(qe, {
              title: "Conference standings",
              meta: e.school.league,
              children: (0, s.jsx)("div", {
                className: "table-wrap",
                children: (0, s.jsxs)("table", {
                  children: [
                    (0, s.jsx)("thead", {
                      children: (0, s.jsxs)("tr", {
                        children: [
                          (0, s.jsx)("th", { children: "#" }),
                          (0, s.jsx)("th", { children: "TEAM" }),
                          (0, s.jsx)("th", { children: "CONF" }),
                          (0, s.jsx)("th", { children: "OVERALL" }),
                        ],
                      }),
                    }),
                    (0, s.jsx)("tbody", {
                      children: Qf(e).map((f, y) =>
                        (0, s.jsxs)(
                          "tr",
                          {
                            className: f.id === e.school.id ? "own-team" : "",
                            children: [
                              (0, s.jsx)("td", { children: y + 1 }),
                              (0, s.jsxs)("td", {
                                children: [
                                  (0, s.jsx)("strong", { children: f.name }),
                                  f.id === e.school.id && (0, s.jsx)(he, { tone: "orange", children: "YOU" }),
                                ],
                              }),
                              (0, s.jsxs)("td", { children: [f.cw, "\u2013", f.cl] }),
                              (0, s.jsxs)("td", { children: [f.wins, "\u2013", f.losses] }),
                            ],
                          },
                          f.id
                        )
                      ),
                    }),
                  ],
                }),
              }),
            }),
            (0, s.jsx)(qe, {
              title: "Team leaders",
              meta: "Season averages per game.",
              children: (0, s.jsx)("div", {
                className: "leader-list",
                children: [...e.roster]
                  .sort(
                    (f, y) => y.stats.pts / Math.max(1, y.stats.gp) - f.stats.pts / Math.max(1, f.stats.gp)
                  )
                  .slice(0, 5)
                  .map((f) =>
                    (0, s.jsxs)(
                      "button",
                      {
                        onClick: () => l(f.id),
                        children: [
                          (0, s.jsx)(Ja, { p: f, size: "tiny" }),
                          (0, s.jsxs)("div", {
                            children: [
                              (0, s.jsxs)("strong", {
                                children: [
                                  f.name,
                                  " ",
                                  (0, s.jsxs)("em", { className: "name-ovr", children: [Tt(f), " OVR"] }),
                                ],
                              }),
                              (0, s.jsxs)("span", {
                                children: [f.pos, " \xB7 ", Bn(f, "reb"), " REB \xB7 ", Bn(f, "ast"), " AST"],
                              }),
                            ],
                          }),
                          (0, s.jsxs)("b", {
                            children: [Bn(f, "pts"), (0, s.jsx)("small", { children: "PPG" })],
                          }),
                        ],
                      },
                      f.id
                    )
                  ),
              }),
            }),
          ],
        }),
      sct === "Tournament bracket" &&
        e.bracket.length > 0 &&
        (0, s.jsx)(qe, {
          title: `${e.tournament} tournament bracket`,
          meta: e.berth || "Win and advance.",
          children: (0, s.jsx)(BracketTree, {
            rounds: cbk(e, e.bracket),
            names:
              e.tournament === "National"
                ? natNames(!1)
                : e.tournament === "NIT"
                  ? NIT_NAMES
                  : ["Quarterfinals", "Semifinals", "Championship"],
            me: e.school.name,
            school: e.school,
            regions: e.tournament === "National" ? natRegionText(e.year) : null,
          }),
        }),
      sct === "Game results" &&
        (0, s.jsx)(qe, {
          title: "Game results",
          meta: `${o.length} games played`,
          children: (0, s.jsx)("div", {
            className: "results-grid",
            children: o.length
              ? [...o]
                  .reverse()
                  .map((f) =>
                    (0, s.jsxs)(
                      "button",
                      {
                        className: "game-result",
                        onClick: () => t(f.id),
                        children: [
                          (0, s.jsxs)("div", {
                            className: "row between",
                            children: [
                              (0, s.jsxs)("span", {
                                className: "table-sub",
                                children: [f.kind, " \xB7 ", f.venue],
                              }),
                              (0, s.jsx)(he, {
                                tone: f.win ? "green" : "red",
                                children: f.win ? "WIN" : "LOSS",
                              }),
                            ],
                          }),
                          (0, s.jsx)("h3", { children: f.opponent }),
                          (0, s.jsxs)("strong", {
                            children: [
                              f.us,
                              (0, s.jsx)("span", { children: " \u2013 " }),
                              f.them,
                              f.ot ? (0, s.jsx)("small", { children: " OT" }) : null,
                            ],
                          }),
                          (0, s.jsx)("span", { className: "table-sub", children: "View box score" }),
                        ],
                      },
                      f.id
                    )
                  )
              : (0, s.jsx)(yl, {
                  title: "Opening night is ahead",
                  body: "Start your season to see game results and player statistics.",
                }),
          }),
        }),
    ],
  });
}
