function a0S({ g: e }) {
  let a = e.history.reduce((l, u) => l + u.wins, 0),
    t = e.history.reduce((l, u) => l + u.losses, 0),
    nitT = e.history.filter((l) => l.result === "NIT champions").length,
    nitIn = e.history.filter((l) => nitFinish(l)).length;
  return (0, s.jsxs)(s.Fragment, {
    children: [
      (0, s.jsxs)("div", {
        className: "metrics three four",
        children: [
          (0, s.jsx)(ca, {
            label: e.scopeLabel || "CAREER RECORD",
            value: `${a}\u2013${t}`,
            note: `${e.history.length} completed seasons`,
            icon: (0, s.jsx)(At, {}),
          }),
          (0, s.jsx)(ca, {
            label: "CHAMPIONSHIPS",
            value: String(e.history.filter((l) => l.result === "National champions").length),
            note: "National titles",
            icon: (0, s.jsx)(ba, {}),
          }),
          (0, s.jsx)(ca, {
            label: "NIT TITLES",
            value: String(nitT),
            note: `${nitIn} NIT trip${nitIn === 1 ? "" : "s"}`,
            icon: (0, s.jsx)(ba, {}),
          }),
          (0, s.jsx)(ca, {
            label: "PROGRAM REPUTATION",
            value: `${e.rep}/99`,
            note: `${e.school.name} \xB7 ${e.school.mascot}`,
            icon: (0, s.jsx)(Es, {}),
          }),
          (0, s.jsx)(ca, {
            label: "COACH REPUTATION",
            value: `${W_crepInit(e)}/99`,
            note: `${W_crepLabel(W_crepInit(e))} \xB7 yours, comes with you \xB7 recruits see the program as ${W_recRep(e)}`,
            icon: (0, s.jsx)(Es, {}),
          }),
        ],
      }),
      e.history.length
        ? (0, s.jsx)("div", {
            className: "stack",
            children: [...e.history]
              .reverse()
              .map((l) =>
                (0, s.jsx)(
                  qe,
                  {
                    title: `${l.year}\u2013${String(l.year + 1).slice(2)} \xB7 ${l.wins}\u2013${l.losses}${!e.scopeLabel && l.school && l.school !== e.school.name ? " \xB7 " + l.school : ""}`,
                    meta: `${l.cw}\u2013${l.cl} conference \xB7 ${nitFinish(l) && !/^NIT/.test(l.result) ? nitFinish(l) : l.result}`,
                    action: (0, s.jsxs)(s.Fragment, {
                      children: [
                        nitFinish(l) && (0, s.jsx)(he, { tone: l.result === "NIT champions" ? "orange" : "", children: l.result === "NIT champions" ? "NIT CHAMPIONS" : nitFinish(l).toUpperCase() }),
                        (0, s.jsxs)(he, { tone: "orange", children: [l.rep, " REP"] }),
                      ],
                    }),
                    children: (0, s.jsxs)("div", {
                      className: "history-content",
                      children: [
                        (0, s.jsxs)("p", { children: [(0, s.jsx)(ba, { size: 18 }), " ", l.award] }),
                        (0, s.jsxs)("p", {
                          children: [
                            (0, s.jsx)(io, { size: 18 }),
                            " Recruiting class: ",
                            l.recruits.length ? l.recruits.join(", ") : "No scholarship signings",
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
                                    (0, s.jsx)("th", { children: "POS" }),
                                    (0, s.jsx)("th", { children: "OVR" }),
                                    (0, s.jsx)("th", { children: "PPG" }),
                                    (0, s.jsx)("th", { children: "RPG" }),
                                    (0, s.jsx)("th", { children: "APG" }),
                                    (0, s.jsx)("th", { children: "SPG" }),
                                    (0, s.jsx)("th", { children: "BPG" }),
                                  ],
                                }),
                              }),
                              (0, s.jsx)("tbody", {
                                children: [...l.players]
                                  .sort((u, o) => o.stats.pts - u.stats.pts)
                                  .map((u, o) =>
                                    (0, s.jsxs)(
                                      "tr",
                                      {
                                        children: [
                                          (0, s.jsx)("td", { children: u.name }),
                                          (0, s.jsx)("td", { children: u.pos }),
                                          (0, s.jsx)("td", { children: u.ovr }),
                                          (0, s.jsx)("td", {
                                            children: (u.stats.pts / Math.max(1, u.stats.gp)).toFixed(1),
                                          }),
                                          (0, s.jsx)("td", {
                                            children: (u.stats.reb / Math.max(1, u.stats.gp)).toFixed(1),
                                          }),
                                          (0, s.jsx)("td", {
                                            children: (u.stats.ast / Math.max(1, u.stats.gp)).toFixed(1),
                                          }),
                                          (0, s.jsx)("td", {
                                            children: ((u.stats.stl || 0) / Math.max(1, u.stats.gp)).toFixed(1),
                                          }),
                                          (0, s.jsx)("td", {
                                            children: ((u.stats.blk || 0) / Math.max(1, u.stats.gp)).toFixed(1),
                                          }),
                                        ],
                                      },
                                      o
                                    )
                                  ),
                              }),
                            ],
                          }),
                        }),
                      ],
                    }),
                  },
                  l.year
                )
              ),
          })
        : (0, s.jsx)(qe, {
            title: "Your legacy starts this season",
            children: (0, s.jsx)(yl, {
              title: "The record books are waiting.",
              body: "Complete your first season to preserve results, awards, recruiting classes, and player statistics here.",
            }),
          }),
    ],
  });
}
