// Shared Table (item 2). DataTable({ columns, rows, filters, rowClass, empty, title, expand })
//  columns: [{ key, label, num?, sort?, get?(row) -> sort value, render?(row, i) -> node, className? }]
//    num: right-aligned tabular numbers (guessed from the first rows when left out); sort: false turns sorting off for that column.
//  rows: array of objects. filters: [{ label, test(row) }] shown as chips above the table ("All" is added).
//  Click a header to sort (arrow shows direction, click again to reverse, a third click restores the original order).
//  Wide tables (9+ columns, or expand: true) get an Expand button (icon in the corner) that opens the same table full screen; Esc or Close returns.
// Every other table in the game gets right-aligned tabular numbers from the small script at the end of this file.
function DataTable({ columns: e, rows: a, filters: t, rowClass: l, empty: u, expand: o, bare: bare, tableClass: tc }) {
  const [r, n] = (0, N.useState)(null),
    [i, d] = (0, N.useState)(0),
    [f, y] = (0, N.useState)(!1),
    xs = (t || []).length ? t : null,
    flt = xs && i > 0 ? xs[i - 1] : null,
    isNum = (c) => {
      if (c.num != null) return c.num;
      const vs = a.slice(0, 8).map((z) => (c.get ? c.get(z) : z[c.key]));
      return vs.length > 0 && vs.every((v) => typeof v === "number" || (typeof v === "string" && /^[+\-–]?\$?\d[\d,.]*\s?(%|[kKmM])?$|^\d+[–-]\d+$/.test(v.trim())));
    },
    cols = e.map((c) => ({ ...c, num: isNum(c) })),
    val = (c, z) => (c.get ? c.get(z) : z[c.key]),
    cmp = (x, z) => {
      const p = typeof x === "string" ? parseFloat(x.replace(/[^0-9.\-]/g, "")) : x,
        q = typeof z === "string" ? parseFloat(z.replace(/[^0-9.\-]/g, "")) : z;
      if (typeof x === "number" || typeof z === "number" || (!isNaN(p) && !isNaN(q) && /\d/.test(x) && /\d/.test(z))) return (isNaN(p) ? -1e12 : p) - (isNaN(q) ? -1e12 : q);
      return String(x ?? "").localeCompare(String(z ?? ""));
    };
  let rows = flt ? a.filter(flt.test) : a;
  if (r) {
    const c = cols.find((z) => z.key === r.key);
    if (c) rows = [...rows].sort((x, z) => r.dir * cmp(val(c, x), val(c, z)));
  }
  const clickHead = (c) => {
      if (c.sort === !1) return;
      n(!r || r.key !== c.key ? { key: c.key, dir: c.num ? -1 : 1 } : r.dir === (c.num ? -1 : 1) ? { key: c.key, dir: -r.dir } : null);
    },
    table = (full) =>
      (0, s.jsx)("div", {
        className: "table-wrap ds-table-wrap",
        children: (0, s.jsxs)("table", {
          className: "ds-table" + (full ? " full" : "") + (tc ? " " + tc : ""),
          children: [
            (0, s.jsx)("thead", {
              children: (0, s.jsx)("tr", {
                children: cols.map((c) => {
                  const on = r && r.key === c.key;
                  return (0, s.jsx)(
                    "th",
                    {
                      className: (c.num ? "ds-num " : "") + (c.sort === !1 ? "" : "sortable ") + (on ? "sorted" : ""),
                      "aria-sort": on ? (r.dir > 0 ? "ascending" : "descending") : void 0,
                      children:
                        c.sort === !1
                          ? c.label
                          : (0, s.jsxs)("button", {
                              type: "button",
                              className: "ds-sort",
                              onClick: () => clickHead(c),
                              title: "Sort by " + c.label,
                              children: [c.label, (0, s.jsx)("span", { className: "ds-arrow", "aria-hidden": "true", children: on ? (r.dir > 0 ? "▲" : "▼") : "⇅" })],
                            }),
                    },
                    c.key
                  );
                }),
              }),
            }),
            (0, s.jsx)("tbody", {
              children: rows.map((z, k) =>
                (0, s.jsx)(
                  "tr",
                  {
                    className: l ? l(z) : "",
                    children: cols.map((c) =>
                      (0, s.jsx)("td", { className: (c.num ? "ds-num " : "") + (c.className || ""), children: c.render ? c.render(z, k) : val(c, z) }, c.key)
                    ),
                  },
                  z.id ?? k
                )
              ),
            }),
          ],
        }),
      }),
    wide = o ?? e.length >= 9;
  (0, N.useEffect)(() => {
    if (!f) return;
    const h = (z) => z.key === "Escape" && y(!1);
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [f]);
  const body = (full) =>
    (0, s.jsxs)(s.Fragment, {
      children: [
        xs &&
          (0, s.jsx)(Tabs, {
            tabs: [{ id: 0, label: "All", count: a.length }, ...xs.map((z, k) => ({ id: k + 1, label: z.label, count: a.filter(z.test).length }))],
            value: i,
            onChange: d,
            label: "Filter",
          }),
        rows.length ? table(full) : u || (0, s.jsx)("p", { className: "muted ds-empty", children: "Nothing to show yet." }),
      ],
    });
  return (0, s.jsxs)("div", {
    className: "ds-table-box" + (bare ? " bare" : ""),
    children: [
      wide && (0, s.jsx)("button", { type: "button", className: "table-expand", "aria-label": "Expand table", title: "Expand table to full screen", onClick: () => y(!0), children: "⤢" }),
      body(!1),
      f &&
        (0, s.jsxs)("div", {
          className: "table-overlay",
          role: "dialog",
          "aria-modal": "true",
          children: [(0, s.jsx)("button", { type: "button", className: "table-close btn", onClick: () => y(!1), children: "Close (Esc)" }), body(!0)],
        }),
    ],
  });
}
// Right-aligned tabular numbers for every table that is not a DataTable: a column whose body cells are (nearly) all numbers gets class ds-num.
(function () {
  const num = /^[+\-–−]?\$?\d[\d,.]*\s?(%|[kKmM]|\/yr)?$|^\d+[–\-]\d+$/;
  const mark = (t) => {
    if (t.classList.contains("ds-table") || !t.tBodies.length) return;
    const rows = [...t.tBodies[0].rows].slice(0, 40);
    if (!rows.length) return;
    const n = Math.max(...rows.map((r) => r.cells.length));
    for (let c = 0; c < n; c++) {
      let seen = 0,
        hit = 0;
      rows.forEach((r) => {
        const cell = r.cells[c];
        if (!cell || r.cells.length < n) return;
        const x = cell.textContent.trim();
        if (x && x !== "–") {
          seen++;
          if (num.test(x)) hit++;
        }
      });
      const on = seen >= 2 && hit / seen >= 0.8;
      [...t.rows].forEach((r) => {
        const cell = r.cells[c];
        if (cell && r.cells.length === n && !cell.matches("td[colspan],th[colspan]")) cell.classList.toggle("ds-num", on);
      });
    }
  };
  let pend = new Set(),
    raf = 0;
  const run = () => {
    raf = 0;
    const list = pend;
    pend = new Set();
    list.forEach((t) => t.isConnected && mark(t));
  };
  const queue = (t) => {
    pend.add(t);
    if (!raf) raf = requestAnimationFrame(run);
  };
  const seek = (el) => {
    if (el.nodeType !== 1) return;
    const up = el.closest && el.closest("table");
    if (up) queue(up);
    else if (el.querySelectorAll) el.querySelectorAll("table").forEach(queue);
  };
  if (typeof MutationObserver !== "undefined" && typeof document !== "undefined")
    new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach(seek))).observe(document.documentElement, { childList: true, subtree: true });
})();
