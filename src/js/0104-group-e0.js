function e0({ g: e, select: a, run: rn }) {
  let [t, setT] = (0, N.useState)("Budget");
  return (0, s.jsxs)(s.Fragment, {
    children: [
      (0, s.jsx)("div", {
        className: "toolbar",
        children: (0, s.jsx)("div", {
          className: "chips",
          children: ["Budget", "Revenue", "Market rates", "Staff", "Hire assistants"].map((d) =>
            (0, s.jsx)(
              "button",
              { className: d === t ? "active" : "", onClick: () => setT(d), children: d },
              d
            )
          ),
        }),
      }),
      t === "Budget"
        ? (0, s.jsx)(e0B, { g: e, select: a })
        : t === "Revenue"
          ? (0, s.jsx)(RevenuePanel, { g: e })
          : t === "Staff"
            ? (0, s.jsx)(StaffPanel, { g: e, run: rn })
            : t === "Hire assistants"
              ? (0, s.jsx)(StaffPanel, { g: e, run: rn, hire: !0 })
              : (0, s.jsx)(MarketPanel, { g: e }),
    ],
  });
}
