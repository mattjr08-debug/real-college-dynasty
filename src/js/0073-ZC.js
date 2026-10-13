// Program HQ dashboard helpers (item 3). No game numbers: these only read the career.
// News icon by topic, so the feed can be scanned by eye.
function newsIcon(title) {
  const x = String(title || "").toLowerCase();
  if (/injur|suspen|ineligib|incident|eligib|waiver/.test(x)) return St;
  if (/draft|graduat|senior|pro /.test(x)) return io;
  if (/portal|transfer|withdr/.test(x)) return so;
  if (/champion|tournament|title|seed|bracket|nit\b|award|american|ranked|poll|top 25/.test(x)) return ba;
  if (/nil|budget|revenue|donor|contract|media|money|salary|\$/.test(x)) return ja;
  if (/recruit|class|sign|commit|visit|offer/.test(x)) return Va;
  if (/coach|assistant|staff|job|hire/.test(x)) return nl;
  return Es;
}
// Small trend lines for the tiles: wins, NIL budget and reputation by finished season; in season the record tile shows each game's margin.
function hqSparks(e) {
  const h = e.history || [],
    played = e.schedule.filter((f) => f.played).map((f) => f.us - f.them);
  return {
    record: e.phase === "Regular season" && played.length >= 3 ? played : h.map((z) => z.wins),
    recordNote: e.phase === "Regular season" && played.length >= 3 ? "Margin, game by game" : "Wins by season",
    budget: h.map((z) => z.budget),
    rep: [...h.map((z) => z.rep), e.rep],
  };
}
// The one thing to do next. Pending decisions come first because they block the season; then the first unfinished offseason step; then the next game.
function hqNext(e, steps, nextGame) {
  const pend = (e.draft || []).filter((d) => d.status === "pending").length,
    xf = (e.xfers || []).filter((d) => d.status === "pending").length + e.prospects.filter((d) => d.wb && d.status === "Available").length,
    neg = (e.negs || []).length;
  if (pend) return { key: "draft", title: `Answer ${pend} draft decision${pend > 1 ? "s" : ""}`, why: "Players are waiting to hear whether you want them back.", label: "Open draft decisions" };
  if (xf) return { key: "xfer", title: `Answer ${xf} transfer decision${xf > 1 ? "s" : ""}`, why: "Players in the portal are waiting for your answer.", label: "Open transfer decisions" };
  if (neg) return { key: "neg", title: `Settle ${neg} contract talk${neg > 1 ? "s" : ""}`, why: "Players want to talk about their NIL deals.", label: "Open contract talks" };
  if (e.phase === "Offseason") {
    const st = steps.find((z) => !z.done);
    return st
      ? { key: "tab", tab: st.tab, title: st.title, why: st.sub, label: "Go there" }
      : { key: "none", title: "Your roster is ready", why: "Press Begin season at the top right when you want to start.", label: "" };
  }
  if (e.phase === "Season review") return { key: "tab", tab: "Season", title: "Review your season", why: e.result || "Season complete", label: "Open season center" };
  if (nextGame) return { key: "sim", title: `Next game: ${nextGame.venue === "Away" ? "at" : nextGame.venue === "Neutral" ? "vs (neutral)" : "vs"} ${nextGame.opponent}`, why: `${nextGame.kind} \xB7 opponent overall ${nextGame.rating}`, label: "Sim next game" };
  return { key: "tab", tab: "Season", title: e.phase, why: e.berth || "Your next result is waiting in the season center.", label: "Open season center" };
}
// A school-like object for any opponent (they have no color or mascot of their own): a steady color from the id, so the generated logo is always the same.
function hqOppSchool(o) {
  return { id: o.id, name: o.name, short: o.short, mascot: "", color: `hsl(${TS(String(o.id)) % 360} 58% 56%)` };
}
// Display-only win chance for the next game: a logistic curve on the rating gap (gap 0 is about even, +10 about 70%) and a small venue edge. It is NOT the engine's number.
function hqWinChance(e, r) {
  const gap = Ps(e) - r.rating + (r.venue === "Home" ? 3 : r.venue === "Away" ? -3 : 0);
  return Math.min(97, Math.max(3, Math.round(100 / (1 + Math.exp(-gap / 11.8)))));
}
function HqMatchup({ e, r }) {
  const o = e.league.find((z) => z.id === r.oppId) || e.opponents.find((z) => z.id === r.oppId),
    sc = o ? hqOppSchool(o) : { id: r.oppId, name: r.opponent, short: "", mascot: "", color: "#9aa3b5" },
    mine = dl(e),
    win = hqWinChance(e, r);
  return (0, s.jsxs)("div", {
    className: "hq-matchup",
    children: [
      (0, s.jsxs)("div", {
        className: "hq-side",
        children: [
          (0, s.jsx)("div", { className: "hq-logo", children: (0, s.jsx)(SchoolLogo, { school: e.school }) }),
          (0, s.jsx)("strong", { children: e.school.name }),
          (0, s.jsxs)("span", { children: [mine.wins, "–", mine.losses, " \xB7 OVR ", Ps(e)] }),
        ],
      }),
      (0, s.jsx)("div", { className: "hq-vs", children: r.venue === "Away" ? "AT" : "VS" }),
      (0, s.jsxs)("div", {
        className: "hq-side",
        children: [
          (0, s.jsx)("div", { className: "hq-logo", children: (0, s.jsx)(SchoolLogo, { school: sc }) }),
          (0, s.jsx)("strong", { children: r.opponent }),
          (0, s.jsxs)("span", { children: [o ? `${o.wins}–${o.losses} \xB7 ` : "", "OVR ", r.rating] }),
        ],
      }),
      (0, s.jsxs)("div", {
        className: "hq-chance",
        title: "An estimate from the two teams' overall ratings and the venue",
        children: [
          (0, s.jsxs)("div", {
            className: "hq-chance-top",
            children: [
              (0, s.jsxs)("b", { children: [win, "%"] }),
              (0, s.jsx)("span", { children: "WIN CHANCE (ESTIMATE)" }),
              (0, s.jsxs)("b", { className: "opp", children: [100 - win, "%"] }),
            ],
          }),
          (0, s.jsx)("div", {
            className: "hq-chance-bar",
            role: "img",
            "aria-label": `Win chance ${win} percent`,
            children: (0, s.jsx)("i", { style: { width: `${win}%` } }),
          }),
        ],
      }),
      (0, s.jsx)("p", { className: "hq-kind", children: `${r.kind}${r.event ? " \xB7 " + r.event : ""}${r.rival ? " \xB7 RIVALRY" : ""}` }),
    ],
  });
}
// One chip per scheduled game: green W, red L, outlined for games still to play.
function HqTimeline({ e, onOpen }) {
  return (0, s.jsx)("section", {
    className: "hq-timeline",
    "aria-label": "Season timeline",
    children: [
      (0, s.jsx)("span", { className: "hq-strip-title", key: "t", children: "SEASON TIMELINE" }),
      (0, s.jsx)("div", {
        className: "hq-chips",
        key: "c",
        children: e.schedule.map((g, i) =>
          (0, s.jsx)(
            g.played ? "button" : "span",
            {
              className: "hq-chip " + (g.played ? (g.win ? "w" : "l") : "todo") + (g.kind === "Conference" ? " conf" : ""),
              title: `${g.played ? (g.win ? "W " : "L ") + g.us + "–" + g.them : "Upcoming"} ${g.venue === "Away" ? "at" : "vs"} ${g.opponent}`,
              onClick: g.played ? () => onOpen(g.id) : void 0,
              children: g.played ? (g.win ? "W" : "L") : i + 1,
            },
            g.id
          )
        ),
      }),
    ],
  });
}
// A strip of big numbers from the games played so far.
function HqStats({ e }) {
  const pl = e.schedule.filter((g) => g.played);
  if (!pl.length) return null;
  const avg = (k) => (pl.reduce((a, g) => a + g[k], 0) / pl.length).toFixed(1),
    cf = Dn(e),
    last = pl[pl.length - 1];
  let streak = 0;
  for (let i = pl.length - 1; i >= 0 && pl[i].win === last.win; i--) streak++;
  const tiles = [
    ["POINTS FOR", avg("us")],
    ["POINTS AGAINST", avg("them")],
    ["AVG MARGIN", ((pl.reduce((a, g) => a + g.us - g.them, 0) / pl.length) >= 0 ? "+" : "") + (pl.reduce((a, g) => a + g.us - g.them, 0) / pl.length).toFixed(1)],
    ["CONFERENCE", `${cf.wins}–${cf.losses}`],
    ["STREAK", `${last.win ? "W" : "L"}${streak}`],
  ];
  return (0, s.jsx)("section", {
    className: "hq-stats",
    "aria-label": "Season numbers",
    children: tiles.map(([k, v]) =>
      (0, s.jsxs)("div", { className: "hq-stat", children: [(0, s.jsx)("b", { children: v }), (0, s.jsx)("span", { children: k })] }, k)
    ),
  });
}
function ZC({
  g: e,
  run: a,
  navigate: t,
  select: l,
  openBox: u,
  openSeason: osv,
  openOffers: oof,
  openMove: omv,
  openDraft: odr,
  openXfer: oxf,
  openNeg: ong,
}) {
  let o = dl(e),
    r = e.schedule.find((f) => !f.played),
    n = e.schedule
      .filter((f) => f.played)
      .slice(-3)
      .reverse(),
    i = e.roster.filter((f) => !f.redshirt).length,
    d = e.roster.reduce((f, y) => f + y.minutes, 0);
  let steps = [
                          {
                            title: "Build an eight-man roster",
                            sub: `${i} active players \xB7 ${Math.max(0, 8 - i)} more needed`,
                            done: i >= 8,
                            tab: "Recruiting",
                            icon: nl,
                          },
                          {
                            title: "Set your starting five & minutes",
                            sub: `${e.lineup.length}/5 starters \xB7 ${d}/200 minutes`,
                            done: e.lineup.length === 5 && d === 200,
                            tab: "Rotation",
                            icon: no,
                          },
                          {
                            title: "Promise a role to every player",
                            sub: `${e.roster.filter((f) => !f.redshirt && f.promise && f.promise !== "None").length} of ${i} promised \xB7 needed before opening night`,
                            done: e.roster
                              .filter((f) => !f.redshirt)
                              .every((f) => f.promise && f.promise !== "None"),
                            tab: "Roster",
                            icon: nl,
                          },
                          {
                            title: "Customize your nonconference schedule",
                            sub: "12 games selected \xB7 adjust opponents and venues",
                            done: !0,
                            tab: "Schedule",
                            icon: ql,
                          },
                          {
                            title: "Resolve your recruiting offers",
                            sub: `${e.prospects.filter((f) => f.offer).length} pending offers \xB7 ${e.round === 9 ? "last chance round" : `round ${Math.min(e.round, 8)} of 8`}`,
                            done: !e.prospects.some((f) => f.offer),
                            tab: "Recruiting",
                            icon: Va,
                          },
                        ],
    next = hqNext(e, steps, r),
    spark = hqSparks(e);
  return (0, s.jsxs)(s.Fragment, {
    children: [
      (0, s.jsxs)("div", {
        className: "hq-banner",
        children: [
          (0, s.jsxs)("div", {
            className: "banner-copy",
            children: [
              (0, s.jsx)(he, {
                tone: "orange",
                children:
                  e.phase === "Offseason"
                    ? "A PROGRAM IN YOUR HANDS"
                    : e.phase === "Season review"
                      ? "THE NEXT CHAPTER AWAITS"
                      : "MAKE EVERY POSSESSION COUNT",
              }),
              (0, s.jsxs)("h2", {
                children: [
                  e.school.name,
                  (0, s.jsx)("br", {}),
                  (0, s.jsx)("span", { children: e.school.mascot }),
                ],
              }),
              (() => {
                const hr = e.phase === "Offseason" ? W_lastRecord(e) : o;
                return (
                  hr &&
                  (0, s.jsxs)("div", {
                    className: "hq-bigrecord",
                    children: [
                      (0, s.jsxs)("b", { children: [hr.wins, "–", hr.losses] }),
                      (0, s.jsx)("span", { children: e.phase === "Offseason" ? "LAST SEASON" : "OVERALL" }),
                    ],
                  })
                );
              })(),
              (0, s.jsx)("p", {
                children:
                  e.phase === "Offseason"
                    ? `${e.departed.filter((f) => f.reason === "Graduated").length} graduates. ${e.departed.filter((f) => f.reason !== "Graduated").length} transfers. ${15 - e.roster.length} roster spots to fill.`
                    : `${o.wins}\u2013${o.losses} overall \xB7 ${Dn(e).wins}\u2013${Dn(e).losses} in conference`,
              }),
              (0, s.jsxs)("div", {
                className: "row gap",
                children: [
                  e.phase === "Offseason"
                    ? (0, s.jsxs)(X, {
                        primary: !0,
                        onClick: () => t("Recruiting"),
                        children: [(0, s.jsx)(Va, { size: 16 }), "Find your next star"],
                      })
                    : (0, s.jsxs)(X, {
                        primary: !0,
                        onClick: () => t("Season"),
                        children: [(0, s.jsx)(ba, { size: 16 }), "Season center"],
                      }),
                  (0, s.jsxs)("button", {
                    className: "text-button",
                    onClick: () => t("Roster"),
                    children: ["Meet your roster ", (0, s.jsx)(Pl, { size: 16 })],
                  }),
                  e.jobOffers?.length > 0 &&
                    (0, s.jsxs)(X, {
                      small: !0,
                      onClick: oof,
                      children: ["Job offers (", e.jobOffers.length, ")"],
                    }),
                  moveInfo(e) &&
                    (0, s.jsx)(X, { small: !0, primary: !0, onClick: omv, children: "Move up conferences" }),
                  (e.draft || []).some((d) => d.status === "pending") &&
                    (0, s.jsxs)(X, {
                      small: !0,
                      primary: !0,
                      onClick: odr,
                      children: [
                        "Draft decisions (",
                        (e.draft || []).filter((d) => d.status === "pending").length,
                        ")",
                      ],
                    }),
                  (e.negs || []).length > 0 &&
                    (0, s.jsxs)(X, {
                      small: !0,
                      primary: !0,
                      onClick: ong,
                      children: ["Contract talks (", e.negs.length, ")"],
                    }),
                  ((e.xfers || []).some((d) => d.status === "pending") ||
                    e.prospects.some((d) => d.wb && d.status === "Available")) &&
                    (0, s.jsxs)(X, {
                      small: !0,
                      primary: !0,
                      onClick: oxf,
                      children: [
                        "Transfer decisions (",
                        (e.xfers || []).filter((d) => d.status === "pending").length +
                          e.prospects.filter((d) => d.wb && d.status === "Available").length,
                        ")",
                      ],
                    }),
                ],
              }),
            ],
          }),
          (0, s.jsxs)("div", {
            className: "banner-emblem",
            "aria-hidden": "true",
            children: [
              (0, s.jsx)("div", {
                className: "emblem-logo",
                children: (0, s.jsx)(SchoolLogo, { school: e.school }),
              }),
              (0, s.jsx)("span", { children: e.school.mascot.toUpperCase() }),
            ],
          }),
          (0, s.jsxs)("div", {
            className: "banner-season",
            children: [
              "SEASON",
              (0, s.jsx)("br", {}),
              (0, s.jsx)("strong", { children: String(e.year - 2025).padStart(2, "0") }),
            ],
          }),
        ],
      }),
      (0, s.jsxs)("section", {
        className: "hq-next" + (next.key === "none" ? " ready" : ""),
        "aria-label": "What to do next",
        children: [
          (0, s.jsxs)("div", {
            children: [
              (0, s.jsx)("span", { className: "eyebrow", children: "DO THIS NEXT" }),
              (0, s.jsx)("h2", { children: next.title }),
              (0, s.jsx)("p", { children: next.why }),
            ],
          }),
          next.label &&
            (0, s.jsx)(X, {
              primary: !0,
              onClick: () =>
                next.key === "draft" ? odr() : next.key === "xfer" ? oxf() : next.key === "neg" ? ong() : next.key === "sim" ? a({ type: "sim", count: 1 }) : t(next.tab),
              children: next.label,
            }),
        ],
      }),
      e.phase !== "Offseason" && (0, s.jsx)(HqTimeline, { e, onOpen: u }),
      e.phase !== "Offseason" && (0, s.jsx)(HqStats, { e }),
      (0, s.jsxs)("div", {
        className: "metrics",
        children: [
          (0, s.jsx)(ca, {
            label: e.phase === "Offseason" ? "LAST SEASON" : "OVERALL RECORD",
            value:
              e.phase === "Offseason"
                ? (() => {
                    const lr = W_lastRecord(e);
                    return lr ? `${lr.wins}\u2013${lr.losses}` : `${e.school.wins}\u2013${W_loss(e.school)}`;
                  })()
                : `${o.wins}\u2013${o.losses}`,
            note: `Goal: ${_s(e)} wins${{ delta: " or real player growth", lake: " or real player growth", mesa: " or a conference title", coastal: " or a conference title", mission: " or a conference title", metro: " or a conference title", cascadia: " or a tournament trip", peachtree: " or a tournament trip", capital: " or a tournament trip", lone: " or a tournament trip" }[e.school.id] || ""} \xB7 ${jobStatus(e)}`,
            icon: (0, s.jsx)(ba, {}),
            spark: spark.record,
            sparkNote: spark.recordNote,
            onClick: osv,
          }),
          (0, s.jsx)(ca, {
            label: "NIL AVAILABLE",
            value: q(Ce(e)),
            note: `${q(e.budget)} total budget \xB7 ${W_nilTierText(e.baseBudget)} \xB7 ${(e.confNames || [])[0] || e.school.league}`,
            spark: spark.budget,
            sparkNote: "Budget by season",
            icon: (0, s.jsx)(ja, {}),
          }),
          (0, s.jsx)(ca, {
            label: "TEAM OVERALL",
            value: String(Ps(e)),
            note: `${e.roster.length} / 15 roster spots`,
            icon: (0, s.jsx)(Ms, {}),
          }),
          (0, s.jsx)(ca, {
            label: "TEAM CHEMISTRY",
            value: `${Math.round(e.chemistry)}%`,
            note: `${En(e)} morale \xB7 ${Hf(En(e))}`,
            icon: (0, s.jsx)(nl, {}),
          }),
          (0, s.jsx)(ca, {
            label: "COACH REPUTATION",
            value: `${W_crepInit(e)}/99`,
            note: `${W_crepLabel(W_crepInit(e))} \xB7 grows with wins, tournament runs and awards; drives job offers and recruit interest`,
            icon: (0, s.jsx)(ba, {}),
          }),
        ],
      }),
      (0, s.jsxs)("div", {
        className: "dashboard-columns",
        children: [
          (0, s.jsxs)("div", {
            className: "stack",
            children: [
              (0, s.jsx)(qe, {
                title: e.phase === "Offseason" ? "Offseason game plan" : "On the schedule",
                meta:
                  e.phase === "Offseason"
                    ? "Build the foundation before opening night."
                    : "Your season, one game at a time.",
                action: (0, s.jsx)("span", {
                  className: "subtle-number",
                  children: e.phase === "Offseason" ? "01" : "02",
                }),
                children:
                  e.phase === "Offseason"
                    ? (0, s.jsx)("div", {
                        className: "checklist",
                        children: steps.map((f, y) =>
                          (0, s.jsxs)(
                            "button",
                            {
                              className: "check-row",
                              onClick: () => t(f.tab),
                              children: [
                                (0, s.jsx)("span", {
                                  className: `check-step ${f.done ? "complete" : ""}`,
                                  children: f.done
                                    ? (0, s.jsx)(Hl, { size: 17 })
                                    : String(y + 1).padStart(2, "0"),
                                }),
                                (0, s.jsxs)("div", {
                                  children: [
                                    (0, s.jsx)("strong", { children: f.title }),
                                    (0, s.jsx)("span", { children: f.sub }),
                                  ],
                                }),
                                (0, s.jsx)(Pl, { size: 17 }),
                              ],
                            },
                            f.title
                          )
                        ),
                      })
                    : r
                      ? (0, s.jsxs)("div", {
                          className: "next-match",
                          children: [
                            (0, s.jsxs)("span", {
                              className: "eyebrow",
                              children: ["NEXT UP \xB7 ", r.venue.toUpperCase()],
                            }),
                            (0, s.jsx)(HqMatchup, { e, r }),
                            (0, s.jsxs)(X, {
                              primary: !0,
                              onClick: () => {
                                a({ type: "sim", count: 1 });
                              },
                              children: [(0, s.jsx)(bt, { size: 15 }), "Sim game"],
                            }),
                          ],
                        })
                      : (0, s.jsxs)("div", {
                          className: "next-match",
                          children: [
                            (0, s.jsx)(ba, { size: 36 }),
                            (0, s.jsx)("h3", {
                              children: e.phase === "Season review" ? e.result || "Season complete" : e.phase,
                            }),
                            (0, s.jsx)("p", {
                              children: e.berth || "Your next result is waiting in the season center.",
                            }),
                            (0, s.jsx)(X, { onClick: () => t("Season"), children: "Open season center" }),
                          ],
                        }),
              }),
              (0, s.jsx)(qe, {
                title: "Your core",
                meta: "Click a player to view ratings, morale, and promises.",
                action: (0, s.jsxs)("button", {
                  className: "text-button",
                  onClick: () => t("Roster"),
                  children: ["Full roster ", (0, s.jsx)(Pl, { size: 15 })],
                }),
                children: (0, s.jsx)("div", {
                  className: "core-grid",
                  children: [...e.roster]
                    .sort((f, y) => y.ovr - f.ovr)
                    .slice(0, 3)
                    .map((f) => (0, s.jsx)(Fy, { p: f, onClick: () => l(f.id) }, f.id)),
                }),
              }),
            ],
          }),
          (0, s.jsxs)("div", {
            className: "stack",
            children: [
              (0, s.jsx)(qe, {
                title: "Around the program",
                action: (0, s.jsx)(he, { children: "LIVE FEED" }),
                children: (0, s.jsx)("div", {
                  className: "news-list",
                  children: e.news
                    .slice(0, 5)
                    .map((f, y) =>
                      (0, s.jsxs)(
                        "div",
                        {
                          className: "news-item",
                          children: [
                            (0, s.jsx)("span", {
                              className: `news-icon ${y === 0 ? "orange" : ""}`,
                              children: (0, s.jsx)(newsIcon(f.title), { size: 15 }),
                            }),
                            (0, s.jsxs)("div", {
                              children: [
                                (0, s.jsxs)("span", {
                                  className: "news-date",
                                  children: [f.year, "\u2013", String(f.year + 1).slice(2), " SEASON"],
                                }),
                                (0, s.jsx)("h3", { children: f.title }),
                                (0, s.jsx)("p", { children: f.body }),
                              ],
                            }),
                          ],
                        },
                        y
                      )
                    ),
                }),
              }),
              (0, s.jsx)(qe, {
                title: "Program reputation",
                children: (0, s.jsxs)("div", {
                  className: "reputation",
                  children: [
                    (0, s.jsxs)("div", {
                      children: [
                        (0, s.jsx)("strong", { children: e.rep }),
                        (0, s.jsx)("span", { children: "/ 99" }),
                        (0, s.jsx)(he, {
                          tone: "orange",
                          children: e.rep < 30 ? "UNDERDOG" : e.rep < 60 ? "RISING PROGRAM" : "CONTENDER",
                        }),
                      ],
                    }),
                    (0, s.jsx)(Wa, { value: e.rep }),
                    (0, s.jsx)(Sparkline, { values: spark.rep, label: "Reputation by season" }),
                    tierOf(e) < 4 &&
                      (0, s.jsxs)("small", {
                        className: "next-tier",
                        children: [
                          "Next conference level at reputation ",
                          Math.round(tierAvg(tierOf(e) + 1, "rep")),
                        ],
                      }),
                    (0, s.jsx)("p", {
                      children:
                        "Win games and meet expectations to attract better recruits and grow your NIL budget.",
                    }),
                  ],
                }),
              }),
              n.length > 0 &&
                (0, s.jsx)(qe, {
                  title: "Recent results",
                  children: n.map((f) =>
                    (0, s.jsxs)(
                      "button",
                      {
                        className: "result-row",
                        onClick: () => u(f.id),
                        children: [
                          (0, s.jsx)(he, { tone: f.win ? "green" : "red", children: f.win ? "W" : "L" }),
                          (0, s.jsx)("span", { children: f.opponent }),
                          (0, s.jsxs)("strong", { children: [f.us, "\u2013", f.them] }),
                        ],
                      },
                      f.id
                    )
                  ),
                }),
            ],
          }),
        ],
      }),
    ],
  });
}
