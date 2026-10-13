function t0({ p: e, g: a, run: t, onClose: l, select: u }) {
  let o = !a.roster.some((g) => g.id === e.id),
    r = e.origin === "Walk-on",
    [n, i] = (0, N.useState)("Overview"),
    [rsAsk, setRsAsk] = (0, N.useState)(null),
    [d, f] = (0, N.useState)(e.offer?.nil ?? (o ? e.ask : Math.max(e.ask, e.nil))),
    // Item 57: the NIL boxes keep exactly what is typed (nilTxt) while d follows it in base dollars; leaving the box shows d again.
    [nilTxt, setNilTxt] = (0, N.useState)(null),
    nilBox = {
      value: nilTxt ?? Math.round(d * MONEY),
      onChange: (g) => (setNilTxt(g.target.value), f(Math.round(Number(g.target.value) / MONEY))),
      onBlur: () => setNilTxt(null),
    },
    [y, h] = (0, N.useState)(
      e.offer?.role || (o ? "Rotation" : e.promise === "None" ? "Rotation" : e.promise) || "Rotation"
    ),
    [p, C] = (0, N.useState)(""),
    v = a.roster.find((g) => g.id === p),
    M = (0, N.useContext)(uc),
    m = !o || e.scouted >= 2,
    c = e.stats.gp ? e.stats : e.history.at(-1)?.stats,
    L = [
      { name: "SHOOTING", idx: [0, 1, 2, 3] },
      { name: "SKILL", idx: [4, 5, 10, 11] },
      { name: "DEFENSE", idx: [6, 7, 8, 9] },
      { name: "ATHLETICISM", idx: [12, 13, 14, 15] },
    ];
  return (0, s.jsxs)(Ao, {
    title: `${e.name} player profile`,
    onClose: l,
    wide: !0,
    drawer: !0,
    children: [
      (0, s.jsxs)("div", {
        className: "profile-top trading-card",
        children: [
          (0, s.jsx)(Ja, { p: e, size: "large" }),
          (0, s.jsxs)("div", {
            className: "profile-title",
            children: [
              (0, s.jsxs)("div", {
                className: "row gap",
                children: [
                  (0, s.jsx)(he, { tone: "orange", children: e.pos2 ? e.pos + " / " + e.pos2 : e.pos }),
                  (0, s.jsx)(he, { tone: "blue", children: W_arch(e) }),
                  (0, s.jsx)(he, { children: Zl(e).toUpperCase() }),
                  (0, s.jsxs)("span", { className: "muted", children: ["#", e.number] }),
                  e.injury > 0 && (0, s.jsx)(he, { tone: "red", children: e.susp ? (e.susp === 2 ? "INELIGIBLE" : "SUSPENDED") : "INJURED" }),
                ],
              }),
              (0, s.jsxs)("h2", { children: [e.name, " ", (0, s.jsx)(FavStar, { p: e, prospect: !!o })] }),
              (0, s.jsxs)("p", {
                children: [
                  Zl(e),
                  " \xB7 Age ",
                  e.age,
                  " \xB7 ",
                  qs(e.height),
                  " \xB7 ",
                  5 - e.year,
                  " years eligible",
                ],
              }),
              o ? (0, s.jsx)(Xn, { n: e.stars }) : (0, s.jsx)(Ys, { p: e }),
            ],
          }),
          (0, s.jsxs)("div", {
            className: "profile-overall",
            children: (0, s.jsx)(RatingRing, { value: Tt(e), label: "OVERALL", size: "big" }),
          }),
        ],
      }),
      o &&
        e.origin !== "Walk-on" &&
        (0, s.jsxs)("div", {
          className: "rp-strip",
          "aria-label": "Recruiting summary",
          children: [
            e.status === "Available" &&
              (0, s.jsxs)("div", {
                className: "rp-strip-item chance",
                children: [(0, s.jsx)(RatingRing, { value: `${Nn(a, e, d, y)}%`, label: "SIGN" }), (0, s.jsx)("span", { children: "SIGNING CHANCE" })],
              }),
            (0, s.jsxs)("div", {
              className: "rp-strip-item",
              children: [(0, s.jsxs)("b", { children: [Math.round(e.interest), "%"] }), (0, s.jsx)("span", { children: "INTEREST" })],
            }),
            (0, s.jsxs)("div", {
              className: "rp-strip-item",
              children: [(0, s.jsx)("b", { children: q(e.ask || 0) }), (0, s.jsx)("span", { children: "NIL ASK / YEAR" })],
            }),
            (0, s.jsxs)("div", {
              className: "rp-strip-item",
              children: [(0, s.jsx)("b", { children: Object.keys(e.pitched || {}).length }), (0, s.jsx)("span", { children: "PITCHES MADE" })],
            }),
          ],
        }),
      rsAsk &&
        (0, s.jsx)(Ao, {
          title: "Redshirt conversation",
          onClose: () => setRsAsk(null),
          children: (() => {
            let dl = rsReact(e),
              mood =
                dl > 0
                  ? "He likes the idea. He is willing to wait his turn."
                  : dl === 0
                    ? "He will go along with whatever the team needs."
                    : dl > -6
                      ? "He is not thrilled, but he will listen."
                      : "He wants to play right now and will be unhappy.";
            return (0, s.jsxs)("div", {
              className: "alert-modal",
              children: [
                (0, s.jsx)("p", { className: "eyebrow", children: "REDSHIRT CONVERSATION" }),
                (0, s.jsx)("h2", { children: e.name }),
                (0, s.jsx)("p", {
                  children: `The plan: sit out this season, keep a year of eligibility and spend the year developing. You still need eight active players.`,
                }),
                (0, s.jsxs)("div", {
                  className: "stat-trio",
                  children: [
                    (0, s.jsxs)("div", {
                      children: [
                        (0, s.jsx)("small", { children: "PERSONALITY" }),
                        (0, s.jsx)("strong", { children: e.pers || "Steady" }),
                      ],
                    }),
                    (0, s.jsxs)("div", {
                      children: [
                        (0, s.jsx)("small", { children: "MORALE NOW" }),
                        (0, s.jsx)("strong", { children: Math.round(e.morale) }),
                      ],
                    }),
                    (0, s.jsxs)("div", {
                      children: [
                        (0, s.jsx)("small", { children: "HOW HE WILL TAKE IT" }),
                        (0, s.jsx)("strong", {
                          style: { fontSize: "1rem" },
                          children:
                            dl > 0
                              ? "Welcomes it"
                              : dl === 0
                                ? "Accepts it"
                                : dl > -6
                                  ? "Reluctant"
                                  : "Unhappy",
                        }),
                      ],
                    }),
                  ],
                }),
                (0, s.jsx)("p", { className: "muted", children: mood }),
                rsAsk === "done" &&
                  (0, s.jsx)("p", {
                    children: "The conversation is done. His reaction is in your news feed.",
                  }),
                (0, s.jsxs)("div", {
                  className: "row gap",
                  children: [
                    (0, s.jsx)(X, {
                      onClick: () => setRsAsk(null),
                      children: rsAsk === "done" ? "Close" : "Not now",
                    }),
                    rsAsk !== "done" &&
                      (0, s.jsx)(X, {
                        primary: !0,
                        onClick: () => {
                          (t({ type: "redshirt", id: e.id }), setRsAsk("done"));
                        },
                        children: "Have the conversation",
                      }),
                  ],
                }),
              ],
            });
          })(),
        }),
      (0, s.jsx)("div", {
        className: "profile-tabs",
        children: ["Overview", "Attributes", "Statistics", "Morale & Role", "NIL & Eligibility"].map((g) =>
          (0, s.jsx)("button", { className: n === g ? "active" : "", onClick: () => i(g), children: g }, g)
        ),
      }),
      (0, s.jsxs)("div", {
        className: "profile-content",
        children: [
          n === "Overview" &&
            (0, s.jsxs)(s.Fragment, {
              children: [
                (0, s.jsxs)("div", {
                  className: "profile-metrics",
                  children: [
                    (0, s.jsxs)("div", {
                      children: [
                        (0, s.jsx)("span", { children: "BASELINE POTENTIAL" }),
                        (0, s.jsx)("strong", {
                          children: m
                            ? o
                              ? Math.max(e.ovr, Math.min(99, e.potential + (e.pn || 0)))
                              : e.potential
                            : "Unscouted",
                        }),
                        (0, s.jsx)("small", {
                          children: m
                            ? o
                              ? "An estimate. Some recruits exceed it, others plateau"
                              : `Likely range ${potRange(e)} \xB7 could end higher or lower based on minutes, role fit & morale`
                            : "Scout to reveal",
                        }),
                      ],
                    }),
                    (0, s.jsxs)("div", {
                      children: [
                        (0, s.jsx)("span", { children: o ? "NIL REQUEST" : "ANNUAL NIL" }),
                        (0, s.jsx)("strong", { children: q(o ? e.ask : e.nil) }),
                        (0, s.jsx)("small", { children: "per year" }),
                      ],
                    }),
                    (0, s.jsxs)("div", {
                      children: [
                        (0, s.jsx)("span", { children: o ? "INTEREST" : "MORALE" }),
                        (0, s.jsxs)("strong", {
                          children: [
                            Math.round(o ? e.interest : e.morale),
                            (0, s.jsx)("small", { children: "/100" }),
                          ],
                        }),
                        (0, s.jsx)("small", {
                          children: o ? e.priority + " priority" : Pf(e) + " transfer risk",
                        }),
                      ],
                    }),
                  ],
                }),
                (() => {
                  let hs = e.hsStars ?? e.stars,
                    now = starRate(e),
                    d = now,
                    ask =
                      Math.round(
                        ((4e3 + Math.pow(Math.max(2, e.ovr - 43), 2) * 110) *
                          0.975 *
                          ((x) => (d <= 2 ? Math.min(1, x) : x))(
                            1 + le((60 - a.rep) / 60, -0.4, 1) * (0.15 + 0.06 * d)
                          )) /
                          1e3
                      ) * 1e3,
                    diff = now - hs;
                  return (0, s.jsxs)("div", {
                    className: "recruit-profile",
                    children: [
                      (0, s.jsx)("h3", { children: "Recruiting profile" }),
                      (0, s.jsxs)("div", {
                        className: "rp-grid",
                        children: [
                          (0, s.jsxs)("div", {
                            children: [
                              (0, s.jsx)("small", {
                                children: o ? "CURRENT RANKING" : "HIGH SCHOOL RANKING",
                              }),
                              (0, s.jsx)(Xn, { n: o ? e.stars : hs }),
                              (0, s.jsx)("em", {
                                children: o
                                  ? `${e.stars}-star ${e.origin === "Transfer" ? "transfer" : "recruit"}`
                                  : `${hs}-star recruit`,
                              }),
                            ],
                          }),
                          o &&
                            e.origin === "Transfer" &&
                            prevLine(e) &&
                            (0, s.jsxs)("div", {
                              children: [
                                (0, s.jsx)("small", { children: "PREVIOUS SEASON" }),
                                (0, s.jsx)("em", { children: prevLine(e) }),
                              ],
                            }),
                          o &&
                            e.origin === "Transfer" &&
                            (0, s.jsxs)("div", {
                              children: [
                                (0, s.jsx)("small", { children: "ELIGIBILITY" }),
                                (0, s.jsx)("em", { children: eligLine(e) }),
                              ],
                            }),
                          !o &&
                            (0, s.jsxs)("div", {
                              children: [
                                (0, s.jsx)("small", { children: "RANKING NOW" }),
                                (0, s.jsx)(Xn, { n: now }),
                                (0, s.jsx)("em", {
                                  children:
                                    diff > 0
                                      ? `${now}-star today \u00B7 up ${diff} since high school`
                                      : diff < 0
                                        ? `${now}-star today \u00B7 down ${-diff} since high school`
                                        : `${now}-star today \u00B7 same as high school`,
                                }),
                              ],
                            }),
                          !o &&
                            (0, s.jsxs)("div", {
                              children: [
                                (0, s.jsx)("small", { children: "IF HE ENTERED THE TRANSFER PORTAL" }),
                                (0, s.jsx)(Xn, { n: now }),
                                (0, s.jsx)("em", {
                                  children: `Would rank as a ${now}-star transfer asking about ${q(ask)} a year`,
                                }),
                              ],
                            }),
                        ],
                      }),
                    ],
                  });
                })(),
                (() => {
                  let PT = {
                      Loyal: "Sticks with the program and is hard to lose.",
                      Ambitious: "Wants minutes and a bigger stage, and leaves if blocked.",
                      Patient: "Accepts a small role or a redshirt year.",
                      "Money-focused": "Follows the NIL and is unhappy when underpaid.",
                    },
                    rv = o && e.status === "Available" ? e.rv || rivalsOf(a, e) : [],
                    me = Math.round(e.progress * 0.6 + e.interest * 0.4),
                    lead = [...rv, { n: "You", s: me }].sort((x, y) => y.s - x.s)[0];
                  return (0, s.jsxs)("div", {
                    className: "rp-grid",
                    style: { marginTop: 10 },
                    children: [
                      (0, s.jsxs)("div", {
                        children: [
                          (0, s.jsx)("small", { children: "PERSONALITY" }),
                          (0, s.jsx)("strong", { style: { fontSize: "1rem" }, children: e.pers || "Steady" }),
                          (0, s.jsx)("em", { children: PT[e.pers] || "" }),
                        ],
                      }),
                      o &&
                        (0, s.jsxs)("div", {
                          children: [
                            (0, s.jsx)("small", { children: "CARES MOST ABOUT" }),
                            (0, s.jsx)("strong", {
                              style: { fontSize: ".95rem" },
                              children: topPrefs(e).join(", "),
                            }),
                            e.intl &&
                              (0, s.jsx)("em", {
                                children:
                                  "International prospect" + (e.cty ? " from " + e.cty : "") + ": more skill than strength, a lower rating now but a high ceiling, faster growth in his first two years, and less scouting information.",
                              }),
                          ],
                        }),
                      !o &&
                        e.ih &&
                        e.ih.n > 0 &&
                        (0, s.jsxs)("div", {
                          children: [
                            (0, s.jsx)("small", { children: "INJURY HISTORY" }),
                            (0, s.jsx)("strong", {
                              style: { fontSize: "1rem" },
                              children: `${e.ih.n} injur${e.ih.n === 1 ? "y" : "ies"} \u00B7 ${e.ih.g} games missed`,
                            }),
                            (0, s.jsx)("em", {
                              children: e.ih.major
                                ? "More likely to get hurt again, and it lowers his draft stock."
                                : "Minor so far.",
                            }),
                          ],
                        }),
                      (!o || m) &&
                        (0, s.jsxs)("div", {
                          className: "tend-box",
                          children: [
                            (0, s.jsx)("small", { children: "TENDENCIES" }),
                            tendTags(e).map((z) =>
                              (0, s.jsxs)(
                                "em",
                                {
                                  className: "tend-row",
                                  children: [(0, s.jsx)("b", { children: z[0] }), " ", z[1]],
                                },
                                z[0]
                              )
                            ),
                            (0, s.jsx)("em", {
                              children: "Attributes set how good he is. Tendencies set how he plays.",
                            }),
                          ],
                        }),
                      rv.length > 0 &&
                        (0, s.jsxs)("div", {
                          children: [
                            (0, s.jsx)("small", { children: "COMPETING OFFERS" }),
                            rv.map((z) => (0, s.jsx)("em", { children: `${z.n}: ${z.s}` }, z.n)),
                            (0, s.jsx)("em", { children: `You: ${me}` }),
                            (0, s.jsx)("strong", {
                              style: { fontSize: ".9rem" },
                              children: lead.n === "You" ? "You are leading" : `${lead.n} is leading`,
                            }),
                            (0, s.jsx)("em", {
                              children: "Rivals react to your offers and pitches every round.",
                            }),
                          ],
                        }),
                      o &&
                        e.status === "Available" &&
                        a.phase === "Offseason" &&
                        a.round <= 8 &&
                        (0, s.jsxs)("div", {
                          children: [
                            (0, s.jsx)("small", { children: "PITCH (1 SCOUTING VISIT)" }),
                            (0, s.jsx)("div", {
                              className: "honor-tags",
                              children: [
                                "Playing time",
                                "Development",
                                "Winning",
                                "NIL",
                                "Coaching",
                                "Close to home",
                              ].map((k) =>
                                (0, s.jsx)(
                                  X,
                                  {
                                    small: !0,
                                    disabled: !!(e.pitched && e.pitched[k]),
                                    onClick: () => {
                                      t({ type: "pitch", id: e.id, kind: k });
                                    },
                                    children: k,
                                  },
                                  k
                                )
                              ),
                            }),
                          ],
                        }),
                      !o &&
                        !e.redshirt &&
                        (0, s.jsxs)("div", {
                          children: [
                            (0, s.jsx)("small", { children: "CHANGE POSITION" }),
                            (0, s.jsx)("select", {
                              "aria-label": "Change position",
                              defaultValue: e.pos,
                              onChange: (z) => {
                                z.target.value !== e.pos &&
                                window.confirm(
                                  `Move ${e.name} to ${z.target.value}? He will need about ten games to adjust and the result is uncertain.`
                                )
                                  ? t({ type: "changePos", id: e.id, pos: z.target.value })
                                  : (z.target.value = e.pos);
                              },
                              children: Le.map((z) => (0, s.jsx)("option", { value: z, children: z }, z)),
                            }),
                            e.adj > 0 && (0, s.jsx)("em", { children: `Adjusting: ${e.adj} games left` }),
                          ],
                        }),
                    ],
                  });
                })(),
                (0, s.jsxs)("div", {
                  className: "profile-two",
                  children: [
                    (0, s.jsxs)("div", {
                      children: [
                        (0, s.jsx)("h3", { children: "Player report" }),
                        (0, s.jsxs)("p", {
                          className: "muted",
                          children: [
                            e.pos,
                            e.pos2 ? ` (can also play ${e.pos2})` : "",
                            " \xB7 ",
                            e.ovr < 58
                              ? "Development project"
                              : e.ovr < 70
                                ? "Solid contributor"
                                : e.ovr < 80
                                  ? "Impact player"
                                  : "Program-changing talent",
                          ],
                        }),
                        (0, s.jsx)("h4", { children: "STRENGTHS" }),
                        [...e.attrs.map((g, I) => ({ v: g, name: il[I] }))]
                          .sort((g, I) => I.v - g.v)
                          .slice(0, 3)
                          .map((g) =>
                            (0, s.jsxs)(
                              "div",
                              {
                                className: "attribute-short",
                                children: [
                                  (0, s.jsx)("span", { children: g.name }),
                                  (0, s.jsx)("strong", {
                                    children: m
                                      ? g.v
                                      : `${Math.max(25, g.v - 6)}\u2013${Math.min(99, g.v + 6)}`,
                                  }),
                                ],
                              },
                              g.name
                            )
                          ),
                        (0, s.jsx)("h4", { children: "DEVELOPMENT FOCUS" }),
                        (0, s.jsx)("p", {
                          children: m
                            ? il[e.attrs.indexOf(Math.min(...e.attrs))]
                            : "Complete scouting to reveal development needs.",
                        }),
                        e.growth > 0 &&
                          (0, s.jsxs)(he, {
                            tone: "green",
                            children: ["+", e.growth, " OVR THIS OFFSEASON"],
                          }),
                      ],
                    }),
                    (0, s.jsxs)("div", {
                      children: [
                        (0, s.jsx)("h3", { children: o ? "Recruitment" : "Role & outlook" }),
                        o
                          ? (0, s.jsxs)(s.Fragment, {
                              children: [
                                (0, s.jsxs)("p", {
                                  children: [
                                    "Prioritizes ",
                                    (0, s.jsx)("strong", { children: e.priority.toLowerCase() }),
                                    ".",
                                  ],
                                }),
                                (0, s.jsx)("p", {
                                  className: "muted",
                                  children:
                                    e.status === "Available"
                                      ? "Competing programs are making their own pitches. Your NIL, role, and reputation all affect the decision."
                                      : e.status,
                                }),
                                (0, s.jsxs)("p", { children: [e.scouted, "/2 scouting visits completed."] }),
                                (0, s.jsxs)(X, {
                                  disabled:
                                    r ||
                                    e.status !== "Available" ||
                                    a.phase !== "Offseason" ||
                                    a.round > 8 ||
                                    e.scouted >= 2 ||
                                    a.scouts < 1 ||
                                    hsLock(a, e),
                                  onClick: () => {
                                    t({ type: "scout", id: e.id });
                                  },
                                  children: [(0, s.jsx)(Va, { size: 15 }), "Scout player \xB7 1 visit"],
                                }),
                                !e.fid &&
                                  (0, s.jsxs)(X, {
                                    disabled:
                                      r ||
                                      e.status !== "Available" ||
                                      a.phase !== "Offseason" ||
                                      a.round > 8 ||
                                      !!e.ov ||
                                      (a.ov ?? TUNE.ovisits) < 1 ||
                                      hsLock(a, e),
                                    title: "An official visit: he is fully scouted, his interest and progress jump and his chance to sign with you rises",
                                    onClick: () => {
                                      t({ type: "officialVisit", id: e.id });
                                    },
                                    children: [(0, s.jsx)(Va, { size: 15 }), e.ov ? "Visited campus" : `Official visit \xB7 ${a.ov ?? TUNE.ovisits} left`],
                                  }),
                                e.fid &&
                                  (0, s.jsxs)(X, {
                                    disabled:
                                      r ||
                                      e.status !== "Available" ||
                                      !(a.pw >= 1 && a.pw <= 3) ||
                                      !!e.vis ||
                                      (a.pv || 0) < 1,
                                    title: "Portal entrants can visit campus: more interest and progress",
                                    onClick: () => {
                                      t({ type: "visit", id: e.id });
                                    },
                                    children: [(0, s.jsx)(Va, { size: 15 }), `Campus visit \xB7 ${a.pv || 0} left`],
                                  }),
                              ],
                            })
                          : (0, s.jsxs)(s.Fragment, {
                              children: [
                                (0, s.jsxs)("p", {
                                  children: [
                                    (0, s.jsx)("strong", { children: e.role }),
                                    " \xB7 ",
                                    e.minutes,
                                    " assigned minutes",
                                  ],
                                }),
                                (0, s.jsx)("ul", {
                                  className: "concerns",
                                  children: Yf(a, e).map((g) => (0, s.jsx)("li", { children: g }, g)),
                                }),
                              ],
                            }),
                      ],
                    }),
                  ],
                }),
                !o && (0, s.jsx)(GrowthChart, { p: e }),
              ],
            }),
          n === "Attributes" &&
            (0, s.jsxs)(s.Fragment, {
              children: [
                (0, s.jsxs)("div", {
                  className: "toolbar",
                  children: [
                    (0, s.jsx)("p", {
                      className: "muted",
                      children: m
                        ? "Current ratings \xB7 0\u201399 scale"
                        : "Estimated ranges \xB7 scout twice for exact ratings",
                    }),
                    (0, s.jsxs)("select", {
                      "aria-label": "Compare with another player",
                      value: p,
                      onChange: (g) => C(g.target.value),
                      children: [
                        (0, s.jsx)("option", { value: "", children: "Compare with\u2026" }),
                        a.roster
                          .filter((g) => g.id !== e.id)
                          .map((g) =>
                            (0, s.jsxs)(
                              "option",
                              { value: g.id, children: [g.name, " \xB7 ", g.ovr, " OVR"] },
                              g.id
                            )
                          ),
                      ],
                    }),
                  ],
                }),
                v &&
                  (0, s.jsxs)("p", {
                    className: "compare-note",
                    children: ["Comparison: ", v.name, " \xB7 ", v.ovr, " OVR. His ratings appear in blue."],
                  }),
                (0, s.jsx)("div", {
                  className: "attributes-grid",
                  children: L.map((g) =>
                    (0, s.jsxs)(
                      "div",
                      {
                        children: [
                          (0, s.jsxs)("h4", {
                            className: "attr-group-head",
                            children: [
                              g.name,
                              m && (0, s.jsx)("span", { children: Math.round(g.idx.reduce((z, k) => z + e.attrs[k], 0) / g.idx.length) }),
                            ],
                          }),
                          g.idx.map((w) => {
                            let I = il[w];
                            return (0, s.jsxs)(
                              "div",
                              {
                                className: "attribute",
                                children: [
                                  (0, s.jsxs)("div", {
                                    children: [
                                      (0, s.jsx)("span", { children: I }),
                                      (0, s.jsxs)("strong", {
                                        children: [
                                          m
                                            ? e.attrs[w]
                                            : `${Math.max(25, e.attrs[w] - 6)}\u2013${Math.min(99, e.attrs[w] + 6)}`,
                                          v && (0, s.jsx)("em", { children: v.attrs[w] }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  (0, s.jsx)(Wa, { value: e.attrs[w] }),
                                  v && (0, s.jsx)(Wa, { tone: "blue", value: v.attrs[w] }),
                                ],
                              },
                              I
                            );
                          }),
                        ],
                      },
                      g.name
                    )
                  ),
                }),
              ],
            }),
          n === "Statistics" &&
            (0, s.jsxs)(s.Fragment, {
              children: [
                (0, s.jsx)("h3", {
                  children: e.stats.gp
                    ? "Current season"
                    : c
                      ? "Previous college season"
                      : "Season statistics",
                }),
                c && c.gp
                  ? (0, s.jsxs)(s.Fragment, {
                      children: [
                        (0, s.jsx)("div", {
                          className: "profile-metrics",
                          children: [
                            ["POINTS", "pts"],
                            ["REBOUNDS", "reb"],
                            ["ASSISTS", "ast"],
                            ["STEALS", "stl"],
                            ["BLOCKS", "blk"],
                          ].map(([g, I]) =>
                            (0, s.jsxs)(
                              "div",
                              {
                                children: [
                                  (0, s.jsx)("span", { children: g }),
                                  (0, s.jsx)("strong", { children: (c[I] / c.gp).toFixed(1) }),
                                  (0, s.jsx)("small", { children: "per game" }),
                                ],
                              },
                              I
                            )
                          ),
                        }),
                        (0, s.jsxs)("div", {
                          className: "stat-line",
                          children: [
                            (0, s.jsxs)("span", { children: [c.gp, " GP"] }),
                            (0, s.jsxs)("span", { children: [(c.min / c.gp).toFixed(1), " MPG"] }),
                            (0, s.jsx)("span", {
                              children: c.fga ? `${((c.fgm / c.fga) * 100).toFixed(1)}% FG` : "FG% \u2014",
                            }),
                            (0, s.jsx)("span", {
                              children: c.tpa ? `${((c.tpm / c.tpa) * 100).toFixed(1)}% 3PT` : "3PT% \u2014",
                            }),
                            (0, s.jsxs)("span", { children: [(c.stl / c.gp).toFixed(1), " SPG"] }),
                            (0, s.jsxs)("span", { children: [(c.blk / c.gp).toFixed(1), " BPG"] }),
                            (0, s.jsxs)("span", { children: [(c.to / c.gp).toFixed(1), " TOPG"] }),
                          ],
                        }),
                      ],
                    })
                  : (0, s.jsx)(yl, {
                      title: "No college games yet",
                      body: "Statistics will appear once this player takes the court.",
                    }),
                e.recent.length > 0 &&
                  (0, s.jsxs)(s.Fragment, {
                    children: [
                      (0, s.jsx)("h3", { children: "Recent games" }),
                      (0, s.jsx)("div", {
                        className: "table-wrap",
                        children: (0, s.jsxs)("table", {
                          children: [
                            (0, s.jsx)("thead", {
                              children: (0, s.jsxs)("tr", {
                                children: [
                                  (0, s.jsx)("th", { children: "OPPONENT" }),
                                  (0, s.jsx)("th", { children: "MIN" }),
                                  (0, s.jsx)("th", { children: "PTS" }),
                                  (0, s.jsx)("th", { children: "REB" }),
                                  (0, s.jsx)("th", { children: "AST" }),
                                  (0, s.jsx)("th", { children: "STL" }),
                                  (0, s.jsx)("th", { children: "BLK" }),
                                ],
                              }),
                            }),
                            (0, s.jsx)("tbody", {
                              children: e.recent.map((g, I) =>
                                (0, s.jsxs)(
                                  "tr",
                                  {
                                    children: [
                                      (0, s.jsx)("td", { children: g.opponent }),
                                      (0, s.jsx)("td", { children: g.min }),
                                      (0, s.jsx)("td", { children: g.pts }),
                                      (0, s.jsx)("td", { children: g.reb }),
                                      (0, s.jsx)("td", { children: g.ast }),
                                      (0, s.jsx)("td", { children: g.stl ?? "\u2014" }),
                                      (0, s.jsx)("td", { children: g.blk ?? "\u2014" }),
                                    ],
                                  },
                                  I
                                )
                              ),
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
                pHist(a, e).length > 0 &&
                  (0, s.jsxs)(s.Fragment, {
                    children: [
                      (0, s.jsx)("h3", { children: "Previous seasons" }),
                      (0, s.jsx)("div", {
                        className: "table-wrap",
                        children: (0, s.jsxs)("table", {
                          children: [
                            (0, s.jsx)("thead", {
                              children: (0, s.jsxs)("tr", {
                                children: [
                                  (0, s.jsx)("th", { children: "SEASON" }),
                                  (0, s.jsx)("th", { children: "TEAM" }),
                                  (0, s.jsx)("th", { children: "GP" }),
                                  (0, s.jsx)("th", { children: "PPG" }),
                                  (0, s.jsx)("th", { children: "RPG" }),
                                  (0, s.jsx)("th", { children: "APG" }),
                                  (0, s.jsx)("th", { children: "SPG" }),
                                  (0, s.jsx)("th", { children: "BPG" }),
                                ],
                              }),
                            }),
                            (0, s.jsx)("tbody", {
                              children: pHist(a, e).map((g, I) =>
                                (0, s.jsxs)(
                                  "tr",
                                  {
                                    children: [
                                      (0, s.jsxs)("td", {
                                        children: [g.year, "\u2013", String(g.year + 1).slice(2)],
                                      }),
                                      (0, s.jsx)("td", { children: g.team || "\u2014" }),
                                      (0, s.jsx)("td", { children: g.stats.gp }),
                                      (0, s.jsx)("td", {
                                        children: (g.stats.pts / Math.max(1, g.stats.gp)).toFixed(1),
                                      }),
                                      (0, s.jsx)("td", {
                                        children: (g.stats.reb / Math.max(1, g.stats.gp)).toFixed(1),
                                      }),
                                      (0, s.jsx)("td", {
                                        children: (g.stats.ast / Math.max(1, g.stats.gp)).toFixed(1),
                                      }),
                                      (0, s.jsx)("td", {
                                        children: ((g.stats.stl || 0) / Math.max(1, g.stats.gp)).toFixed(1),
                                      }),
                                      (0, s.jsx)("td", {
                                        children: ((g.stats.blk || 0) / Math.max(1, g.stats.gp)).toFixed(1),
                                      }),
                                    ],
                                  },
                                  I
                                )
                              ),
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
              ],
            }),
          n === "Morale & Role" &&
            (o
              ? (0, s.jsx)(yl, {
                  title: "Make your pitch",
                  body: "Offer NIL and a team role below. Morale begins once the player joins your roster.",
                })
              : (0, s.jsxs)(s.Fragment, {
                  children: [
                    (0, s.jsxs)("div", {
                      className: "morale-header",
                      children: [
                        (0, s.jsxs)("strong", {
                          children: [Math.round(e.morale), (0, s.jsx)("small", { children: "/100" })],
                        }),
                        (0, s.jsxs)("div", {
                          children: [
                            (0, s.jsx)(Ys, { p: e }),
                            (0, s.jsxs)("p", { children: [Pf(e), " transfer risk"] }),
                          ],
                        }),
                      ],
                    }),
                    (0, s.jsx)(Wa, { value: e.morale }),
                    (0, s.jsx)("ul", {
                      className: "concerns",
                      children: Yf(a, e).map((g) => (0, s.jsx)("li", { children: g }, g)),
                    }),
                    (0, s.jsxs)(X, {
                      disabled: e.talked,
                      onClick: () => {
                        t({ type: "talk", id: e.id });
                      },
                      children: [
                        (0, s.jsx)(fo, { size: 15 }),
                        e.talked ? "Meeting held this season" : "Meet with player",
                      ],
                    }),
                    (0, s.jsxs)("div", {
                      className: "profile-form",
                      children: [
                        (0, s.jsx)("h3", { children: "Discuss his role" }),
                        (0, s.jsxs)("p", {
                          children: [
                            "Current promise: ",
                            (0, s.jsx)("strong", { children: e.promise === "None" ? "None" : e.promise }),
                            ". Current assignment: ",
                            (0, s.jsx)("strong", { children: e.role }),
                            ".",
                          ],
                        }),
                        (0, s.jsxs)("label", {
                          children: [
                            "New role promise",
                            (0, s.jsx)("select", {
                              disabled: M,
                              value: y,
                              onChange: (g) => h(g.target.value),
                              children: Ns.map((g) =>
                                (0, s.jsxs)(
                                  "option",
                                  {
                                    disabled: g === "Starter" && Xa(a, e.id) >= 5,
                                    children: [g, g === "Starter" && Xa(a, e.id) >= 5 ? " (5 promised)" : ""],
                                  },
                                  g
                                )
                              ),
                            }),
                          ],
                        }),
                        (0, s.jsxs)("div", {
                          className: "promise-notice",
                          children: [
                            "You are promising ",
                            e.name,
                            " a ",
                            (0, s.jsx)("strong", { children: y.toLowerCase() }),
                            " role and ",
                            (0, s.jsxs)("strong", { children: [wt(y), "+ minutes per game"] }),
                            ". Morale improves when actual playing time meets this promise.",
                          ],
                        }),
                        (0, s.jsx)(X, {
                          primary: !0,
                          onClick: () => {
                            t({ type: "promise", id: e.id, role: y });
                          },
                          children: "Confirm promise",
                        }),
                      ],
                    }),
                  ],
                })),
          n === "NIL & Eligibility" &&
            (0, s.jsxs)(s.Fragment, {
              children: [
                (0, s.jsxs)("div", {
                  className: "profile-metrics",
                  children: [
                    (0, s.jsxs)("div", {
                      children: [
                        (0, s.jsx)("span", { children: "CLASS" }),
                        (0, s.jsx)("strong", { className: "smaller", children: Zl(e) }),
                        (0, s.jsxs)("small", { children: ["Age ", e.age] }),
                      ],
                    }),
                    (0, s.jsxs)("div", {
                      children: [
                        (0, s.jsx)("span", { children: "ELIGIBILITY" }),
                        (0, s.jsx)("strong", { children: 5 - e.year }),
                        (0, s.jsx)("small", { children: "seasons remaining" }),
                      ],
                    }),
                    (0, s.jsxs)("div", {
                      children: [
                        (0, s.jsx)("span", { children: "REDSHIRT" }),
                        (0, s.jsx)("strong", {
                          className: "smaller",
                          children: e.redshirt ? "Active" : e.redshirtUsed ? "Used" : "Available",
                        }),
                        (0, s.jsx)("small", { children: "One season per player" }),
                      ],
                    }),
                  ],
                }),
                !o &&
                  (0, s.jsxs)(s.Fragment, {
                    children: [
                      (0, s.jsxs)("div", {
                        className: "profile-form",
                        children: [
                          (0, s.jsx)("h3", { children: "Annual NIL commitment" }),
                          (0, s.jsxs)("p", {
                            children: [
                              "Current: ",
                              (0, s.jsx)("strong", { children: q(e.nil) }),
                              " \xB7 Requested: ",
                              (0, s.jsx)("strong", { children: q(e.ask) }),
                            ],
                          }),
                          (0, s.jsxs)("label", {
                            children: [
                              "NIL per year ($)",
                              (0, s.jsx)("input", {
                                disabled: M || a.phase !== "Offseason",
                                type: "number",
                                min: e.nil * MONEY,
                                step: 1e3,
                                ...nilBox,
                              }),
                            ],
                          }),
                          (0, s.jsx)(X, {
                            primary: !0,
                            disabled: a.phase !== "Offseason" || d <= e.nil,
                            onClick: () => {
                              t({ type: "nil", id: e.id, nil: d });
                            },
                            children: "Update annual NIL",
                          }),
                          (0, s.jsxs)("p", {
                            className: "offer-balance",
                            children: [
                              "After increase: ",
                              (0, s.jsx)("strong", { children: q(Ce(a) - Math.max(0, d - e.nil)) }),
                              " NIL remaining.",
                            ],
                          }),
                          (0, s.jsxs)("p", {
                            className: "muted",
                            children: [q(Ce(a)), " available. Renegotiations happen during the offseason."],
                          }),
                        ],
                      }),
                      (0, s.jsxs)("div", {
                        className: "profile-form",
                        children: [
                          (0, s.jsx)("h3", { children: "Redshirt this player" }),
                          (0, s.jsx)("p", {
                            className: "muted",
                            children:
                              "Sit out the season to preserve eligibility and focus on development. You can do it in the offseason, or early in the season before he has played a game. You still need eight active players.",
                          }),
                          (() => {
                            // why the button is not available (shown as its tooltip), so it never just looks broken
                            const gp = (e.stats && e.stats.gp) || 0,
                              why = a.live
                                ? "Finish the live game first."
                                : a.phase !== "Offseason" && a.phase !== "Regular season"
                                  ? "Redshirts can be set in the offseason, or early in the season before a player has played."
                                  : e.redshirtUsed && !e.redshirt
                                    ? "He has already used his redshirt season."
                                    : a.phase === "Regular season" && !e.redshirt && gp > 0
                                      ? `He has already played ${gp} game${gp === 1 ? "" : "s"} this season, so he can no longer redshirt.`
                                      : a.phase === "Regular season" && !e.redshirt && a.roster.filter((l) => !l.redshirt && l.id !== e.id).length < 8
                                        ? "You need at least eight active players during the season."
                                        : "";
                            return (0, s.jsxs)(s.Fragment, {
                              children: [
                                why && (0, s.jsx)("p", { className: "muted", children: why }),
                                (0, s.jsx)(X, {
                            disabled: !!why,
                            title: why || void 0,
                            onClick: () => {
                              e.redshirt ? t({ type: "redshirt", id: e.id }) : setRsAsk("talk");
                            },
                            children: e.redshirt ? "Activate player" : "Talk about a redshirt year",
                          }),
                              ],
                            });
                          })(),
                        ],
                      }),
                      (0, s.jsxs)("div", {
                        className: "profile-form",
                        children: [
                          (0, s.jsx)("h3", { children: "Cut this player" }),
                          (0, s.jsx)("p", {
                            className: "muted",
                            children:
                              "Remove him from the roster and free up his NIL money. This cannot be undone, and you need eight active players to start the season.",
                          }),
                          (0, s.jsx)(X, {
                            className: "cut-btn",
                            disabled: !!a.live,
                            title: a.live ? "Finish the live game first" : void 0,
                            onClick: () => {
                              window.confirm(
                                `Cut ${e.name}? ${a.roster.length - 1 < 8 ? "You will have fewer than 8 players. " : ""}${a.phase !== "Offseason" ? "His minutes will be given to the rest of the rotation. " : ""}This cannot be undone.`
                              ) && (t({ type: "cut", id: e.id }), l());
                            },
                            children: "Cut player",
                          }),
                          a.phase === "Offseason" &&
                            a.pw >= 1 &&
                            a.pw <= 3 &&
                            (0, s.jsx)(X, {
                              className: "cut-btn",
                              title:
                                "Open a roster spot: he enters the transfer portal and other schools may sign him. Releasing more than one player hurts your reputation and team morale.",
                              disabled: a.roster.length <= 8,
                              onClick: () => {
                                window.confirm(
                                  `Release ${e.name} into the transfer portal? ${(a.rel || 0) >= 1 ? "You have already released a player this offseason: this one costs reputation and team morale. " : "The first release is free. "}This cannot be undone.`
                                ) && (t({ type: "release", id: e.id }), l());
                              },
                              children: "Release into portal",
                            }),
                        ],
                      }),
                    ],
                  }),
              ],
            }),
        ],
      }),
      o &&
        r &&
        (0, s.jsxs)("div", {
          className: "offer-footer",
          children: [
            (0, s.jsx)("h3", { children: "Walk-on invitation" }),
            (0, s.jsxs)("p", {
              children: [
                "No NIL required \xB7 ",
                fl(a, e),
                "% chance of accepting \xB7 ",
                15 - a.roster.length,
                " open spots",
              ],
            }),
            (0, s.jsx)(X, {
              primary: !0,
              disabled:
                e.status !== "Available" ||
                a.phase !== "Offseason" ||
                a.roster.length + a.prospects.filter((g) => g.offer).length >= 15,
              onClick: () => {
                t({ type: "walkon", id: e.id });
              },
              children: e.status === "Available" ? "Invite to roster" : e.status,
            }),
          ],
        }),
      o &&
        !r &&
        (0, s.jsxs)("div", {
          className: "offer-footer",
          children: [
            (0, s.jsxs)("div", {
              className: "row between",
              children: [
                (0, s.jsx)("h3", { children: e.offer ? "Your pending offer" : "Make an offer" }),
                (0, s.jsx)(he, { tone: "orange", children: e.status }),
              ],
            }),
            e.status === "Available" && a.phase === "Offseason" && a.round <= 9 && !hsLock(a, e)
              ? (0, s.jsxs)(s.Fragment, {
                  children: [
                    (0, s.jsxs)("div", {
                      className: "offer-fields",
                      children: [
                        (0, s.jsxs)("label", {
                          children: [
                            "Annual NIL ($)",
                            (0, s.jsx)("input", {
                              disabled: M,
                              type: "number",
                              min: 0,
                              step: 1e3,
                              ...nilBox,
                            }),
                            (0, s.jsxs)("small", {
                              className: Ce(a) + (e.offer?.nil || 0) - d < 0 ? "bad-text" : "good-text",
                              children: [q(Ce(a) + (e.offer?.nil || 0) - d), " remaining after this offer"],
                            }),
                          ],
                        }),
                        (0, s.jsxs)("label", {
                          children: [
                            "Promised role",
                            (0, s.jsx)("select", {
                              disabled: M,
                              value: y,
                              onChange: (g) => h(g.target.value),
                              children: Ns.map((g) =>
                                (0, s.jsxs)(
                                  "option",
                                  {
                                    disabled: g === "Starter" && Xa(a, e.id) >= 5,
                                    children: [g, g === "Starter" && Xa(a, e.id) >= 5 ? " (5 promised)" : ""],
                                  },
                                  g
                                )
                              ),
                            }),
                          ],
                        }),
                        (0, s.jsxs)("div", {
                          className: "offer-chance",
                          children: [
                            (0, s.jsx)("span", { children: "EST. SIGNING CHANCE" }),
                            (0, s.jsxs)("strong", { children: [Nn(a, e, d, y), "%"] }),
                          ],
                        }),
                      ],
                    }),
                    (0, s.jsxs)("p", {
                      className: "muted",
                      children: [
                        "Promises ",
                        wt(y),
                        "+ minutes per game. ",
                        q(Ce(a) + (e.offer?.nil || 0)),
                        " available for this offer. Progress: ",
                        e.progress,
                        "% toward a decision. Advance recruiting rounds to continue your pitch.",
                      ],
                    }),
                    (0, s.jsxs)("div", {
                      className: "row gap",
                      children: [
                        (0, s.jsx)(X, {
                          primary: !0,
                          disabled:
                            !Number.isFinite(d) ||
                            d < 0 ||
                            d > Ce(a) + (e.offer?.nil || 0) ||
                            (y === "Starter" && Xa(a, e.id) >= 5),
                          onClick: () => {
                            t({ type: "offer", id: e.id, nil: d, role: y });
                          },
                          children: e.offer ? "Update offer" : "Send offer",
                        }),
                        e.offer &&
                          (0, s.jsx)(X, {
                            onClick: () => {
                              t({ type: "withdraw", id: e.id });
                            },
                            children: "Withdraw offer",
                          }),
                        (0, s.jsxs)(X, {
                          disabled: e.scouted >= 2 || a.scouts < 1,
                          onClick: () => {
                            t({ type: "scout", id: e.id });
                          },
                          children: ["Scout \xB7 ", e.scouted, "/2"],
                        }),
                      ],
                    }),
                  ],
                })
              : (0, s.jsx)("p", {
                  className: "muted",
                  children:
                    e.status === "Signed"
                      ? "This player has joined your program."
                      : e.status === "Available" && hsLock(a, e)
                        ? HS_LOCK_MSG + " Finish the portal waves first (Advance portal wave)."
                        : "Recruiting is closed for this player.",
                }),
          ],
        }),
    ],
  });
}
