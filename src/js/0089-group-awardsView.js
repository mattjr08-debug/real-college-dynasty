function awardsView(o) {
  return (0, s.jsx)("div", {
    className: "awards-list",
    children: o.map((a, i) =>
      (0, s.jsxs)(
        "div",
        {
          className: "award-block",
          children: [
            (0, s.jsx)("h4", { children: a.k }),
            (0, s.jsx)("div", {
              children: a.list.map((p, n) =>
                (0, s.jsxs)(
                  "div",
                  {
                    className: p.you ? "award-row you" : "award-row",
                    children: [
                      (0, s.jsx)("strong", { children: p.n }),
                      (0, s.jsx)("span", { children: p.s }),
                    ],
                  },
                  n
                )
              ),
            }),
          ],
        },
        i
      )
    ),
  });
}
