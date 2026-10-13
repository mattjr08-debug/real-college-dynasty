function YC({ g: e, select: a, run: t, navigate: l }) {
  let [u, o] = (0, N.useState)("All"),
    [r, n] = (0, N.useState)("Overall"),
    [rtab, setRtab] = (0, N.useState)("Roster"),
    i = e.roster.filter((d) => u === "All" || d.pos === u);
  return (
    (i = [...i].sort((d, f) =>
      r === "Overall"
        ? f.ovr - d.ovr
        : r === "Morale"
          ? d.morale - f.morale
          : r === "NIL"
            ? f.nil - d.nil
            : r === "Class"
              ? f.year - d.year
              : Le.indexOf(d.pos) - Le.indexOf(f.pos)
    )),
    (0, s.jsxs)(s.Fragment, {
      children: [
        (0, s.jsx)("div", {
          className: "toolbar",
          children: (0, s.jsx)("div", {
            className: "chips",
            children: ["Roster", "Stats", "Development", "Offseason departures"].map((d) =>
              (0, s.jsx)(
                "button",
                { className: d === rtab ? "active" : "", onClick: () => setRtab(d), children: d },
                d
              )
            ),
          }),
        }),
        rtab === "Roster" &&
          (0, s.jsxs)("div", {
            className: "toolbar",
            children: [
              (0, s.jsx)("div", {
                className: "chips",
                children: ["All", ...Le].map((d) =>
                  (0, s.jsx)(
                    "button",
                    {
                      className: d === u ? "active" : "",
                      onClick: () => o(d),
                      children: d === "All" ? "All players" : d,
                    },
                    d
                  )
                ),
              }),
              (0, s.jsxs)("div", {
                className: "row gap",
                children: [
                  (0, s.jsxs)("span", { className: "muted", children: [e.roster.length, " / 15 players"] }),
                  (0, s.jsx)("select", {
                    "aria-label": "Sort roster",
                    value: r,
                    onChange: (d) => n(d.target.value),
                    children: ["Overall", "Morale", "NIL", "Class", "Position"].map((d) =>
                      (0, s.jsx)("option", { children: d }, d)
                    ),
                  }),
                ],
              }),
            ],
          }),
        rtab === "Roster" &&
          e.roster.some((d) => d.injury > 0) &&
          (0, s.jsxs)("div", {
            className: "min-warn injury-report",
            children: [
              (0, s.jsx)("strong", { children: "Injury report: " }),
              e.roster
                .filter((d) => d.injury > 0)
                .sort((d, f) => f.injury - d.injury)
                .map(
                  (d) =>
                    `${d.name} (${d.pos}${e.lineup.includes(d.id) ? ", starter" : ""}) ${d.susp ? (d.susp === 2 ? "ineligible" : "suspended") : "out"} ${d.injury} game${d.injury === 1 ? "" : "s"}`
                )
                .join(" \xB7 "),
            ],
          }),
        rtab === "Roster" &&
          (0, s.jsxs)("div", {
            className: "roster-grid",
            children: [
              i.map((d) => (0, s.jsx)(Fy, { p: d, onClick: () => a(d.id) }, d.id)),
              !i.length &&
                (0, s.jsx)(yl, {
                  title: "No players at this position",
                  body: "Recruit someone who can fill the gap.",
                }),
            ],
          }),
        rtab === "Roster" &&
          e.phase === "Offseason" &&
          e.roster.length < 15 &&
          (0, s.jsxs)("div", {
            className: "callout",
            children: [
              (0, s.jsxs)("div", {
                children: [
                  (0, s.jsx)("h3", { children: "Need to fill out the roster?" }),
                  (0, s.jsx)("p", {
                    children:
                      "Walk-ons cost no NIL and provide depth. Their ratings are lower than most recruits.",
                  }),
                ],
              }),
              (0, s.jsxs)("div", {
                className: "row gap",
                children: [
                  (0, s.jsxs)(X, {
                    onClick: () => l("Walkons"),
                    children: [(0, s.jsx)(Gl, { size: 16 }), "Browse 100 walk-ons"],
                  }),
                  (0, s.jsx)(Zn, { g: e, run: t }),
                ],
              }),
            ],
          }),
        rtab === "Stats" && (0, s.jsx)(StatsPanel, { g: e, select: a }),
        rtab === "Development" && (0, s.jsx)(DevPanel, { g: e, select: a }),
        rtab === "Offseason departures" &&
          (0, s.jsx)(qe, {
            title: "Offseason departures",
            meta: "The roster changes that shaped this rebuild.",
            children: (0, s.jsx)("div", {
              className: "departure-list",
              children: e.departed.length
                ? e.departed.map((d, f) =>
                    (0, s.jsxs)(
                      "div",
                      {
                        children: [
                          (0, s.jsxs)("div", {
                            className: "row gap",
                            children: [
                              d.faceSeed !== void 0
                                ? (0, s.jsx)(Ja, { p: d, size: "tiny" })
                                : d.reason === "Graduated"
                                  ? (0, s.jsx)(io, { size: 18 })
                                  : (0, s.jsx)(so, { size: 18 }),
                              (0, s.jsx)("strong", { children: d.name }),
                              d.pos && (0, s.jsx)("span", { className: "muted", children: d.pos }),
                            ],
                          }),
                          (0, s.jsx)("span", { children: d.reason }),
                          (0, s.jsxs)(he, { children: [d.ovr, " OVR"] }),
                        ],
                      },
                      f
                    )
                  )
                : (0, s.jsx)("p", { className: "muted", children: "Everyone returned this offseason." }),
            }),
          }),
      ],
    })
  );
}
