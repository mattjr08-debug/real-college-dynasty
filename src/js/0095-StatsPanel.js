function StatsPanel({ g: e, select: a }) {
  let [m, setM] = (0, N.useState)("Per game"),
    [sc, setSc] = (0, N.useState)(e.phase === "Offseason" ? "Last season" : "This season"),
    [k, setK] = (0, N.useState)("pts"),
    pg = m === "Per game",
    tr = (0, N.useRef)(null),
    br = (0, N.useRef)(null),
    inn = (0, N.useRef)(null);
  (0, N.useEffect)(() => {
    let b = br.current,
      t = tr.current,
      i = inn.current;
    if (!b || !t || !i) return;
    let u = () => {
      i.style.width = b.scrollWidth + "px";
    };
    u();
    let x = () => {
        t.scrollLeft !== b.scrollLeft && (t.scrollLeft = b.scrollLeft);
      },
      y = () => {
        b.scrollLeft !== t.scrollLeft && (b.scrollLeft = t.scrollLeft);
      };
    (b.addEventListener("scroll", x), t.addEventListener("scroll", y), window.addEventListener("resize", u));
    let o = new ResizeObserver(u);
    o.observe(b);
    return () => {
      (b.removeEventListener("scroll", x),
        t.removeEventListener("scroll", y),
        window.removeEventListener("resize", u),
        o.disconnect());
    };
  });
  let z0 = () => ({
      gp: 0,
      min: 0,
      pts: 0,
      reb: 0,
      ast: 0,
      stl: 0,
      blk: 0,
      to: 0,
      fgm: 0,
      fga: 0,
      tpm: 0,
      tpa: 0,
      ftm: 0,
      fta: 0,
    }),
    sum = (h) => {
      let t = z0();
      for (let x of h) for (let y in t) t[y] += x[y] || 0;
      return t;
    },
    seasons = (p) =>
      sc === "Career"
        ? [
            ...pHist(e, p).map((x) => ({ y: x.year, team: x.team || "\u2014", t: sum([x.stats]) })),
            ...(p.stats.gp ? [{ y: e.year, team: e.school.name, t: sum([p.stats]) }] : []),
          ]
        : sc === "Last season"
          ? pHist(e, p).length
            ? [
                {
                  y: pHist(e, p).at(-1).year,
                  team: pHist(e, p).at(-1).team || "\u2014",
                  t: sum([pHist(e, p).at(-1).stats]),
                },
              ]
            : []
          : [{ y: e.year, team: e.school.name, t: sum([p.stats]) }],
    cols = [
      ["gp", "GP", (t) => t.gp],
      ["min", "MIN", (t) => (pg ? (t.gp ? t.min / t.gp : 0) : t.min)],
      ["pts", "PTS", (t) => (pg ? (t.gp ? t.pts / t.gp : 0) : t.pts)],
      ["reb", "REB", (t) => (pg ? (t.gp ? t.reb / t.gp : 0) : t.reb)],
      ["ast", "AST", (t) => (pg ? (t.gp ? t.ast / t.gp : 0) : t.ast)],
      ["stl", "STL", (t) => (pg ? (t.gp ? t.stl / t.gp : 0) : t.stl)],
      ["blk", "BLK", (t) => (pg ? (t.gp ? t.blk / t.gp : 0) : t.blk)],
      ["to", "TO", (t) => (pg ? (t.gp ? t.to / t.gp : 0) : t.to)],
      ["fg", "FG%", (t) => (t.fga ? (100 * t.fgm) / t.fga : 0)],
      ["tp", "3P%", (t) => (t.tpa ? (100 * t.tpm) / t.tpa : 0)],
      ["ft", "FT%", (t) => (t.fta ? (100 * t.ftm) / t.fta : 0)],
    ],
    att = { fg: "fga", tp: "tpa", ft: "fta" },
    fm = (c, t) => {
      let v = c[2](t);
      return c[0] === "gp"
        ? String(v)
        : att[c[0]]
          ? t[att[c[0]]]
            ? v.toFixed(1) + "%"
            : "\u2013"
          : pg
            ? t.gp
              ? v.toFixed(1)
              : "\u2013"
            : String(Math.round(v));
    },
    cc = cols.find((z) => z[0] === k) || cols[2],
    blocks = e.roster
      .map((p) => ({ p, ss: seasons(p) }))
      .map((o) => ({ ...o, tot: sum(o.ss.map((x) => x.t)) }))
      .sort((x, y) => cc[2](y.tot) - cc[2](x.tot) || y.p.ovr - x.p.ovr),
    team = (() => {
      let t = z0();
      for (let r of blocks) for (let y in t) t[y] += r.tot[y];
      let u = dl(e);
      t.gp = sc === "This season" ? u.wins + u.losses : Math.max(0, ...blocks.map((r) => r.tot.gp));
      return t;
    })(),
    multi = sc !== "This season";
  return (0, s.jsxs)(qe, {
    title: "Player stats",
    meta: `${sc} \u00B7 ${m}`,
    children: [
      (0, s.jsxs)("div", {
        className: "stat-toggles",
        children: [
          (0, s.jsx)("div", {
            className: "chips",
            children: ["Per game", "Totals"].map((d) =>
              (0, s.jsx)(
                "button",
                { className: d === m ? "active" : "", onClick: () => setM(d), children: d },
                d
              )
            ),
          }),
          (0, s.jsx)("div", {
            className: "chips",
            children: ["This season", "Last season", "Career"].map((d) =>
              (0, s.jsx)(
                "button",
                { className: d === sc ? "active" : "", onClick: () => setSc(d), children: d },
                d
              )
            ),
          }),
        ],
      }),
      (0, s.jsx)("div", { className: "top-scroll", ref: tr, children: (0, s.jsx)("div", { ref: inn }) }),
      (0, s.jsx)("div", {
        className: "table-wrap",
        ref: br,
        children: (0, s.jsxs)("table", {
          className: "stats-table",
          children: [
            (0, s.jsx)("thead", {
              children: (0, s.jsxs)("tr", {
                children: [
                  (0, s.jsx)("th", { children: "PLAYER" }),
                  multi && (0, s.jsx)("th", { children: "SEASON" }),
                  multi && (0, s.jsx)("th", { children: "TEAM" }),
                  cols.map((c) =>
                    (0, s.jsx)(
                      "th",
                      {
                        className: c[0] === k ? "sortable active" : "sortable",
                        title: "Sort by " + c[1],
                        onClick: () => setK(c[0]),
                        children: c[1],
                      },
                      c[0]
                    )
                  ),
                ],
              }),
            }),
            (0, s.jsxs)("tbody", {
              children: [
                blocks.flatMap(({ p: r, ss: q0, tot: t }) => {
                  let head = (0, s.jsxs)(
                    "tr",
                    {
                      className: "clickable-row",
                      onClick: () => a(r.id),
                      children: [
                        (0, s.jsx)("td", {
                          children: (0, s.jsxs)("div", {
                            className: "player-cell",
                            children: [
                              (0, s.jsx)(Ja, { p: r, size: "tiny" }),
                              (0, s.jsxs)("div", {
                                children: [
                                  (0, s.jsx)("strong", { children: r.name }),
                                  (0, s.jsx)("span", {
                                    className: "table-sub",
                                    children: `${r.pos2 ? r.pos + "/" + r.pos2 : r.pos} \u00B7 ${r.ovr} OVR`,
                                  }),
                                ],
                              }),
                            ],
                          }),
                        }),
                        multi &&
                          (0, s.jsx)("td", {
                            children: sc === "Career" ? "Career" : q0[0] ? q0[0].y : "\u2014",
                          }),
                        multi &&
                          (0, s.jsx)("td", {
                            className: "muted",
                            children:
                              sc === "Career"
                                ? q0.length > 1
                                  ? `${q0.length} seasons`
                                  : q0[0]?.team || "\u2014"
                                : q0[0]
                                  ? q0[0].team
                                  : "\u2014",
                          }),
                        cols.map((c) =>
                          (0, s.jsx)("td", { className: c[0] === k ? "hl" : "", children: fm(c, t) }, c[0])
                        ),
                      ],
                    },
                    r.id
                  );
                  return sc === "Career" && q0.length > 1
                    ? [
                        head,
                        ...q0.map((x, i) =>
                          (0, s.jsxs)(
                            "tr",
                            {
                              className: "season-row",
                              onClick: () => a(r.id),
                              children: [
                                (0, s.jsx)("td", {}),
                                (0, s.jsx)("td", { children: x.y }),
                                (0, s.jsx)("td", { className: "muted", children: x.team }),
                                cols.map((c) => (0, s.jsx)("td", { children: fm(c, x.t) }, c[0])),
                              ],
                            },
                            r.id + "-" + i
                          )
                        ),
                      ]
                    : [head];
                }),
                blocks.length > 0 &&
                  sc !== "Career" &&
                  (0, s.jsxs)("tr", {
                    className: "team-row",
                    children: [
                      (0, s.jsx)("td", { children: (0, s.jsx)("strong", { children: "Team" }) }),
                      multi && (0, s.jsx)("td", {}),
                      multi && (0, s.jsx)("td", {}),
                      cols.map((c) =>
                        (0, s.jsx)(
                          "td",
                          {
                            children:
                              c[0] === "gp"
                                ? String(team.gp)
                                : c[0] === "min"
                                  ? pg
                                    ? "200.0"
                                    : String(Math.round(team.min))
                                  : fm(c, team),
                          },
                          c[0]
                        )
                      ),
                    ],
                  }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
