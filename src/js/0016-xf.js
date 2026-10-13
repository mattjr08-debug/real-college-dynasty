function xf(e, l) {
  return {
    id: l.id,
    name: l.name,
    pos: l.pos,
    ovr: l.ovr,
    pot: l.potential,
    cls: ["Freshman", "Sophomore", "Junior", "Senior"][Math.min(3, l.year - 1)] || "Junior",
    why:
      l.promise === "Starter" && !e.lineup.includes(l.id)
        ? "Broken promise: he was promised a starting role"
        : l.__sg
          ? "Recruited over at his position"
          : l.pers === "Ambitious" && e.rep < 45
            ? "Wants a bigger program"
            : l.pers === "Money-focused" && l.nil < l.ask * 0.8
              ? "Wants more NIL"
              : TS(l.id + "-pers") % 5 === 0
                ? // item 31: about one player in five has a personal reason that decides it (family, a fresh start)
                  ["Personal reasons: wants to be closer to family", "Personal reasons: a family matter at home", "Personal reasons: needs a fresh start"][TS(l.id + "-prs") % 3]
                : l.minutes < 12
                  ? "Wants more playing time"
                  : l.morale < 50
                    ? "Unhappy with the program"
                    : "Testing the market",
    chance: le(
      Math.round(
        38 +
          (l.morale - 45) * 0.7 +
          e.rep * 0.15 +
          ({ Loyal: 12, Patient: 6, Ambitious: -8, "Money-focused": -4 }[l.pers] || 0)
      ),
      10,
      80
    ),
    status: "pending",
    player: l,
  };
}
