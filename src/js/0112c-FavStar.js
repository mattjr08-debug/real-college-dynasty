// Favorite players: a star on player boxes (your roster cards, other teams' rosters and cards, recruit cards).
// Your own and other teams' players are kept in e.favPlayers by player id (a favorite stays a favorite when he transfers or leaves).
// On recruit boxes the star is the existing recruiting bookmark (target), which Auto-recruit and auto-scout already use.
function FavStar({ p, prospect = !1, g, className = "" }) {
  const id = p.id ?? p.i,
    on = prospect ? !!p.target : g ? (g.favPlayers || []).includes(id) : !!(window.__favs && window.__favs.has(id)),
    label = (on ? "Unfavorite " : "Favorite ") + (p.name || p.n || "player"),
    act = (ev) => {
      ev.stopPropagation();
      ev.preventDefault();
      window.__favRun && window.__favRun(prospect ? { type: "target", id } : { type: "favPlayer", id });
    };
  return (0, s.jsx)("span", {
    role: "button",
    tabIndex: 0,
    className: `fav-star ${className}${on ? " on" : ""}`,
    "aria-pressed": on,
    "aria-label": label,
    title: on ? "Unfavorite" : prospect ? "Favorite (bookmark this recruit)" : "Favorite",
    onClick: act,
    onKeyDown: (ev) => {
      if (ev.key === "Enter" || ev.key === " ") act(ev);
    },
    children: on ? "\u2605" : "\u2606",
  });
}
// Where is a favorite now? Your roster, another team's roster, a recruit or portal player, or someone who left a team this offseason.
function W_favWhere(g, id) {
  const own = (g.roster || []).find((p) => p.id === id);
  if (own) return { id, n: own.name, pos: own.pos, cls: xS[Math.max(0, Math.min(3, own.year - 1))], ovr: own.ovr, where: g.school.name + " (your team)", own: !0 };
  for (const t of g.opponents || []) {
    const q = (g.rosters[t.id] || []).find((r) => r.i === id);
    if (q) return { id, n: q.n, pos: q.p, cls: TV_CLASS[Math.max(0, Math.min(3, q.y - 1))], ovr: q.o, where: t.name };
  }
  const pr = (g.prospects || []).find((r) => r.id === id);
  if (pr) return { id, n: pr.name, pos: pr.pos, cls: pr.origin === "Transfer" ? "Transfer" : "Recruit", ovr: pr.ovr, where: pr.status === "Available" ? "Available to recruit" : pr.committedTo ? `Committed to ${pr.committedTo}` : pr.status, prospect: !0 };
  for (const tid of Object.keys(g.tmoves || {})) {
    const q = (g.tmoves[tid].out || []).find((r) => r.i === id);
    if (q) return { id, n: q.n, pos: q.p, cls: TV_CLASS[Math.max(0, Math.min(3, q.y - 1))], ovr: q.o, where: W_moveStatus(g, q, tid).text, gone: !0 };
  }
  return null;
}
function FavoritePlayers({ g, run }) {
  const ids = g.favPlayers || [],
    rows = [
      ...ids.map((id) => W_favWhere(g, id) || { id, n: "Player no longer in the game", pos: "", cls: "", ovr: "", where: "", missing: !0 }),
      ...(g.prospects || []).filter((r) => r.target && r.status === "Available" && !ids.includes(r.id)).map((r) => W_favWhere(g, r.id)).filter(Boolean),
    ].sort((a, b) => (b.own ? 1 : 0) - (a.own ? 1 : 0) || (Number(b.ovr) || 0) - (Number(a.ovr) || 0));
  return (0, s.jsxs)("div", {
    children: [
      (0, s.jsx)("p", {
        className: "muted",
        children:
          "Players you starred on their boxes. Click a name to open his card. A star on a recruit is the recruiting bookmark, so Auto-recruit and auto-scout go after the ones you star.",
      }),
      rows.length
        ? (0, s.jsx)("div", {
            className: "table-wrap",
            children: (0, s.jsxs)("table", {
              className: "stats-table",
              children: [
                (0, s.jsx)("thead", { children: (0, s.jsx)("tr", { children: ["", "Player", "Pos", "Class", "OVR", "Where he is now"].map((l, i) => (0, s.jsx)("th", { children: l }, i)) }) }),
                (0, s.jsx)("tbody", {
                  children: rows.map((r) =>
                    (0, s.jsxs)("tr", { children: [
                      (0, s.jsx)("td", { children: (0, s.jsx)(FavStar, { p: { id: r.id, name: r.n, target: r.prospect }, prospect: !!r.prospect, g }) }),
                      (0, s.jsx)("td", { children: r.n }), (0, s.jsx)("td", { children: r.pos }), (0, s.jsx)("td", { children: r.cls }), (0, s.jsx)("td", { children: r.ovr }), (0, s.jsx)("td", { children: r.where }),
                    ] }, r.id)
                  ),
                }),
              ],
            }),
          })
        : (0, s.jsx)("p", { className: "muted", children: "No favorites yet. Click the star on any player box (your roster, another team's roster, a recruit) to follow him here." }),
    ],
  });
}
