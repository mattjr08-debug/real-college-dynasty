function MarketPanel({ g: e }) {
  let m = e.mkt || 1,
    pm = e.pm || {};
  return (0, s.jsxs)(s.Fragment, {
    children: [MarketRates(e, m), PosMarket(e, pm)],
  });
}
function PosMarket(e, pm) {
  return (0, s.jsxs)(qe, {
    title: "Price by position",
    meta: "Each position has its own price index. A position with few good players across the country costs more, and one with plenty costs less. It is updated every offseason and applies to new asks.",
    children: [
      (0, s.jsx)("div", {
        className: "ds-bars",
        role: "img",
        "aria-label": "Price index by position (1.00 = normal)",
        children: Le.map((k) => {
          const v = pm[k] || 1;
          return (0, s.jsxs)(
            "div",
            {
              className: "ds-bars-row",
              children: [
                (0, s.jsx)("span", { children: k }),
                (0, s.jsx)("span", {
                  className: "ds-bars-track",
                  children: (0, s.jsx)("i", { className: v >= 1 ? "up" : "down", style: v >= 1 ? { left: "50%", width: `${Math.min(50, (v - 1) * 166)}%` } : { right: "50%", width: `${Math.min(50, (1 - v) * 166)}%` } }),
                }),
                (0, s.jsx)("b", { children: "x" + v.toFixed(2) }),
              ],
            },
            k
          );
        }),
      }),
      (0, s.jsx)("div", {
      className: "table-wrap",
      children: (0, s.jsxs)("table", {
        children: [
          (0, s.jsx)("thead", {
            children: (0, s.jsx)("tr", {
              children: ["POSITION", "PRICE INDEX", "A 70 OVR RECRUIT ASKS", "A 78 OVR RECRUIT ASKS", "ON YOUR TEAM"].map((z) =>
                (0, s.jsx)("th", { children: z }, z)
              ),
            }),
          }),
          (0, s.jsx)("tbody", {
            children: Le.map((k) =>
              (0, s.jsxs)(
                "tr",
                {
                  children: [
                    (0, s.jsx)("td", { children: (0, s.jsx)("strong", { children: k }) }),
                    (0, s.jsx)("td", { className: (pm[k] || 1) > 1.04 ? "hl" : "muted", children: `x${(pm[k] || 1).toFixed(2)}` }),
                    (0, s.jsx)("td", { children: q(W_ask(e, 70, "High school", k)) }),
                    (0, s.jsx)("td", { children: q(W_ask(e, 78, "High school", k)) }),
                    (0, s.jsx)("td", { className: "muted", children: `${e.roster.filter((p) => p.pos === k).length} players` }),
                  ],
                },
                k
              )
            ),
          }),
        ],
      }),
    }),
    ],
  });
}
function MarketRates(e, m) {
  return (0, s.jsxs)(qe, {
    title: "NIL market rates",
    meta: `Market index ${m.toFixed(2)}. Asking prices rise a few percent a year, faster when donors are excited. A raise you do not give can cost you the player.`,
    children: [
      (0, s.jsx)(LineChart, {
        series: ["High school", "Transfer", "Roster"].map((o) => ({ name: o === "Roster" ? "Returning player" : o, pts: [55, 62, 70, 78, 85, 92].map((r) => [r, W_ask(e, r, o)]) })),
        fx: (r) => r + " OVR",
        fy: q,
        label: "Yearly NIL ask by player rating",
      }),
      (0, s.jsx)("div", {
      className: "table-wrap",
      children: (0, s.jsxs)("table", {
        children: [
          (0, s.jsx)("thead", {
            children: (0, s.jsx)("tr", {
              children: ["RATING", "HIGH SCHOOL RECRUIT", "TRANSFER", "RETURNING PLAYER"].map((z) =>
                (0, s.jsx)("th", { children: z }, z)
              ),
            }),
          }),
          (0, s.jsx)("tbody", {
            children: [55, 62, 70, 78, 85, 92].map((o) =>
              (0, s.jsxs)(
                "tr",
                {
                  children: [
                    (0, s.jsx)("td", { children: `${o} OVR` }),
                    (0, s.jsx)("td", { children: q(W_ask(e, o, "High school")) }),
                    (0, s.jsx)("td", { children: q(W_ask(e, o, "Transfer")) }),
                    (0, s.jsx)("td", { children: q(W_ask(e, o, "Roster")) }),
                  ],
                },
                o
              )
            ),
          }),
        ],
      }),
    }),
    ],
  });
}
