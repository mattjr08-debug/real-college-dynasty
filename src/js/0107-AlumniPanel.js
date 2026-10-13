// A former player's favorite key: name + the year he left (stored in e.favAlum).
const alumKey = (a) => `${a.n}|${a.y}`;
function AlumniPanel({ g: e, part: part, run: run }) {
  const [adding, setAdding] = (0, N.useState)(!1),
    [q, setQ] = (0, N.useState)(""),
    // rows stay on the tab after an unfavorite until you leave it, so a mis-click can be undone
    [kept, setKept] = (0, N.useState)(() => new Set(e.favAlum || []));
  (0, N.useEffect)(() => {
    if (!adding) return;
    const h = (ev) => ev.key === "Escape" && (ev.stopPropagation(), setAdding(!1));
    return (document.addEventListener("keydown", h, !0), () => document.removeEventListener("keydown", h, !0));
  }, [adding]);
  let al = e.alumni || [],
    favs = new Set(e.favAlum || []),
    toggle = (a) => {
      favs.has(alumKey(a)) || setKept((k) => new Set(k).add(alumKey(a)));
      run && run({ type: "favAlum", key: alumKey(a) });
    },
    star = (a) =>
      (0, s.jsx)("button", {
        type: "button",
        className: "fav-star" + (favs.has(alumKey(a)) ? " on" : ""),
        "aria-label": (favs.has(alumKey(a)) ? "Unfavorite " : "Favorite ") + a.n,
        "aria-pressed": favs.has(alumKey(a)),
        title: favs.has(alumKey(a)) ? "Unfavorite" : "Favorite",
        onClick: () => toggle(a),
        children: favs.has(alumKey(a)) ? "★" : "☆",
      }),
    aw = {};
  (e.history || []).forEach((x) =>
    (x.awards || []).forEach((o) =>
      o.list.forEach((p) => {
        p.you && (aw[p.n] = (aw[p.n] || 0) + 1);
      })
    )
  );
  let ret = al.filter((a) => a.pts >= 1200 || (aw[a.n] || 0) >= 2),
    dr = al.filter((a) => /Drafted/.test(a.fate)),
    cls = [...(e.classes || [])].sort((a, b) => b.avg - a.avg || b.fives - a.fives).slice(0, 5),
    // where he plays now and what he is averaging this season (other teams' players are compact: s = stats)
    // players who turned pro (drafted or signed) play for a professional team; the others are looked up on college rosters (by id when we have it, so a common name cannot match the wrong player)
    find = (a) => {
      for (let [id, R] of Object.entries(e.rosters || {})) {
        let p = R.find((z) => (a.id ? z.i === a.id : z.n === a.n));
        if (p) return { p: p, t: e.opponents.find((z) => z.id === id) };
      }
      return null;
    },
    now = (a) => {
      const pro = W_proTeam(e, a);
      if (pro) return pro.text;
      let f = find(a);
      return f ? `${f.t ? f.t.name : "another school"} \u00B7 ${f.p.o} OVR` : null;
    },
    avg = (a) => {
      const pro = W_proTeam(e, a);
      if (pro) {
        // he is picked in the draft at the rollover after the season he left (year a.y + 1); that year's season is his first as a pro
        const n = e.year - (a.y + 1) + 1;
        return e.phase === "Offseason" && n <= 1 ? "Just signed" : `Pro season ${Math.max(1, n)}`;
      }
      let f = find(a);
      if (!f) return "\u2014";
      let st = f.p.s || {},
        g = st.g || 0,
        pg = (v) => ((v || 0) / g).toFixed(1);
      return g
        ? `${pg(st.p)} pts \u00B7 ${pg(st.r)} reb \u00B7 ${pg(st.a)} ast (${g} g)`
        : "No games yet this season";
    },
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
                      className: "team-row",
                      children: [
                        (0, s.jsxs)("span", { children: [r[2] ? star(r[2]) : null, r[0]] }),
                        (0, s.jsx)("small", { children: r[1] }),
                      ],
                    },
                    i
                  )
                )
              : (0, s.jsx)("div", {
                  className: "team-row",
                  children: (0, s.jsx)("span", { className: "muted", children: em }),
                }),
          ],
        },
        t
      );
  let fTable = (list) =>
      (0, s.jsx)("div", {
        className: "table-wrap",
        children: (0, s.jsxs)("table", {
          children: [
            (0, s.jsx)("thead", {
              children: (0, s.jsx)("tr", {
                children: ["★", "PLAYER", "POS", "LEFT", "CAREER WITH YOU", "WHAT HAPPENED", "NOW", "AVERAGING NOW"].map((z, i) =>
                  (0, s.jsx)("th", { children: z, "aria-label": i ? undefined : "Favorite" }, i)
                ),
              }),
            }),
            (0, s.jsx)("tbody", {
              children: list.map((a) =>
                (0, s.jsxs)(
                  "tr",
                  {
                    children: [
                      (0, s.jsx)("td", { children: star(a) }),
                      (0, s.jsx)("td", { children: a.n }),
                      (0, s.jsx)("td", { children: a.pos }),
                      (0, s.jsx)("td", { children: a.y }),
                      (0, s.jsx)("td", {
                        children: `${(a.pts / Math.max(1, a.gp)).toFixed(1)} pts · ${(a.reb / Math.max(1, a.gp)).toFixed(1)} reb · ${a.seasons} yr`,
                      }),
                      (0, s.jsx)("td", { children: a.fate }),
                      (0, s.jsx)("td", { className: "muted", children: now(a) || "—" }),
                      (0, s.jsx)("td", { children: avg(a) }),
                    ],
                  },
                  alumKey(a)
                )
              ),
            }),
          ],
        }),
      }),
    shown = [...al].reverse().filter((a) => kept.has(alumKey(a)) || favs.has(alumKey(a))),
    allRows = [...al].reverse().filter((a) => !q.trim() || a.n.toLowerCase().includes(q.trim().toLowerCase()));
  return (0, s.jsxs)(s.Fragment, {
    children: [
      part !== "former" &&
        (0, s.jsx)(qe, {
          title: "Program honors",
          meta: "Retired jerseys go to players with 1,200 career points or two awards.",
          children: (0, s.jsxs)("div", {
            className: "team-grid",
            style: { padding: "14px 18px" },
            children: [
              card(
                "Retired jerseys",
                ret.map((a) => [a.n, `${a.pts} pts \u00B7 ${a.seasons} seasons`, a]),
                "None yet"
              ),
              card(
                "Draft picks",
                dr.map((a) => [a.n, a.fate.replace("Drafted \u00B7 ", "") + ` \u00B7 ${a.y} \u00B7 ${(W_proTeam(e, a) || {}).team || ""}`, a]),
                "No draft picks yet"
              ),
              card(
                "Best recruiting classes",
                cls.map((c) => [
                  `${c.y} class`,
                  `avg ${c.avg} OVR \u00B7 ${c.fives} five-star${c.fives === 1 ? "" : "s"}`,
                ]),
                "Finish a season to see classes"
              ),
            ],
          }),
        }),
      part !== "honors" &&
        (0, s.jsxs)(qe, {
          title: "Former players",
          meta: "The former players you follow. Use Add favorites to pick them.",
          children: [
            (0, s.jsxs)("div", {
              className: "fav-bar",
              children: [
                (0, s.jsx)("button", { type: "button", className: "btn", onClick: () => setAdding(!0), children: "Add favorites" }),
                (0, s.jsx)("span", { className: "muted", children: `${favs.size} favorite${favs.size === 1 ? "" : "s"}` }),
              ],
            }),
            shown.length
              ? fTable(shown)
              : (0, s.jsx)(yl, {
                  title: al.length ? "No favorites yet" : "No former players yet",
                  body: al.length
                    ? `You have ${al.length} former player${al.length === 1 ? "" : "s"}. Add the ones you want to follow.`
                    : "Graduates, draft picks and transfers will show up here. Then you can favorite the ones you want to follow.",
                }),
          ],
        }),
      part !== "honors" &&
        adding &&
        (0, s.jsxs)("div", {
          className: "table-overlay",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": "Add favorites",
          children: [
            (0, s.jsx)("button", { type: "button", className: "table-close btn", onClick: () => setAdding(!1), children: "Close (Esc)" }),
            (0, s.jsx)("h3", { children: `Add favorites \u00B7 ${favs.size} favorited` }),
            (0, s.jsx)("input", {
              type: "search",
              className: "fav-search",
              placeholder: "Search by name",
              "aria-label": "Search former players by name",
              value: q,
              onChange: (ev) => setQ(ev.target.value),
              autoFocus: !0,
            }),
            allRows.length
              ? fTable(allRows)
              : (0, s.jsx)("p", { className: "muted", children: "No former players match." }),
          ],
        }),
    ],
  });
}
