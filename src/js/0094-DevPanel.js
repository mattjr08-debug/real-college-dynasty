function DevPanel({ g: e, select: a }) {
  let rows = e.roster
    .map((p) => {
      let d = (p.dlog && p.dlog.d) || [],
        top = d
          .map((v, i) => ({ v, n: il[i] }))
          .filter((z) => z.v > 0)
          .sort((x, y) => y.v - x.v)
          .slice(0, 3);
      return { p, top, why: (p.dlog && p.dlog.why) || [] };
    })
    .sort((x, y) => (y.p.growth || 0) - (x.p.growth || 0));
  return (0, s.jsx)(qe, {
    title: "Player development",
    meta: e.history.length
      ? "What changed over the offseason, and why."
      : "Development shows up after your first offseason.",
    children: (0, s.jsx)("div", {
      className: "table-wrap",
      children: (0, s.jsxs)("table", {
        children: [
          (0, s.jsx)("thead", {
            children: (0, s.jsx)("tr", {
              children: ["PLAYER", "OVR", "CHANGE", "BIGGEST GAINS", "WHY"].map((z) =>
                (0, s.jsx)("th", { children: z }, z)
              ),
            }),
          }),
          (0, s.jsx)("tbody", {
            children: rows.map(({ p: r, top: t, why: w }) =>
              (0, s.jsxs)(
                "tr",
                {
                  className: "clickable-row",
                  onClick: () => a(r.id),
                  children: [
                    (0, s.jsx)("td", {
                      children: (0, s.jsxs)("div", {
                        className: "player-cell",
                        children: [
                          (0, s.jsx)(Ja, { p: r, size: "tiny" }),
                          (0, s.jsxs)("div", {
                            children: [
                              (0, s.jsx)("strong", { children: r.name }),
                              (0, s.jsx)("span", {
                                className: "table-sub",
                                children: `${r.pos} \u00B7 ${r.dev || "Steady"}`,
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
                    (0, s.jsx)("td", { children: r.ovr }),
                    (0, s.jsx)("td", {
                      className: (r.growth || 0) > 0 ? "hl" : "",
                      children: (r.growth || 0) > 0 ? `+${r.growth}` : String(r.growth || 0),
                    }),
                    (0, s.jsx)("td", {
                      children: t.length ? t.map((z) => `+${z.v} ${z.n.toLowerCase()}`).join(", ") : "\u2014",
                    }),
                    (0, s.jsx)("td", {
                      className: "muted",
                      children: w.length ? w.join(" \u00B7 ") : "\u2014",
                    }),
                  ],
                },
                r.id
              )
            ),
          }),
        ],
      }),
    }),
  });
}
