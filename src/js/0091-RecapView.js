function RecapView({ d: d, h: h }) {
  let g = (d.games || []).filter((x) => x.r !== void 0),
    bw = g.filter((x) => x.w).sort((x, y) => y.r - x.r)[0],
    wl = g.filter((x) => !x.w).sort((x, y) => x.r - y.r)[0],
    bm = [...(d.games || [])].sort((x, y) => y.us - y.t - (x.us - x.t))[0],
    rows = [
      ["BEST WIN", bw ? `${bw.o} (${bw.r}) ${bw.us}\u2013${bw.t}` : "\u2014"],
      ["WORST LOSS", wl ? `${wl.o} (${wl.r}) ${wl.us}\u2013${wl.t}` : "\u2014"],
      ["BIGGEST BLOWOUT", bm ? `${bm.o} ${bm.us}\u2013${bm.t}` : "\u2014"],
      ["TEAM LEADER", (h && h.leader) || "\u2014"],
      ["STRENGTH OF SCHEDULE", h && h.tsos ? `${h.tsos} avg opponent` : "\u2014"],
      ["SEASON RESULT", d.line || "\u2014"],
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
