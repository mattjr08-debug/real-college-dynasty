function u0({ g: e, run: a, select: t }) {
  let [l, u] = (0, N.useState)("All"),
    [vw, setVw] = (0, N.useState)("My recruits"),
    [bsort, setBsort] = (0, N.useState)("Stars"),
    r = [...e.prospects, ...e.walkons]
      .filter((n) => n.target || n.offer || n.status === "Signed")
      .filter((n) =>
        l === "All" || l === "In progress"
          ? l !== "In progress" || n.status === "Available"
          : l === "Offer pending"
            ? !!n.offer && n.status === "Available"
            : l === "Committed"
              ? n.status === "Signed"
              : n.status === "Committed elsewhere" || n.status === "Declined"
      )
      .sort((n, i) => {
        let d = n.source === "Roster" || n.scouted >= 2,
          f = i.source === "Roster" || i.scouted >= 2,
          nm = n.name.localeCompare(i.name);
        return bsort === "Rating"
          ? d !== f
            ? d
              ? -1
              : 1
            : d
              ? i.ovr - n.ovr || nm
              : i.stars - n.stars || nm
          : bsort === "Class"
            ? n.year - i.year || i.stars - n.stars || nm
            : bsort === "Interest"
              ? i.interest - n.interest || nm
              : bsort === "Name"
                ? nm
                : i.stars - n.stars || (d !== f ? (d ? -1 : 1) : d ? i.ovr - n.ovr : 0) || nm;
      });
  return (0, s.jsxs)(s.Fragment, {
    children: [
      (0, s.jsxs)("div", {
        className: "recruit-banner",
        children: [
          (0, s.jsxs)("div", {
            children: [
              (0, s.jsx)("p", { className: "eyebrow", children: "YOUR RECRUITING ROOM" }),
              (0, s.jsx)("h2", { children: "From first contact to commitment." }),
              (0, s.jsx)("p", {
                children:
                  "Decision progress shows how close a recruit is to choosing. Signing chance shows how likely they are to choose your school.",
              }),
            ],
          }),
          (0, s.jsxs)("div", {
            className: "recruit-resources",
            children: [
              (0, s.jsxs)("div", {
                children: [
                  (0, s.jsx)("strong", { children: e.prospects.filter((n) => n.offer).length }),
                  (0, s.jsx)("span", { children: "ACTIVE OFFERS" }),
                ],
              }),
              (0, s.jsxs)("div", {
                children: [
                  (0, s.jsx)("strong", { children: e.signings.length }),
                  (0, s.jsx)("span", { children: "COMMITMENTS" }),
                ],
              }),
              (0, s.jsxs)("div", {
                children: [
                  (0, s.jsx)("strong", { children: q(Ce(e)) }),
                  (0, s.jsx)("span", { children: "NIL REMAINING" }),
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
              (0, s.jsxs)("strong", {
                children:
                  e.pw >= 1 && e.pw <= 3
                    ? `Transfer portal window: wave ${e.pw} of 3`
                    : e.round === 9
                      ? "Last chance round"
                      : ["Round ", Math.min(e.round, 8), " / 8"],
              }),
              (0, s.jsxs)("span", {
                children: [e.roster.length, "/15 players \xB7 ", Xa(e), "/5 starter promises"],
              }),
            ],
          }),
          (0, s.jsx)(Zn, { g: e, run: a }),
          (0, s.jsxs)(X, {
            primary: !0,
            disabled: e.phase !== "Offseason" || e.round > 9,
            onClick: () => {
              a({ type: e.pw >= 1 && e.pw <= 3 ? "portalWave" : "recruitRound" });
            },
            children: [
              (0, s.jsx)(Fl, { size: 15 }),
              e.pw >= 1 && e.pw <= 3
                ? "Advance portal wave"
                : e.round === 9
                  ? "Finish recruiting"
                  : "Advance recruiting round",
            ],
          }),
        ],
      }),
      (0, s.jsx)("div", {
        className: "toolbar",
        children: (0, s.jsx)("div", {
          className: "chips",
          children: ["My recruits", "Commitment history"].map((n) =>
            (0, s.jsx)(
              "button",
              { className: vw === n ? "active" : "", onClick: () => setVw(n), children: n },
              n
            )
          ),
        }),
      }),
      vw === "My recruits" &&
        (0, s.jsxs)("div", {
          className: "toolbar",
          children: [
            (0, s.jsx)("div", {
              className: "chips",
              children: ["All", "In progress", "Offer pending", "Committed", "Lost"].map((n) =>
                (0, s.jsx)(
                  "button",
                  { className: l === n ? "active" : "", onClick: () => u(n), children: n },
                  n
                )
              ),
            }),
            (0, s.jsxs)("label", {
              className: "sort-pick",
              children: [
                (0, s.jsx)("span", { children: "Sort by" }),
                (0, s.jsx)("select", {
                  value: bsort,
                  onChange: (n) => setBsort(n.target.value),
                  children: ["Stars", "Rating", "Class", "Interest", "Name"].map((n) =>
                    (0, s.jsx)("option", { value: n, children: n }, n)
                  ),
                }),
              ],
            }),
            (0, s.jsx)(X, {
              small: !0,
              className: "cut-btn",
              disabled: !r.some((n) => n.status !== "Signed" && !n.offer),
              title:
                "Take every recruit shown here off the list. Players with pending offers and players who committed to you stay.",
              onClick: () => {
                let c = r.filter((n) => n.status !== "Signed" && !n.offer);
                c.length &&
                  window.confirm(
                    `Remove ${c.length} recruit${c.length === 1 ? "" : "s"} from this list? Players with pending offers and players who committed to you stay.`
                  ) &&
                  a({ type: "removeBoardMany", ids: c.map((n) => n.id) });
              },
              children: "Remove all",
            }),
          ],
        }),
      vw === "My recruits" &&
        (0, s.jsx)(RecruitTable, {
          g: e,
          rows: r,
          run: a,
          select: t,
          kind: "Board",
          empty: (0, s.jsx)(yl, {
            title: "Your board is waiting",
            body: "Bookmark, scout, or offer a high school recruit or transfer to track them here.",
          }),
        }),
      vw === "Commitment history" &&
        (0, s.jsxs)(qe, {
          title: "Commitment history",
          meta: "Most recent 100 commitments, including walk-ons.",
          children: [
            (0, s.jsx)("div", {
              className: "table-wrap",
              children: (0, s.jsxs)("table", {
                children: [
                  (0, s.jsx)("thead", {
                    children: (0, s.jsxs)("tr", {
                      children: [
                        (0, s.jsx)("th", { children: "PLAYER" }),
                        (0, s.jsx)("th", { children: "POSITION / OVR" }),
                        (0, s.jsx)("th", { children: "ORIGIN" }),
                        (0, s.jsx)("th", { children: "COMMITTED" }),
                        (0, s.jsx)("th", { children: "NIL / YEAR" }),
                      ],
                    }),
                  }),
                  (0, s.jsx)("tbody", {
                    children: [...e.signingEvents]
                      .reverse()
                      .map((n) =>
                        (0, s.jsxs)(
                          "tr",
                          {
                            children: [
                              (0, s.jsx)("td", {
                                children: e.roster.some((i) => i.id === n.playerId)
                                  ? (0, s.jsx)("button", {
                                      className: "text-button",
                                      onClick: () => t(n.playerId),
                                      children: n.name,
                                    })
                                  : n.name,
                              }),
                              (0, s.jsxs)("td", { children: [n.pos, " \xB7 ", n.ovr, " OVR"] }),
                              (0, s.jsx)("td", { children: n.origin }),
                              (0, s.jsxs)("td", { children: [n.year, " \xB7 Round ", n.round] }),
                              (0, s.jsx)("td", { children: q(n.nil) }),
                            ],
                          },
                          n.id
                        )
                      ),
                  }),
                ],
              }),
            }),
            !e.signingEvents.length &&
              (0, s.jsx)("p", {
                className: "empty-note",
                children: "Your first commitment will be recorded here.",
              }),
          ],
        }),
    ],
  });
}
