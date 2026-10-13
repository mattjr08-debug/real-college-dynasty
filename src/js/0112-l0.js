function l0({ m: e, g: a, select: t, onClose: l }) {
  return (0, s.jsxs)(Ao, {
    title: "Game box score",
    onClose: l,
    wide: !0,
    children: [
      (0, s.jsxs)("p", {
        className: "eyebrow",
        children: ["FINAL \xB7 ", e.kind.toUpperCase(), " \xB7 ", e.venue.toUpperCase()],
      }),
      (0, s.jsxs)("div", {
        className: "box-score-header",
        children: [
          (0, s.jsxs)("div", {
            children: [
              (0, s.jsx)("h3", { children: a.school.name }),
              (0, s.jsx)("strong", { className: e.win ? "good-text" : "", children: e.us }),
            ],
          }),
          (0, s.jsx)("span", { children: e.ot ? `${e.ot}OT` : "FINAL" }),
          (0, s.jsxs)("div", {
            children: [
              (0, s.jsx)("h3", { children: e.opponent }),
              (0, s.jsx)("strong", { children: e.them }),
            ],
          }),
        ],
      }),
      (0, s.jsx)("div", {
        className: "table-wrap",
        children: (0, s.jsxs)("table", {
          children: [
            (0, s.jsx)("thead", {
              children: (0, s.jsxs)("tr", {
                children: [
                  (0, s.jsx)("th", { children: "PLAYER" }),
                  (0, s.jsx)("th", { children: "MIN" }),
                  (0, s.jsx)("th", { children: "PTS" }),
                  (0, s.jsx)("th", { children: "REB" }),
                  (0, s.jsx)("th", { children: "AST" }),
                  (0, s.jsx)("th", { children: "STL" }),
                  (0, s.jsx)("th", { children: "BLK" }),
                  (0, s.jsx)("th", { children: "TO" }),
                  (0, s.jsx)("th", { children: "FG" }),
                  (0, s.jsx)("th", { children: "3PT" }),
                  (0, s.jsx)("th", { children: "FT" }),
                ],
              }),
            }),
            (0, s.jsx)("tbody", {
              children: e.box?.map((u) =>
                (0, s.jsxs)(
                  "tr",
                  {
                    children: [
                      (0, s.jsxs)("td", {
                        children: [
                          (0, s.jsx)("button", {
                            className: "text-button",
                            onClick: () => t(u.id),
                            children: u.name,
                          }),
                          (0, s.jsx)("span", { className: "table-sub", children: u.pos }),
                        ],
                      }),
                      (0, s.jsx)("td", { children: u.min }),
                      (0, s.jsx)("td", { children: (0, s.jsx)("strong", { children: u.pts }) }),
                      (0, s.jsx)("td", { children: u.reb }),
                      (0, s.jsx)("td", { children: u.ast }),
                      (0, s.jsx)("td", { children: u.stl }),
                      (0, s.jsx)("td", { children: u.blk }),
                      (0, s.jsx)("td", { children: u.to }),
                      (0, s.jsxs)("td", { children: [u.fgm, "\u2013", u.fga] }),
                      (0, s.jsxs)("td", { children: [u.tpm, "\u2013", u.tpa] }),
                      (0, s.jsxs)("td", { children: [u.ftm, "\u2013", u.fta] }),
                    ],
                  },
                  u.id
                )
              ),
            }),
          ],
        }),
      }),
      (0, s.jsx)("p", {
        className: "footnote",
        children: "Click a player\u2019s name to open their full profile.",
      }),
    ],
  });
}
