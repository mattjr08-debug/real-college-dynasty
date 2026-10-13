// Recruiting tables (item 5): High school, Transfer portal and My recruits share this table (built on DataTable);
// the Walk-on pool uses DataTable directly (0115-o0.js). Reads the career only: nothing here changes a number.
// Key numbers sit right after the name: rating, interest (bar), signing chance (bar), NIL ask; then who leads the race,
// the star level and status, the player's priority, and the buttons.
var RT_RIVAL = new Map();
function rtRivals(e, p) {
  if (p.rv) return p.rv;
  const k = p.id + "|" + e.year + "|" + e.round;
  if (!RT_RIVAL.has(k)) {
    if (RT_RIVAL.size > 3000) RT_RIVAL.clear();
    RT_RIVAL.set(k, rivalsOf(e, p));
  }
  return RT_RIVAL.get(k);
}
// Who is ahead for this recruit: the same comparison the profile uses (your progress x 0.6 + interest x 0.4 against the rivals' scores).
// Transfers show the schools bidding for them instead (item 42).
function rtRace(e, p) {
  if (p.status !== "Available") return null;
  if (p.fid && p.bd && p.bd.length) return { you: !1, text: `${p.bd.length} bid${p.bd.length === 1 ? "" : "s"} \xB7 best: ${p.bd[0].n}` };
  if (p.origin === "Walk-on") return null;
  const rv = rtRivals(e, p),
    me = Math.round(p.progress * 0.6 + p.interest * 0.4),
    lead = [...rv, { n: "You", s: me }].sort((x, y) => y.s - x.s)[0];
  return lead ? { you: lead.n === "You", text: lead.n === "You" ? "You lead" : `${lead.n} leads` } : null;
}
function rtChance(e, p) {
  return p.origin === "Walk-on" ? fl(e, p) : Nn(e, p, p.offer ? p.offer.nil : p.ask, p.offer ? p.offer.role : "Rotation");
}
function RtBar({ value: e, label: a }) {
  return (0, s.jsxs)("div", {
    className: "rt-bar",
    "aria-label": a,
    children: [(0, s.jsxs)("strong", { children: [Math.round(e), "%"] }), (0, s.jsx)(Wa, { value: e })],
  });
}
function RecruitTable({ g: e, rows: a, run: t, select: l, kind: u, empty: o }) {
  const portal = u === "Transfer",
    board = u === "Board",
    line = (v) =>
      portal
        ? `${v.pos2 ? v.pos + "/" + v.pos2 : v.pos} \xB7 ${qs(v.height)} \xB7 ${v.year >= 4 ? "Grad transfer" : Zl(v)} \xB7 ${5 - v.year} yr left \xB7 eligible now`
        : board
          ? `${v.pos2 ? v.pos + "/" + v.pos2 : v.pos} \xB7 ${v.origin} \xB7 ${Zl(v)}`
          : `${v.pos2 ? v.pos + "/" + v.pos2 : v.pos} \xB7 ${qs(v.height)} \xB7 Age ${v.age}${v.intl ? " \xB7 International" + (v.cty ? " (" + v.cty + ")" : "") : ""}`,
    remove = (v) =>
      (!v.offer || window.confirm(`Remove ${v.name}? Your pending offer will be withdrawn.`)) &&
      t({ type: board ? "removeBoard" : "removeRecruit", id: v.id }),
    cols = [
      {
        key: "name",
        label: "PLAYER",
        render: (v) =>
          (0, s.jsxs)("button", {
            className: "player-cell",
            onClick: () => l(v.id),
            children: [
              (0, s.jsx)(Ja, { p: v, size: "tiny" }),
              (0, s.jsxs)("div", {
                children: [
                  (0, s.jsx)("strong", { children: v.name }),
                  (0, s.jsx)("span", { children: line(v) }),
                  portal && prevLine(v) ? (0, s.jsx)("span", { className: "prev-line", children: prevLine(v) }) : null,
                ],
              }),
            ],
          }),
      },
      {
        key: "ovr",
        label: "RATING",
        num: !0,
        get: (v) => Tt(v),
        render: (v) =>
          (0, s.jsxs)(s.Fragment, {
            children: [
              (0, s.jsx)("strong", { className: "rating-inline", children: (0, s.jsx)(RatingRing, { value: Tt(v) }) }),
              (0, s.jsx)("span", { className: "table-sub", children: v.origin === "Walk-on" || v.scouted >= 2 ? "Scouted" : "Estimated" }),
            ],
          }),
      },
      { key: "interest", label: "INTEREST", num: !0, get: (v) => v.interest, render: (v) => (0, s.jsx)(RtBar, { value: v.interest, label: "Interest" }) },
      {
        key: "chance",
        label: "SIGN CHANCE",
        num: !0,
        get: (v) => (v.status === "Available" ? rtChance(e, v) : -1),
        render: (v) =>
          v.status === "Available" ? (0, s.jsx)(RtBar, { value: rtChance(e, v), label: "Signing chance" }) : (0, s.jsx)("span", { className: "muted", children: "–" }),
      },
      {
        key: "ask",
        label: "NIL ASK",
        num: !0,
        get: (v) => v.ask || 0,
        render: (v) =>
          (0, s.jsxs)(s.Fragment, {
            children: [
              (0, s.jsx)("strong", { children: q(v.ask || 0) }),
              (0, s.jsx)("span", { className: "table-sub", children: v.offer ? `${q(v.offer.nil)} offered` : "per year" }),
            ],
          }),
      },
      {
        key: "race",
        label: "RIVALS",
        get: (v) => (rtRace(e, v) || { text: "" }).text,
        render: (v) => {
          const r = rtRace(e, v);
          return r ? (0, s.jsx)("span", { className: "rival-tag " + (r.you ? "you" : "them"), children: r.text }) : (0, s.jsx)("span", { className: "muted", children: "–" });
        },
      },
      board && {
        key: "progress",
        label: "DECISION",
        num: !0,
        get: (v) => (v.status === "Available" ? v.progress : 101),
        render: (v) => (v.status === "Available" ? (0, s.jsx)(RtBar, { value: v.progress, label: "Decision progress" }) : (0, s.jsx)("span", { className: "table-sub", children: "Decided" })),
      },
      {
        key: "stars",
        label: "STATUS",
        num: !1,
        get: (v) => v.stars,
        render: (v) =>
          (0, s.jsxs)(s.Fragment, {
            children: [
              (0, s.jsx)(Xn, { n: v.stars }),
              (0, s.jsx)("span", {
                className: "table-sub",
                children:
                  v.status === "Signed"
                    ? "Committed to you"
                    : v.offer
                      ? "Offer pending"
                      : v.committedTo && v.status !== "Available"
                        ? v.committedTo
                        : v.status,
              }),
              v.status === "Available" && Object.keys(v.pitched || {}).length > 0
                ? (0, s.jsx)("span", { className: "pitch-tag", title: Object.keys(v.pitched).join(", "), children: `Pitched \xD7${Object.keys(v.pitched).length}` })
                : null,
            ],
          }),
      },
      !board && { key: "priority", label: "PRIORITY", className: "muted" },
      {
        key: "act",
        label: "",
        sort: !1,
        render: (v) =>
          (0, s.jsxs)("div", {
            className: "rt-actions",
            children: [
              !board &&
                (0, s.jsx)("button", {
                  className: `icon-btn ${v.target ? "accent" : ""}`,
                  "aria-label": v.target ? `Unwatch ${v.name}` : `Watch ${v.name}`,
                  onClick: () => t({ type: "target", id: v.id }),
                  children: (0, s.jsx)(ro, { size: 18, fill: v.target ? "currentColor" : "none" }),
                }),
              board &&
                v.status === "Available" &&
                (0, s.jsx)("select", {
                  "aria-label": `Choice rank for ${v.name}`,
                  value: v.rank || 0,
                  onChange: (z) => t({ type: "rankRecruit", id: v.id, rank: +z.target.value }),
                  children: [
                    [0, "Choice —"],
                    [1, "1st choice"],
                    [2, "2nd choice"],
                    [3, "3rd choice"],
                  ].map((z) => (0, s.jsx)("option", { value: z[0], children: z[1] }, z[0])),
                }),
              (0, s.jsx)(X, { small: !0, onClick: () => l(v.id), children: "View" }),
              v.status !== "Signed" &&
                (0, s.jsx)(X, { small: !0, className: "cut-btn", title: "Remove this recruit from the list", onClick: () => remove(v), children: "Remove" }),
            ],
          }),
      },
    ].filter(Boolean);
  return (0, s.jsx)("div", {
    className: "panel recruit-table",
    children: (0, s.jsx)(DataTable, {
      columns: cols,
      rows: a,
      tableClass: "prospect-table",
      rowClass: (v) => (v.status === "Signed" ? "row-signed" : v.target ? "row-target" : ""),
      empty: o,
      expand: !1,
    }),
  });
}
// Chip row for a filter: [value, label] pairs.
function ChipFilter({ value: e, onChange: a, items: t, label: l }) {
  return (0, s.jsx)(Tabs, { tabs: t.map(([u, o]) => ({ id: u, label: o })), value: e, onChange: a, label: l });
}
