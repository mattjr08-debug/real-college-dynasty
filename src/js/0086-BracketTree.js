// Item 7: the bracket is scaled to the width of its box (never scrolls sideways); Expand opens it in a full-window view, scaled the same way.
function BracketTree(props) {
  const [open, setOpen] = (0, N.useState)(!1),
    big = (props.rounds || []).some((r) => r && r.length >= 4);
  (0, N.useEffect)(() => {
    if (!open) return;
    const h = (z) => z.key === "Escape" && setOpen(!1);
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open]);
  return (0, s.jsxs)("div", {
    className: "ds-table-box bt-box",
    children: [
      big && (0, s.jsx)("button", { type: "button", className: "table-expand", "aria-label": "Expand table", title: "Open the bracket full screen", onClick: () => setOpen(!0), children: "\u2922" }),
      (0, s.jsx)(BracketTreeInner, props),
      open &&
        (0, s.jsxs)("div", {
          className: "table-overlay",
          role: "dialog",
          "aria-modal": "true",
          children: [(0, s.jsx)("button", { type: "button", className: "table-close btn", onClick: () => setOpen(!1), children: "Close (Esc)" }), (0, s.jsx)(BracketTreeInner, props)],
        }),
    ],
  });
}
function btCrest(name, me, school) {
  // your school gets its real logo; everyone else a generated one in a steady color (bracket rows only carry names)
  const sc = school && name === me ? school : hqOppSchool({ id: name, name, short: String(name).replace(/[^A-Z]/g, "").slice(0, 3) || String(name).slice(0, 3).toUpperCase() });
  return (0, s.jsx)("span", { className: "bt-logo", "aria-hidden": "true", children: (0, s.jsx)(SchoolLogo, { school: sc }) });
}
function BracketTreeInner({ rounds: r0, names: nm, me: me, regions: regions, school: school }) {
  // a First Four round is shown as a line above the tree; the tree itself starts with the round of 64
  let ffRound = r0[0]?.[0]?.ff || r0[0]?.[0]?.pi ? r0[0] : null,
    r = ffRound ? r0.slice(1) : r0,
    ref = (0, N.useRef)(null);
  (0, N.useEffect)(() => {
    let fit = () => {
      let el = ref.current,
        w = el && el.firstChild;
      if (!w) return;
      w.style.zoom = 1;
      let a = w.scrollWidth,
        c = el.clientWidth - 28;
      (a > c
        ? (w.style.zoom = Math.max(0.25, c / a))
        : el.closest(".table-overlay") && (w.style.zoom = Math.min(1.8, c / a)),
        (el.scrollLeft = Math.max(0, (el.scrollWidth - el.clientWidth) / 2)));
    };
    (fit(), window.addEventListener("resize", fit));
    return () => window.removeEventListener("resize", fit);
  }, [r.length]);
  let n0 = r[0]?.length || 0,
    R = n0 ? Math.round(Math.log2(n0)) + 1 : 0,
    all = Array.from({ length: R }, (_, i) => {
      let c = n0 / Math.pow(2, i);
      return r[i] && r[i].length === c ? r[i] : Array.from({ length: c }, () => ({ a: "", b: "", tbd: !0 }));
    }),
    L = [],
    Rt = [];
  for (let i = 0; i < R - 1; i++) {
    let h = all[i].length / 2;
    (L.push(all[i].slice(0, h)), Rt.push(all[i].slice(h)));
  }
  let ch = all[R - 1]?.[0]?.w,
    game = (g, k) =>
      (0, s.jsx)(
        "div",
        {
          className: `bt-game${g.me ? " mine" : ""}${g.tbd ? " tbd" : ""}`,
          children: [
            ["a", "sa", "sda"],
            ["b", "sb", "sdb"],
          ].map(([t, c, d]) =>
            (0, s.jsxs)(
              "div",
              {
                className: `bt-team${g.w && g.w === g[t] ? " win" : ""}${g[t] && g[t] === me ? " me" : ""}`,
                children: [
                  (0, s.jsxs)("span", {
                    children: [
                      g[d] ? (0, s.jsx)("i", { className: "seed", children: g[d] }) : null,
                      g[t] ? btCrest(g[t], me, school) : null,
                      g[t] || "TBD",
                    ],
                  }),
                  (0, s.jsx)("b", { children: g[c] ?? "" }),
                ],
              },
              t
            )
          ),
        },
        k
      ),
    col = (g, i, k) =>
      (0, s.jsxs)(
        "div",
        {
          className: "bt-col",
          children: [
            (0, s.jsx)("h4", { children: nm[i] || `Round ${i + 1}` }),
            (0, s.jsx)("div", { className: "bt-games", children: g.map(game) }),
          ],
        },
        k
      );
  return R
    ? (0, s.jsxs)("div", {
        className: n0 >= 16 ? "bt bt-compact" : "bt",
        children: [
          (0, s.jsxs)("p", {
            className: "champ-line",
            children: ["Champion: ", (0, s.jsx)("strong", { children: ch || "\u2014" })],
          }),
          regions &&
            (0, s.jsx)("p", {
              className: "muted",
              style: { fontSize: 12, margin: "4px 0" },
              children: "Regions: " + regions + " (the first two regions are on the left of the bracket, the last two on the right).",
            }),
          ffRound &&
            (0, s.jsx)("p", {
              className: "muted",
              style: { fontSize: 12, margin: "4px 0 8px" },
              children: (r0[0][0].pi ? "First round (the top four seeds have a bye): " : "First Four: ") + ffRound.map((g) => (g.sda ? "(" + g.sda + ") " : "") + g.a + " " + (g.sa ?? "") + "-" + (g.sb ?? "") + " " + g.b + (g.w ? " (" + g.w + " advance)" : "")).join(" \u00B7 "),
            }),
          (0, s.jsx)("div", {
            className: "bt-scroll",
            ref: ref,
            children: (0, s.jsxs)("div", {
              className: "bt-wrap",
              style: { "--n": all[0].length / 2 },
              children: [
                L.map((g, i) => col(g, i, "l" + i)),
                col(all[R - 1], R - 1, "c"),
                [...Rt].reverse().map((g, i) => col(g, R - 2 - i, "r" + i)),
              ],
            }),
          }),
        ],
      })
    : null;
}
