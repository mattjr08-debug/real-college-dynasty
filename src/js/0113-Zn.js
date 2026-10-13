function Zn({ g: e, run: a }) {
  let [t, l] = (0, N.useState)(!1);
  return (0, s.jsxs)(s.Fragment, {
    children: [
      (0, s.jsxs)(X, {
        disabled: e.phase !== "Offseason" || e.roster.length >= 15,
        onClick: () => l(!0),
        children: [(0, s.jsx)(Vl, { size: 15 }), "Auto-recruit"],
      }),
      e.phase === "Offseason" &&
        e.round <= 8 &&
        (0, s.jsx)(X, {
          disabled: e.scouts < 1,
          title: "Spend your scouting visits on the recruits you bookmarked",
          onClick: () => a({ type: "autoScout" }),
          children: "Auto-scout favorites",
        }),
      t &&
        (0, s.jsxs)(Ao, {
          title: "Automate recruiting",
          onClose: () => l(!1),
          children: [
            (0, s.jsx)("p", { className: "eyebrow", children: "DELEGATE TO YOUR STAFF" }),
            (0, s.jsx)("h2", { children: "Build a complete roster." }),
            (0, s.jsx)("p", {
              children:
                "Staff will advance the remaining recruiting rounds, honor pending offers, and spread your available NIL across roster needs. They aim for three players at each position, then invite walk-ons to fill remaining spots.",
            }),
            (0, s.jsxs)("div", {
              className: "automation-summary",
              children: [
                (0, s.jsxs)("span", {
                  children: ["Open spots ", (0, s.jsx)("strong", { children: 15 - e.roster.length })],
                }),
                (0, s.jsxs)("span", {
                  children: ["NIL available ", (0, s.jsx)("strong", { children: q(Ce(e)) })],
                }),
                (0, s.jsxs)("span", {
                  children: [
                    "Remaining rounds ",
                    (0, s.jsx)("strong", { children: Math.max(0, 9 - e.round) }),
                  ],
                }),
              ],
            }),
            (0, s.jsx)("p", {
              className: "muted",
              children:
                (e.prospects.some((v) => v.target && v.status === "Available")
                  ? `Your ${e.prospects.filter((v) => v.target && v.status === "Available").length} favorite recruits (bookmarked) get offers first when the money allows. `
                  : "Tip: bookmark recruits to make them favorites and your staff will try to sign them first. ") +
                "Signings are final. Your staff will also set the best lineup, minutes, and tactics. Existing players and promises stay on your roster.",
            }),
            (0, s.jsxs)("div", {
              className: "row gap",
              children: [
                (0, s.jsx)(X, { onClick: () => l(!1), children: "Keep recruiting manually" }),
                (0, s.jsx)(X, {
                  primary: !0,
                  onClick: async () => {
                    (l(!1), await a({ type: "autoRecruit" }));
                  },
                  children: "Build my 15-player roster",
                }),
              ],
            }),
          ],
        }),
    ],
  });
}
