function KC({ g: e, run: a, select: t }) {
  let l = e.roster.reduce((r, n) => r + n.minutes, 0),
    [u, o] = (0, N.useState)(""),
    [tab, setTab] = (0, N.useState)("Lineup & tactics"),
    [, rr] = (0, N.useState)(0),
    mp = MINP[e.minPreset] ? e.minPreset : "Balanced",
    starNow = mp === "Star player" ? (e.roster.find((z) => z.id === e.starId && !z.redshirt) || [...e.roster].filter((z) => !z.redshirt && !z.injury).sort((x1, x2) => x2.ovr - x1.ovr)[0])?.id : null,
    fit = W_fit(e).s,
    hurt = e.roster.filter((r) => r.injury > 0 && !r.redshirt),
    // minutes plan picker plus the "always auto-set" switch (shared by both tabs)
    plan = (cp) =>
      (0, s.jsxs)("div", {
      className: `min-plan ${cp ? "compact" : "panel"}`,
      children: [
        (0, s.jsxs)("div", {
          className: "min-plan-head",
          children: [
            (0, s.jsx)("strong", { children: "Minutes plan" }),
            (0, s.jsxs)("label", {
              className: "min-auto",
              title: "Also in Settings > Game",
              children: [
                (0, s.jsx)("input", {
                  type: "checkbox",
                  checked: !!CFG.autoCoach,
                  onChange: (z) => {
                    ((CFG.autoCoach = z.target.checked), saveCfg(), rr((n) => n + 1));
                  },
                }),
                "Always auto-set coaching before games",
              ],
            }),
          ],
        }),
        cp
          ? (0, s.jsx)("select", {
              "aria-label": "Minutes plan",
              value: mp,
              onChange: (z) => a({ type: "minPreset", value: z.target.value }),
              children: Object.keys(MINP).map((d) =>
                (0, s.jsx)("option", { value: d, children: d === "Stars" ? "Big three" : d }, d)
              ),
            })
          : (0, s.jsx)("div", {
              className: "plan-cards",
              role: "radiogroup",
              "aria-label": "Minutes plan",
              children: Object.keys(MINP).map((d) =>
                (0, s.jsxs)(
                  "button",
                  {
                    role: "radio",
                    "aria-checked": d === mp,
                    className: "plan-card" + (d === mp ? " active" : ""),
                    onClick: () => a({ type: "minPreset", value: d }),
                    children: [
                      (0, s.jsx)("strong", { children: d === "Stars" ? "Big three" : d }),
                      (0, s.jsx)("span", { children: MINP[d].note }),
                    ],
                  },
                  d
                )
              ),
            }),
        (0, s.jsxs)("label", {
          className: "rot-size",
          children: [
            "Players in rotation ",
            (0, s.jsxs)("select", {
              "aria-label": "Players in rotation",
              value: e.rotSize || 0,
              onChange: (z) => a({ type: "rotSize", value: Number(z.target.value) }),
              children: [
                (0, s.jsx)("option", { value: 0, children: "Plan default (" + (5 + MINP[mp].n) + ")" }, 0),
                ...[5, 6, 7, 8, 9, 10, 11, 12, 13].map((d) => (0, s.jsx)("option", { value: d, children: d + " players" }, d)),
              ],
            }),
          ],
        }),
        (0, s.jsx)("small", { children: "Tired legs: a player's shooting drops once he is past about 30 minutes, so a short rotation or a star at 38 pays for it late in games." }),
        cp
          ? (0, s.jsx)("small", { children: MINP[mp].note })
          : (0, s.jsx)("small", { children: "Choosing a plan keeps your starters and redoes the minutes." }),
      ],
    });
  return (0, s.jsxs)(s.Fragment, {
    children: [
      (0, s.jsxs)("div", {
        className: "toolbar",
        children: [
          (0, s.jsx)("div", {
            className: "chips",
            children: ["Lineup & tactics", "Minutes & development", "Shot priority", "Assistant coaches"].map((d) =>
              (0, s.jsx)(
                "button",
                { className: d === tab ? "active" : "", onClick: () => setTab(d), children: d },
                d
              )
            ),
          }),
          (0, s.jsx)("div", {
            className: "coach-summary",
            children: [
              ["TEAM", `${Ps(e)} OVR`, ""],
              ["LINEUP FIT", `${fit >= 0 ? "+" : ""}${fit.toFixed(1)}`, fit >= 0 ? "good-text" : "orange-text"],
              ["CHEMISTRY", String(Math.round(e.chemistry)), ""],
              ["MINUTES", `${l}/200`, l === 200 ? "good-text" : "bad-text"],
              ["INJURED", String(hurt.length), hurt.length ? "bad-text" : ""],
            ].map((z) =>
              (0, s.jsxs)(
                "span",
                { children: [(0, s.jsx)("small", { children: z[0] }), (0, s.jsx)("b", { className: z[2], children: z[1] })] },
                z[0]
              )
            ),
          }),
        ],
      }),
      l !== 200 &&
        l > 0 &&
        (0, s.jsxs)("div", {
          className: "min-warn",
          role: "status",
          children: [
            (0, s.jsx)("strong", {
              children: `${l} of 200 minutes: ${l > 200 ? l - 200 + " too many" : 200 - l + " too few"}.`,
            }),
            " Balance the rotation to exactly 200 before you leave this page, or pick a minutes plan.",
          ],
        }),
      tab === "Lineup & tactics" &&
        (0, s.jsxs)("div", {
          className: "coaching-top",
          children: [
            (0, s.jsxs)("div", {
              className: "panel court-panel",
              children: [
                (0, s.jsxs)("div", {
                  className: "section-head",
                  children: [
                    (0, s.jsxs)("div", {
                      children: [
                        (0, s.jsx)("h2", { children: "Starting five" }),
                        (0, s.jsx)("p", {
                          children: "Only five starters. Auto-set chooses lineup, minutes, and tactics.",
                        }),
                      ],
                    }),
                    (0, s.jsxs)(X, {
                      primary: !0,
                      small: !0,
                      onClick: () => {
                        a({ type: "autoCoach" });
                      },
                      children: [(0, s.jsx)(Vl, { size: 14 }), "Auto-set coaching"],
                    }),
                  ],
                }),
                (0, s.jsxs)("div", {
                  className: "court",
                  children: [
                    (0, s.jsxs)("svg", {
                      viewBox: "0 0 600 360",
                      preserveAspectRatio: "none",
                      "aria-hidden": "true",
                      children: [
                        (0, s.jsx)("path", {
                          d: "M20 340V20H580V340M210 20V140H390V20M240 20V55H360V20M110 20V95C110 300 490 300 490 95V20M210 140A90 70 0 0 0 390 140M260 340A40 35 0 0 1 340 340",
                          fill: "none",
                          stroke: "currentColor",
                          strokeWidth: "1.5",
                        }),
                        (0, s.jsx)("circle", {
                          cx: "300",
                          cy: "47",
                          r: "10",
                          fill: "none",
                          stroke: "currentColor",
                        }),
                      ],
                    }),
                    (0, s.jsx)("div", {
                      className: "court-lineup",
                      children: Le.map((r, n) => {
                        let i = e.roster.find((d) => d.id === e.lineup[n]);
                        return (0, s.jsxs)(
                          "div",
                          {
                            className: `court-player slot-${n}`,
                            onDragOver: (d) => d.preventDefault(),
                            onDrop: (d) => {
                              (d.preventDefault(), u && a({ type: "starter", id: u, slot: n }), o(""));
                            },
                            children: [
                              (0, s.jsxs)("button", {
                                className: "court-portrait",
                                onClick: () => i && t(i.id),
                                "aria-label": i ? `View ${i.name}` : `Empty ${r} position`,
                                children: [
                                  i ? (0, s.jsx)(Ja, { p: i, size: "small" }) : (0, s.jsx)(nl, { size: 26 }),
                                  (0, s.jsx)("span", { children: r }),
                                ],
                              }),
                              (0, s.jsx)("strong", { children: i ? i.name.split(" ").at(-1) : "Empty" }),
                              (0, s.jsx)("small", { children: i ? `${i.ovr} OVR \xB7 ${i.minutes} min` : "Assign a player" }),
                              i &&
                                i.injury > 0 &&
                                (0, s.jsx)("span", {
                                  className: "injury-tag",
                                  title: "Injured players do not play. Swap him out or use Auto-set coaching.",
                                  children: `${i.susp ? (i.susp === 2 ? "Ineligible" : "Suspended") : "Injured"} \xB7 ${i.injury} g`,
                                }),
                              i &&
                                !i.injury &&
                                i.pos !== r &&
                                (i.pos2 === r
                                  ? (0, s.jsx)("span", {
                                      className: "position-note",
                                      title: "Playing his secondary position costs very little",
                                      children: "Secondary position",
                                    })
                                  : (0, s.jsx)("span", {
                                      className: "position-warning",
                                      title:
                                        "Playing out of position lowers his effective rating and costs the team about 0.65 rating points",
                                      children: "Out of position",
                                    })),
                            ],
                          },
                          r
                        );
                      }),
                    }),
                  ],
                }),
                (0, s.jsx)("p", {
                  className: "fit-note",
                  children:
                    "Starting a player outside his position lowers his effective rating, which lowers the whole team’s rating: about 0.65 team-rating points per starter out of position, but only about 0.16 at his secondary position.",
                }),
                (0, s.jsx)("div", {
                  className: "honor-tags fit-chips",
                  children: W_fit(e).n.map((z, i) =>
                    (0, s.jsx)("span", { className: z.g ? "good" : "bad", children: z.t }, i)
                  ),
                }),
                (0, s.jsx)("div", {
                  className: "lineup-selectors",
                  children: Le.map((r, n) =>
                    (0, s.jsxs)(
                      "label",
                      {
                        children: [
                          r,
                          (0, s.jsxs)("select", {
                            "aria-label": `${r} starter`,
                            value: e.lineup[n] || "",
                            onChange: (i) => {
                              a({ type: "starter", id: i.target.value, slot: n });
                            },
                            children: [
                              (0, s.jsx)("option", { value: "", disabled: !0, children: "Select" }),
                              e.roster
                                .filter((i) => !i.redshirt)
                                .map((i) =>
                                  (0, s.jsxs)(
                                    "option",
                                    {
                                      value: i.id,
                                      children: [
                                        i.name,
                                        " \xB7 ",
                                        i.pos2 ? i.pos + "/" + i.pos2 : i.pos,
                                        " \xB7 ",
                                        i.ovr,
                                        " OVR",
                                      ],
                                    },
                                    i.id
                                  )
                                ),
                            ],
                          }),
                        ],
                      },
                      r
                    )
                  ),
                }),
              ],
            }),
            (0, s.jsx)(qe, {
              title: "Your coaching system",
              meta: `${e.specialty} specialist \xB7 Level ${e.level}`,
              children: (0, s.jsxs)("div", {
                className: "tactics",
                children: [
                  [
                    {
                      key: "offense",
                      name: "Offensive system",
                      options: ["Balanced", "Perimeter", "Inside-out"],
                      note: "Match your offense to your best players.",
                    },
                    {
                      key: "defense",
                      name: "Defensive approach",
                      options: ["Man-to-man", "2\u20133 zone", "Full-court press"],
                      note: "Zone protects the paint but gives up more threes.",
                    },
                    {
                      key: "pace",
                      name: "Pace of play",
                      options: ["Slow", "Balanced", "Fast"],
                      note: "More possessions create more scoring opportunities.",
                    },
                  ].map((r) =>
                    (0, s.jsxs)(
                      "label",
                      {
                        children: [
                          r.name,
                          (0, s.jsx)("select", {
                            value: e.tactics[r.key],
                            onChange: (n) => {
                              a({ type: "tactics", key: r.key, value: n.target.value });
                            },
                            children: r.options.map((n) => (0, s.jsx)("option", { children: n }, n)),
                          }),
                          (0, s.jsx)("small", { children: r.note }),
                          (0, s.jsxs)("small", {
                            className: "tactic-mode",
                            children: [
                              e.tacLock?.[r.key] ? "Kept as you set it, even with auto coaching." : "Set automatically.",
                              (0, s.jsx)("button", {
                                type: "button",
                                className: "tactic-auto",
                                onClick: (n) => {
                                  (n.preventDefault(), a({ type: "tacticsMode", key: r.key, keep: !e.tacLock?.[r.key] }));
                                },
                                children: e.tacLock?.[r.key] ? "Set automatically" : "Keep this",
                              }),
                            ],
                          }),
                        ],
                      },
                      r.key
                    )
                  ),
                  (0, s.jsxs)("div", {
                    className: "rotation-total",
                    children: [
                      (0, s.jsxs)("div", {
                        children: [
                          (0, s.jsx)("span", { children: "ROTATION MINUTES" }),
                          (0, s.jsxs)("strong", {
                            className: l === 200 ? "good-text" : "orange-text",
                            children: [l, (0, s.jsx)("small", { children: " / 200" })],
                          }),
                        ],
                      }),
                      (0, s.jsx)(RotationBar, { roster: e.roster, lineup: e.lineup, total: l }),
                      (0, s.jsx)("p", {
                        children:
                          l === 200
                            ? "Your rotation is balanced."
                            : `Adjust by ${200 - l} minutes or use Auto-set coaching.`,
                      }),
                    ],
                  }),
                  plan(!0),
                ],
              }),
            }),
          ],
        }),
      tab === "Shot priority" && (0, s.jsx)(ShotPriority, { g: e, run: a }),
      tab === "Assistant coaches" && (0, s.jsx)(AssistantCoaches, { g: e }),
      tab === "Minutes & development" && plan(!1),
      tab === "Minutes & development" &&
        (0, s.jsx)(qe, {
          title: "Minutes & development",
          meta: "Promised minutes affect morale. Training shapes offseason development. POT is an estimated range and can move with minutes, role fit and morale.",
          children: (0, s.jsx)("div", {
            className: "table-wrap",
            children: (0, s.jsxs)("table", {
              children: [
                (0, s.jsx)("thead", {
                  children: (0, s.jsxs)("tr", {
                    children: [
                      (0, s.jsx)("th", { children: "PLAYER" }),
                      (0, s.jsx)("th", { children: "ROLE" }),
                      (0, s.jsx)("th", { children: "PROMISE" }),
                      (0, s.jsx)("th", { children: "MINUTES" }),
                      (0, s.jsx)("th", { children: "TRAINING" }),
                      (0, s.jsx)("th", { children: "MORALE" }),
                    ],
                  }),
                }),
                (0, s.jsx)("tbody", {
                  children: [...e.roster]
                    .sort((r, n) => {
                      let a1 = e.lineup.indexOf(r.id),
                        b1 = e.lineup.indexOf(n.id);
                      return (a1 < 0 ? 9 : a1) - (b1 < 0 ? 9 : b1) || n.minutes - r.minutes;
                    })
                    .map((r) =>
                      (0, s.jsxs)(
                        "tr",
                        {
                          draggable: !0,
                          className: r.injury > 0 ? "row-injured" : "",
                          onDragStart: () => o(r.id),
                          children: [
                            (0, s.jsx)("td", {
                              children: (0, s.jsxs)("button", {
                                className: "player-cell",
                                onClick: () => t(r.id),
                                children: [
                                  (0, s.jsx)(Ja, { p: r, size: "tiny" }),
                                  (0, s.jsxs)("div", {
                                    children: [
                                      (0, s.jsxs)("strong", {
                                        children: [
                                          r.name,
                                          " ",
                                          (0, s.jsxs)("em", {
                                            className: "name-ovr",
                                            children: [Tt(r), " OVR"],
                                          }),
                                          r.injury > 0 &&
                                            (0, s.jsx)("span", {
                                              className: "injury-tag",
                                              title: "He will not play until he is healthy. His minutes go to the rest of the rotation.",
                                              children: `${r.susp ? (r.susp === 2 ? "Ineligible" : "Suspended") : "Injured"} \xB7 out ${r.injury} game${r.injury === 1 ? "" : "s"}`,
                                            }),
                                        ],
                                      }),
                                      (0, s.jsxs)("span", {
                                        children: [
                                          r.pos2 ? r.pos + "/" + r.pos2 : r.pos,
                                          " \xB7 ",
                                          r.ovr,
                                          " OVR \xB7 ",
                                          r.potential,
                                          " POT (",
                                          potRange(r),
                                          ")",
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            }),
                            (0, s.jsx)("td", {
                              children: r.redshirt
                                ? "Redshirt"
                                : (0, s.jsx)("select", {
                                    "aria-label": `${r.name} role`,
                                    value: r.role === "Redshirt" ? "Bench" : r.role,
                                    onChange: (n) => {
                                      ((window.__minDirty = !0),
                                        a({ type: "setRole", id: r.id, role: n.target.value }));
                                    },
                                    children: ["Starter", "Rotation", "Bench"].map((n) =>
                                      (0, s.jsx)("option", { value: n, children: n }, n)
                                    ),
                                  }),
                            }),
                            (0, s.jsxs)("td", {
                              children: [
                                r.promise === "None" ? "No promise" : r.promise,
                                (0, s.jsx)("span", {
                                  className: "table-sub",
                                  children: r.promise === "None" ? "\u2014" : wt(r.promise) + "+ min",
                                }),
                              ],
                            }),
                            (0, s.jsxs)("td", {
                              children: [
                                (0, s.jsx)(WC, { p: r, run: a }, `${r.id}-${r.minutes}`),
                                !r.redshirt &&
                                  (0, s.jsx)("button", {
                                    className: "star-minutes" + (starNow === r.id ? " on" : ""),
                                    "aria-pressed": starNow === r.id,
                                    title: starNow === r.id ? "He is your star (about 38 minutes). Press again to go back to the balanced plan." : "Make him your star: about 38 minutes, the others fill in around him.",
                                    onClick: () => a({ type: "starPlayer", id: r.id }),
                                    children: starNow === r.id ? "\u2605 Star" : "\u2606 Star",
                                  }),
                                (0, s.jsx)("span", {
                                  className: "min-bar",
                                  role: "img",
                                  "aria-label": `${r.minutes} of 40 minutes`,
                                  children: (0, s.jsx)("i", { style: { width: `${Math.min(100, (r.minutes / 40) * 100)}%` } }),
                                }),
                              ],
                            }),
                            (0, s.jsx)("td", {
                              children: (0, s.jsx)("select", {
                                "aria-label": `${r.name} training`,
                                value: r.training,
                                onChange: (n) => {
                                  a({ type: "training", id: r.id, focus: n.target.value });
                                },
                                children: ["Balanced", ...il].map((n) =>
                                  (0, s.jsx)("option", { children: n }, n)
                                ),
                              }),
                            }),
                            (0, s.jsx)("td", { children: (0, s.jsx)(Ys, { p: r }) }),
                          ],
                        },
                        r.id
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
