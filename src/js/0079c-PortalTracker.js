// Item 45: portal tracker (League news > Transfer portal). Everyone who entered and where he signed, the top transfers,
// and what each school needs. The entrant list covers the best TUNE.portalShow entrants; the rest are counted in e.pst.
function PortalTracker({ g: e }) {
  let [v, setV] = (0, N.useState)("Entrants"),
    P = e.prospects.filter((q) => q.fid),
    tn = (id) => (e.opponents.find((z) => z.id === id) || {}).name || (id === e.school.id ? e.school.name : "?"),
    out = (q) =>
      q.status === "Available"
        ? "In the portal"
        : q.status === "Signed"
          ? `Signed with ${e.school.name}`
          : q.committedTo === "Left college basketball"
            ? "Left college basketball"
            : q.committedTo === tn(q.fid)
              ? `Withdrew, back at ${q.committedTo}`
              : `Signed with ${q.committedTo}`,
    landed = (q) => q.status === "Signed" || (q.status === "Committed elsewhere" && q.committedTo && q.committedTo !== "Left college basketball"),
    all = [...P].sort((a, b) => b.ovr - a.ovr),
    top = all.filter(landed).slice(0, 25),
    lost = {};
  P.forEach((q) => (lost[q.fid] = (lost[q.fid] || 0) + 1));
  let needs =
      v === "School needs"
        ? e.opponents
            .map((t) => {
              let R = e.rosters[t.id] || [],
                ps = ["PG", "SG", "SF", "PF", "C"].map((p) => {
                  let m = Math.max(0, ...R.filter((z) => z.p === p).map((z) => z.o));
                  return { p, m, d: t.rating - m };
                }).sort((a, b) => b.d - a.d);
              return { t, R, need: ps[0], lost: lost[t.id] || 0 };
            })
            .sort((a, b) => b.need.d - a.need.d)
        : [],
    st = e.pst || {},
    sum = (k) => ["hidden", "shown", "released"].reduce((n, g) => n + ["power", "other"].reduce((m, c) => m + ((((st[g] || {})[c]) || {})[k] || 0), 0), 0),
    N0 = sum("n"),
    Lv = sum("leave"),
    Bk = sum("back"),
    th = (a) => a.map((z) => (0, s.jsx)("th", { children: z }, z)),
    table = (head, rows) =>
      (0, s.jsx)("div", {
        className: "table-wrap",
        children: (0, s.jsxs)("table", {
          children: [
            (0, s.jsx)("thead", { children: (0, s.jsx)("tr", { children: th(head) }) }),
            (0, s.jsx)("tbody", {
              children: rows.map((r, i) =>
                (0, s.jsx)("tr", { children: r.map((c, k) => (0, s.jsx)("td", { children: c }, k)) }, i)
              ),
            }),
          ],
        }),
      });
  return (0, s.jsxs)(s.Fragment, {
    children: [
      (0, s.jsx)("div", {
        className: "toolbar",
        children: (0, s.jsx)("div", {
          className: "chips",
          children: ["Entrants", "Top transfers", "School needs"].map((n) =>
            (0, s.jsx)("button", { className: n === v ? "active" : "", onClick: () => setV(n), children: n }, n)
          ),
        }),
      }),
      (0, s.jsx)(qe, {
        title: "Transfer portal tracker",
        meta: P.length
          ? `${N0 ? `About ${N0} players entered the portal this year: ${Math.round(((N0 - Lv - Bk) / N0) * 100)}% found a new school, ${Math.round((Lv / N0) * 100)}% left college basketball, ${Math.round((Bk / N0) * 100)}% withdrew. ` : ""}The list below covers the best ${P.length}.`
          : "No portal this year yet. It opens right after the season ends.",
        children:
          v === "Entrants"
            ? table(
                ["PLAYER", "POS", "OVR", "FROM", "WHY HE ENTERED", "WHERE HE ENDED UP"],
                all.map((q) => [q.name, q.pos, q.ovr, tn(q.fid), q.why || "", out(q)])
              )
            : v === "Top transfers"
              ? table(
                  ["#", "PLAYER", "POS", "OVR", "FROM", "NEW SCHOOL"],
                  top.map((q, i) => [i + 1, q.name, q.pos, q.ovr, tn(q.fid), q.status === "Signed" ? e.school.name : q.committedTo])
                )
              : table(
                  ["SCHOOL", "RATING", "BIGGEST NEED", "BEST AT THAT SPOT", "ENTRANTS SHOWN FROM HERE"],
                  needs.map((z) => [z.t.name, z.t.rating, z.need.p, z.need.m || "none", z.lost])
                ),
      }),
    ],
  });
}
