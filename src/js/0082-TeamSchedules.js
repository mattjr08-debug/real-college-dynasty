function TeamSchedules({ g: e }) {
  let [ci, setCi] = (0, N.useState)(0),
    [tid, setTid] = (0, N.useState)(""),
    ids = (e.confs || [])[ci] || [],
    cur = ids.includes(tid) ? tid : ids.find((i) => i !== e.school.id) || ids[0],
    rows = cur ? W_tsch(e, cur) : [],
    t = cur && W_t(e, cur);
  return (0, s.jsxs)(qe, {
    title: "Team schedules",
    meta: "Every team plays 12 nonconference and 18 conference games. Pick a conference and a team.",
    children: [
      (0, s.jsxs)("div", {
        className: "stat-toggles",
        children: [
          (0, s.jsxs)("label", {
            className: "sort-pick",
            children: [
              (0, s.jsx)("span", { children: "Conference" }),
              (0, s.jsx)("select", {
                value: ci,
                onChange: (z) => {
                  (setCi(+z.target.value), setTid(""));
                },
                children: (e.confNames || []).map((n, i) =>
                  (0, s.jsx)("option", { value: i, children: n }, i)
                ),
              }),
            ],
          }),
          (0, s.jsxs)("label", {
            className: "sort-pick",
            children: [
              (0, s.jsx)("span", { children: "Team" }),
              (0, s.jsx)("select", {
                value: cur,
                onChange: (z) => setTid(z.target.value),
                children: ids.map((i) => {
                  let o = W_t(e, i);
                  return (0, s.jsx)("option", { value: i, children: o ? o.name : i }, i);
                }),
              }),
            ],
          }),
        ],
      }),
      (0, s.jsx)("div", {
        className: "table-wrap",
        children: (0, s.jsxs)("table", {
          children: [
            (0, s.jsx)("thead", {
              children: (0, s.jsx)("tr", {
                children: ["#", "TYPE", "OPPONENT", "RESULT"].map((z) =>
                  (0, s.jsx)("th", { children: z }, z)
                ),
              }),
            }),
            (0, s.jsx)("tbody", {
              children: rows.map((r) =>
                (0, s.jsxs)(
                  "tr",
                  {
                    children: [
                      (0, s.jsx)("td", { children: r.d }),
                      (0, s.jsx)("td", { className: "muted", children: r.k }),
                      (0, s.jsx)("td", { children: r.opp }),
                      (0, s.jsx)("td", {
                        className: r.r === "W" ? "hl" : "muted",
                        children: r.r || "\u2014",
                      }),
                    ],
                  },
                  r.d
                )
              ),
            }),
          ],
        }),
      }),
    ],
  });
}
