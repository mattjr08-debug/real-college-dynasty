function JC({ g: e, run: a, openBox: t }) {
  let l = Math.round(e.schedule.slice(0, 30).reduce((u, o) => u + o.rating, 0) / 30);
  return (0, s.jsxs)(s.Fragment, {
    children: [
      (0, s.jsxs)("div", {
        className: "metrics three",
        children: [
          (0, s.jsx)(ca, {
            label: "REGULAR SEASON",
            value: "30",
            note: "12 nonconference \xB7 18 conference",
            icon: (0, s.jsx)(ql, {}),
          }),
          (0, s.jsx)(ca, {
            label: "SCHEDULE STRENGTH",
            value: String(l),
            note: "Average opponent overall",
            icon: (0, s.jsx)(co, {}),
          }),
          (0, s.jsx)(ca, {
            label: "GUARANTEE NIL",
            value: q(e.guaranteeIncome),
            note: "Added to this season\u2019s NIL budget",
            icon: (0, s.jsx)(ja, {}),
          }),
        ],
      }),
      (0, s.jsxs)("div", {
        className: "callout",
        children: [
          (0, s.jsx)(ja, { size: 24 }),
          (0, s.jsx)("p", {
            children:
              "Guarantee contracts pay into your NIL budget when booked. You earn the payment regardless of the result, but face a tougher road game. Each paid opponent can be scheduled once. Contracts renew with next season\u2019s schedule; removing one also removes its funding.",
          }),
        ],
      }),
      (0, s.jsx)(qe, {
        title: "Your season schedule",
        meta:
          e.phase === "Offseason"
            ? `Two early-season events are played at neutral sites (no home-court edge); conference play starts January 2. Choose 12 nonconference games. Visit opponents rated ${Ps(e) + 15}+ (15 above your team overall) to earn guaranteed NIL, win or lose.`
            : "Click a completed game to open the box score.",
        children: (0, s.jsx)("div", {
          className: "table-wrap",
          children: (0, s.jsxs)("table", {
            children: [
              (0, s.jsx)("thead", {
                children: (0, s.jsxs)("tr", {
                  children: [
                    (0, s.jsx)("th", { children: "GAME" }),
                    (0, s.jsx)("th", { children: "OPPONENT" }),
                    (0, s.jsx)("th", { children: "OVR" }),
                    (0, s.jsx)("th", { children: "VENUE" }),
                    (0, s.jsx)("th", { children: "GUARANTEE NIL" }),
                    (0, s.jsx)("th", { children: "COMPETITION" }),
                    (0, s.jsx)("th", { children: "RESULT" }),
                  ],
                }),
              }),
              (0, s.jsx)("tbody", {
                children: e.schedule.map((u, o) =>
                  (0, s.jsxs)(
                    "tr",
                    {
                      children: [
                        (0, s.jsxs)("td", {
                          className: "muted",
                          children: [String(o + 1).padStart(2, "0"), (0, s.jsx)("small", { className: "game-date", style: { display: "block" }, children: W_gdate(e, o) })],
                        }),
                        (0, s.jsx)("td", {
                          children:
                            e.phase === "Offseason" && o < 12 && !evSecond(e, o)
                              ? (0, s.jsx)("select", {
                                  "aria-label": `Game ${o + 1} opponent`,
                                  value: u.oppId,
                                  onChange: (r) => {
                                    a({ type: "schedule", index: o, teamId: r.target.value, venue: u.venue });
                                  },
                                  children: [...e.opponents]
                                    .sort((r, n) => r.rating - n.rating)
                                    .map((r) =>
                                      (0, s.jsxs)(
                                        "option",
                                        { value: r.id, children: [r.name, " \xB7 ", r.rating, " OVR"] },
                                        r.id
                                      )
                                    ),
                                })
                              : (0, s.jsxs)("strong", {
                                  children: [
                                    u.opponent,
                                    e.rival &&
                                      u.oppId === e.rival.id &&
                                      (0, s.jsx)(he, { tone: "red", children: "RIVALRY" }),
                                    u.bk && (0, s.jsx)("small", { className: "muted", style: { display: "block", fontWeight: 400 }, children: u.bk }),
                                    evSecond(e, o) && !u.played && !u.bk && (0, s.jsx)("small", { className: "muted", style: { display: "block", fontWeight: 400 }, children: "Opponent set after game " + o + " (winners meet winners, losers meet losers)" }),
                                  ],
                                }),
                        }),
                        (0, s.jsx)("td", {
                          children: (0, s.jsx)(he, {
                            tone: u.rating >= 78 ? "red" : u.rating >= 65 ? "orange" : "green",
                            children: u.rating,
                          }),
                        }),
                        (0, s.jsxs)("td", {
                          children: [
                            e.phase === "Offseason" && o < 12
                              ? (0, s.jsx)("select", {
                                  "aria-label": `Game ${o + 1} venue`,
                                  value: u.venue,
                                  onChange: (r) => {
                                    a({ type: "schedule", index: o, teamId: u.oppId, venue: r.target.value });
                                  },
                                  children: ["Home", "Away", "Neutral"].map((r) =>
                                    (0, s.jsx)("option", { children: r }, r)
                                  ),
                                })
                              : u.venue,
                            u.event && u.venue === "Neutral" && (0, s.jsx)("small", { className: "muted", style: { display: "block" }, children: u.event + (ncEvents(e).find((z) => z[0] === u.event)?.[1] ? " · " + ncEvents(e).find((z) => z[0] === u.event)[1] : "") }),
                          ],
                        }),
                        (0, s.jsx)("td", {
                          children:
                            o < 12 && e.phase === "Offseason"
                              ? (0, s.jsxs)("label", {
                                  className: "guarantee-option",
                                  children: [
                                    (0, s.jsx)("input", {
                                      type: "checkbox",
                                      "aria-label": `Game ${o + 1} guarantee contract`,
                                      checked: !!u.guarantee,
                                      disabled: !u.guarantee && (u.venue !== "Away" || u.rating < Ps(e) + 15),
                                      onChange: (r) => {
                                        a({
                                          type: "schedule",
                                          index: o,
                                          teamId: u.oppId,
                                          venue: u.venue,
                                          guarantee: r.target.checked,
                                        });
                                      },
                                    }),
                                    (0, s.jsxs)("span", {
                                      children: [
                                        u.venue === "Away" && u.rating >= Ps(e) + 15
                                          ? `+${q(
                                              u.guarantee ||
                                                Xf(
                                                  e.opponents.find((r) => r.id === u.oppId),
                                                  Ps(e)
                                                )
                                            )}`
                                          : `Away \xB7 ${Ps(e) + 15}+ OVR`,
                                        (0, s.jsx)("small", {
                                          children: u.guarantee ? "Contract signed" : "Optional",
                                        }),
                                      ],
                                    }),
                                  ],
                                })
                              : u.guarantee
                                ? (0, s.jsxs)(he, { tone: "green", children: ["+", q(u.guarantee)] })
                                : "\u2014",
                        }),
                        (0, s.jsx)("td", { className: "muted", children: u.kind }),
                        (0, s.jsx)("td", {
                          children: u.played
                            ? (0, s.jsxs)("button", {
                                className: "score-button",
                                onClick: () => t(u.id),
                                children: [
                                  (0, s.jsx)("span", {
                                    className: u.win ? "good-text" : "bad-text",
                                    children: u.win ? "W" : "L",
                                  }),
                                  " ",
                                  u.us,
                                  "\u2013",
                                  u.them,
                                  u.ot ? " OT" : "",
                                ],
                              })
                            : (0, s.jsx)("span", { className: "muted", children: "Upcoming" }),
                        }),
                      ],
                    },
                    u.id
                  )
                ),
              }),
            ],
          }),
        }),
      }),
    ],
  });
}
