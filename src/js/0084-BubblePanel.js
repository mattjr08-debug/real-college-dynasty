function BubblePanel({ g: e }) {
  let b = W_bubble(e),
    me = W_all(e)[0],
    row = (x, i, k) =>
      (0, s.jsxs)(
        "div",
        {
          className: x.id === e.school.id ? "team-row you" : "team-row",
          children: [
            (0, s.jsxs)("span", {
              className: "team-cell",
              children: [
                (0, s.jsx)("span", { className: "team-logo", children: (0, s.jsx)(SchoolLogo, { school: x.id === e.school.id ? e.school : hqOppSchool(x) }) }),
                `${x.name}`,
              ],
            }),
            (0, s.jsx)("small", { children: `${x.wins}\u2013${x.losses}` }),
          ],
        },
        k + i
      );
  return (0, s.jsx)(qe, {
    title: "Bubble watch",
    meta: `Projected field of 68: ${b.f.autos.length} automatic bids and ${b.f.at.length} at-large teams.`,
    children: (0, s.jsxs)("div", {
      className: "team-grid",
      style: { padding: "14px 18px" },
      children: [
        (0, s.jsxs)("div", {
          className: "team-card",
          children: [
            (0, s.jsx)("h4", { children: "Your status" }),
            (0, s.jsx)("div", {
              className: "team-row",
              children: (0, s.jsx)("span", {
                children: b.inField
                  ? b.auto
                    ? "Projected automatic bid"
                    : `Projected at-large bid, #${Math.min(16, Math.floor(b.rank / 4) + 1)} seed`
                  : "Currently outside the field",
              }),
            }),
          ],
        }),
        (0, s.jsxs)("div", {
          className: "team-card",
          children: [
            (0, s.jsx)("h4", { children: "NET and quadrants" }),
            (0, s.jsx)("div", {
              className: "team-row",
              children: (0, s.jsx)("span", { children: `Your NET rank: #${W_netRank(e)[e.school.id]} of ${e.opponents.length + 1}` }),
            }),
            (0, s.jsx)("div", {
              className: "team-row",
              children: (0, s.jsx)("span", {
                children: [0, 1, 2, 3].map((q) => "Q" + (q + 1) + " " + (me.qd?.[q * 2] || 0) + "\u2013" + (me.qd?.[q * 2 + 1] || 0)).join(" \u00B7 "),
              }),
            }),
            (0, s.jsx)("small", {
              className: "muted",
              children: "Quadrants sort games by opponent rank and venue. Q1 wins help most, Q3 and Q4 losses hurt most.",
            }),
          ],
        }),
        (0, s.jsxs)("div", {
          className: "team-card bubble-in",
          children: [(0, s.jsx)("h4", { children: "Last four in" }), b.last.map((x, i) => row(x, i, "l"))],
        }),
        (0, s.jsxs)("div", {
          className: "team-card bubble-out",
          children: [
            (0, s.jsx)("h4", { children: "First four out" }),
            b.firstOut.map((x, i) => row(x, i, "o")),
          ],
        }),
        (0, s.jsxs)("div", {
          className: "team-card bubble-out",
          children: [
            (0, s.jsx)("h4", { children: "Next four out" }),
            b.nextOut.map((x, i) => row(x, i, "n")),
          ],
        }),
        (0, s.jsxs)("div", {
          className: "team-card",
          children: [
            (0, s.jsx)("h4", { children: "Projected top seeds" }),
            b.f.field.slice(0, 8).map((x, i) => row(x, i, "s")),
          ],
        }),
      ],
    }),
  });
}
