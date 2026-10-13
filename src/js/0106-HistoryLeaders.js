// A table wrapper that shows a second scroll bar ABOVE the table, but only when the table is wider than its box (so a stat would be cut off).
function TopScroll({ children: kids }) {
  const wrap = (0, N.useRef)(null), top = (0, N.useRef)(null), [w, setW] = (0, N.useState)(0), [over, setOver] = (0, N.useState)(!1);
  (0, N.useEffect)(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => { setOver(el.scrollWidth > el.clientWidth + 1); setW(el.scrollWidth); };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => ro.disconnect();
  }, []);
  return (0, s.jsxs)(s.Fragment, {
    children: [
      over && (0, s.jsx)("div", { className: "top-scroll", ref: top, "aria-hidden": "true", onScroll: () => { if (wrap.current && top.current) wrap.current.scrollLeft = top.current.scrollLeft; }, children: (0, s.jsx)("div", { style: { width: w } }) }),
      (0, s.jsx)("div", { className: "table-wrap", ref: wrap, onScroll: () => { if (wrap.current && top.current) top.current.scrollLeft = wrap.current.scrollLeft; }, children: kids }),
    ],
  });
}
function HistoryLeaders({ h: h, g: e, part: part = "Leaders" }) {
  let car = {},
    hi = {};
  for (let x of h)
    for (let p of x.players || []) {
      let t = p.stats,
        c = (car[p.name] = car[p.name] || { n: p.name, pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, tpm: 0 });
      for (let k of ["pts", "reb", "ast", "stl", "blk", "tpm"]) c[k] += t[k] || 0;
      if (t.gp >= 15)
        for (let k of ["pts", "reb", "ast", "stl", "blk", "tpm"])
          (hi[k] = hi[k] || []).push({ n: p.name, y: x.year, v: t[k] / t.gp });
    }
  let cats = [
      ["pts", "Points"],
      ["reb", "Rebounds"],
      ["ast", "Assists"],
      ["stl", "Steals"],
      ["blk", "Blocks"],
      ["tpm", "Three-pointers"],
    ],
    sy = (y) => `${y}–${String(y + 1).slice(2)}`,
    card = (t, rows, em) =>
      (0, s.jsxs)(
        "div",
        {
          className: "team-card",
          children: [
            (0, s.jsx)("h4", { children: t }),
            rows.length
              ? rows.map((r, i) =>
                  (0, s.jsxs)(
                    "div",
                    {
                      className: r[2] === !1 ? "team-row rec" : "team-row",
                      children: [
                        (0, s.jsx)("span", { children: r[2] === !1 ? r[0] : `${i + 1}. ${r[0]}` }),
                        (0, s.jsx)("small", { children: r[1] }),
                      ],
                    },
                    i
                  )
                )
              : (0, s.jsx)("div", {
                  className: "team-row",
                  children: (0, s.jsx)("span", { className: "muted", children: em || "No data yet" }),
                }),
          ],
        },
        t
      ),
    grid = (kids) => (0, s.jsx)("div", { className: "team-grid", style: { padding: "14px 18px" }, children: kids });
  // single-game records: program bests and the current roster's career highs
  if (part === "Game records") {
    let R = (e && e.recs) || {},
      rows = (e?.roster || []).filter((p) => p.hi && Object.keys(p.hi).length);
    return (0, s.jsxs)(s.Fragment, {
      children: [
        (0, s.jsx)(qe, {
          title: "Most in a game",
          meta: "Program single-game records since you took over. They update after every game.",
          children: grid([
            ...cats.map(([k, t]) =>
              card(
                t,
                R[k] ? [[`${R[k].v} · ${R[k].n}`, `vs ${R[k].o} · ${sy(R[k].y)}`, !1]] : [],
                "No games yet"
              )
            ),
            card("Team points", R.team ? [[`${R.team.v} points`, `${R.team.s} vs ${R.team.o} · ${sy(R.team.y)}`, !1]] : [], "No games yet"),
            card("Biggest win", R.margin ? [[`by ${R.margin.v}`, `${R.margin.s} vs ${R.margin.o} · ${sy(R.margin.y)}`, !1]] : [], "No wins yet"),
          ]),
        }),
        (0, s.jsx)(qe, {
          title: "Career highs on your roster",
          meta: "Each current player's best single game with your program.",
          children: rows.length
            ? (0, s.jsx)(TopScroll, {
                children: (0, s.jsxs)("table", {
                  className: "stats-table career-highs-table",
                  children: [
                    (0, s.jsx)("thead", {
                      children: (0, s.jsxs)("tr", {
                        children: [
                          (0, s.jsx)("th", { children: "PLAYER" }),
                          cats.map(([k, t]) => (0, s.jsx)("th", { title: t, children: k === "tpm" ? "3PM" : k.toUpperCase() }, k)),
                        ],
                      }),
                    }),
                    (0, s.jsx)("tbody", {
                      children: rows
                        .sort((x, y) => (y.hi.pts?.v || 0) - (x.hi.pts?.v || 0))
                        .map((p) =>
                          (0, s.jsxs)(
                            "tr",
                            {
                              children: [
                                (0, s.jsx)("td", { children: (0, s.jsx)("strong", { children: p.name }) }),
                                cats.map(([k]) =>
                                  (0, s.jsx)(
                                    "td",
                                    {
                                      title: p.hi[k] ? `vs ${p.hi[k].o}, ${sy(p.hi[k].y)}` : "",
                                      children: p.hi[k] ? p.hi[k].v : "—",
                                    },
                                    k
                                  )
                                ),
                              ],
                            },
                            p.id
                          )
                        ),
                    }),
                  ],
                }),
              })
            : (0, s.jsx)(yl, { title: "No games played yet", body: "Career highs appear after your first game." }),
        }),
      ],
    });
  }
  if (!h.length)
    return (0, s.jsx)(yl, {
      title: "No completed seasons yet",
      body: part === "Best seasons" ? "Best single seasons appear after your first season." : "Career leaders appear after your first season.",
    });
  return part === "Best seasons"
    ? (0, s.jsx)(qe, {
        title: "Best single seasons",
        meta: "Per-game averages, minimum 15 games. Top 10 in each category.",
        children: grid(
          cats.map(([k, t]) =>
            card(
              t + " per game",
              (hi[k] || [])
                .sort((x, y) => y.v - x.v)
                .slice(0, 10)
                .map((x) => [x.n, `${x.v.toFixed(1)} · ${sy(x.y)}`])
            )
          )
        ),
      })
    : (0, s.jsx)(qe, {
        title: "Career leaders",
        meta: "Totals while playing for your program.",
        children: grid(
          cats.map(([k, t]) =>
            card(
              t,
              Object.values(car)
                .sort((x, y) => y[k] - x[k])
                .filter((x) => x[k] > 0)
                .slice(0, 5)
                .map((x) => [x.n, String(Math.round(x[k]))])
            )
          )
        ),
      });
}
