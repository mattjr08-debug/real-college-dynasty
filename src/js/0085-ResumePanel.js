function ResumePanel({ g: e }) {
  let pl = e.schedule.filter((f) => f.played && ["Nonconference", "Conference"].includes(f.kind)),
    w = pl.filter((f) => f.win).length,
    lo = pl.length - w,
    sos = pl.length ? pl.reduce((x, f) => x + f.rating, 0) / pl.length : 0,
    me = Ps(e),
    qw = pl.filter((f) => f.win && f.rating >= 74),
    bl = pl.filter((f) => !f.win && f.rating <= me - 8),
    qwn = qw.length,
    seed = le(Math.round(18 - (w - 14) * 0.75 - qwn * 0.5), 1, 16),
    ok = e.confChampion || (w >= 19 && (sos >= 61 || w >= 24) && w + qwn * 2 >= 22),
    left = e.schedule.filter((f) => !f.played && ["Nonconference", "Conference"].includes(f.kind)).length,
    need = Math.max(0, 19 - w),
    status = e.confChampion
      ? "Automatic qualifier"
      : ok
        ? "Currently in the field"
        : need > left
          ? "Out of reach on wins alone"
          : "On the bubble";
  return (0, s.jsxs)(qe, {
    title: "Tournament r\u00E9sum\u00E9",
    meta: "The same numbers the selection committee uses.",
    children: [
      (0, s.jsx)("div", {
        className: "stat-trio",
        style: { padding: "14px 18px" },
        children: [
          ["RECORD", `${w}\u2013${lo}`],
          ["STRENGTH OF SCHEDULE", pl.length ? `${Math.round(sos)} avg opp` : "\u2014"],
          ["QUALITY WINS (74+)", String(qwn)],
          ["BAD LOSSES", String(bl.length)],
          ["PROJECTED SEED", ok ? `#${seed}` : "\u2014"],
          ["STATUS", status],
        ].map((z) =>
          (0, s.jsxs)(
            "div",
            { children: [(0, s.jsx)("small", { children: z[0] }), (0, s.jsx)("strong", { children: z[1] })] },
            z[0]
          )
        ),
      }),
      (0, s.jsxs)("div", {
        className: "rp-grid",
        style: { padding: "0 18px 16px" },
        children: [
          (0, s.jsxs)("div", {
            children: [
              (0, s.jsx)("small", { children: "QUALITY WINS" }),
              qw.length
                ? qw.map((f, i) =>
                    (0, s.jsx)("em", { children: `${f.opponent} (${f.rating}) ${f.us}\u2013${f.them}` }, i)
                  )
                : (0, s.jsx)("em", { children: "None yet" }),
            ],
          }),
          (0, s.jsxs)("div", {
            children: [
              (0, s.jsx)("small", { children: "BAD LOSSES" }),
              bl.length
                ? bl.map((f, i) =>
                    (0, s.jsx)("em", { children: `${f.opponent} (${f.rating}) ${f.us}\u2013${f.them}` }, i)
                  )
                : (0, s.jsx)("em", { children: "None" }),
            ],
          }),
          (0, s.jsxs)("div", {
            children: [
              (0, s.jsx)("small", { children: "TO GET IN" }),
              (0, s.jsx)("em", {
                children: e.confChampion
                  ? "You already have the automatic bid."
                  : ok
                    ? "Keep winning to protect your seed."
                    : `Win the conference tournament, or reach 19 wins with a tough schedule (${need} more, ${left} games left).`,
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
