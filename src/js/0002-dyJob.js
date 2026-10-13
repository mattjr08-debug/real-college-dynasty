function dyJob(e, a, l) {
  let g = _s({ ...e, rep: l }),
    n = e.history.length - (e.tenureStart || 0),
    gr = graceOf(e),
    h = e.heat || 0;
  if (a.wins >= g || W_focus(e, a, g)) {
    e.heat = Math.max(0, h - 1);
    return;
  }
  if (n <= gr) {
    Be(
      e,
      "Grace period",
      `${a.wins} wins is short of the ${g}-win goal, but the athletic department is giving you time. ${gr - n} grace season${gr - n === 1 ? "" : "s"} left.`
    );
    return;
  }
  let f = g - a.wins;
  e.heat = h + (f >= 6 ? 2 : 1);
  if (e.heat >= 2) {
    ((e.fired = !0),
      (e.firedMsg = `${a.wins} wins against a goal of ${g}. After falling short again, the athletic director has decided to move in a new direction.${W_fireBuyout(e)}`),
      Be(e, "You have been fired", e.firedMsg));
  } else
    Be(
      e,
      "Hot seat",
      `${a.wins} wins against a goal of ${g}. Miss expectations again and you will be let go.`
    );
}
