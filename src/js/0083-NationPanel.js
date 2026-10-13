function NationPanel({ g: e }) {
  let me = e.school.id;
  return (0, s.jsx)(qe, {
    title: "Around the nation",
    meta: "Conference leaders across the country.",
    children: (0, s.jsx)("div", {
      className: "team-grid",
      style: { padding: "14px 18px" },
      children: (e.confs || []).map((g, ci) => {
        let ts = W_all(e)
          .filter((x) => g.includes(x.id))
          .sort((a, b) => b.cw - a.cw || b.wins - a.wins || b.rating - a.rating)
          .slice(0, 3);
        return (0, s.jsxs)(
          "div",
          {
            className: "team-card",
            children: [
              (0, s.jsx)("h4", { children: (e.confNames || [])[ci] }),
              ts.map((x) =>
                (0, s.jsxs)(
                  "div",
                  {
                    className: x.id === me ? "team-row you" : "team-row",
                    children: [
                      (0, s.jsx)("span", { children: x.name }),
                      (0, s.jsx)("small", {
                        children: `${x.cw}\u2013${x.cl} \u00B7 ${x.wins}\u2013${x.losses}`,
                      }),
                    ],
                  },
                  x.id
                )
              ),
            ],
          },
          ci
        );
      }),
    }),
  });
}
