function ConfTourneys({ g: e }) {
  let [ci, setCi] = (0, N.useState)(1),
    res = e.ctRes && e.ctRes[ci],
    all = W_all(e).sort((a, b) => W_score(b) - W_score(a)),
    top64 = new Set(all.slice(0, FIELD_SIZE).map((t) => t.id)),
    bub = new Set(all.slice(56, 76).map((t) => t.id)),
    rows = Object.keys(e.ctRes || {})
      .map((k) => {
        let w = (e.ctRes[k].at(-1) || [])[0];
        return w
          ? {
              ci: +k,
              champ: w.w,
              seed: w.w === w.a ? w.sda : w.sdb,
              thief: !top64.has((e.opponents.find((t) => t.name === w.w) || {}).id),
            }
          : null;
      })
      .filter(Boolean);
  return (0, s.jsxs)(s.Fragment, {
    children: [
      (0, s.jsxs)(qe, {
        title: "Conference tournaments",
        meta: "Every conference crowns an automatic bid. Pick a conference to see its bracket.",
        children: [
          (0, s.jsx)("div", {
            className: "stat-toggles",
            children: (0, s.jsxs)("label", {
              className: "sort-pick",
              children: [
                (0, s.jsx)("span", { children: "Conference" }),
                (0, s.jsx)("select", {
                  value: ci,
                  onChange: (z) => setCi(+z.target.value),
                  children: (e.confNames || []).map((n, i) =>
                    i ? (0, s.jsx)("option", { value: i, children: n }, i) : null
                  ),
                }),
              ],
            }),
          }),
          res
            ? (0, s.jsx)(BracketTree, {
                rounds: res,
                names: ["Quarterfinals", "Semifinals", "Championship"],
                me: "",
              })
            : (0, s.jsx)("p", {
                className: "muted",
                style: { padding: "14px 18px" },
                children: "Conference tournaments are played when the regular season ends.",
              }),
        ],
      }),
      res &&
        (0, s.jsx)(qe, {
          title: "Bid watch",
          meta: "Champions who were not in the at-large field steal a bid from the bubble.",
          children: (0, s.jsx)("div", {
            className: "table-wrap",
            children: (0, s.jsxs)("table", {
              children: [
                (0, s.jsx)("thead", {
                  children: (0, s.jsx)("tr", {
                    children: ["CONFERENCE", "CHAMPION", "SEED", "BID"].map((z) =>
                      (0, s.jsx)("th", { children: z }, z)
                    ),
                  }),
                }),
                (0, s.jsx)("tbody", {
                  children: rows.map((r) =>
                    (0, s.jsxs)(
                      "tr",
                      {
                        children: [
                          (0, s.jsx)("td", { children: (e.confNames || [])[r.ci] }),
                          (0, s.jsx)("td", { children: (0, s.jsx)("strong", { children: r.champ }) }),
                          (0, s.jsx)("td", { children: `#${r.seed}` }),
                          (0, s.jsx)("td", {
                            className: r.thief ? "hl" : "muted",
                            children: r.thief
                              ? "Bid thief: would have missed the field"
                              : "Would have made it anyway",
                          }),
                        ],
                      },
                      r.ci
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
