function HighlightsView({ d: d, h: h }) {
  let x = h && h.hl;
  if (!x)
    return (0, s.jsx)("p", {
      className: "muted",
      children: "Highlights are saved at the end of each season.",
    });
  let pre = x.pre,
    fin = x.cf,
    sc = (n) => (n === 1 ? "1st" : n === 2 ? "2nd" : n === 3 ? "3rd" : n + "th"),
    rows = [
      ["BIGGEST WIN", x.big ? `${x.big.o} ${x.big.us}\u2013${x.big.t}` : "\u2014"],
      ["BEST WIN", x.up ? `${x.up.o} (${x.up.r}) ${x.up.us}\u2013${x.up.t}` : "No win over a stronger team"],
      ["WORST LOSS", x.bad ? `${x.bad.o} (${x.bad.r}) ${x.bad.us}\u2013${x.bad.t}` : "\u2014"],
      [
        "BEST GAME BY A PLAYER",
        x.best
          ? `${x.best.n}: ${x.best.pts} pts, ${x.best.reb} reb, ${x.best.ast} ast vs ${x.best.o}`
          : "\u2014",
      ],
      ["LONGEST WIN STREAK", x.streak ? `${x.streak} games` : "\u2014"],
      [
        "VS. EXPECTATIONS",
        pre && fin
          ? `Picked ${sc(pre.conf)} of ${pre.n}, finished ${sc(fin)} in the conference (${fin < pre.conf ? "beat" : fin === pre.conf ? "met" : "missed"} the media pick)`
          : "\u2014",
      ],
    ];
  return (0, s.jsx)("div", {
    className: "stat-trio",
    children: rows.map((z) =>
      (0, s.jsxs)(
        "div",
        {
          children: [
            (0, s.jsx)("small", { children: z[0] }),
            (0, s.jsx)("strong", { style: { fontSize: "1rem" }, children: z[1] }),
          ],
        },
        z[0]
      )
    ),
  });
}
