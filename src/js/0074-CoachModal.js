function CoachModal({ g: e, onClose: a }) {
  let h = e.history,
    W = h.reduce((x, y) => x + y.wins, 0),
    Lo = h.reduce((x, y) => x + y.losses, 0),
    titles = h.filter((x) => x.result === "National champions"),
    ff = h.filter((x) => ["National champions", "National runner-up", "Final Four"].includes(x.result)),
    cc = h.filter((x) => x.cc),
    dance = h.filter((x) => /berth/.test(x.bt || "")),
    nitT = h.filter((x) => x.result === "NIT champions"),
    nitIn = h.filter((x) => nitFinish(x)),
    coachHon = [],
    pl = {};
  h.forEach((x) =>
    (x.awards || []).forEach((o) =>
      o.list.forEach((p) => {
        if (p.you) {
          let y = `${x.year}\u2013${String(x.year + 1).slice(2)}`;
          p.pid ? (pl[p.n] = pl[p.n] || []).push(`${y} \u00B7 ${o.k}`) : coachHon.push(`${y} \u00B7 ${o.k}`);
        }
      })
    )
  );
  return (0, s.jsxs)("div", {
    className: "ceremony",
    children: [
      (0, s.jsxs)("div", {
        className: "ceremony-head",
        children: [
          (0, s.jsx)("div", { className: "ceremony-icon", children: e.coach.replace("Coach ", "")[0] }),
          (0, s.jsxs)("div", {
            children: [
              (0, s.jsx)("p", { className: "eyebrow", children: "COACH & PLAYER ACCOLADES" }),
              (0, s.jsx)("h2", { children: e.coach }),
              (0, s.jsx)("p", {
                className: "ceremony-sub",
                children: `${e.specialty} specialist \u00B7 Level ${e.level} \u00B7 ${e.school.name}`,
              }),
            ],
          }),
        ],
      }),
      (0, s.jsxs)("div", {
        className: "ceremony-scroll",
        children: [
          (0, s.jsxs)("div", {
            className: "awards-body",
            children: [
              (0, s.jsxs)("section", {
                children: [
                  (0, s.jsx)("h3", { children: "Coaching resume" }),
                  (0, s.jsx)("div", {
                    className: "stat-trio",
                    children: [
                      ["SEASONS", String(h.length)],
                      ["RECORD", `${W}\u2013${Lo}`],
                      ["WIN %", W + Lo ? `${Math.round((100 * W) / (W + Lo))}%` : "\u2014"],
                      ["NATIONAL TITLES", String(titles.length)],
                      ["FINAL FOURS", String(ff.length)],
                      ["CONFERENCE TITLES", String(cc.length)],
                      ["TOURNAMENT TRIPS", String(dance.length)],
                      ["NIT TITLES", String(nitT.length)],
                      ["NIT TRIPS", String(nitIn.length)],
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
                ],
              }),
              (0, s.jsxs)("section", {
                children: [
                  (0, s.jsx)("h3", { children: "Coaching skills" }),
                  (0, s.jsx)("div", {
                    className: "stat-trio",
                    children: COACH_SKILLS.map((z) =>
                      (0, s.jsxs)(
                        "div",
                        {
                          title: z.perk,
                          children: [
                            (0, s.jsx)("small", { children: z.name.toUpperCase() }),
                            (0, s.jsx)("strong", { children: W_skill(e, z.k) }),
                            (0, s.jsx)("em", { children: z.perk }),
                          ],
                        },
                        z.k
                      )
                    ),
                  }),
                  (0, s.jsx)("p", {
                    className: "muted",
                    children:
                      "Skills start at 50 (60 in your specialty) and grow every season, faster when you win, recruit well, develop players and keep the locker room happy. 50 is average; each point above it helps a little.",
                  }),
                ],
              }),
              (0, s.jsxs)("section", {
                children: [
                  (0, s.jsx)("h3", { children: "Contract" }),
                  (() => {
                    let c = e.contract || W_newContract(e);
                    return (0, s.jsx)("div", {
                      className: "stat-trio",
                      children: [
                        ["SALARY", `${q(c.sal)} / yr`],
                        ["YEARS LEFT", `${c.yrs} of ${c.len}`],
                        ["BUYOUT IF FIRED", q(W_buyout({ contract: c }))],
                        ["EXIT FEE IF YOU LEAVE", q(W_exitFee({ contract: c }))],
                        ["CAREER EARNINGS", q(e.earn || 0)],
                      ].map((z) =>
                        (0, s.jsxs)(
                          "div",
                          { children: [(0, s.jsx)("small", { children: z[0] }), (0, s.jsx)("strong", { children: z[1] })] },
                          z[0]
                        )
                      ),
                    });
                  })(),
                  (0, s.jsx)("p", {
                    className: "muted",
                    children:
                      "Meeting the win goal earns an extension. If you are fired the school pays a buyout for the years left; leaving early for another job costs you an exit fee. Your salary is separate from the NIL budget.",
                  }),
                ],
              }),
              (0, s.jsxs)("section", {
                children: [
                  (0, s.jsx)("h3", { children: "Coach honors" }),
                  coachHon.length
                    ? (0, s.jsx)("div", {
                        className: "honor-tags",
                        children: coachHon.map((z, i) => (0, s.jsx)("span", { children: z }, i)),
                      })
                    : (0, s.jsx)("p", {
                        className: "muted",
                        children: "No coaching awards yet. Win with a young roster or go on a deep run.",
                      }),
                  titles.length > 0 &&
                    (0, s.jsxs)("p", {
                      className: "muted",
                      children: ["National champions: ", titles.map((x) => x.year).join(", ")],
                    }),
                  nitT.length > 0 &&
                    (0, s.jsx)("p", {
                      className: "muted",
                      children: ["NIT champions: ", nitT.map((x) => x.year).join(", ")],
                    }),
                ],
              }),
              (0, s.jsxs)("section", {
                children: [
                  (0, s.jsx)("h3", {
                    children: `Achievements (${W_ach(e).filter((z) => z[2]).length}/${W_ach(e).length})`,
                  }),
                  (0, s.jsx)("div", {
                    className: "team-grid",
                    children: W_ach(e).map((z) =>
                      (0, s.jsxs)(
                        "div",
                        {
                          className: z[2] ? "team-card ach on" : "team-card ach",
                          children: [
                            (0, s.jsx)("h4", { children: (z[2] ? "✓ " : "") + z[0] }),
                            (0, s.jsx)("small", { children: z[1] + (z[2] && z[3] ? ` \u00B7 earned ${z[3]}\u2013${String(z[3] + 1).slice(2)}` : "") }),
                          ],
                        },
                        z[0]
                      )
                    ),
                  }),
                ],
              }),
              (0, s.jsxs)("section", {
                children: [
                  (0, s.jsx)("h3", { children: "Player accolades" }),
                  // grouped by AWARD: each award is a heading, and the players of yours who won it are listed under it with the year
                  (() => {
                    const by = {};
                    h.forEach((x) =>
                      (x.awards || []).forEach((o) =>
                        o.list.forEach((p) => {
                          if (p.you && p.pid) (by[o.k] = by[o.k] || []).push({ n: p.n, yr: x.year, y: `${x.year}\u2013${String(x.year + 1).slice(2)}` });
                        })
                      )
                    );
                    const keys = Object.keys(by);
                    return keys.length
                      ? (0, s.jsx)("div", {
                          className: "team-grid",
                          children: keys.map((k) =>
                            (0, s.jsxs)(
                              "div",
                              {
                                className: "team-card",
                                children: [
                                  (0, s.jsx)("h4", { children: k }),
                                  by[k]
                                    .sort((u, v) => v.yr - u.yr)
                                    .map((z, i) =>
                                      (0, s.jsx)("div", { className: "team-row", children: (0, s.jsxs)("span", { children: [z.n, " \u00B7 ", z.y] }) }, i)
                                    ),
                                ],
                              },
                              k
                            )
                          ),
                        })
                      : (0, s.jsx)("p", { className: "muted", children: "Your players have not won any awards yet." });
                  })(),
                ],
              }),
            ],
          }),
        ],
      }),
      (0, s.jsx)("div", {
        className: "ceremony-foot",
        children: (0, s.jsxs)("div", {
          className: "row gap",
          children: [(0, s.jsx)(X, { onClick: a, children: "Close" })],
        }),
      }),
    ],
  });
}
