function AwardsBody({ aw: o, roster: rs }) {
  let single = [
      "National Player of the Year",
      "Conference Player of the Year",
      "Freshman of the Year",
      "Conference Coach of the Year",
      "National Coach of the Year",
    ],
    mine = {};
  for (let x of o)
    for (let p of x.list)
      if (p.you) {
        let k = p.pid || "coach";
        (mine[k] = mine[k] || { p, list: [] }).list.push(x.k);
      }
  let ym = Object.entries(mine).map(([id, v]) => ({
      id,
      name: v.p.n,
      pl: (rs || []).find((r) => r.id === id),
      list: v.list,
    })),
    feat = o.filter((x) => single.includes(x.k)),
    teams = o.filter((x) => !single.includes(x.k));
  return (0, s.jsxs)("div", {
    className: "awards-body",
    children: [
      ym.length > 0 &&
        (0, s.jsxs)("section", {
          children: [
            (0, s.jsx)("h3", { children: "Your honors" }),
            (0, s.jsx)("div", {
              className: "honor-grid",
              children: ym.map((h) =>
                (0, s.jsxs)(
                  "div",
                  {
                    className: "honor-card",
                    children: [
                      h.pl
                        ? (0, s.jsx)(Ja, { p: h.pl, size: "small" })
                        : (0, s.jsx)("div", { className: "coach-badge", children: "C" }),
                      (0, s.jsxs)("div", {
                        children: [
                          (0, s.jsx)("strong", { children: h.name }),
                          (0, s.jsx)("div", {
                            className: "honor-tags",
                            children: h.list.map((k) => (0, s.jsx)("span", { children: k }, k)),
                          }),
                          h.pl &&
                            h.pl.awardBump > 0 &&
                            (0, s.jsxs)("small", {
                              children: [
                                "Will ask for about +",
                                Math.round(h.pl.awardBump * 100),
                                "% NIL next season",
                              ],
                            }),
                        ],
                      }),
                    ],
                  },
                  h.id
                )
              ),
            }),
          ],
        }),
      (0, s.jsxs)("section", {
        children: [
          (0, s.jsx)("h3", { children: "Top honors" }),
          (0, s.jsx)("div", {
            className: "feat-grid",
            children: feat.map((x) =>
              (0, s.jsxs)(
                "div",
                {
                  className: x.list[0]?.you ? "feat-card you" : "feat-card",
                  children: [
                    (0, s.jsx)("span", { className: "feat-k", children: x.k }),
                    (0, s.jsx)("strong", { children: x.list[0]?.n }),
                    (0, s.jsx)("small", { children: x.list[0]?.s }),
                  ],
                },
                x.k
              )
            ),
          }),
        ],
      }),
      (0, s.jsxs)("section", {
        children: [
          (0, s.jsx)("h3", { children: "All-teams" }),
          (0, s.jsx)("div", {
            className: "team-grid",
            children: teams.map((x) =>
              (0, s.jsxs)(
                "div",
                {
                  className: "team-card",
                  children: [
                    (0, s.jsx)("h4", { children: x.k }),
                    x.list.map((p, i) =>
                      (0, s.jsxs)(
                        "div",
                        {
                          className: p.you ? "team-row you" : "team-row",
                          children: [
                            (0, s.jsx)("span", { children: p.n }),
                            (0, s.jsx)("small", { children: p.s }),
                          ],
                        },
                        i
                      )
                    ),
                  ],
                },
                x.k
              )
            ),
          }),
        ],
      }),
    ],
  });
}
