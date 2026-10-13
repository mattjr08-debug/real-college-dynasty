// Settings > About (item 32): which build this is, and a "What's new" list built from the instruction log.
function AboutPanel() {
  let [all, setAll] = (0, N.useState)(!1),
    b = BUILD_INFO,
    day = (iso) => {
      try {
        let [y, m, d] = String(iso).split("-").map(Number);
        return new Date(y, m - 1, d).toLocaleDateString(undefined, { dateStyle: "medium" });
      } catch {
        return iso || "";
      }
    },
    stamp = (iso) => {
      try {
        return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
      } catch {
        return iso || "";
      }
    },
    rows = all ? WHATS_NEW : WHATS_NEW.slice(0, 8);
  return (0, s.jsxs)(s.Fragment, {
    children: [
      (0, s.jsx)(qe, {
        title: "This version",
        meta: "The build number goes up by one with every saved change, so two copies of the game can be told apart.",
        children: (0, s.jsx)("div", {
          className: "set-body",
          children: [
            ["Game", `College Dynasty ${b.version}`],
            ["Build", `${b.build} · commit ${b.commit}${b.dirty ? " + changes not saved to history yet" : ""}`],
            ["Built", stamp(b.date)],
            ["Save format", `${SAVE_VERSION} (a save made by a newer game cannot be opened by an older one)`],
          ].map((r) =>
            (0, s.jsxs)(
              "div",
              {
                className: "set-row about-row",
                children: [(0, s.jsx)("strong", { children: r[0] }), (0, s.jsx)("span", { children: r[1] })],
              },
              r[0]
            )
          ),
        }),
      }),
      (0, s.jsx)(qe, {
        title: "What’s new",
        meta: "Every change made to the game, newest first, taken from the instruction log.",
        children: (0, s.jsxs)("div", {
          className: "set-body",
          children: [
            rows.length === 0 &&
              (0, s.jsx)("div", { className: "set-row", children: (0, s.jsx)("small", { children: "No changes recorded yet." }) }),
            rows.map((r) =>
              (0, s.jsx)(
                "div",
                {
                  className: "set-row whats-new-row",
                  children: (0, s.jsxs)("div", {
                    children: [
                      (0, s.jsxs)("strong", { children: [r.title || "Change", " ", (0, s.jsx)("span", { className: "muted", children: `#${r.id} · ${day(r.date)}` })] }),
                      r.text && (0, s.jsx)("small", { children: r.text }),
                    ],
                  }),
                },
                r.id
              )
            ),
            WHATS_NEW.length > 8 &&
              (0, s.jsx)(X, {
                small: !0,
                onClick: () => setAll(!all),
                children: all ? "Show fewer" : `Show all ${WHATS_NEW.length}`,
              }),
          ],
        }),
      }),
    ],
  });
}
