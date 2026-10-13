// Search for schools and players (October 2026). Opened from the magnifier button in the top bar, or by pressing / or Ctrl/Cmd+K.
// Pick a school to open its team view (roster, record, rating), a player on another team to open his player card, one of your own players to open yours,
// and a recruit or transfer to jump to the Recruiting / Transfer portal page. Reuses the team view and player card from 0112b-TeamPlayerViews.js.
const gsNorm = (t) => String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
const GS_CLASS = ["Fr", "So", "Jr", "Sr"];
function W_searchIndex(g) {
  const teams = [], players = [], seen = new Set();
  const addTeam = (t, own) => { if (!t || seen.has(t.id)) return; seen.add(t.id); teams.push({ id: t.id, own, name: t.name, hay: gsNorm(`${t.name} ${t.mascot || ""} ${(g.confNames && g.confNames[t.conf]) || (typeof t.conf === "string" ? t.conf : "")}`), t }); };
  addTeam(g.school, true);
  for (const t of g.opponents || []) addTeam(t, t.id === g.school.id);
  const tname = (id) => { const t = (g.opponents || []).find((x) => x.id === id); return t ? t.name : ""; };
  for (const t of g.opponents || []) {
    if (t.id === g.school.id) continue;
    for (const q of (g.rosters && g.rosters[t.id]) || []) players.push({ kind: "team", key: `t${q.i}`, name: q.n, norm: gsNorm(q.n), hay: gsNorm(`${q.n} ${t.name}`), pos: q.p, cls: GS_CLASS[Math.max(0, Math.min(3, (q.y || 1) - 1))], ovr: q.o, where: t.name, q, teamId: t.id, face: q.f });
  }
  for (const p of g.roster || []) players.push({ kind: "own", key: `o${p.id}`, name: p.name, norm: gsNorm(p.name), hay: gsNorm(`${p.name} ${g.school.name}`), pos: p.pos, cls: GS_CLASS[Math.max(0, Math.min(3, (p.year || 1) - 1))], ovr: p.ovr, where: `${g.school.name} (your team)`, p, face: p.faceSeed, portrait: p.portrait });
  for (const [list, page] of [[g.prospects || [], null], [g.walkons || [], "Walkons"]]) {
    for (const r of list) {
      const isXfer = r.origin && (g.opponents || []).some((t) => t.name === r.origin);
      players.push({ kind: "prospect", key: `p${r.id}`, name: r.name, norm: gsNorm(r.name), hay: gsNorm(`${r.name} ${r.origin || ""} ${r.committedTo || ""}`), pos: r.pos, cls: GS_CLASS[Math.max(0, Math.min(3, (r.year || 1) - 1))], ovr: r.ovr, where: r.committedTo ? `Committed to ${r.committedTo}` : r.status === "Signed" ? "Signed with you" : isXfer ? `Transfer from ${r.origin}` : page === "Walkons" ? "Walk-on pool" : `Recruit${r.stars ? ` · ${r.stars}★` : ""}`, page: page || (isXfer ? "Portal" : "Recruiting"), face: r.faceSeed, portrait: r.portrait });
    }
  }
  return { teams, players, tname };
}
function GameSearch({ g, onClose, openTeam, openForeign, openOwn, go }) {
  const [text, setText] = (0, N.useState)(""), inRef = (0, N.useRef)(null);
  (0, N.useEffect)(() => { const t = setTimeout(() => inRef.current && inRef.current.focus(), 60); return () => clearTimeout(t); }, []);
  const idx = (0, N.useMemo)(() => W_searchIndex(g), [g.year, g.phase, g.round, g.pw, g.roster && g.roster.length, g.prospects && g.prospects.length]);
  const toks = gsNorm(text).split(" ").filter(Boolean);
  const hit = (hay) => toks.every((k) => hay.includes(k));
  const schools = toks.length ? idx.teams.filter((t) => hit(t.hay)).sort((a, b) => (gsNorm(b.name).startsWith(toks[0]) ? 1 : 0) - (gsNorm(a.name).startsWith(toks[0]) ? 1 : 0) || (b.t.rating || 0) - (a.t.rating || 0)).slice(0, 8) : [];
  const allPl = toks.length ? idx.players.filter((p) => hit(p.hay)) : [];
  const players = allPl.sort((a, b) => (b.norm.startsWith(toks[0]) ? 1 : 0) - (a.norm.startsWith(toks[0]) ? 1 : 0) || (b.ovr || 0) - (a.ovr || 0)).slice(0, 40);
  const choose = (fn) => () => { onClose(); fn(); };
  const openSchool = (t) => choose(() => (t.own ? go("Roster") : openTeam(t.id)));
  const openPlayer = (p) => choose(() => (p.kind === "own" ? openOwn(p.p) : p.kind === "team" ? openForeign({ q: p.q, teamId: p.teamId }) : go(p.page)));
  const ovrColor = (v) => (v >= 80 ? "#6ee7b7" : v >= 70 ? "#7cc4ff" : "#f6c177");
  const rowStyle = { display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: 8, background: "transparent", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 6, cursor: "pointer", color: "inherit" };
  return (0, s.jsxs)(Ao, { title: "Search", onClose, wide: !0, children: [
    (0, s.jsx)("input", { className: "school-search", ref: inRef, placeholder: "Search players and schools", value: text, onChange: (ev) => setText(ev.target.value), onKeyDown: (ev) => { if (ev.key === "Enter") { const first = schools[0] ? openSchool(schools[0]) : players[0] ? openPlayer(players[0]) : null; if (first) first(); } }, style: { width: "100%", marginBottom: 12 } }),
    !toks.length && (0, s.jsx)("p", { className: "muted", children: `Type a player or school name. ${idx.teams.length} schools and ${idx.players.length} players are searchable. Press Enter to open the top result.` }),
    toks.length > 0 && !schools.length && !players.length && (0, s.jsx)("p", { className: "muted", children: "No schools or players match." }),
    schools.length > 0 && (0, s.jsxs)("div", { children: [
      (0, s.jsx)("h3", { children: `Schools (${schools.length})` }),
      schools.map((t) => { let sc = null; try { sc = t.own ? null : hqOppSchool(t.t); } catch (e) {} return (0, s.jsxs)("button", { type: "button", style: rowStyle, onClick: openSchool(t), children: [
        (0, s.jsx)("span", { style: { width: 34, height: 34, flex: "none" }, children: sc ? (0, s.jsx)(SchoolLogo, { school: sc }) : null }),
        (0, s.jsxs)("span", { style: { flex: 1 }, children: [(0, s.jsx)("strong", { children: t.name }), t.own ? " (your school)" : "", (0, s.jsx)("br", {}), (0, s.jsx)("small", { className: "muted", children: [(g.confNames && g.confNames[t.t.conf]) || (typeof t.t.conf === "string" ? t.t.conf : ""), t.t.wins != null ? `${t.t.wins}–${t.t.losses}` : "", t.t.rating != null ? `Rating ${t.t.rating}` : ""].filter(Boolean).join(" · ") })] })] }, t.id); }) ] }),
    players.length > 0 && (0, s.jsxs)("div", { children: [
      (0, s.jsx)("h3", { children: allPl.length > players.length ? `Players (top ${players.length} of ${allPl.length})` : `Players (${players.length})` }),
      players.map((p) => (0, s.jsxs)("button", { type: "button", style: rowStyle, onClick: openPlayer(p), children: [
        (0, s.jsx)("span", { style: { width: 38, height: 38, flex: "none" }, children: (0, s.jsx)(qy, { p: { name: p.name, faceSeed: p.face, portrait: p.portrait || 0 } }) }),
        (0, s.jsxs)("span", { style: { flex: 1 }, children: [(0, s.jsx)("strong", { children: p.name }), (0, s.jsx)("br", {}), (0, s.jsx)("small", { className: "muted", children: [p.pos, p.cls, p.where].filter(Boolean).join(" · ") })] }),
        p.ovr != null && (0, s.jsx)("strong", { style: { color: ovrColor(p.ovr) }, children: p.ovr })] }, p.key)) ] })
  ] });
}
