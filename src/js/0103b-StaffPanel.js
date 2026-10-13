function StaffPanel({ g: e, run: a, hire: hire }) {
  let st = e.staff || {},
    open = e.phase === "Offseason",
    LV = ["None", "Level 1", "Level 2", "Level 3"],
    pool = e.asstPool || W_asstPool(e),
    // item 23: assistants are people with a rating; the level buttons set what you pay, the rating scales the perk (65 = the base perk)
    levelButtons = (r) =>
      [0, 1, 2, 3].map((lv) => {
        let cur = st[r.k] || 0,
          extra = W_staffLevelCost(e, r.k, lv) - W_staffLevelCost(e, r.k, cur);
        return (0, s.jsx)(
          X,
          {
            disabled: !open || lv === cur || extra > Ce(e) || (r.k !== "fac" && lv > 0 && !e.asst?.[r.k]),
            title: extra > Ce(e) ? "Not enough available NIL" : "",
            onClick: () => a({ type: "staff", key: r.k, level: lv }),
            children: `${lv} \xB7 ${q(W_staffLevelCost(e, r.k, lv))}`,
          },
          lv
        );
      });
  return (0, s.jsxs)(s.Fragment, {
    children: [
      !hire && (0, s.jsx)(qe, {
        title: "Coaching staff and facilities",
        meta: `Staff and facilities cost ${q(W_staffCostOf(e))} a year, taken from your available NIL (${q(Ce(e))} available now). They can only be changed in the offseason.`,
        children: (0, s.jsx)("div", {
          className: "table-wrap",
          children: (0, s.jsxs)("table", {
            children: [
              (0, s.jsx)("thead", {
                children: (0, s.jsx)("tr", {
                  children: ["ROLE", "WHO AND LEVEL", "WHAT IT DOES", "SET LEVEL (YEARLY COST)"].map((z) =>
                    (0, s.jsx)("th", { children: z }, z)
                  ),
                }),
              }),
              (0, s.jsx)("tbody", {
                children: STAFF_ROLES.map((r) => {
                  let p = r.k === "fac" ? null : e.asst?.[r.k];
                  return (0, s.jsxs)(
                    "tr",
                    {
                      children: [
                        (0, s.jsx)("td", { children: (0, s.jsx)("strong", { children: r.name }) }),
                        (0, s.jsx)("td", {
                          children:
                            r.k === "fac"
                              ? LV[st[r.k] || 0]
                              : p
                                ? `${p.name} \xB7 rating ${p.rating} \xB7 ${LV[st[r.k] || 0]} \xB7 ${p.yrs || 1} season${(p.yrs || 1) === 1 ? "" : "s"} here`
                                : "Vacant (hire one on the Hire assistants tab)",
                        }),
                        (0, s.jsx)("td", { className: "muted", children: r.perk }),
                        (0, s.jsx)("td", { children: levelButtons(r) }),
                      ],
                    },
                    r.k
                  );
                }),
              }),
            ],
          }),
        }),
      }),
      hire && (0, s.jsx)(qe, {
        title: "Assistant candidates",
        meta: open
          ? "Hire a named assistant at a level. A rating of 65 gives the plain perk, 85 about a third more, 45 about a third less. Better assistants cost more, and good ones can be hired away or leave for head jobs, so check this tab every offseason."
          : "Hiring opens in the offseason.",
        children: (0, s.jsx)("div", {
          className: "table-wrap",
          children: (0, s.jsxs)("table", {
            children: [
              (0, s.jsx)("thead", {
                children: (0, s.jsx)("tr", {
                  children: ["ROLE", "CANDIDATE", "RATING", "HIRE AT LEVEL (YEARLY COST)"].map((z) => (0, s.jsx)("th", { children: z }, z)),
                }),
              }),
              (0, s.jsx)("tbody", {
                children: ASST_ROLES.flatMap((k) =>
                  (pool[k] || []).map((c) =>
                    (0, s.jsxs)(
                      "tr",
                      {
                        children: [
                          (0, s.jsx)("td", { children: STAFF_ROLES.find((r) => r.k === k).name }),
                          (0, s.jsx)("td", { children: c.name }),
                          (0, s.jsx)("td", { children: c.rating }),
                          (0, s.jsx)("td", {
                            children: [1, 2, 3].map((lv) => {
                              let extra =
                                W_staffLevelCost(e, k, lv, c) - W_staffLevelCost(e, k, st[k] || 0, e.asst?.[k] || null);
                              return (0, s.jsx)(
                                X,
                                {
                                  disabled: !open || extra > Ce(e),
                                  title: extra > Ce(e) ? "Not enough available NIL" : "",
                                  onClick: () => a({ type: "hireAsst", key: k, id: c.id, level: lv }),
                                  children: `${lv} \xB7 ${q(W_staffLevelCost(e, k, lv, c))}`,
                                },
                                lv
                              );
                            }),
                          }),
                        ],
                      },
                      c.id
                    )
                  )
                ),
              }),
            ],
          }),
        }),
      }),
      !hire && (0, s.jsxs)("div", {
        className: "callout",
        children: [
          (0, s.jsx)(ja, { size: 24 }),
          (0, s.jsx)("p", {
            children:
              "Every dollar spent here is a dollar you cannot offer players. Costs are a share of your base budget, so they grow as the program grows. The perks are small on their own and add up at higher levels.",
          }),
        ],
      }),
    ],
  });
}
