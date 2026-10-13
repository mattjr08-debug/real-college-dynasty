function Top25Panel({ g: e }) {
  let t = W_top25(e),
    me = e.school.id,
    myConf = (e.league[0] || {}).conf ?? 0,
    gp = e.schedule.filter((f) => f.played).length;
  return (0, s.jsx)(qe, {
    title: "Top 25",
    meta: gp
      ? `Poll after week ${W_poll(e).w}. Ranked by record and team strength, but the voters move slowly: one loss costs a few spots, and the preseason ranking fades over the first month.`
      : "Preseason poll: team strength plus last year's reputation, so big programs start high.",
    children: (0, s.jsx)(DataTable, {
      columns: [
        { key: "rank", label: "#" },
        {
          key: "chg",
          label: "MOVE",
          num: !1,
          get: (x) => (x.pre ? 0 : x.chg || 0),
          render: (x) =>
            x.pre || !x.chg
              ? "–"
              : (0, s.jsx)("span", { className: "move-arrow " + (x.chg > 0 ? "up" : "down"), children: (x.chg > 0 ? "▲ " : "▼ ") + Math.abs(x.chg) }),
          className: "muted",
        },
        {
          key: "name",
          label: "TEAM",
          render: (x) =>
            (0, s.jsxs)("span", {
              className: "team-cell",
              children: [
                (0, s.jsx)("span", { className: "team-logo", children: (0, s.jsx)(SchoolLogo, { school: x.id === me ? e.school : hqOppSchool(x) }) }),
                (0, s.jsx)("strong", { children: x.name }),
              ],
            }),
        },
        { key: "rec", label: "RECORD", num: !0, get: (x) => x.wins - x.losses, render: (x) => `${x.wins}–${x.losses}` },
        {
          key: "net",
          label: "NET RTG",
          num: !0,
          get: (x) => (x.po ? W_eff(x).net : -999),
          render: (x) => (x.po ? (W_eff(x).net >= 0 ? "+" : "") + W_eff(x).net.toFixed(1) : "–"),
        },
        { key: "rating", label: "RATING", num: !0 },
        { key: "conf", label: "CONFERENCE", get: (x) => (e.confNames || [])[x.conf ?? 0] || "", className: "muted" },
      ],
      rows: t.map((x, i) => ({ ...x, rank: i + 1 })),
      rowClass: (x) => (x.id === me ? "you-row" : ""),
      filters: [
        { label: "Your conference", test: (x) => (x.conf ?? 0) === myConf },
        { label: "Top 10", test: (x) => x.rank <= 10 },
      ],
    }),
  });
}
