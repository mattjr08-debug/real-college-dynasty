// Click any other school's name or any other team's player anywhere in the game: a read-only team view (roster, and in the offseason who arrived and who left)
// and a read-only player card (no position, role, redshirt or cut buttons: things you can only do with your own players).
// One shared layer (LinkLayer) finds school and player names on every screen, in tables, cards and news text, so no screen has to be changed.
const TV_CLASS = ["Freshman", "Sophomore", "Junior", "Senior"];
const tvHeight = (q) => { const h = ({ PG: 73, SG: 76, SF: 79, PF: 81, C: 83 })[q.p] + (TS(String(q.i) + "-height") % 5) - 2; return `${Math.floor(h / 12)}\u2032${h % 12}\u2033`; };
// this season's totals, or last season's in the offseason (the new year resets them); hs holds the last three finished seasons
const tvStats = (q) => (q.s && q.s.g > 0 ? q.s : (q.hs || []).at(-1) || null);
const tvPerGame = (q, k) => { const t = tvStats(q); return t && t.g > 0 ? (t[k] / t.g).toFixed(1) : "\u2014"; };
const tvSeason = (y) => `${y}\u2013${String(y + 1).slice(2)}`;
const tvTeam = (g, id) => (g.opponents || []).find((t) => t.id === id) || (g.league || []).find((t) => t.id === id);
// Where did a player who left a team end up? Worked out from the current game, so portal waves that happen later are always up to date.
function W_moveStatus(g, q, fromId) {
  if (q.why === "Drafted") {
    const yr = g.tmoves && g.tmoves[fromId] ? g.tmoves[fromId].y : g.year, team = q.pk ? W_proForPick(yr, q.pk) : PRO_TEAMS[TS(`${q.n}|${yr}|pick`) % PRO_TEAMS.length];
    return { text: q.pk ? `Drafted by ${team} \u00B7 pick ${q.pk}` : `Drafted by ${team}`, tone: "draft", pro: team };
  }
  if (q.why === "Graduated") return { text: "Graduated", tone: "grad" };
  if (g.roster && g.roster.some((r) => r.id === q.i)) return { text: `Transferred to ${g.school.name}`, tone: "you" };
  for (const t of g.opponents || []) if (t.id !== fromId && (g.rosters[t.id] || []).some((r) => r.i === q.i)) return { text: `Transferred to ${t.name}`, tone: "xfer", to: t.id };
  if ((g.rosters[fromId] || []).some((r) => r.i === q.i)) return { text: "Changed his mind and stayed", tone: "stay" };
  const pr = (g.prospects || []).find((r) => r.id === q.i);
  if (pr) {
    if (pr.status === "Available") return { text: "In the transfer portal", tone: "portal" };
    if (pr.committedTo && pr.committedTo !== "Left college basketball") return { text: `Transferred to ${pr.committedTo}`, tone: "xfer" };
    if (pr.status === "Signed") return { text: `Transferred to ${g.school.name}`, tone: "you" };
  }
  return { text: "Left college basketball", tone: "left" };
}
function W_movesFor(g, id) {
  const m = g.tmoves && g.tmoves[id];
  if (!m || m.y !== g.year) return null;
  const now = g.rosters[id] || [], prev = new Set(m.prev || []), outBy = new Map();
  for (const tid of Object.keys(g.tmoves)) for (const o of g.tmoves[tid].out || []) outBy.set(o.i, tid);
  const incoming = now.filter((q) => !prev.has(q.i)).map((q) => { const from = outBy.get(q.i), ft = from && tvTeam(g, from); return { q, how: from ? `Transfer from ${ft ? ft.name : "another school"}` : q.y === 1 ? "Freshman" : "Added" }; }).sort((a, b) => b.q.o - a.q.o);
  const out = (m.out || []).map((q) => ({ q, st: W_moveStatus(g, q, id) })).filter((x) => x.st.tone !== "stay").sort((a, b) => b.q.o - a.q.o);
  return { incoming, out };
}
function TvPlayerLink({ g, q, team, extra, openPlayer, children }) {
  return (0, s.jsx)("button", { type: "button", className: "lk-btn", onClick: () => openPlayer({ q, teamId: team && team.id, ...extra }), children: children || q.n });
}
function TeamView({ g, id, onClose, openPlayer }) {
  const t = tvTeam(g, id), [tab, setTab] = (0, N.useState)("Roster");
  if (!t) return null;
  const roster = [...(g.rosters[id] || [])].sort((a, b) => b.o - a.o), moves = g.phase === "Offseason" ? W_movesFor(g, id) : null, sc = hqOppSchool(t);
  const cname = (g.confNames && g.confNames[t.conf]) || (typeof t.conf === "string" ? t.conf : "");
  const th = (l) => (0, s.jsx)("th", { children: l }, l);
  const people = (rows, kind) => (0, s.jsx)("div", { className: "table-wrap", children: (0, s.jsxs)("table", { className: "stats-table", children: [
    (0, s.jsx)("thead", { children: (0, s.jsx)("tr", { children: ["", "Player", "Pos", "Class", "OVR", kind === "in" ? "How" : "What happened"].map(th) }) }),
    (0, s.jsx)("tbody", { children: rows.map((r) => (0, s.jsxs)("tr", { children: [
      (0, s.jsx)("td", { children: (0, s.jsx)(FavStar, { p: { i: r.q.i, n: r.q.n }, g }) }),
      (0, s.jsx)("td", { children: (0, s.jsx)(TvPlayerLink, { g, q: r.q, team: t, extra: kind === "out" ? { gone: r.st.text } : {}, openPlayer }) }),
      (0, s.jsx)("td", { children: r.q.p }), (0, s.jsx)("td", { children: TV_CLASS[Math.max(0, Math.min(3, (kind === "out" ? r.q.y : r.q.y) - 1))] }), (0, s.jsx)("td", { children: r.q.o }),
      (0, s.jsx)("td", { children: kind === "in" ? r.how : r.st.text }) ] }, r.q.i)) }) ] }) });
  return (0, s.jsxs)(Ao, { title: t.name, onClose, wide: !0, children: [
    (0, s.jsxs)("div", { className: "tv-head", style: { display: "flex", gap: 14, alignItems: "center", marginBottom: 10, paddingTop: 8, paddingRight: 44 }, children: [
      (0, s.jsx)("div", { style: { width: 64, height: 64, flex: "none" }, children: (0, s.jsx)(SchoolLogo, { school: sc }) }),
      (0, s.jsxs)("div", { children: [
        (0, s.jsx)("h2", { style: { margin: 0 }, children: t.name }),
        (0, s.jsx)("div", { className: "muted", children: [cname, t.coach && t.coach.n ? `Head coach ${t.coach.n}` : "", `Team rating ${t.rating}`, t.budget != null ? `NIL budget ${q(t.budget)} (${W_nilTierText(t.budget)})` : ""].filter(Boolean).join(" \u00B7 ") }),
        (0, s.jsx)("div", { children: `${t.wins}\u2013${t.losses} overall \u00B7 ${t.cw}\u2013${t.cl} conference` }) ] }) ] }),
    moves && (0, s.jsx)("div", { className: "chips", style: { marginBottom: 8 }, children: ["Roster", "Offseason moves"].map((l) => (0, s.jsx)("button", { className: l === tab ? "active" : "", onClick: () => setTab(l), children: l }, l)) }),
    tab === "Roster" || !moves
      ? (0, s.jsxs)("div", { children: [
          roster.some((q) => !(q.s && q.s.g > 0) && (q.hs || []).length) && (0, s.jsx)("p", { className: "muted", children: "Averages are from last season (the new year resets this season's totals)." }),
          (0, s.jsx)("div", { className: "table-wrap", children: (0, s.jsxs)("table", { className: "stats-table", children: [
          (0, s.jsx)("thead", { children: (0, s.jsx)("tr", { children: ["", "Player", "Pos", "Class", "Ht", "OVR", "PPG", "RPG", "APG"].map(th) }) }),
          (0, s.jsx)("tbody", { children: roster.map((q) => (0, s.jsxs)("tr", { children: [
            (0, s.jsx)("td", { children: (0, s.jsx)(FavStar, { p: { i: q.i, n: q.n }, g }) }),
            (0, s.jsx)("td", { children: (0, s.jsx)(TvPlayerLink, { g, q, team: t, openPlayer }) }), (0, s.jsx)("td", { children: q.p }),
            (0, s.jsx)("td", { children: TV_CLASS[Math.max(0, Math.min(3, q.y - 1))] }), (0, s.jsx)("td", { children: tvHeight(q) }), (0, s.jsx)("td", { children: q.o }),
            (0, s.jsx)("td", { children: tvPerGame(q, "p") }), (0, s.jsx)("td", { children: tvPerGame(q, "r") }), (0, s.jsx)("td", { children: tvPerGame(q, "a") }) ] }, q.i)) }) ] }) }) ] })
      : (0, s.jsxs)("div", { children: [
          (0, s.jsx)("h3", { children: `New this year (${moves.incoming.length})` }),
          moves.incoming.length ? people(moves.incoming, "in") : (0, s.jsx)("p", { className: "muted", children: "Nobody new yet." }),
          (0, s.jsx)("h3", { children: `Left the team (${moves.out.length})` }),
          moves.out.length ? people(moves.out, "out") : (0, s.jsx)("p", { className: "muted", children: "Nobody left." }) ] }) ] });
}
function ForeignPlayerCard({ g, pl, onClose, openTeam }) {
  const q = pl.q, [tab, setTab] = (0, N.useState)("Overview"), team = pl.teamId && tvTeam(g, pl.teamId);
  const attrs = W_at(q), tend = W_tend({ id: q.i, ovr: q.o, attrs }), arch = W_arch({ pos: q.p, attrs, tend: { three: tend.three } }), ht = tvHeight(q);
  const status = pl.gone ? { text: pl.gone } : null, cur = q.s && q.s.g > 0 ? q.s : null, last = (q.hs || []).at(-1), st = cur || last || {},
    seasons = [...[...(q.hs || [])].reverse().map((h) => ({ label: tvSeason(h.y), t: h })), ...(cur ? [{ label: "This season", t: cur }] : [])].sort((a, b) => (a.label === "This season" ? -1 : b.label === "This season" ? 1 : 0)),
    sum = (k) => seasons.reduce((n, z) => n + (z.t[k] || 0), 0), perG = (t, k) => (t.g > 0 ? (t[k] / t.g).toFixed(1) : "\u2014");
  // his strongest rating (of the 16 attributes) with its number, in place of the old shot-mix tile
  const bestSkill = attrs.map((v, i) => [il[i], v]).sort((x, y) => y[1] - x[1])[0],
    bestTile = (0, s.jsxs)("div", { className: "metric", children: [(0, s.jsx)("div", { children: (0, s.jsx)("span", { children: "BEST SKILL" }) }), (0, s.jsx)("strong", { children: bestSkill[1] }), (0, s.jsx)("small", { className: "muted", children: bestSkill[0] })] }, "best");
  const tile = (label, value) => (0, s.jsxs)("div", { className: "metric", children: [(0, s.jsx)("div", { children: (0, s.jsx)("span", { children: label }) }), (0, s.jsx)("strong", { children: value })] }, label);
  return (0, s.jsxs)(Ao, { title: q.n, onClose, wide: !0, children: [
    (0, s.jsxs)("div", { style: { display: "flex", gap: 16, alignItems: "center", marginBottom: 12, paddingTop: 6, paddingRight: 44 }, children: [
      (0, s.jsx)("div", { style: { width: 120, height: 120, flex: "none" }, children: (0, s.jsx)(qy, { p: { name: q.n, faceSeed: q.f }, size: "large" }) }),
      (0, s.jsxs)("div", { style: { flex: 1 }, children: [
        (0, s.jsxs)("h2", { style: { margin: 0 }, children: [q.n, " ", (0, s.jsx)(FavStar, { p: { i: q.i, n: q.n }, g })] }),
        (0, s.jsx)("div", { className: "muted", children: `${q.p} \u00B7 ${TV_CLASS[Math.max(0, Math.min(3, q.y - 1))]} \u00B7 ${ht} \u00B7 ${arch}` }),
        team && (0, s.jsx)("div", { children: (0, s.jsx)("button", { type: "button", className: "lk-btn", onClick: () => openTeam(team.id), children: team.name }) }),
        status && (0, s.jsx)("div", { style: { color: "#f6c177" }, children: status.text }) ] }),
      (0, s.jsx)(RatingRing, { value: q.o, label: "OVERALL", size: "big" }) ] }),
    (0, s.jsx)("div", { className: "chips", style: { marginBottom: 8 }, children: ["Overview", "Attributes", "Statistics"].map((l) => (0, s.jsx)("button", { className: l === tab ? "active" : "", onClick: () => setTab(l), children: l }, l)) }),
    tab === "Overview" && (0, s.jsxs)("div", { children: [
      (0, s.jsx)("div", { className: "metrics three", children: [tile("PPG", tvPerGame(q, "p")), tile("RPG", tvPerGame(q, "r")), tile("APG", tvPerGame(q, "a"))] }),
      (0, s.jsx)("div", { className: "metrics three", children: [tile("SPG", tvPerGame(q, "s")), tile("BPG", tvPerGame(q, "b")), tile("GAMES", st.g > 0 ? st.g : "\u2014")] }),
      (0, s.jsx)("p", { className: "muted", children: cur ? "Averages are for this season." : last ? `Averages are from ${tvSeason(last.y)}, his last season (the new year resets this season's totals).` : q.y === 1 ? "A freshman: no college games yet." : "No games on record yet." }),
      (0, s.jsx)("div", { className: "metrics three", children: [tile("ARCHETYPE", arch), bestTile, tile("USAGE", tend.usage >= 1.1 ? "High" : tend.usage <= 0.9 ? "Low" : "Average")] }),
      (0, s.jsx)("p", { className: "muted", children: "You can see ratings and results for players on other teams. Position, role, minutes and contracts can only be changed for your own players." }) ] }),
    tab === "Attributes" && (0, s.jsx)("div", { className: "attributes-grid", children: attrs.map((v, i) => (0, s.jsxs)("div", { className: "attribute", children: [
      (0, s.jsxs)("div", { style: { display: "flex", justifyContent: "space-between" }, children: [(0, s.jsx)("span", { children: il[i] }), (0, s.jsx)("strong", { children: v })] }),
      (0, s.jsx)("div", { className: "meter", children: (0, s.jsx)("span", { style: { display: "block", height: "100%", width: `${Math.max(4, Math.min(100, v))}%`, background: v >= 75 ? "#6ee7b7" : v >= 60 ? "#7cc4ff" : "#f6c177", borderRadius: 4 } }) }) ] }, il[i])) }),
    tab === "Statistics" && (seasons.length
      ? (0, s.jsxs)("div", { children: [
          (0, s.jsx)("h3", { children: "Per game" }),
          (0, s.jsx)("div", { className: "table-wrap", children: (0, s.jsxs)("table", { className: "stats-table", children: [
            (0, s.jsx)("thead", { children: (0, s.jsx)("tr", { children: ["Season", "GP", "PTS", "REB", "AST", "STL", "BLK", "TO"].map((l) => (0, s.jsx)("th", { children: l }, l)) }) }),
            (0, s.jsxs)("tbody", { children: [
              ...seasons.map((z) => (0, s.jsx)("tr", { children: [z.label, z.t.g, perG(z.t, "p"), perG(z.t, "r"), perG(z.t, "a"), perG(z.t, "s"), perG(z.t, "b"), perG(z.t, "t")].map((v, i) => (0, s.jsx)("td", { children: v }, i)) }, z.label)),
              seasons.length > 1 && (0, s.jsx)("tr", { className: "totals", children: ["Career", sum("g"), ...["p", "r", "a", "s", "b", "t"].map((k) => (sum("g") ? (sum(k) / sum("g")).toFixed(1) : "\u2014"))].map((v, i) => (0, s.jsx)("td", { children: v }, i)) }, "career") ] }) ] }) }),
          (0, s.jsx)("h3", { children: "Totals" }),
          (0, s.jsx)("div", { className: "table-wrap", children: (0, s.jsxs)("table", { className: "stats-table", children: [
            (0, s.jsx)("thead", { children: (0, s.jsx)("tr", { children: ["Season", "GP", "PTS", "REB", "AST", "STL", "BLK", "TO"].map((l) => (0, s.jsx)("th", { children: l }, l)) }) }),
            (0, s.jsx)("tbody", { children: seasons.map((z) => (0, s.jsx)("tr", { children: [z.label, z.t.g, z.t.p, z.t.r, z.t.a, z.t.s, z.t.b, z.t.t].map((v, i) => (0, s.jsx)("td", { children: v ?? "\u2014" }, i)) }, z.label)) }) ] }) }) ] })
      : (0, s.jsx)("p", { className: "muted", children: q.y === 1 ? "A freshman: no college games yet." : "No games on record yet." })) ] });
}
// ---- the shared link layer ----
// The index only remembers WHO is called what (ids and school ids). When a name is clicked the player is looked up again in the current game, so a card can never show numbers
// from an older moment (this used to cache the player objects: after simming games a card still showed the old averages).
function W_linkInstall(ref) {
  let idx = null, idxKey = null, timer = null;
  const norm = (t) => String(t || "").replace(/\s+/g, " ").trim();
  const add = (m, k, v) => { const l = m.get(k); l ? l.push(v) : m.set(k, [v]); };
  const build = () => {
    const g = ref.current.g; if (!g || !g.opponents) return null;
    let total = 0; for (const o of g.opponents) total += (g.rosters[o.id] || []).length;
    const key = `${g.year}:${g.phase}:${g.round}:${g.pw || 0}:${g.roster ? g.roster.length : 0}:${g.history ? g.history.length : 0}:${total}:${g.tmoves ? 1 : 0}`;
    if (idx && idxKey === key) return idx;
    const teams = new Map(), players = new Map();
    for (const t of g.opponents) { if (t.id === g.school.id) continue; teams.set(norm(t.name), t.id); for (const q of g.rosters[t.id] || []) add(players, q.n, { kind: "roster", id: q.i, teamId: t.id, teamName: t.name, o: q.o }); }
    if (g.tmoves) for (const tid of Object.keys(g.tmoves)) { const t = tvTeam(g, tid); for (const q of g.tmoves[tid].out || []) add(players, q.n, { kind: "gone", id: q.i, teamId: tid, teamName: t ? t.name : "", o: q.o }); }
    for (const p of g.roster || []) add(players, p.name, { kind: "own", id: p.id, o: p.ovr });
    idx = { teams, players }; idxKey = key; return idx;
  };
  const clickable = (el) => { for (let a = el.parentElement, n = 0; a && n < 7; a = a.parentElement, n++) { if (/^(BUTTON|A|SELECT|INPUT|TEXTAREA)$/.test(a.tagName) || a.getAttribute("role") === "button") return true; if (!a.classList.contains("lk-team") && !a.classList.contains("lk-player") && getComputedStyle(a).cursor === "pointer") return true; if (a.tagName === "MAIN" || a.classList.contains("modal")) break; } return false; };
  const pick = (list, el) => {
    if (list.length === 1) return list[0];
    let box = el; for (let n = 0; n < 4 && box.parentElement; n++) { box = box.parentElement; if (/^(TR|LI)$/.test(box.tagName) || /team-row|news-item|history-content|card/.test(box.className || "")) break; }
    const text = norm(box.textContent), here = list.filter((c) => c.teamName && text.includes(c.teamName));
    // no school in the row: on a page about your own program (My roster, Coaching, Career history, Program HQ, NIL budget) or in a row that names your school, a name that is one of your players is yours
    if (!here.length) { const own = list.find((c) => c.kind === "own"), h1 = document.querySelector("main h1"), ownPage = h1 && /my roster|coaching|career history|program hq|nil budget/i.test(h1.textContent); if (own && (ownPage || text.includes(ref.current.g.school.name))) return own; }
    return (here.length ? here : list).slice().sort((a, b) => (b.o || 0) - (a.o || 0))[0];
  };
  // find the player in the game as it is now (he may have moved to another school since the index was made)
  const fresh = (g, c) => {
    if (c.kind === "own") return (g.roster || []).find((p) => p.id === c.id) || null;
    if (c.kind === "roster") {
      let q = (g.rosters[c.teamId] || []).find((z) => z.i === c.id), tid = c.teamId;
      if (!q) for (const o of g.opponents) { const hit = (g.rosters[o.id] || []).find((z) => z.i === c.id); if (hit) { q = hit; tid = o.id; break; } }
      return q ? { q, teamId: tid } : null;
    }
    const q = ((g.tmoves && g.tmoves[c.teamId] && g.tmoves[c.teamId].out) || []).find((z) => z.i === c.id);
    return q ? { q, teamId: c.teamId, gone: W_moveStatus(g, q, c.teamId).text } : null;
  };
  const openName = (name, el) => {
    const I = build(); if (!I) return false;
    const g = ref.current.g;
    if (I.teams.has(name)) { ref.current.openTeam(I.teams.get(name)); return true; }
    const list = I.players.get(name);
    if (!list) return false;
    const c = pick(list, el), now = fresh(g, c);
    if (!now) return false;
    if (c.kind === "own") { if (clickable(el)) return false; ref.current.openOwn(now); return true; }
    if (clickable(el) && (g.prospects || []).some((r) => r.name === name)) return false;
    ref.current.openForeign({ q: now.q, teamId: now.teamId, gone: now.gone });
    return true;
  };
  const unlink = (el) => { if (el.classList.contains("lk-team") || el.classList.contains("lk-player")) { el.classList.remove("lk-team", "lk-player"); el.removeAttribute("role"); el.removeAttribute("tabindex"); } };
  const scan = () => {
    timer = null; const I = build(); if (!I) return;
    document.querySelectorAll("main td, main th, main span, main strong, main b, main h3, main h4, main small, main p, main li, main div, .modal td, .modal span, .modal strong, .modal h3, .modal h4, .modal small, .modal p, .modal div, .table-overlay td, .table-overlay span, .ceremony span, .ceremony h4").forEach((el) => {
      if (el.childElementCount) { unlink(el); return; }
      const t = norm(el.textContent);
      if (!t || t.length < 4 || t.length > 40 || el.closest(".lk-btn, a, select, .sidebar")) { unlink(el); return; }
      // inside a button (a game result, the next-game card) only a school name is a link; the rest of the button keeps doing what it did
      const inBtn = !!el.closest("button, [role=button]"), isT = I.teams.has(t), isP = !isT && I.players.has(t) && !inBtn;
      const own = isP && I.players.get(t).every((c) => c.kind === "own") && clickable(el), linkIt = isT || (isP && !own);
      el.classList.toggle("lk-team", isT); el.classList.toggle("lk-player", isP && !own);
      if (linkIt) { el.setAttribute("role", "link"); el.tabIndex = inBtn ? -1 : 0; } else unlink(el);
    });
  };
  const queue = () => { if (!timer) timer = setTimeout(scan, 220); };
  const onClick = (ev) => {
    if (ev.button !== 0 || ev.defaultPrevented || ev.target.closest(".lk-btn, select, input, textarea")) return;
    const el = ev.target.closest && ev.target.closest(".lk-team, .lk-player");
    if (el) { if (openName(norm(el.textContent), el)) { ev.stopPropagation(); ev.preventDefault(); } return; }
    // names inside sentences (news, recaps): find the name under the click
    if (ev.target.closest("button, a, select, input, textarea, .sidebar, [role=button]") || !document.caretRangeFromPoint) return;
    const r = document.caretRangeFromPoint(ev.clientX, ev.clientY); if (!r || r.startContainer.nodeType !== 3) return;
    const text = r.startContainer.textContent, off = r.startOffset, I = build(); if (!I) return;
    const names = [...I.teams.keys(), ...I.players.keys()].filter((n) => n.length >= 6 && text.includes(n)).sort((a, b) => b.length - a.length);
    for (const n of names) { let at = text.indexOf(n); while (at >= 0) { if (off >= at && off <= at + n.length) { const host = r.startContainer.parentElement; if (openName(n, host)) { ev.stopPropagation(); ev.preventDefault(); } return; } at = text.indexOf(n, at + 1); } }
  };
  // keyboard: Tab reaches a linked name and Enter opens it
  const onKey = (ev) => { if (ev.key === "Enter" && ev.target && ev.target.matches && ev.target.matches(".lk-team, .lk-player")) { ev.preventDefault(); ev.target.click(); } };
  document.addEventListener("click", onClick, true);
  document.addEventListener("keydown", onKey, true);
  const mo = new MutationObserver(queue); mo.observe(document.body, { childList: true, subtree: true, characterData: true }); queue();
  return () => { document.removeEventListener("click", onClick, true); document.removeEventListener("keydown", onKey, true); mo.disconnect(); if (timer) clearTimeout(timer); };
}
function LinkLayer({ g, openTeam, openForeign, openOwn }) {
  const ref = (0, N.useRef)({});
  ref.current = { g, openTeam, openForeign, openOwn };
  (0, N.useEffect)(() => W_linkInstall(ref), []);
  return null;
}
window.__dbg && Object.assign(window.__dbg, { W_moveStatus });
