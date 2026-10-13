// A fired coach is not finished: programs a step down (and open jobs) may still want you, by your reputation as a coach and your record.
// e.jobOffers then holds the landing spots; with none, the career ends and a new one starts.
function W_firedOffers(e) {
  const cr = TUNE.coachRep ? W_crepInit(e) : e.rep, t = tierOf(e), twenty = e.history.filter((x) => x.wins >= 20).length,
    bad = e.history.slice(-3).filter((x) => x.wins < (x.goal ?? 15) - 4).length;   // the seasons that got you fired count against you
  const pool = Xl.filter((h) => h.id !== e.school.id && (tierOf({ school: h }) < t || (e.vac || []).includes(h.id)))
    .map((h) => ({ h, want: 10 + (cr - h.rep) * 1.2 + twenty * 4 - bad * 12 + (t - tierOf({ school: h })) * 8 + ((e.vac || []).includes(h.id) ? 15 : 0) }))
    .filter((x) => x.want > 0).sort((x, y) => y.want - x.want);
  const out = [];
  for (const x of pool) { if (out.length >= 3) break; if (ne(e) * 100 < le(x.want, 5, 95)) out.push(x.h.id); }
  return out;
}
function dyOffers(e, a, l) {
  e.jobOffers = [];
  if (e.fired) {
    e.jobOffers = TUNE.coachRep ? W_firedOffers(e) : [];
    if (e.jobOffers.length) Be(e, "Landing spots", `${e.jobOffers.length === 1 ? "One program is" : e.jobOffers.length + " programs are"} willing to hire you after ${e.school.name} let you go.`);
    return;
  }
  let g = _s({ ...e, rep: l }),
    run =
      e.result === "National champions"
        ? 8
        : ["Final Four", "National runner-up"].includes(e.result)
          ? 6
          : e.result === "Elite Eight"
            ? 4
            : e.result === "Sweet 16"
              ? 3
              : String(e.berth || "").includes("berth")
                ? 1
                : 0,
    pf = a.wins - g + run + (e.confChampion ? 2 : 0),
    cr = TUNE.coachRep ? W_crepInit(e) : 50,
    // coach reputation: a respected coach hears from programs even after an ordinary season; an unknown one only after a big one
    pOffer = le(0.05 + pf * 0.05 + (cr - 50) * 0.006, 0, 0.85);
  if (ne(e) >= pOffer) return;
  let t = tierOf(e),
    c = Xl.filter((h) => h.id !== e.school.id),
    up = c.filter((h) => tierOf({ school: h }) > t),
    vc = (e.vac || [])
      .map((id) => Xl.find((h) => h.id === id))
      .filter((h) => h && h.id !== e.school.id && tierOf({ school: h }) >= t && h.rep <= Math.max(e.rep, cr) + 20),
    pool = vc.length ? [...vc] : up.length ? up : c.filter((h) => tierOf({ school: h }) === t),
    pk = [];
  let nOff = cr >= 75 ? 3 : cr >= 40 ? 2 : 1;
  for (let k = 0; k < nOff && pool.length; k++) {
    let h = pool.splice(Math.floor(ne(e) * pool.length), 1)[0];
    pk.push(h.id);
  }
  ((e.jobOffers = pk),
    e.jobOffers.length &&
      Be(
        e,
        "Job offers",
        `${e.jobOffers.length === 1 ? "A program has" : "Programs have"} reached out about your head coaching job.`
      ));
}
