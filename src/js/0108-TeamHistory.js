function TeamHistory({ g: e, part: part }) {
  let h = e.history,
    W = h.reduce((x, y) => x + y.wins, 0),
    Lo = h.reduce((x, y) => x + y.losses, 0),
    best = [...h].sort((x, y) => y.wins - x.wins)[0],
    worst = [...h].sort((x, y) => x.wins - y.wins)[0],
    titles = h.filter((x) => x.result === "National champions").length,
    ff = h.filter((x) =>
      ["National champions", "National runner-up", "Final Four"].includes(x.result)
    ).length,
    cc = h.filter((x) => x.cc).length,
    dance = h.filter((x) => /berth/.test(x.bt || "")).length,
    nitT = h.filter((x) => x.result === "NIT champions").length,
    nitIn = h.filter((x) => nitFinish(x)).length,
    recs = (() => {
      let r = { pts: null, reb: null, ast: null };
      for (let x of h)
        for (let p of x.players || [])
          if (p.stats.gp >= 15)
            for (let k of ["pts", "reb", "ast"]) {
              let v = p.stats[k] / p.stats.gp;
              (!r[k] || v > r[k].v) && (r[k] = { v, n: p.name, y: x.year });
            }
      return r;
    })(),
    aw = h.reduce(
      (t, x) => t + (x.awards || []).reduce((u, o) => u + o.list.filter((p) => p.you).length, 0),
      0
    );
  return (0, s.jsxs)(s.Fragment, {
    children: [
      (0, s.jsx)("div", {
        className: "metrics three four",
        children: [
          [
            "ALL-TIME RECORD",
            h.length ? `${W}\u2013${Lo}` : "\u2014",
            h.length
              ? `${Math.round((100 * W) / Math.max(1, W + Lo))}% wins over ${h.length} seasons`
              : "No seasons yet",
          ],
          ["NATIONAL TITLES", String(titles), `${ff} Final Four trips`],
          ["CONFERENCE TITLES", String(cc), `${dance} national tournament trips`],
          ["NIT TITLES", String(nitT), `${nitIn} NIT trip${nitIn === 1 ? "" : "s"}`],
        ].map((z) =>
          (0, s.jsxs)(
            "div",
            {
              className: "metric",
              children: [
                (0, s.jsx)("div", { children: (0, s.jsx)("span", { children: z[0] }) }),
                (0, s.jsx)("strong", { children: z[1] }),
                (0, s.jsx)("p", { children: z[2] }),
              ],
            },
            z[0]
          )
        ),
      }),
      (0, s.jsx)(qe, {
        title: "Program records",
        meta: "Best single-season averages (minimum 15 games) and standout years.",
        children: h.length
          ? (0, s.jsxs)("div", {
              className: "rp-grid",
              style: { padding: "14px 18px" },
              children: [
                [
                  ["POINTS PER GAME", recs.pts],
                  ["REBOUNDS PER GAME", recs.reb],
                  ["ASSISTS PER GAME", recs.ast],
                ].map((z) =>
                  (0, s.jsxs)(
                    "div",
                    {
                      children: [
                        (0, s.jsx)("small", { children: z[0] }),
                        (0, s.jsx)("strong", { children: z[1] ? z[1].v.toFixed(1) : "\u2014" }),
                        (0, s.jsx)("em", {
                          children: z[1]
                            ? `${z[1].n} \u00B7 ${z[1].y}\u2013${String(z[1].y + 1).slice(2)}`
                            : "No record yet",
                        }),
                      ],
                    },
                    z[0]
                  )
                ),
                (0, s.jsxs)("div", {
                  children: [
                    (0, s.jsx)("small", { children: "BEST SEASON" }),
                    (0, s.jsx)("strong", { children: best ? `${best.wins}\u2013${best.losses}` : "\u2014" }),
                    (0, s.jsx)("em", {
                      children: best
                        ? `${best.year}\u2013${String(best.year + 1).slice(2)} \u00B7 ${best.result}`
                        : "",
                    }),
                  ],
                }),
                (0, s.jsxs)("div", {
                  children: [
                    (0, s.jsx)("small", { children: "TOUGHEST SEASON" }),
                    (0, s.jsx)("strong", {
                      children: worst ? `${worst.wins}\u2013${worst.losses}` : "\u2014",
                    }),
                    (0, s.jsx)("em", {
                      children: worst
                        ? `${worst.year}\u2013${String(worst.year + 1).slice(2)} \u00B7 ${worst.result}`
                        : "",
                    }),
                  ],
                }),
                (0, s.jsxs)("div", {
                  children: [
                    (0, s.jsx)("small", { children: "AWARDS WON" }),
                    (0, s.jsx)("strong", { children: String(aw) }),
                    (0, s.jsx)("em", { children: "Players and coach combined" }),
                  ],
                }),
              ],
            })
          : (0, s.jsx)(yl, {
              title: "The record books are empty",
              body: "Finish a season to start your program history.",
            }),
      }),
      h.length > 0 &&
        (0, s.jsx)(qe, {
          title: "Season by season",
          children: (0, s.jsx)("div", {
            className: "table-wrap",
            children: (0, s.jsxs)("table", {
              children: [
                (0, s.jsx)("thead", {
                  children: (0, s.jsxs)("tr", {
                    children: [
                      ["SEASON", "RECORD", "CONFERENCE", "RESULT", "REP"].map((z) =>
                        (0, s.jsx)("th", { children: z }, z)
                      ),
                    ],
                  }),
                }),
                (0, s.jsx)("tbody", {
                  children: [...h]
                    .reverse()
                    .map((x) =>
                      (0, s.jsxs)(
                        "tr",
                        {
                          children: [
                            (0, s.jsx)("td", { children: `${x.year}\u2013${String(x.year + 1).slice(2)}` }),
                            (0, s.jsx)("td", { children: `${x.wins}\u2013${x.losses}` }),
                            (0, s.jsx)("td", {
                              children: `${x.cw}\u2013${x.cl}${x.cc ? " \u00B7 champions" : ""}`,
                            }),
                            (0, s.jsx)("td", { children: x.result }),
                            (0, s.jsx)("td", { children: x.rep }),
                          ],
                        },
                        x.year
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
