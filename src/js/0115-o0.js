function o0({ g: e, run: a, select: t }) {
  let [l, u] = (0, N.useState)("All"),
    [o, r] = (0, N.useState)(""),
    [n, i] = (0, N.useState)("Overall"),
    [d, f] = (0, N.useState)(!0),
    y = e.walkons
      .filter(
        (p) =>
          (l === "All" || p.pos === l) &&
          (!d || p.status === "Available") &&
          p.name.toLowerCase().includes(o.toLowerCase())
      )
      .sort((p, C) => (n === "Overall" ? C.ovr - p.ovr : fl(e, C) - fl(e, p))),
    h = e.roster.length + e.prospects.filter((p) => p.offer).length >= 15;
  return (0, s.jsxs)(s.Fragment, {
    children: [
      (0, s.jsxs)("div", {
        className: "recruit-banner",
        children: [
          (0, s.jsxs)("div", {
            children: [
              (0, s.jsx)("p", { className: "eyebrow", children: "OPEN TRYOUTS" }),
              (0, s.jsx)("h2", { children: "Find an overlooked player." }),
              (0, s.jsx)("p", {
                children:
                  "100 new faces each offseason. Most provide modest depth. Rare 60\u201370 OVR prospects have a much lower chance of accepting a walk-on role.",
              }),
            ],
          }),
          (0, s.jsxs)("div", {
            className: "recruit-resources",
            children: [
              (0, s.jsxs)("div", {
                children: [
                  (0, s.jsx)("strong", {
                    children: e.walkons.filter((p) => p.status === "Available").length,
                  }),
                  (0, s.jsx)("span", { children: "AVAILABLE" }),
                ],
              }),
              (0, s.jsxs)("div", {
                children: [
                  (0, s.jsx)("strong", { children: "$0" }),
                  (0, s.jsx)("span", { children: "NIL REQUIRED" }),
                ],
              }),
              (0, s.jsxs)("div", {
                children: [
                  (0, s.jsx)("strong", { children: 15 - e.roster.length }),
                  (0, s.jsx)("span", { children: "OPEN SPOTS" }),
                ],
              }),
            ],
          }),
        ],
      }),
      (0, s.jsxs)("div", {
        className: "toolbar wrap",
        children: [
          (0, s.jsxs)("div", {
            className: "search-field",
            children: [
              (0, s.jsx)(Va, { size: 17 }),
              (0, s.jsx)("input", {
                "aria-label": "Search walk-ons",
                placeholder: "Search walk-ons\u2026",
                value: o,
                onChange: (p) => r(p.target.value),
              }),
            ],
          }),
          (0, s.jsx)(ChipFilter, {
            label: "Walk-on position",
            value: l,
            onChange: u,
            items: ["All", ...Le].map((p) => [p, p === "All" ? "All positions" : p]),
          }),
          (0, s.jsx)("select", {
            "aria-label": "Sort walk-ons",
            value: n,
            onChange: (p) => i(p.target.value),
            children: ["Overall", "Signing chance"].map((p) => (0, s.jsx)("option", { children: p }, p)),
          }),
          (0, s.jsxs)("label", {
            className: "inline-checkbox",
            children: [
              (0, s.jsx)("input", { type: "checkbox", checked: d, onChange: (p) => f(p.target.checked) }),
              "Available only",
            ],
          }),
          (0, s.jsx)(Zn, { g: e, run: a }),
        ],
      }),
      (0, s.jsx)("div", {
        className: "panel recruit-table",
        children: (0, s.jsx)(DataTable, {
          tableClass: "prospect-table",
          expand: !1,
          rows: y,
          rowClass: (p) => (p.status === "Signed" ? "row-signed" : ""),
          empty: (0, s.jsx)(yl, {
            title: "No matching walk-ons",
            body: "Change your filters or show players who have already made a decision.",
          }),
          columns: [
            {
              key: "name",
              label: "PLAYER",
              render: (p) =>
                (0, s.jsxs)("button", {
                  className: "player-cell",
                  onClick: () => t(p.id),
                  children: [
                    (0, s.jsx)(Ja, { p, size: "tiny" }),
                    (0, s.jsxs)("div", {
                      children: [
                        (0, s.jsx)("strong", { children: p.name }),
                        (0, s.jsxs)("span", { children: [p.pos2 ? p.pos + "/" + p.pos2 : p.pos, " \xB7 ", Zl(p)] }),
                      ],
                    }),
                  ],
                }),
            },
            {
              key: "ovr",
              label: "RATING",
              num: !0,
              render: (p) =>
                (0, s.jsxs)(s.Fragment, {
                  children: [
                    (0, s.jsx)("strong", { className: "rating-inline", children: p.ovr }),
                    p.ovr >= 60 && (0, s.jsx)("span", { className: "table-sub orange-text", children: "RARE FIND" }),
                  ],
                }),
            },
            { key: "acc", label: "ACCEPTANCE", num: !0, get: (p) => fl(e, p), render: (p) => (0, s.jsx)(RtBar, { value: fl(e, p), label: "Chance he accepts" }) },
            { key: "nil", label: "NIL", num: !0, sort: !1, render: () => "$0" },
            { key: "height", label: "HEIGHT / AGE", get: (p) => p.height, render: (p) => `${qs(p.height)} \xB7 ${p.age}` },
            {
              key: "status",
              label: "STATUS",
              render: (p) => (0, s.jsx)(he, { tone: p.status === "Signed" ? "green" : "", children: p.status === "Signed" ? "Committed" : p.status }),
            },
            {
              key: "act",
              label: "",
              sort: !1,
              render: (p) =>
                (0, s.jsx)(X, {
                  small: !0,
                  disabled: (e.phase !== "Offseason" && e.phase !== "Regular season") || h || p.status !== "Available",
                  onClick: () => {
                    a({ type: "walkon", id: p.id });
                  },
                  children: "Invite \xB7 $0 NIL",
                }),
            },
          ],
        }),
      }),
      (0, s.jsx)("p", {
        className: "footnote",
        children:
          "Invitations receive an immediate decision. Pending recruiting offers reserve roster spots. There is no NIL cost, and walk-ons still earn minutes through their performance.",
      }),
    ],
  });
}
