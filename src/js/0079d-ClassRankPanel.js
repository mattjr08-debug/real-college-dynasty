// Item 50: recruiting class rankings (League news > Recruiting classes). Every school's incoming high school class is scored like the
// recruiting services do: each commit is worth points by stars plus his rating, and later commits count a little less (0.96 per place),
// so a few stars beat many bargains. The class is read from the prospect pool (committedTo), so it moves live during recruiting.
// The finished class of each year is stored for you in e.classHist (written by W_off).
function W_classPts(p) {
  return ({ 5: 100, 4: 46, 3: 20, 2: 8, 1: 3 }[p.stars] ?? 1) + Math.max(0, p.ovr - 60) * 0.4;
}
// Players who have not picked a school yet (two stars and up) are counted at the school W_off will send them to (W_dest is a fixed
// function of the player and the year), so the AI classes are not half empty while recruiting is still open. yr = the year W_off will use.
function W_classRank(e, yr) {
  let by = {},
    sh = { opponents: e.opponents, year: yr ?? e.year + 1 };
  for (let p of e.prospects) {
    if (p.origin !== "High school") continue;
    let to =
      p.committedTo && p.status !== "Available"
        ? p.committedTo
        : p.status === "Available" && !p.committedTo && p.stars >= 2
          ? (W_dest(sh, p) || {}).name
          : null;
    to && to !== "Left college basketball" && (by[to] ||= []).push(p);
  }
  let teams = [
      { id: e.school.id, name: e.school.name, conf: 0 },
      ...e.opponents.filter((t) => t.id !== e.school.id).map((t) => ({ id: t.id, name: t.name, conf: t.conf ?? 0 })),
    ],
    rows = teams.map((t) => {
      let L = (by[t.name] || []).map((p) => ({ p, v: W_classPts(p) })).sort((a, b) => b.v - a.v);
      return {
        ...t,
        n: L.length,
        score: Math.round(L.reduce((x, z, i) => x + z.v * Math.pow(0.96, i), 0)),
        five: L.filter((z) => z.p.stars === 5).length,
        four: L.filter((z) => z.p.stars === 4).length,
        avg: L.length ? L.reduce((x, z) => x + (z.p.stars || 0), 0) / L.length : 0,
        best: L[0] ? L[0].p : null,
        list: L.map((z) => z.p),
      };
    });
  rows.sort((a, b) => b.score - a.score || b.n - a.n);
  rows.forEach((r, i) => (r.nat = i + 1));
  let cn = {};
  rows.forEach((r) => ((cn[r.conf] = (cn[r.conf] || 0) + 1), (r.cr = cn[r.conf])));
  return { rows, me: rows.find((r) => r.id === e.school.id) };
}
function ClassRankPanel({ g: e }) {
  let [v, setV] = (0, N.useState)("National"),
    R = W_classRank(e),
    me = R.me,
    th = (a) => a.map((z) => (0, s.jsx)("th", { children: z }, z)),
    table = (head, rows) =>
      (0, s.jsx)("div", {
        className: "table-wrap",
        children: (0, s.jsxs)("table", {
          children: [
            (0, s.jsx)("thead", { children: (0, s.jsx)("tr", { children: th(head) }) }),
            (0, s.jsx)("tbody", {
              children: rows.map((r, i) =>
                (0, s.jsx)("tr", { className: r.you ? "you-row" : "", children: r.c.map((c, k) => (0, s.jsx)("td", { children: c }, k)) }, i)
              ),
            }),
          ],
        }),
      }),
    cname = (c) => (e.confNames || [])[c] || "",
    line = (r) => ({
      you: r.id === e.school.id,
      c: [
        r.nat,
        r.name,
        cname(r.conf),
        r.score,
        r.n,
        `${r.five} / ${r.four}`,
        r.best ? `${r.best.name} (${r.best.stars}★ ${r.best.pos})` : "—",
      ],
    }),
    head = ["#", "SCHOOL", "CONFERENCE", "SCORE", "COMMITS", "5★ / 4★", "TOP RECRUIT"],
    hist = e.classHist || [];
  return (0, s.jsx)(qe, {
    title: "Recruiting classes",
    meta: "Every school's incoming high school class, scored by stars and rating. Players who have not decided yet are counted at the school they are heading to, so it moves while recruiting is open.",
    children: (0, s.jsxs)("div", {
      style: { padding: "10px 16px" },
      children: [
        me &&
          (0, s.jsx)("p", {
            children: `Your class: #${me.nat} nationally and #${me.cr} in your conference · score ${me.score} · ${me.n} high school commit${me.n === 1 ? "" : "s"} (${me.five} five-star, ${me.four} four-star).`,
          }),
        (0, s.jsx)("div", {
          className: "chips",
          children: ["National", "Your conference", "Your history"].map((d) =>
            (0, s.jsx)("button", { className: d === v ? "active" : "", onClick: () => setV(d), children: d }, d)
          ),
        }),
        v === "National" && table(head, R.rows.slice(0, 25).map(line).concat(me && me.nat > 25 ? [line(me)] : [])),
        v === "Your conference" &&
          table(
            head,
            R.rows.filter((r) => r.conf === 0).map((r) => ({ ...line(r), c: [r.cr, ...line(r).c.slice(1)] }))
          ),
        v === "Your history" &&
          (hist.length
            ? table(
                ["CLASS", "SCHOOL", "NATIONAL", "CONFERENCE", "SCORE", "COMMITS", "5★ / 4★"],
                [...hist].reverse().map((h) => ({
                  c: [`${h.y}–${String(h.y + 1).slice(2)}`, h.school, `#${h.nat}`, `#${h.cr}`, h.score, h.n, `${h.five} / ${h.four}`],
                }))
              )
            : (0, s.jsx)("p", {
                className: "muted",
                children: "Your finished classes are listed here after each offseason rollover.",
              })),
      ],
    }),
  });
}
