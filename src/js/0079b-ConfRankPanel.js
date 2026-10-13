function ConfRankPanel({ g: e }) {
  let all = W_all(e),
    top = new Set(W_top25(e).map((x) => x.id)),
    bids = {},
    pf = W_field(e, !0),
    pn = (pf.field.forEach((x) => (bids[x.conf ?? 0] = (bids[x.conf ?? 0] || 0) + 1)), 0),
    mine = (e.league[0] || {}).conf ?? 0,
    rows = (e.confNames || [])
      .map((name, ci) => {
        let T = all.filter((x) => (x.conf ?? 0) === ci);
        return {
          ci,
          name,
          n: T.length,
          score: T.length ? T.reduce((a, x) => a + W_score(x), 0) / T.length : 0,
          rating: T.length ? T.reduce((a, x) => a + x.rating, 0) / T.length : 0,
          wins: T.reduce((a, x) => a + x.wins, 0),
          losses: T.reduce((a, x) => a + x.losses, 0),
          t25: T.filter((x) => top.has(x.id)).length,
          bids: bids[ci] || 0,
        };
      })
      .filter((r) => r.n)
      .sort((a, b) => b.score - a.score);
  return (0, s.jsx)(qe, {
    title: "Conference ranking",
    meta: "Conferences ranked by the average strength and record of their teams. Leagues have different sizes; the strong ones send many teams to the tournament and the weak ones only their champion. Your conference is highlighted.",
    children: (0, s.jsx)("div", {
      className: "table-wrap",
      children: (0, s.jsxs)("table", {
        children: [
          (0, s.jsx)("thead", {
            children: (0, s.jsx)("tr", {
              children: ["#", "CONFERENCE", "TEAMS", "AVG RATING", "RECORD", "TOP 25 TEAMS", "PROJECTED BIDS"].map((z) =>
                (0, s.jsx)("th", { children: z }, z)
              ),
            }),
          }),
          (0, s.jsx)("tbody", {
            children: rows.map((r, i) =>
              (0, s.jsxs)(
                "tr",
                {
                  className: r.ci === mine ? "you-row" : "",
                  children: [
                    (0, s.jsx)("td", { children: i + 1 }),
                    (0, s.jsx)("td", { children: (0, s.jsx)("strong", { children: r.name }) }),
                    (0, s.jsx)("td", { children: r.n }),
                    (0, s.jsx)("td", { children: r.rating.toFixed(1) }),
                    (0, s.jsx)("td", { children: `${r.wins}–${r.losses}` }),
                    (0, s.jsx)("td", { children: r.t25 }),
                    (0, s.jsx)("td", { children: r.bids === 1 ? "1 (one-bid league)" : r.bids }),
                  ],
                },
                r.ci
              )
            ),
          }),
        ],
      }),
    }),
  });
}
