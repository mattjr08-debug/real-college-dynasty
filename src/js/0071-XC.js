// Player-name search on the Choose your rebuild page (Real College Dynasty): typing a player's name also finds his school.
function W_careerPlayerHits(ql) {
  const out = new Map();
  if (typeof REAL_TEAMS === "undefined" || !ql || ql.length < 3) return out;
  const nz = (t) => String(t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
  const toks = nz(ql).split(" ").filter(Boolean); if (!toks.length) return out;
  for (const school of Object.keys(REAL_TEAMS)) for (const r of REAL_TEAMS[school].r || []) {
    const n = nz(r[0]); if (!toks.every((k) => n.includes(k))) continue;
    const l = out.get(school) || []; if (l.length < 3) l.push(`${r[0]} \u00B7 ${r[1]} \u00B7 ${["Fr", "So", "Jr", "Sr"][Math.max(0, Math.min(3, r[2] - 1))]} \u00B7 OVR ${r[3]}`); out.set(school, l);
  }
  return out;
}
var TIER_RANGE = ["$15M\u2013$25M+", "$7M\u2013$15M", "$3M\u2013$7M", "$1.5M\u2013$3M", "$500K\u2013$1.5M", "$0\u2013$500K"];
function XC({ onStart: e, onCancel: a, existing: t, busy: l }) {
  let u0 = Xl.find((i) => i.id === "coastal") || Xl[0],
    [u, o] = (0, N.useState)(u0),
    tiers = (0, N.useMemo)(() => W_schoolTiers(), []),
    [op, setOp] = (0, N.useState)(() => new Set([W_nilTier(u0.budget).n])),
    [sq, setSq] = (0, N.useState)(""),
    ql = sq.trim().toLowerCase(),
    pm = (0, N.useMemo)(() => W_careerPlayerHits(ql), [ql]),
    [r, n] = (0, N.useState)("Coach Jackson"),
    [i, d] = (0, N.useState)("Development");
  return (0, s.jsxs)("div", {
    className: "setup",
    children: [
      (0, s.jsxs)("div", {
        className: "setup-top",
        children: [
          (0, s.jsxs)("div", {
            className: "brand",
            children: [
              (0, s.jsx)("div", { className: "brand-mark", children: (0, s.jsx)(It, { size: 30 }) }),
              (0, s.jsxs)("div", {
                children: ["DYNASTY", (0, s.jsx)("span", { children: "COLLEGE BASKETBALL" })],
              }),
            ],
          }),
          (0, s.jsx)(he, { children: "CAREER MODE" }),
        ],
      }),
      (0, s.jsxs)("div", {
        className: "setup-heading",
        children: [
          (0, s.jsx)("p", { className: "eyebrow", children: "YOUR FIRST HEAD COACHING JOB" }),
          (0, s.jsxs)("h1", {
            children: [
              "EVERY DYNASTY",
              (0, s.jsx)("br", {}),
              "STARTS SOMEWHERE",
              (0, s.jsx)("span", { children: "." }),
            ],
          }),
          (0, s.jsx)("p", {
            children: "Take over a losing program. Build a roster. Give them a reason to believe.",
          }),
        ],
      }),
      (0, s.jsxs)("div", {
        className: "setup-layout",
        children: [
          (0, s.jsxs)("div", {
            children: [
              (0, s.jsxs)("div", {
                className: "section-head",
                children: [
                  (0, s.jsx)("h2", { children: "Choose your rebuild \u2014 all " + REAL_N + " schools" }),
                  (0, s.jsx)("span", {
                    className: "muted",
                    children:
                      "Poor schools: a long road to a title, but low pressure and a long grace period. Rich schools: easier to build a contender, but big win goals and a short leash.",
                  }),
                ],
              }),
              (0, s.jsxs)("div", {
                className: "school-search-row",
                style: { display: "flex", gap: 8, alignItems: "stretch", flexWrap: "wrap" },
                children: [
                  (0, s.jsx)("input", {
                    className: "school-search",
                    style: { flex: "1 1 220px", minWidth: 0 },
                    placeholder: "Search all " + REAL_N + " schools, mascots, conferences or players",
                    value: sq,
                    onChange: (ev) => setSq(ev.target.value),
                  }),
                  (0, s.jsx)("button", {
                    type: "button",
                    className: "btn random-school-btn",
                    title: "Pick any school at random",
                    onClick: () => {
                      // Random school (October 2026): any school, ignoring the search box. Not game logic, so it does not use the seeded generator.
                      const all = tiers.flatMap((g) => g.schools.map((f) => ({ f, tier: g.tier.n })));
                      if (!all.length) return;
                      let k = 0;
                      try { k = crypto.getRandomValues(new Uint32Array(1))[0] % all.length; } catch (e) { k = Date.now() % all.length; }
                      if (all.length > 1 && all[k].f.id === u.id) k = (k + 1) % all.length;
                      const pick = all[k];
                      setSq("");
                      setOp(new Set([pick.tier]));
                      o(pick.f);
                      setTimeout(() => {
                        try {
                          const el = document.querySelector(".school-card.selected");
                          if (el && el.scrollIntoView) el.scrollIntoView({ block: "center", behavior: "smooth" });
                        } catch (e) {}
                      }, 60);
                    },
                    children: "\uD83C\uDFB2 Random school",
                  }),
                ],
              }),
              (0, s.jsx)("div", {
                className: "tier-list",
                children: tiers.map((g) => {
                  let list = ql
                      ? g.schools.filter((f) => `${f.name} ${f.league} ${f.mascot} ${f.city}`.toLowerCase().includes(ql) || pm.has(f.name))
                      : g.schools,
                    isOpen = ql ? list.length > 0 : op.has(g.tier.n);
                  return (0, s.jsxs)(
                    "section",
                    {
                      className: `tier-group ${isOpen ? "open" : ""}`,
                      children: [
                        (0, s.jsxs)("button", {
                          className: "tier-head",
                          onClick: () => {
                            let n = new Set(op);
                            (n.has(g.tier.n) ? n.delete(g.tier.n) : n.add(g.tier.n), setOp(n));
                          },
                          children: [
                            (0, s.jsxs)("span", { className: "tier-num", children: ["TIER ", g.tier.n] }),
                            (0, s.jsx)("strong", { children: g.tier.name }),
                            (0, s.jsx)("span", { className: "tier-range", children: TIER_RANGE[g.tier.n - 1] + " NIL budget" }),
                            (0, s.jsxs)("span", {
                              className: "tier-share",
                              children: [g.schools.length, " schools \xB7 ", g.pct, "% of Division I"],
                            }),
                            (0, s.jsx)("span", { className: "tier-chev", children: isOpen ? "\u25B2" : "\u25BC" }),
                          ],
                        }),
                        isOpen &&
                          (0, s.jsx)("div", {
                            className: "school-grid",
                            children: list.length
                              ? list.map((f) =>
                  (0, s.jsxs)(
                    "button",
                    {
                      className: `school-card ${u.id === f.id ? "selected" : ""}`,
                      style: { "--team": f.color },
                      onClick: () => o(f),
                      children: [
                        (0, s.jsxs)("div", {
                          className: "row between",
                          children: [
                            (0, s.jsx)("div", {
                              className: "crest has-logo",
                              children: (0, s.jsx)(SchoolLogo, { school: f }),
                            }),
                            (0, s.jsx)(he, {
                              tone: /^(Elite|Big)/.test(f.difficulty)
                                ? "red"
                                : /^Mid/.test(f.difficulty)
                                  ? "orange"
                                  : /^(Shoestring|Small)/.test(f.difficulty)
                                    ? "green"
                                    : "",
                              children: f.difficulty,
                            }),
                          ],
                        }),
                        (0, s.jsx)("h3", { children: f.name }),
                        (0, s.jsx)("p", { className: "school-conf", children: f.league }),
                        (0, s.jsxs)("p", {
                          className: "school-mascot",
                          children: [f.mascot, " \xB7 ", f.city],
                        }),
                        (0, s.jsxs)("div", {
                          className: "school-numbers",
                          children: [
                            (0, s.jsxs)("div", {
                              children: [
                                (0, s.jsxs)("strong", { children: [f.wins, "\u2013", W_loss(f)] }),
                                (0, s.jsx)("span", { children: "LAST SEASON" }),
                              ],
                            }),
                            (0, s.jsxs)("div", {
                              children: [
                                (0, s.jsx)("strong", { children: q(f.budget) }),
                                (0, s.jsx)("span", { children: "NIL BUDGET" }),
                              ],
                            }),
                          ],
                        }),
                        pm.has(f.name) && (0, s.jsx)("p", { className: "school-players", style: { color: "#7cc4ff", fontSize: "0.85em" }, children: "Player: " + pm.get(f.name).join("  |  ") }),
                        (0, s.jsx)("p", { className: "school-story", children: f.story }),
                        u.id === f.id &&
                          (0, s.jsxs)("span", {
                            className: "school-selected",
                            children: [(0, s.jsx)(Hl, { size: 14 }), " YOUR PROGRAM"],
                          }),
                      ],
                    },
                    f.id
                  )
                                )
                              : (0, s.jsx)("p", { className: "muted", children: "No schools match." }),
                          }),
                      ],
                    },
                    g.tier.n
                  );
                }),
              }),
            ],
          }),
          (0, s.jsxs)("aside", {
            className: "setup-coach panel",
            children: [
              (0, s.jsx)("p", { className: "eyebrow", children: "THE PERSON ON THE SIDELINE" }),
              (0, s.jsx)("h2", { children: "Make it your program." }),
              (0, s.jsxs)("label", {
                children: [
                  "Coach name",
                  (0, s.jsx)("input", { value: r, maxLength: 32, onChange: (f) => n(f.target.value) }),
                ],
              }),
              (0, s.jsx)("label", { children: "Coaching specialty" }),
              (0, s.jsx)("div", {
                className: "specialties",
                children: Us.map((f) =>
                  (0, s.jsxs)(
                    "button",
                    {
                      className: f === i ? "active" : "",
                      onClick: () => d(f),
                      children: [
                        (0, s.jsx)("span", { children: f }),
                        (0, s.jsx)("small", {
                          children:
                            f === "Recruiting"
                              ? "Win more recruiting battles"
                              : f === "Development"
                                ? "Help young players grow faster"
                                : f === "Offense"
                                  ? "Get more from your offense"
                                  : "Give your defense an edge",
                        }),
                        f === i && (0, s.jsx)(Hl, { size: 17 }),
                      ],
                    },
                    f
                  )
                ),
              }),
              (0, s.jsxs)("div", {
                className: "start-summary",
                children: [
                  (0, s.jsx)("span", { children: "YOUR ASSIGNMENT" }),
                  (0, s.jsxs)("strong", { children: ["Rebuild the ", u.mascot, "."] }),
                  (0, s.jsxs)("p", { children: [u.name, " \xB7 ", u.league, " \xB7 ", W_nilTierText(u.budget)] }),
                  (0, s.jsxs)("p", {
                    children: [
                      "Start in the offseason after ",
                      u.wins,
                      " wins. A random 3\u20135 seniors graduate and 0\u20135 players transfer out. Every rebuild starts differently.",
                    ],
                  }),
                ],
              }),
              (0, s.jsxs)(X, {
                primary: !0,
                className: "full",
                onClick: () => e(u.id, r, i),
                children: [
                  l ? (0, s.jsx)(Ga, { className: "spin", size: 18 }) : (0, s.jsx)(bt, { size: 18 }),
                  "Take the job",
                ],
              }),
              t && (0, s.jsx)(X, { className: "full", onClick: a, children: "Return to current career" }),
              (0, s.jsxs)("p", {
                className: "save-note",
                children: [(0, s.jsx)(Bs, { size: 13 }), "Saves on this computer. Export a backup anytime."],
              }),
            ],
          }),
        ],
      }),
      (0, s.jsx)("p", {
        className: "setup-footer",
        children: "2026\u201327 SEASON \xB7 REAL DIVISION I SCHOOLS \xB7 " + REAL_CONFS.length + " CONFERENCES",
      }),
    ],
  });
}
