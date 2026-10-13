// Coaching > Assistant coaches: who is in each chair, what he adds to your program right now, what he is doing this phase and what he has done.
// All numbers are the ones the game really uses (W_staffLv: paid level x rating / 65; 0011-Nn signing chance, 0048-wS scouting visits, growth and chemistry).
function AssistantCoaches({ g: e }) {
  const st = e.staff || {},
    LV = ["Not hired", "Level 1", "Level 2", "Level 3"],
    fac = st.fac || 0,
    off = e.phase === "Offseason",
    board = (e.prospects || []).filter((p) => p.status === "Available"),
    favs = board.filter((p) => p.target),
    scouted = favs.filter((p) => (p.scouted || 0) > 0).length,
    offers = board.filter((p) => p.offer).length,
    plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`,
    f1 = (n) => (Math.round(n * 10) / 10).toFixed(1),
    cls = (e.classes || []).at(-1),
    roster = e.roster || [],
    growers = roster.filter((p) => p.ovr < p.potential && !p.redshirt).length,
    grown = roster.filter((p) => typeof p.growth === "number"),
    improved = grown.filter((p) => p.growth > 0).sort((a, b) => b.growth - a.growth),
    tact = e.tactics || {},
    ovisits = e.ov ?? TUNE.ovisits;   // official visits this class (the same number the Recruiting page shows)
  const role = (k) => STAFF_ROLES.find((r) => r.k === k);
  const content = {
    rec: () => {
      const eff = W_staffLv(e, "rec"), visits = 10 + (e.specialty === "Recruiting" ? 6 : 0) + Math.round(eff * 2), lvl = st.rec || 0;
      return {
        gives: [
          `+${f1(eff * 2 + fac * 1.5)} signing chance on every offer (${f1(eff * 2)} from him${fac ? `, ${f1(fac * 1.5)} from facilities` : ""})`,
          `+${Math.round(eff * 2)} scouting visits a year (${visits} in all)`,
          lvl >= 2 ? `${plural((lvl >= 2 ? 1 : 0) + (lvl >= 3 ? 1 : 0), "extra official visit")} (${ovisits} in all)` : "A level 2 assistant adds an official visit, level 3 adds another",
        ],
        doing: off
          ? [`Scouting: ${plural(e.scouts, "visit")} left this round`, `Your board: ${plural(favs.length, "favorite")} (${scouted} scouted), ${plural(offers, "offer")} out`, `Official visits: ${ovisits} for this class`]
          : [`Recruiting is closed until the offseason. He keeps the board warm: ${plural(board.length, "prospect")} on it.`],
        done: cls ? [`Latest class: ${plural(cls.n, "player")} signed, average rating ${cls.avg}, top ${cls.top}`] : ["No class signed yet."],
      };
    },
    dev: () => {
      const eff = W_staffLv(e, "dev"), add = eff * 0.34 + fac * 0.15;
      return {
        gives: [`+${(eff * 0.34).toFixed(2)} growth points per player a year from him${fac ? `, +${(fac * 0.15).toFixed(2)} from facilities` : ""} (before class and position)`, `About +${add.toFixed(2)} in all, on top of training focus and minutes`],
        doing: [`${plural(growers, "player")} on your roster can still grow (below their ceiling)`, e.phase === "Regular season" ? "Working with the roster through the season; growth is applied when it ends" : "Growth is applied when the season ends"],
        done: grown.length && (e.history || []).length
          ? [`Last growth: ${plural(improved.length, "player")} improved, +${improved.reduce((n, p) => n + p.growth, 0)} overall points in total`, ...improved.slice(0, 4).map((p) => `${p.name} +${p.growth} (now ${p.ovr})`)]
          : ["No development results yet. They appear after the first season ends."],
      };
    },
    tac: () => {
      const eff = W_staffLv(e, "tac");
      return {
        gives: [`+${f1(eff * 2)} team chemistry at the start of each season`],
        doing: [`Team chemistry now: ${e.chemistry ?? "not set yet"}`, `Tactics you are running: ${tact.offense || "Balanced"} offense, ${tact.defense || "Man-to-man"} defense, ${tact.pace || "Balanced"} pace`],
        done: [e.chemistry != null ? `This season started with chemistry at ${e.chemistry} (the scale runs from 30 to 90)` : "Chemistry is set when the season starts."],
      };
    },
    fac: () => ({
      gives: [`+${f1(fac * 1.5)} signing chance on every offer`, `+${(fac * 0.15).toFixed(2)} growth points per player a year`],
      doing: [fac ? "Always on: it works for every recruit and every player, all year" : "Not upgraded: recruits and players get no bonus from your campus"],
      done: [],
    }),
  };
  const li = (t, i) => (0, s.jsx)("li", { children: t }, i);
  const card = (k) => {
    const r = role(k), isFac = k === "fac", person = isFac ? null : e.asst?.[k], lvl = st[k] || 0, c = content[k](), eff = isFac ? lvl : W_staffLv(e, k),
      justHired = !isFac && person && (person.yrs || 1) <= 1,   // a new hire is not credited with results from before he arrived
      done = justHired ? ["Just hired. His first results show after the next rollover."] : c.done;
    return (0, s.jsxs)("div", { className: "asst-card" + (!isFac && !person ? " vacant" : ""), children: [
      (0, s.jsxs)("div", { className: "asst-head", children: [
        (0, s.jsx)("small", { children: r.name.toUpperCase() }),
        (0, s.jsx)("h3", { children: isFac ? LV[lvl].replace("Not hired", "Not upgraded") : person ? person.name : "Vacant" }),
        !isFac && person && (0, s.jsx)(RatingBar, { value: person.rating }),
        (0, s.jsx)("p", { className: "muted", children: isFac ? `${LV[lvl]} \u00B7 ${q(W_staffLevelCost(e, k, lvl))} a year` : person ? `Rating ${person.rating} \u00B7 ${LV[lvl]} \u00B7 ${plural(person.yrs || 1, "season")} with you \u00B7 ${q(W_staffLevelCost(e, k, lvl))} a year \u00B7 works at level ${eff.toFixed(1)}` : "Nobody in this chair. Hire someone in the offseason (NIL budget > Staff)." }),
      ] }),
      (!isFac && !person) ? (0, s.jsx)("p", { className: "muted", children: `Without him you lose: ${r.perk}.` }) : (0, s.jsxs)(s.Fragment, { children: [
        (0, s.jsx)("h4", { children: "What he adds" }), (0, s.jsx)("ul", { children: c.gives.map(li) }),
        (0, s.jsx)("h4", { children: "What he is doing now" }), (0, s.jsx)("ul", { children: c.doing.map(li) }),
        done.length > 0 && (0, s.jsxs)(s.Fragment, { children: [(0, s.jsx)("h4", { children: "What he has done" }), (0, s.jsx)("ul", { children: done.map(li) })] }),
      ] }),
    ] }, k);
  };
  const news = (e.news || []).filter((n) => /assistant|staff/i.test(`${n.title} ${n.body}`)).slice(0, 5);
  return (0, s.jsxs)(s.Fragment, { children: [
    (0, s.jsx)(qe, { title: "Assistant coaches", meta: `Staff and facilities cost ${q(W_staffCostOf(e))} a year, taken from your available NIL (${q(Ce(e))} available now). Hire or change them in the offseason on the NIL budget page, Staff tab.`,
      children: (0, s.jsx)("div", { className: "asst-grid", children: ["rec", "dev", "tac", "fac"].map(card) }) }),
    news.length > 0 && (0, s.jsx)(qe, { title: "Staff news", children: (0, s.jsx)("ul", { className: "asst-news", children: news.map((n, i) => (0, s.jsx)("li", { children: (0, s.jsxs)("span", { children: [(0, s.jsx)("strong", { children: n.title }), ` \u00B7 ${n.year ?? ""} \u00B7 ${n.body}`] }) }, i)) }) }),
  ] });
}
window.__dbg && Object.assign(window.__dbg, { W_asstPool });
