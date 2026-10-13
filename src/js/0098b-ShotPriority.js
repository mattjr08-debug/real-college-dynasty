// Coaching > Shot priority: rank the players who should take the most shots and get the ball the most. Blank = the normal game.
function ShotPriority({ g: e, run: a }) {
  const ids = (e.shotPriority || []).filter((id) => e.roster.some((p) => p.id === id)).slice(0, 5),
    labels = ["1st option", "2nd option", "3rd option", "4th option", "5th option"],
    effect = (i) => `${Math.round((TUNE.spBoost[i] - 1) * 100)}% more shots and touches at his usual percentages`,
    set = (slot, id) => {
      const slots = [0, 1, 2, 3, 4].map((i) => ids[i] || "");
      for (let i = 0; i < 5; i++) if (id && slots[i] === id) slots[i] = "";
      slots[slot] = id;
      a({ type: "shotPriority", ids: slots.filter(Boolean) });
    },
    pool = e.roster.filter((p) => !p.redshirt).sort((x, y) => y.ovr - x.ovr);
  return (0, s.jsxs)(qe, {
    title: "Shot priority",
    meta: ids.length ? `${ids.length} player${ids.length === 1 ? "" : "s"} ranked` : "Not set: your team plays the normal way",
    action: ids.length ? (0, s.jsx)(X, { small: !0, onClick: () => a({ type: "shotPriority", ids: [] }), children: "Clear priority" }) : null,
    children: [
      (0, s.jsx)("p", {
        className: "muted",
        style: { padding: "14px 18px 4px", margin: 0 },
        children:
          "Pick the players who should take the most shots, in order. They get the ball more and shoot more often when they are on the floor, at their usual percentages, so a priority player's scoring average goes up. Leave it blank and everyone plays the normal way. It does not change minutes: a player on your list who is on the bench does nothing until he plays.",
      }),
      (0, s.jsx)("div", {
        className: "lineup-selectors shot-priority",
        children: labels.map((r, n) =>
          (0, s.jsxs)(
            "label",
            {
              children: [
                r,
                (0, s.jsxs)("select", {
                  "aria-label": `${r} to take shots`,
                  value: ids[n] || "",
                  onChange: (i) => set(n, i.target.value),
                  children: [
                    (0, s.jsx)("option", { value: "", children: n === 0 ? "None: normal" : "None" }),
                    pool
                      .filter((p) => p.id === ids[n] || !ids.includes(p.id))
                      .map((p) =>
                        (0, s.jsxs)("option", { value: p.id, children: [p.name, " \u00B7 ", p.pos2 ? p.pos + "/" + p.pos2 : p.pos, " \u00B7 ", p.ovr, " OVR", p.injury > 0 ? " (injured)" : ""] }, p.id)
                      ),
                  ],
                }),
                (0, s.jsx)("small", { className: "muted", children: ids[n] ? effect(n) : "\u00A0" }),
              ],
            },
            r
          )
        ),
      }),
    ],
  });
}
