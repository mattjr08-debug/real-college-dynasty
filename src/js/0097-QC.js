function QC({ g: e, source: a, run: t, select: l }) {
  let [u, o] = (0, N.useState)("All"),
    [r, n] = (0, N.useState)("All"),
    [i, d] = (0, N.useState)("Available"),
    [f, y] = (0, N.useState)(""),
    h = "Interest",
    C = e.prospects
      .filter(
        (v) =>
          (a === "Transfer" ? v.origin === "Transfer" : v.origin === "High school") &&
          (u === "All" || v.pos === u) &&
          (r === "All" || v.stars === Number(r)) &&
          (i === "All" || i === "Targets"
            ? i !== "Targets" || v.target
            : i === "Offers"
              ? !!v.offer
              : v.status === i) &&
          v.name.toLowerCase().includes(f.toLowerCase())
      )
      .sort((v, M) =>
        h === "Interest" ? M.interest - v.interest : h === "Stars" ? M.stars - v.stars : v.ask - M.ask
      );
  return (0, s.jsxs)(s.Fragment, {
    children: [
      (0, s.jsxs)("div", {
        className: "recruit-banner",
        children: [
          (0, s.jsxs)("div", {
            children: [
              (0, s.jsx)("p", {
                className: "eyebrow",
                children:
                  a === "Transfer" ? "EXPERIENCE CHANGES EVERYTHING" : "FIND THE FUTURE OF YOUR PROGRAM",
              }),
              (0, s.jsx)("h2", {
                children: a === "Transfer" ? "Win now. Build momentum." : "Your next difference-maker.",
              }),
              (0, s.jsx)("p", {
                children:
                  a === "Transfer"
                    ? "Proven college players looking for a new opportunity."
                    : "Scout hidden potential. Make your pitch. Win the commitment.",
              }),
            ],
          }),
          (0, s.jsxs)("div", {
            className: "recruit-resources",
            children: [
              (0, s.jsxs)("div", {
                children: [
                  (0, s.jsx)("strong", { children: e.scouts }),
                  (0, s.jsx)("span", { children: "SCOUTING VISITS" }),
                ],
              }),
              (0, s.jsxs)("div", {
                children: [
                  (0, s.jsx)("strong", { children: e.ov ?? TUNE.ovisits }),
                  (0, s.jsx)("span", { children: "OFFICIAL VISITS" }),
                ],
              }),
              (0, s.jsxs)("div", {
                children: [
                  (0, s.jsx)("strong", { children: q(Ce(e)) }),
                  (0, s.jsx)("span", { children: "NIL AVAILABLE" }),
                ],
              }),
              (0, s.jsxs)("div", {
                children: [
                  (0, s.jsx)("strong", { children: 15 - e.roster.length }),
                  (0, s.jsx)("span", { children: "OPEN SPOTS" }),
                ],
              }),
            ],
          }),
        ],
      }),
      (0, s.jsxs)("div", {
        className: "recruit-round",
        children: [
          (0, s.jsxs)("div", {
            children: [
              (0, s.jsx)("strong", {
                children:
                  e.phase === "Offseason" && e.pw >= 1 && e.pw <= 3
                    ? `Transfer portal window: wave ${e.pw} of 3`
                    : e.phase === "Offseason" && e.round <= 8
                    ? `Recruiting round ${e.round} of 8`
                    : e.phase === "Offseason" && e.round === 9
                      ? "Last chance round"
                      : "Recruiting window closed",
              }),
              (0, s.jsxs)("span", {
                children: [
                  e.prospects.filter((v) => v.offer).length,
                  " offers pending \xB7 ",
                  q(kt(e)),
                  " reserved",
                ],
              }),
            ],
          }),
          (0, s.jsx)(Zn, { g: e, run: t }),
          (0, s.jsxs)(X, {
            primary: !0,
            disabled: e.phase !== "Offseason" || e.round > 9,
            onClick: () => {
              t({ type: e.pw >= 1 && e.pw <= 3 ? "portalWave" : "recruitRound" });
            },
            children: [
              (0, s.jsx)(Fl, { size: 16 }),
              e.pw >= 1 && e.pw <= 3
                ? "Advance portal wave"
                : e.round === 9
                  ? "Finish recruiting"
                  : "Advance recruiting round",
            ],
          }),
        ],
      }),
      // Item 58: the high school class waits for the portal window
      a !== "Transfer" &&
        e.phase === "Offseason" &&
        hsLock(e) &&
        (0, s.jsxs)("div", {
          className: "callout hs-lock",
          children: [
            (0, s.jsx)(ja, { size: 24 }),
            (0, s.jsxs)("p", {
              children: [
                (0, s.jsx)("strong", { children: HS_LOCK_MSG }),
                ` The transfer portal window is open (wave ${e.pw} of 3). You can look at and bookmark high school recruits, but offers, scouting and official visits wait until the last portal wave is done.`,
              ],
            }),
          ],
        }),
      (0, s.jsxs)("div", {
        className: "toolbar wrap recruit-filters",
        children: [
          (0, s.jsxs)("div", {
            className: "search-field",
            children: [
              (0, s.jsx)(Va, { size: 17 }),
              (0, s.jsx)("input", {
                placeholder: "Search players…",
                "aria-label": "Search players",
                value: f,
                onChange: (v) => y(v.target.value),
              }),
            ],
          }),
          (0, s.jsx)(ChipFilter, {
            label: "Recruiting status",
            value: i,
            onChange: d,
            items: ["Available", "Targets", "Offers", "Signed", "Committed elsewhere", "All"].map((v) => [v, v === "Targets" ? "Watching" : v]),
          }),
          (0, s.jsx)(ChipFilter, {
            label: "Position",
            value: u,
            onChange: o,
            items: ["All", ...Le].map((v) => [v, v === "All" ? "All positions" : v]),
          }),
          (0, s.jsx)(ChipFilter, {
            label: "Stars",
            value: r,
            onChange: n,
            items: [["All", "All stars"], ...[5, 4, 3, 2, 1, 0].map((v) => [String(v), v ? `${v}★` : "Unranked"])],
          }),
        ],
      }),
      (0, s.jsx)(RecruitTable, {
        g: e,
        rows: C,
        run: t,
        select: l,
        kind: a,
        empty: (0, s.jsx)(yl, {
          title: "No matching players",
          body: "Try another position, star level, or recruiting status.",
        }),
      }),
      (0, s.jsx)("p", {
        className: "footnote",
        children:
          "Offers reserve NIL and a roster spot. Advance rounds to move recruits toward a decision. Progress measures decision timing; signing chance measures whether they choose you. Two scouting visits reveal exact ratings and baseline potential. Official visits (five a year, more with a good recruiting assistant) fully scout a high school recruit and raise his chance to sign. Real ceilings can move with minutes, role fit and morale.",
      }),
    ],
  });
}
