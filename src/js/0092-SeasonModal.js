function SeasonModal({ g: e, onClose: a, tab0: tab0 }) {
  let cur = !(e.phase === "Offseason" || e.phase === "Season review"),
    h = e.history.at(-1),
    d = cur
      ? {
          title: `${e.year}\u2013${String(e.year + 1).slice(2)} season so far`,
          line: `${dl(e).wins}\u2013${dl(e).losses} overall`,
          games: e.schedule
            .filter((f) => f.played)
            .map((f) => ({
              o: f.opponent,
              v: f.venue,
              k: f.kind,
              us: f.us,
              t: f.them,
              w: f.win,
              ot: f.ot || 0,
            })),
          conf: e.confBracket || (e.tournament === "Conference" ? cbk(e, e.bracket) : null),
          nat: e.tournament === "National" ? cbk(e, e.bracket) : e.natBracket || null,
          nit: e.tournament === "NIT" ? cbk(e, e.bracket) : e.nitBracket || null,
        }
      : h
        ? {
            title: `${h.year}\u2013${String(h.year + 1).slice(2)} season`,
            line: `${h.wins}\u2013${h.losses} \u00B7 ${h.result}`,
            games: h.games || null,
            conf: h.conf || null,
            nat: h.nat || null,
            nit: h.nit || null,
            awards: h.awards || null,
          }
        : null,
    [t, l] = (0, N.useState)(tab0 || "Games"),
    CN = ["Quarterfinals", "Semifinals", "Final"],
    NN = natNames(!1),
    br = (r, nm, rg) => (0, s.jsx)(BracketTree, { rounds: r, names: nm, me: e.school.name, regions: rg, school: e.school });
  return (0, s.jsx)(Ao, {
    title: "Season results",
    onClose: a,
    wide: !0,
    children: (0, s.jsxs)("div", {
      className: "season-modal",
      children: [
        (0, s.jsx)("p", { className: "eyebrow", children: "SEASON RESULTS" }),
        (0, s.jsx)("h2", { children: d ? d.title : "No season played yet" }),
        d && (0, s.jsx)("p", { className: "muted", children: d.line }),
        d &&
          (0, s.jsx)("div", {
            className: "chips",
            children: [
              "Games",
              "Recap",
              "Highlights",
              "Conference tournament",
              "National tournament",
              "NIT",
              "Awards",
            ].map((u) =>
              (0, s.jsx)(
                "button",
                { className: u === t ? "active" : "", onClick: () => l(u), children: u },
                u
              )
            ),
          }),
        !d &&
          (0, s.jsx)("p", {
            className: "muted",
            children: "Play a season to see every game and both tournaments here.",
          }),
        d && t === "Recap" && (0, s.jsx)(RecapView, { d: d, h: cur ? null : h }),
        d && t === "Highlights" && (0, s.jsx)(HighlightsView, { d: d, h: cur ? null : h }),
        d &&
          t === "Games" &&
          (d.games && d.games.length
            ? (0, s.jsx)("div", {
                className: "season-list",
                children: d.games.map((u, n) =>
                  (0, s.jsxs)(
                    "div",
                    {
                      className: "season-game",
                      children: [
                        (0, s.jsx)(he, { tone: u.w ? "green" : "red", children: u.w ? "W" : "L" }),
                        (0, s.jsxs)("div", {
                          children: [
                            (0, s.jsx)("strong", { children: u.o }),
                            (0, s.jsx)("small", { children: `${u.k} \u00B7 ${u.v}` }),
                          ],
                        }),
                        (0, s.jsxs)("b", { children: [u.us, "\u2013", u.t, u.ot ? " OT" : ""] }),
                      ],
                    },
                    n
                  )
                ),
              })
            : (0, s.jsx)("p", {
                className: "muted",
                children: "Game scores were not recorded for this season.",
              })),
        d &&
          t === "Conference tournament" &&
          (d.conf && d.conf.length
            ? br(d.conf, CN)
            : (0, s.jsx)("p", {
                className: "muted",
                children: "No conference tournament results were recorded for this season.",
              })),
        d &&
          t === "National tournament" &&
          (d.nat && d.nat.length
            ? br(d.nat, NN, natRegionText(cur ? e.year : h.year))
            : (0, s.jsx)("p", {
                className: "muted",
                children: "No national tournament results were recorded for this season.",
              })),
        d &&
          t === "NIT" &&
          (d.nit && d.nit.length
            ? br(d.nit, NIT_NAMES)
            : (0, s.jsx)("p", {
                className: "muted",
                children: "The 32 best teams left out of the national tournament play the NIT. No NIT results were recorded for this season.",
              })),
        d &&
          t === "Awards" &&
          (d.awards && d.awards.length
            ? (0, s.jsx)(AwardsBody, { aw: d.awards, roster: e.roster })
            : (0, s.jsx)("p", { className: "muted", children: "No awards were recorded for this season." })),
        (0, s.jsx)("div", {
          className: "row gap",
          children: (0, s.jsx)(X, { onClick: a, children: "Close" }),
        }),
      ],
    }),
  });
}
