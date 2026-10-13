function e0B({ g: e, select: a }) {
  let dn = e.don || { ex: 50, co: 50 };
  return (0, s.jsxs)(s.Fragment, {
    children: [
      (0, s.jsx)(qe, {
        title: "Donors and boosters",
        meta: "Contributions rise and fall with results, recruiting excitement and confidence in the coach.",
        children: (0, s.jsx)("div", {
          className: "stat-trio",
          style: { padding: "14px 18px" },
          children: [
            ["EXCITEMENT", dn.ex, "Wins vs. goal, tournament runs, big recruits"],
            ["CONFIDENCE IN THE COACH", dn.co, "Meeting expectations, titles, job security"],
          ].map((z) =>
            (0, s.jsxs)(
              "div",
              {
                children: [
                  (0, s.jsx)("small", { children: z[0] }),
                  (0, s.jsx)("strong", { children: `${z[1]}/100` }),
                  (0, s.jsx)("div", {
                    className: "bar",
                    style: { height: 6, background: "#ffffff12", borderRadius: 4, marginTop: 4 },
                    children: (0, s.jsx)("div", {
                      style: {
                        width: z[1] + "%",
                        height: 6,
                        borderRadius: 4,
                        background: "var(--team,var(--orange))",
                      },
                    }),
                  }),
                  (0, s.jsx)("em", { children: z[2] }),
                ],
              },
              z[0]
            )
          ),
        }),
      }),
      (0, s.jsxs)("div", {
        className: "metrics three",
        children: [
          (0, s.jsx)(ca, {
            label: "ANNUAL NIL BUDGET",
            value: q(e.budget),
            note: `${q(e.baseBudget)} base + ${q(e.guaranteeIncome)} guarantees \xB7 ${W_nilTierText(e.baseBudget)} \xB7 ${(e.confNames || [])[0] || e.school.league}`,
            icon: (0, s.jsx)(ja, {}),
          }),
          (0, s.jsx)(ca, {
            label: "COMMITTED + RESERVED",
            value: q(go(e) + kt(e)),
            note: `${q(kt(e))} in recruiting offers`,
            icon: (0, s.jsx)(co, {}),
          }),
          (0, s.jsx)(ca, {
            label: "AVAILABLE TO SPEND",
            value: q(Ce(e)),
            note: `${15 - e.roster.length} open roster spots${W_staffCostOf(e) ? ` \xB7 ${q(W_staffCostOf(e))} goes to staff and facilities` : ""}`,
            icon: (0, s.jsx)(Gl, {}),
          }),
        ],
      }),
      (0, s.jsxs)(qe, {
        title: "NIL allocation",
        meta: "Annual commitments to your players.",
        children: [
          (0, s.jsxs)("div", {
            className: "budget-chart",
            children: [
              (0, s.jsxs)("div", {
                className: "budget-stack",
                children: [
                  (0, s.jsx)("span", { style: { width: `${(go(e) / e.budget) * 100}%` } }),
                  (0, s.jsx)("span", { style: { width: `${(kt(e) / e.budget) * 100}%` } }),
                ],
              }),
              (0, s.jsxs)("div", {
                className: "legend",
                children: [
                  (0, s.jsxs)("span", { children: [(0, s.jsx)("i", {}), "Players \xB7 ", q(go(e))] }),
                  (0, s.jsxs)("span", { children: [(0, s.jsx)("i", {}), "Offers \xB7 ", q(kt(e))] }),
                  (0, s.jsxs)("span", { children: [(0, s.jsx)("i", {}), "Available \xB7 ", q(Ce(e))] }),
                ],
              }),
            ],
          }),
          (0, s.jsx)("div", {
            className: "table-wrap",
            children: (0, s.jsxs)("table", {
              children: [
                (0, s.jsx)("thead", {
                  children: (0, s.jsxs)("tr", {
                    children: [
                      (0, s.jsx)("th", { children: "PLAYER" }),
                      (0, s.jsx)("th", { children: "OVR" }),
                      (0, s.jsx)("th", { children: "ANNUAL NIL" }),
                      (0, s.jsx)("th", { children: "REQUESTED" }),
                      (0, s.jsx)("th", { children: "BUDGET SHARE" }),
                      (0, s.jsx)("th", { children: "MORALE" }),
                    ],
                  }),
                }),
                (0, s.jsx)("tbody", {
                  children: [...e.roster]
                    .sort((t, l) => l.nil - t.nil)
                    .map((t) =>
                      (0, s.jsxs)(
                        "tr",
                        {
                          children: [
                            (0, s.jsx)("td", {
                              children: (0, s.jsxs)("button", {
                                className: "player-cell",
                                onClick: () => a(t.id),
                                children: [
                                  (0, s.jsx)(Ja, { p: t, size: "tiny" }),
                                  (0, s.jsxs)("div", {
                                    children: [
                                      (0, s.jsxs)("strong", {
                                        children: [
                                          t.name,
                                          " ",
                                          (0, s.jsxs)("em", {
                                            className: "name-ovr",
                                            children: [Tt(t), " OVR"],
                                          }),
                                        ],
                                      }),
                                      (0, s.jsxs)("span", { children: [t.pos, " \xB7 ", t.role] }),
                                    ],
                                  }),
                                ],
                              }),
                            }),
                            (0, s.jsx)("td", { children: t.ovr }),
                            (0, s.jsx)("td", { children: (0, s.jsx)("strong", { children: q(t.nil) }) }),
                            (0, s.jsx)("td", { children: q(t.ask) }),
                            (0, s.jsxs)("td", {
                              children: [
                                ((t.nil / e.budget) * 100).toFixed(1),
                                "%",
                                (0, s.jsx)(Wa, { value: (t.nil / e.budget) * 100 }),
                              ],
                            }),
                            (0, s.jsx)("td", { children: (0, s.jsx)(Ys, { p: t }) }),
                          ],
                        },
                        t.id
                      )
                    ),
                }),
              ],
            }),
          }),
        ],
      }),
      (0, s.jsxs)("div", {
        className: "callout",
        children: [
          (0, s.jsx)(ja, { size: 24 }),
          (0, s.jsx)("p", {
            children:
              "Click a player to increase their NIL during the offseason. Current commitments cannot be reduced. Recruiting offers reserve money until a decision is made or you withdraw them.",
          }),
        ],
      }),
    ],
  });
}
