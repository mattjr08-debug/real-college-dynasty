function ElimCeremony({ a: t, onClose: c, onGo: g }) {
  let nat = t.kind === "National";
  return (0, s.jsxs)("div", {
    className: "ceremony",
    children: [
      (0, s.jsxs)("div", {
        className: "ceremony-head sad",
        children: [
          (0, s.jsx)("div", { className: "ceremony-icon", children: "\u2715" }),
          (0, s.jsxs)("div", {
            children: [
              (0, s.jsx)("p", {
                className: "eyebrow",
                children: nat ? "NATIONAL TOURNAMENT" : t.kind === "NIT" ? "NIT" : "CONFERENCE TOURNAMENT",
              }),
              (0, s.jsx)("h2", { children: "Your run is over" }),
              (0, s.jsx)("p", { className: "ceremony-sub", children: `Eliminated in the ${t.round}` }),
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
                  (0, s.jsx)("small", { children: "FINAL SCORE" }),
                  (0, s.jsx)("strong", { children: `${t.us}\u2013${t.them}` }),
                ],
              }),
              (0, s.jsxs)("div", {
                children: [
                  (0, s.jsx)("small", { children: "LOST TO" }),
                  (0, s.jsx)("strong", { children: t.opp }),
                ],
              }),
              (0, s.jsxs)("div", {
                children: [
                  (0, s.jsx)("small", { children: "YOUR SEED" }),
                  (0, s.jsx)("strong", { children: t.seed ? `#${t.seed}` : "\u2014" }),
                ],
              }),
            ],
          }),
          (0, s.jsx)("p", {
            className: "ceremony-body",
            children: t.kind === "NIT"
              ? "The rest of the NIT is being played out."
              : nat
              ? "The rest of the national tournament is being played out. See who cut down the nets."
              : "The conference tournament finishes without you. Your national tournament hopes depend on the selection committee.",
          }),
        ],
      }),
      (0, s.jsx)("div", {
        className: "ceremony-foot",
        children: (0, s.jsxs)("div", {
          className: "row gap",
          children: [
            (0, s.jsx)(X, { onClick: c, children: "Close" }),
            (0, s.jsx)(X, { primary: !0, onClick: g, children: "See the full bracket" }),
          ],
        }),
      }),
    ],
  });
}
