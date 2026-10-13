function RevenuePanel({ g: e }) {
  let r = e.rev || { donors: 0, tickets: 0, media: 0, conf: 0, tourney: 0 },
    pv = e.revPrev || null,
    cm = W_confMult(e),
    tot = r.donors + r.tickets + r.media + r.conf + r.tourney,
    rows = [
      ["Donors and boosters", r.donors, "Follow wins, excitement and confidence in you"],
      ["Ticket sales", r.tickets, "Follow your win percentage"],
      ["Media and merchandise", r.media, "Follows reputation and the market; renegotiated every 4th season; title bonus"],
      ["Conference revenue share", r.conf, `Your conference ranks ${cm.rank} of ${cm.n} by strength (payout x${cm.mult.toFixed(2)}); it changes as the league does`],
      ["Tournament payouts", r.tourney, "One-time money for last season's tournament wins, plus a share of the units your conference mates earned"],
    ];
  return (0, s.jsxs)(qe, {
    title: "Where your NIL comes from",
    meta: "Your annual base budget is the sum of these streams and is rebuilt at the end of every season.",
    children: [
      (0, s.jsxs)("div", {
        className: "ds-chart-row",
        children: [
          (0, s.jsxs)("div", {
            children: [
              (0, s.jsx)("h3", { className: "ds-chart-title", children: "This year's streams" }),
              (0, s.jsx)(ShareBar, { parts: rows.map((z) => ({ label: z[0], value: z[1] })), fmt: q, label: "Share of each revenue stream" }),
            ],
          }),
          new Set([...(e.history || []).map((h) => h.year), e.year]).size >= 2 &&
            (0, s.jsxs)("div", {
              children: [
                (0, s.jsx)("h3", { className: "ds-chart-title", children: "Total budget by season" }),
                (0, s.jsx)(LineChart, {
                  series: [{ name: "Budget", pts: [...e.history.map((h) => [h.year, h.budget]), ...(e.history.some((h) => h.year === e.year) ? [] : [[e.year, e.budget]])].filter((z) => z[1] > 0) }],
                  fx: (z) => `'${String(z).slice(2)}`,
                  fy: q,
                  label: "Total NIL budget by season",
                  height: 140,
                }),
              ],
            }),
        ],
      }),
      (0, s.jsx)("div", {
      className: "table-wrap",
      children: (0, s.jsxs)("table", {
        children: [
          (0, s.jsx)("thead", {
            children: (0, s.jsx)("tr", {
              children: ["STREAM", "THIS YEAR", "SHARE", "LAST YEAR", "WHAT MOVES IT"].map((z) =>
                (0, s.jsx)("th", { children: z }, z)
              ),
            }),
          }),
          (0, s.jsxs)("tbody", {
            children: [
              rows.map((z, i) => {
                let k = ["donors", "tickets", "media", "conf", "tourney"][i],
                  d = pv ? z[1] - (pv[k] || 0) : null;
                return (0, s.jsxs)(
                  "tr",
                  {
                    children: [
                      (0, s.jsx)("td", { children: z[0] }),
                      (0, s.jsx)("td", { children: (0, s.jsx)("strong", { children: q(z[1]) }) }),
                      (0, s.jsx)("td", { children: `${Math.round((100 * z[1]) / Math.max(1, tot))}%` }),
                      (0, s.jsx)("td", {
                        className: d > 0 ? "hl" : "muted",
                        children: d === null ? "\u2014" : `${d >= 0 ? "+" : "-"}${q(Math.abs(d))}`,
                      }),
                      (0, s.jsx)("td", { className: "muted", children: z[2] }),
                    ],
                  },
                  z[0]
                );
              }),
              (0, s.jsxs)("tr", {
                children: [
                  (0, s.jsx)("td", { children: (0, s.jsx)("strong", { children: "Base budget" }) }),
                  (0, s.jsx)("td", { children: (0, s.jsx)("strong", { children: q(tot) }) }),
                  (0, s.jsx)("td", { children: "100%" }),
                  (0, s.jsx)("td", {}),
                  (0, s.jsx)("td", {
                    className: "muted",
                    children: `Plus ${q(e.guaranteeIncome || 0)} from guarantee games`,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    }),
    ],
  });
}
