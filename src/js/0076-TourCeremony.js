function TourCeremony({ a: t, onClose: c, onGo: g }) {
  let nat = t.kind === "National";
  return (0, s.jsxs)("div", {
    className: "ceremony",
    children: [
      (0, s.jsxs)("div", {
        className: "ceremony-head",
        children: [
          (0, s.jsx)("div", { className: "ceremony-icon", children: (0, s.jsx)(ba, { size: 28 }) }),
          (0, s.jsxs)("div", {
            children: [
              (0, s.jsx)("p", {
                className: "eyebrow",
                children: nat ? "NATIONAL TOURNAMENT" : t.kind === "NIT" ? "NIT" : "CONFERENCE TOURNAMENT",
              }),
              (0, s.jsx)("h2", { children: t.title }),
              (0, s.jsx)("p", { className: "ceremony-sub", children: t.line }),
            ],
          }),
        ],
      }),
      (0, s.jsxs)("div", {
        className: "ceremony-scroll",
        children: [
          (0, s.jsxs)("div", {
            className: "stat-trio",
            children: [
              (0, s.jsxs)("div", {
                children: [
                  (0, s.jsx)("small", { children: "YOUR SEED" }),
                  (0, s.jsx)("strong", { children: t.seed ? `#${t.seed}` : "\u2014" }),
                ],
              }),
              (0, s.jsxs)("div", {
                children: [
                  (0, s.jsx)("small", { children: "FIRST OPPONENT" }),
                  (0, s.jsx)("strong", { children: t.opp || "\u2014" }),
                  t.opR && (0, s.jsx)("em", { children: `${t.opR} OVR` }),
                ],
              }),
              (0, s.jsxs)("div", {
                children: [
                  (0, s.jsx)("small", { children: "YOUR TEAM" }),
                  (0, s.jsx)("strong", { children: `${t.me} OVR` }),
                ],
              }),
            ],
          }),
          (0, s.jsx)("p", { className: "ceremony-body", children: t.body }),
        ],
      }),
      (0, s.jsx)("div", {
        className: "ceremony-foot",
        children: (0, s.jsxs)("div", {
          className: "row gap",
          children: [
            (0, s.jsx)(X, { onClick: c, children: "Close" }),
            (0, s.jsx)(X, { primary: !0, onClick: g, children: "View the bracket" }),
          ],
        }),
      }),
    ],
  });
}
