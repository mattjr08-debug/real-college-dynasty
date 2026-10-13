function Yf(e, a) {
  let t = a.stats.gp ? a.stats.min / a.stats.gp : a.minutes,
    l = [];
  (a.redshirt
    ? l.push("Redshirting this season; a year of eligibility is preserved.")
    : (l.push(
        `${a.promise === "None" ? "No role promised." : `Promised ${a.promise.toLowerCase()} minutes (${wt(a.promise)}+).`} ${a.stats.gp ? "Averaging" : "Assigned"} ${t.toFixed(1)} minutes.`
      ),
      a.promise === "Starter" && !e.lineup.includes(a.id) && l.push("Wants a place in the starting five.")),
    l.push(
      a.nil >= a.ask * 0.8 ? "Satisfied with annual NIL." : `Would like NIL closer to ${q(a.ask)} per year.`
    ));
  let u = dl(e);
  return (
    u.wins + u.losses > 3 &&
      l.push(
        u.wins >= u.losses ? "Encouraged by team results." : "Frustrated by the team\u2019s losing record."
      ),
    a.injury && l.push(`${a.susp ? (a.susp === 2 ? "Ineligible" : "Suspended") : "Out"} for ${a.injury} more game${a.injury === 1 ? "" : "s"}.`),
    l
  );
}
