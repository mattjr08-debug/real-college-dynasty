function DiagPanel({ g: e }) {
  let R = e.opponents.map((t) => t.rating),
    mean = R.reduce((x, y) => x + y, 0) / R.length,
    sd = Math.sqrt(R.reduce((x, y) => x + (y - mean) ** 2, 0) / R.length),
    gm = e.schedule.filter((f) => f.played && f.box),
    n = gm.length || 1,
    S = (k) => gm.reduce((x, f) => x + f.box.reduce((y, b) => y + (b[k] || 0), 0), 0),
    pc = (m, a) => (a ? ((100 * m) / a).toFixed(1) + "%" : "\u2014"),
    mg = gm.map((f) => f.us - f.them),
    mm = mg.length ? mg.reduce((x, y) => x + y, 0) / mg.length : 0,
    msd = mg.length ? Math.sqrt(mg.reduce((x, y) => x + (y - mm) ** 2, 0) / mg.length) : 0,
    hw = gm.filter((f) => f.venue === "Home"),
    aw = gm.filter((f) => f.venue === "Away"),
    ai = e.opponents.filter((t) => t.wins + t.losses > 0),
    aip = ai.length
      ? ai.reduce(
          (x, t) => x + (e.rosters[t.id] || []).reduce((y, p) => y + p.s.p, 0) / (t.wins + t.losses),
          0
        ) / ai.length
      : 0,
    aia = ai.length
      ? ai.reduce(
          (x, t) => x + (e.rosters[t.id] || []).reduce((y, p) => y + p.s.a, 0) / (t.wins + t.losses),
          0
        ) / ai.length
      : 0,
    air = ai.length
      ? ai.reduce(
          (x, t) => x + (e.rosters[t.id] || []).reduce((y, p) => y + p.s.r, 0) / (t.wins + t.losses),
          0
        ) / ai.length
      : 0,
    inj = e.news.filter((z) => z.title === "Injury report").length,
    ihs = e.roster.reduce((x, p) => x + ((p.ih && p.ih.n) || 0), 0),
    h = e.history,
    dr = e.draftLog && e.draftLog[0],
    rows = [
      ["Teams in the league", String(R.length + 1), `${R.length + 1} teams in ${(e.confs || []).length} conferences of ${[...new Set((e.confs || []).map((g) => g.length))].sort((x, y) => x - y).join("/")} teams`],
      [
        "Team rating mean / spread",
        `${mean.toFixed(1)} / ${sd.toFixed(1)}`,
        "Spread of about 10 to 12 keeps upsets believable",
      ],
      ["Your points per game", gm.length ? (S("pts") / n).toFixed(1) : "\u2014", "Real college: about 72"],
      [
        "Opponent points per game",
        gm.length ? (gm.reduce((x, f) => x + f.them, 0) / n).toFixed(1) : "\u2014",
        "Real college: about 72",
      ],
      ["Field goal %", pc(S("fgm"), S("fga")), "Real: 44 to 46%"],
      [
        "Three-point % / share of shots",
        `${pc(S("tpm"), S("tpa"))} / ${pc(S("tpa"), S("fga"))}`,
        "Real: about 34% on about 38% of shots",
      ],
      [
        "Free throw % / attempts",
        `${pc(S("ftm"), S("fta"))} / ${(S("fta") / n).toFixed(1)}`,
        "Real: about 70% on about 20",
      ],
      [
        "Turnovers / fouls per game",
        `${(S("to") / n).toFixed(1)} / ${(S("pf") / n).toFixed(1)}`,
        "Real: about 12.5 turnovers, about 17 fouls",
      ],
      [
        "Rebounds / assists per game",
        `${(S("reb") / n).toFixed(1)} / ${(S("ast") / n).toFixed(1)}`,
        "Real: about 35 and about 13.5",
      ],
      [
        "Steals / blocks per game",
        `${(S("stl") / n).toFixed(1)} / ${(S("blk") / n).toFixed(1)}`,
        "Real: about 6.5 and about 3.5",
      ],
      [
        "Average margin / spread",
        gm.length ? `${mm.toFixed(1)} / ${msd.toFixed(1)}` : "\u2014",
        "Spread of about 11 to 13 is normal",
      ],
      [
        "Home vs. away win %",
        `${hw.length ? Math.round((100 * hw.filter((f) => f.win).length) / hw.length) : "\u2014"}% / ${aw.length ? Math.round((100 * aw.filter((f) => f.win).length) / aw.length) : "\u2014"}%`,
        "Home teams win about 60% of the time",
      ],
      [
        "Other teams: points, assists, rebounds a game",
        ai.length ? `${aip.toFixed(1)}, ${aia.toFixed(1)}, ${air.toFixed(1)}` : "\u2014",
        "Same engine as your games, top nine players tracked",
      ],
      [
        "Injuries this season / career injuries on roster",
        `${inj} / ${ihs}`,
        "Minutes, age, stamina and history all raise the risk",
      ],
      [
        "National tournament trips",
        `${h.filter((x) => /berth/.test(x.bt || "")).length} of ${h.length} seasons`,
        "Field is about a third of all teams",
      ],
      [
        "Draft: freshmen share",
        dr && dr.stat ? dr.stat.replace("Freshmen: ", "") : "\u2014",
        "Target 55 to 80% of the lottery, 40 to 60% of the first round",
      ],
    ];
  let main = (0, s.jsx)(qe, {
    title: "Diagnostics",
    meta: "Live checks on the simulation so you can see how it compares with real basketball.",
    children: (0, s.jsx)("div", {
      className: "table-wrap",
      children: (0, s.jsxs)("table", {
        children: [
          (0, s.jsx)("thead", {
            children: (0, s.jsx)("tr", {
              children: ["CHECK", "THIS GAME", "WHAT TO EXPECT"].map((z) =>
                (0, s.jsx)("th", { children: z }, z)
              ),
            }),
          }),
          (0, s.jsx)("tbody", {
            children: rows.map((r) =>
              (0, s.jsxs)(
                "tr",
                {
                  children: [
                    (0, s.jsx)("td", { children: r[0] }),
                    (0, s.jsx)("td", { children: (0, s.jsx)("strong", { children: r[1] }) }),
                    (0, s.jsx)("td", { className: "muted", children: r[2] }),
                  ],
                },
                r[0]
              )
            ),
          }),
        ],
      }),
    }),
  });
  return (0, s.jsxs)(s.Fragment, { children: [main, (0, s.jsx)(PerfPanel, {})] });
}
// Slowest recent actions from the performance log (see perfRecord in 0060-group-Gn.js)
function PerfPanel() {
  let [, bump] = (0, N.useState)(0),
    slow = perfSlowest(12),
    total = perfLog.length,
    when = (t) => {
      let d = new Date(t);
      return isNaN(d) ? "" : d.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", second: "2-digit" });
    };
  return (0, s.jsx)(qe, {
    title: "Performance log",
    meta: `The slowest of the last ${total} actions (most recent 200 are kept). If the game ever feels slow, this shows which action it was and when.`,
    children: (0, s.jsxs)("div", {
      className: "table-wrap",
      children: [
        (0, s.jsxs)("table", {
          children: [
            (0, s.jsx)("thead", {
              children: (0, s.jsx)("tr", {
                children: ["ACTION", "TIME TAKEN", "WHEN", "SAVE SIZE"].map((z) => (0, s.jsx)("th", { children: z }, z)),
              }),
            }),
            (0, s.jsx)("tbody", {
              children: slow.length
                ? slow.map((r, i) =>
                    (0, s.jsxs)(
                      "tr",
                      {
                        children: [
                          (0, s.jsx)("td", { children: r.action }),
                          (0, s.jsx)("td", {
                            children: (0, s.jsx)("strong", { children: r.ms >= 1000 ? `${(r.ms / 1000).toFixed(1)} s` : `${r.ms} ms` }),
                          }),
                          (0, s.jsx)("td", { className: "muted", children: when(r.at) }),
                          (0, s.jsx)("td", { className: "muted", children: r.kb ? `${r.kb} KB` : "—" }),
                        ],
                      },
                      r.at + i
                    )
                  )
                : (0, s.jsx)("tr", {
                    children: (0, s.jsx)("td", { colSpan: 4, className: "muted", children: "Nothing recorded yet. Play a few games and come back." }),
                  }),
            }),
          ],
        }),
        (0, s.jsx)("button", {
          className: "btn small",
          onClick: () => (perfClear(), bump((n) => n + 1)),
          children: "Clear the log",
        }),
      ],
    }),
  });
}
