function Nn(e, a, t, l) {
  let rr = TUNE.coachRep ? W_recRep(e) : e.rep,
    u = le(t / Math.max(1e3, a.ask), 0, 2.5),
    o = wt(l) - wt((a.sg ?? a.stars) >= 4 ? "Starter" : (a.sg ?? a.stars) >= 2 ? "Rotation" : "Bench"),
    r = Math.max(0, (a.sg ?? a.stars) * 12 - rr) * 0.62 + [0, 2, 5, 9, 14, 20][a.sg ?? a.stars];
  return Math.round(
    le(
      a.interest * 0.45 +
        u * (a.priority === "NIL" ? 39 : 30) +
        Math.max(0, u - 1) * 5 +
        o * (a.priority === "Playing time" ? 1.3 : 0.7) +
        rr * 0.2 -
        r +
        (e.specialty === "Recruiting" ? 9 + e.level : 0) +
        (a.priority === "Development" && e.specialty === "Development" ? 10 : 0) +
        (e.round === 9 ? 20 : 0) +
        (a.ov ? TUNE.ovBonus : 0) +
        (e.staff ? W_staffLv(e, "rec") * 2 + (e.staff.fac || 0) * 1.5 : 0) +
        (W_skill(e, "rec") - 50) * 0.1 +
        prefAdj(e, a) +
        ({ relaxed: 6, hardcore: -6 }[e.diff] || 0) -
        (a.rv
          ? Math.max(
              0,
              Math.max(...a.rv.map((z) => z.s)) -
                (Math.round(a.progress * 0.6 + a.interest * 0.4) + (a.offer ? 8 : 0))
            ) * 0.4
          : 0),
      3,
      e.round === 9 ? 99 : 96
    )
  );
}
