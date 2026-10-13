function a0({ g: e, run: run }) {
  let [t, l] = (0, N.useState)("Seasons"),
    other = W_hasOtherProgram(e),
    [sc, setSc] = (0, N.useState)("Current program"),
    cur = other && sc === "Current program",
    eg = cur ? { ...e, history: W_progHist(e), alumni: (e.alumni || []).filter((x) => (x.sid ? x.sid === e.school.id : x.school === e.school.name)), classes: (e.classes || []).filter((c) => (c.sid ? c.sid === e.school.id : !c.school || c.school === e.school.name)), scopeLabel: "PROGRAM RECORD" } : e;
  return (0, s.jsxs)(s.Fragment, {
    children: [
      (0, s.jsxs)("div", {
        className: "toolbar",
        children: [
          other &&
            (0, s.jsx)("div", {
              className: "chips scope-chips",
              role: "group",
              "aria-label": "History scope",
              title: "You have coached at more than one school. Current program shows only your seasons at this school; All time shows your whole coaching career.",
              children: ["Current program", "All time"].map((d) =>
                (0, s.jsx)("button", { className: d === sc ? "active" : "", onClick: () => setSc(d), children: d }, d)
              ),
            }),
          (0, s.jsx)("div", {
          className: "chips",
          children: [
            "Seasons",
            "Team history",
            "Leaders",
            "Best seasons",
            "Game records",
            "Program honors",
            "Former players",
            "Favorite players",
          ].map((d) =>
            (0, s.jsx)("button", { className: d === t ? "active" : "", onClick: () => l(d), children: d }, d)
          ),
        }),
        ],
      }),
      t === "Seasons"
        ? (0, s.jsx)(a0S, { g: eg })
        : t === "Team history"
          ? (0, s.jsx)(TeamHistory, { g: eg })
          : t === "Leaders" || t === "Best seasons" || t === "Game records"
            ? (0, s.jsx)(HistoryLeaders, { h: eg.history, g: eg, part: t })
            : t === "Program honors"
              ? (0, s.jsx)(AlumniPanel, { g: eg, part: "honors", run: run, key: "honors" })
              : t === "Favorite players"
                ? (0, s.jsx)(FavoritePlayers, { g: e, run: run })
                : (0, s.jsx)(AlumniPanel, { g: eg, part: "former", run: run, key: "former" }),
    ],
  });
}
