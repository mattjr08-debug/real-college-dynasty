function ChampCelebration({ g: e, onClose: c, onSeason: g }) {
  let h = e.history.at(-1);
  return (0, s.jsxs)("div", {
    className: "ceremony champ",
    children: [
      (0, s.jsx)("div", {
        className: "confetti",
        "aria-hidden": "true",
        children: Array.from({ length: 36 }, (_, i) =>
          (0, s.jsx)(
            "span",
            {
              style: {
                left: `${i * 2.8}%`,
                animationDelay: `${(i % 9) * 0.22}s`,
                background: ["#f5c542", "#fff", "var(--team)", "#6fd6a2"][i % 4],
              },
            },
            i
          )
        ),
      }),
      (0, s.jsxs)("div", {
        className: "ceremony-head gold",
        children: [
          (0, s.jsx)("div", { className: "ceremony-icon", children: (0, s.jsx)(ba, { size: 30 }) }),
          (0, s.jsxs)("div", {
            children: [
              (0, s.jsx)("p", { className: "eyebrow", children: "NATIONAL CHAMPIONS" }),
              (0, s.jsx)("h2", { children: `${e.school.name} win it all` }),
              (0, s.jsx)("p", {
                className: "ceremony-sub",
                children: `${h.year}\u2013${String(h.year + 1).slice(2)} \u00B7 ${h.wins}\u2013${h.losses}${e.confChampion ? " \u00B7 Conference champions too" : ""}`,
              }),
            ],
          }),
        ],
      }),
      (0, s.jsxs)("div", {
        className: "ceremony-scroll",
        children: [
          (0, s.jsx)("p", {
            className: "ceremony-body",
            children: `${e.coach} and the ${e.school.mascot} cut down the nets. The banner goes up in the rafters, your reputation soars, and the whole country knows your name.`,
          }),
          h.leader && (0, s.jsx)("p", { className: "ceremony-body", children: `Team leader: ${h.leader}` }),
        ],
      }),
      (0, s.jsx)("div", {
        className: "ceremony-foot",
        children: (0, s.jsxs)("div", {
          className: "row gap",
          children: [
            (0, s.jsx)(X, { onClick: c, children: "Keep celebrating" }),
            (0, s.jsx)(X, { primary: !0, onClick: g, children: "See the tournament" }),
          ],
        }),
      }),
    ],
  });
}
