function AwardsCeremony({ g: e, onClose: a, onSeason: t }) {
  let h = e.history.at(-1),
    n = h.awards.reduce((l, u) => l + u.list.filter((r) => r.you).length, 0);
  return (0, s.jsxs)("div", {
    className: "ceremony",
    children: [
      (0, s.jsxs)("div", {
        className: "ceremony-head",
        children: [
          (0, s.jsx)("div", { className: "ceremony-icon", children: (0, s.jsx)(ba, { size: 28 }) }),
          (0, s.jsxs)("div", {
            children: [
              (0, s.jsx)("p", { className: "eyebrow", children: "END OF SEASON AWARDS" }),
              (0, s.jsx)("h2", { children: `${h.year}\u2013${String(h.year + 1).slice(2)} Awards` }),
              (0, s.jsx)("p", {
                className: "ceremony-sub",
                children: n
                  ? `${n} honor${n === 1 ? "" : "s"} for ${e.school.name}`
                  : "No one from your program was honored this year",
              }),
            ],
          }),
        ],
      }),
      (0, s.jsx)("div", {
        className: "ceremony-scroll",
        children: (0, s.jsx)(AwardsBody, { aw: h.awards, roster: e.roster }),
      }),
      (0, s.jsxs)("div", {
        className: "ceremony-foot",
        children: [
          (0, s.jsx)("small", { children: n ? "Honored players will ask for raises next season." : "" }),
          (0, s.jsxs)("div", {
            className: "row gap",
            children: [
              (0, s.jsx)(X, { onClick: a, children: "Close" }),
              (0, s.jsx)(X, { primary: !0, onClick: t, children: "See the full season" }),
            ],
          }),
        ],
      }),
    ],
  });
}
