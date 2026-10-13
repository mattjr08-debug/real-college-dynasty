function NewsPage({ g: e, run: run }) {
  let [t, setT] = (0, N.useState)("Headlines"),
    vac = (e.vac || []).map((id) => Xl.find((h) => h.id === id)).filter(Boolean),
    mk = W_mock(e),
    mock = mk.rows,
    // top 50 players in the nation by production per game (min 8 games played), adjusted for conference and schedule strength
    sosAdj = t === "Top 50" ? Object.fromEntries(W_all(e).map((z) => [z.id, W_sosAdj(z)])) : {},
    top50 =
      t === "Top 50"
        ? [
            ...Object.entries(e.rosters || {}).flatMap(([id, R]) =>
              R.filter((p) => p.s.g >= 8).map((p) => ({
                n: p.n,
                tid: id,
                t: (e.opponents.find((z) => z.id === id) || {}).name,
                p: p.p,
                y: p.y,
                o: p.o,
                g: p.s.g,
                pts: p.s.p,
                reb: p.s.r,
                ast: p.s.a,
                stl: p.s.s,
                blk: p.s.b,
              }))
            ),
            ...e.roster
              .filter((l) => l.stats.gp >= 8)
              .map((l) => ({
                n: l.name,
                tid: e.school.id,
                t: e.school.name,
                p: l.pos,
                y: l.year,
                o: l.ovr,
                g: l.stats.gp,
                pts: l.stats.pts,
                reb: l.stats.reb,
                ast: l.stats.ast,
                stl: l.stats.stl,
                blk: l.stats.blk,
                you: 1,
              })),
          ]
            .map((z) => ({ ...z, v: ((z.pts + 1.2 * z.reb + 1.5 * z.ast + 2 * z.stl + 2 * z.blk) / z.g) * (sosAdj[z.tid] || 1) }))
            .sort((a, b) => b.v - a.v)
            .slice(0, 50)
        : [];
  return (0, s.jsxs)(s.Fragment, {
    children: [
      (0, s.jsx)("div", {
        className: "toolbar",
        children: (0, s.jsx)("div", {
          className: "chips",
          children: ["Headlines", "Coaching carousel", "Draft results", "Mock draft", "Top 50", "Top 25", "Conference ranking", "Transfer portal", "Recruiting classes", "Advanced stats"].map((d) =>
            (0, s.jsx)(
              "button",
              { className: d === t ? "active" : "", onClick: () => setT(d), children: d },
              d
            )
          ),
        }),
      }),
      t === "Transfer portal" && (0, s.jsx)(PortalTracker, { g: e }),
      t === "Recruiting classes" && (0, s.jsx)(ClassRankPanel, { g: e }),
      t === "Advanced stats" && (0, s.jsx)(AdvStatsPanel, { g: e }),
      t === "Headlines" &&
        (0, s.jsx)(qe, {
          title: "The Athletic Desk",
          meta: "Storylines from around the league.",
          children: (0, s.jsx)("div", {
            className: "departure-list",
            children: (e.lnews || []).length
              ? e.lnews
                  .slice(0, 25)
                  .map((n, i) =>
                    (0, s.jsxs)(
                      "div",
                      {
                        children: [
                          (0, s.jsx)("strong", { children: n.t }),
                          (0, s.jsx)("span", { children: n.b }),
                          (0, s.jsx)(he, { children: n.y }),
                        ],
                      },
                      i
                    )
                  )
              : (0, s.jsx)("p", { className: "muted", children: "Headlines show up as the season goes on." }),
          }),
        }),
      t === "Coaching carousel" &&
        (0, s.jsxs)(qe, {
          title: "Coaching carousel",
          meta: "Schools that just fired their coach. Apply once the season is over.",
          children: [
            vac.length
              ? (0, s.jsx)("div", {
                  className: "lost-list",
                  style: { padding: "14px 18px" },
                  children: vac.map((h) =>
                    (0, s.jsxs)(
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
                              (0, s.jsx)("small", {
                                children: `${q(h.budget)} NIL budget \u00B7 ${h.difficulty} \u00B7 win goal about ${[12, 13, 13, 15, 17][tierOf({ school: h })]}`,
                              }),
                            ],
                          }),
                          (0, s.jsx)(X, {
                            small: !0,
                            primary: !0,
                            disabled: !["Season review", "Offseason"].includes(e.phase),
                            onClick: () => {
                              run({ type: "applyJob", school: h.id });
                            },
                            children: "Apply",
                          }),
                        ],
                      },
                      h.id
                    )
                  ),
                })
              : (0, s.jsx)("p", {
                  className: "muted",
                  style: { padding: "14px 18px" },
                  children:
                    "No playable schools have open jobs right now. Openings appear when a program fires its coach at the end of a season.",
                }),
            (0, s.jsx)("div", {
              className: "departure-list",
              children: (e.lnews || [])
                .filter((n) => n.t === "Coaching change")
                .slice(0, 8)
                .map((n, i) =>
                  (0, s.jsxs)(
                    "div",
                    {
                      children: [
                        (0, s.jsx)("strong", { children: "Fired" }),
                        (0, s.jsx)("span", { children: n.b }),
                        (0, s.jsx)(he, { children: n.y }),
                      ],
                    },
                    i
                  )
                ),
            }),
          ],
        }),
      t === "Draft results" &&
        (0, s.jsx)(qe, {
          title: "Draft results",
          meta: (e.draftLog && e.draftLog[0] && e.draftLog[0].stat) || "The most recent drafts.",
          children: (e.draftLog || []).length
            ? (0, s.jsx)("div", {
                className: "table-wrap",
                children: (0, s.jsxs)("table", {
                  children: [
                    (0, s.jsx)("thead", {
                      children: (0, s.jsx)("tr", {
                        children: ["YEAR", "PICK", "PLAYER", "POS", "OVR", "FROM"].map((z) =>
                          (0, s.jsx)("th", { children: z }, z)
                        ),
                      }),
                    }),
                    (0, s.jsx)("tbody", {
                      children: e.draftLog
                        .slice(0, 2)
                        .flatMap((d) =>
                          d.picks
                            .slice(0, 30)
                            .map((p) =>
                              (0, s.jsxs)(
                                "tr",
                                {
                                  children: [
                                    (0, s.jsx)("td", { children: d.y }),
                                    (0, s.jsx)("td", { children: p.pk }),
                                    (0, s.jsxs)("td", {
                                      children: [
                                        p.n,
                                        p.y === 1 && (0, s.jsx)(he, { children: "FR" }),
                                        p.ret && (0, s.jsx)(he, { tone: "green", children: "RETURNED" }),
                                      ],
                                    }),
                                    (0, s.jsx)("td", { children: p.p }),
                                    (0, s.jsx)("td", { children: p.o }),
                                    (0, s.jsx)("td", { className: "muted", children: p.t }),
                                  ],
                                },
                                d.y + "-" + p.pk
                              )
                            )
                        ),
                    }),
                  ],
                }),
              })
            : (0, s.jsx)("p", {
                className: "muted",
                style: { padding: "14px 18px" },
                children: "The first draft happens after this season.",
              }),
        }),
      t === "Top 25" && (0, s.jsx)(Top25Panel, { g: e }),
      t === "Conference ranking" && (0, s.jsx)(ConfRankPanel, { g: e }),
      t === "Top 50" &&
        (0, s.jsx)(qe, {
          title: "Top 50 players in the nation",
          meta: "Ranked by production per game (points, rebounds, assists, steals, blocks), adjusted for conference and schedule strength. Needs 8 games played. Your players are highlighted.",
          children: top50.length
            ? (0, s.jsx)("div", {
                className: "table-wrap",
                children: (0, s.jsxs)("table", {
                  children: [
                    (0, s.jsx)("thead", {
                      children: (0, s.jsx)("tr", {
                        children: ["#", "PLAYER", "POS", "CLASS", "OVR", "PPG", "RPG", "APG", "SPG", "BPG", "SCHOOL"].map(
                          (z) => (0, s.jsx)("th", { children: z }, z)
                        ),
                      }),
                    }),
                    (0, s.jsx)("tbody", {
                      children: top50.map((z, i) =>
                        (0, s.jsxs)(
                          "tr",
                          {
                            className: z.you ? "you-row" : "",
                            children: [
                              (0, s.jsx)("td", { children: i + 1 }),
                              (0, s.jsx)("td", { children: z.n }),
                              (0, s.jsx)("td", { children: z.p }),
                              (0, s.jsx)("td", { children: ["", "Fr", "So", "Jr", "Sr"][z.y] || z.y }),
                              (0, s.jsx)("td", { children: z.o }),
                              (0, s.jsx)("td", { children: (z.pts / z.g).toFixed(1) }),
                              (0, s.jsx)("td", { children: (z.reb / z.g).toFixed(1) }),
                              (0, s.jsx)("td", { children: (z.ast / z.g).toFixed(1) }),
                              (0, s.jsx)("td", { children: (z.stl / z.g).toFixed(1) }),
                              (0, s.jsx)("td", { children: (z.blk / z.g).toFixed(1) }),
                              (0, s.jsx)("td", { className: "muted", children: z.t }),
                            ],
                          },
                          z.n + z.t
                        )
                      ),
                    }),
                  ],
                }),
              })
            : (0, s.jsx)("p", {
                className: "muted",
                style: { padding: "14px 18px" },
                children: "The list appears once players have played 8 games.",
              }),
        }),
      t === "Mock draft" &&
        (0, s.jsx)(qe, {
          title: "Mock draft",
          meta: mk.stat + ". Your players are highlighted.",
          children: (0, s.jsx)("div", {
            className: "table-wrap",
            children: (0, s.jsxs)("table", {
              children: [
                (0, s.jsx)("thead", {
                  children: (0, s.jsx)("tr", {
                    children: ["#", "PLAYER", "POS", "OVR", "UPSIDE", "CLASS", "PPG", "SCHOOL"].map((z) =>
                      (0, s.jsx)("th", { children: z }, z)
                    ),
                  }),
                }),
                (0, s.jsx)("tbody", {
                  children: mock.map((z) =>
                    (0, s.jsxs)(
                      "tr",
                      {
                        className: z.you ? "you-row" : "",
                        children: [
                          (0, s.jsx)("td", { children: z.pk <= 14 ? `${z.pk} (lottery)` : z.pk }),
                          (0, s.jsx)("td", { children: z.n }),
                          (0, s.jsx)("td", { children: z.p }),
                          (0, s.jsx)("td", { children: z.o }),
                          (0, s.jsx)("td", { children: z.pot }),
                          (0, s.jsx)("td", { children: ["", "Fr", "So", "Jr", "Sr"][z.y] || z.y }),
                          (0, s.jsx)("td", { children: z.ppg ? z.ppg.toFixed(1) : "\u2014" }),
                          (0, s.jsx)("td", { className: "muted", children: z.t }),
                        ],
                      },
                      z.n + z.t
                    )
                  ),
                }),
              ],
            }),
          }),
        }),
    ],
  });
}
