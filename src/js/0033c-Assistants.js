// Item 23: named assistant coaches (recruiting, development, tactics). Facilities stay a plain level (not a person).
// e.staff = { rec, dev, tac, fac } is still the LEVEL 0 to 3 (what you pay for), as before. e.asst = { rec, dev, tac } holds the person in each
// chair: { id, name, rating (40 to 95), yrs (seasons with you) }. e.asstPool = { rec: [...], dev: [...], tac: [...] } are this offseason's candidates
// (4 a role: { id, name, rating }). A perk is the level's old perk x rating / 65 (a 65 rating gives exactly the old numbers), and a better assistant costs more
// (0.85 to 1.15 x the level's price). Everything here comes from a fixed hash of school, year and role (no random numbers), so nothing moves for a
// career that never hires anyone (auto-play and the balance tests), and old saves get a named 65-rated assistant for the levels they already paid for.
// Each rollover (W_asstYear, called from wS): an assistant may take a head coaching job (about 1.5%, 7% and up for a rating of 72 or more) or be poached by
// another school (3% plus 0.15% a rating point above 50, more when your reputation is low); either way the chair is empty and you hire again.
// The others gain 1 or 2 rating points of experience (up to 95).
var ASST_FIRST = ["Mike", "Dave", "Chris", "Tom", "Jeff", "Greg", "Andre", "Marcus", "Rick", "Dan", "Kevin", "Brian", "Terrell", "Luis", "Paul", "Steve", "Darnell", "Mark", "Jason", "Eric", "Carlos", "Ron", "Tyrone", "Scott"],
  ASST_LAST = ["Hollis", "Brennan", "Okafor", "Delgado", "Whitfield", "Kowalski", "Reyes", "Tanaka", "Booker", "Sullivan", "Marsh", "Pruitt", "Nakamura", "Castillo", "Frazier", "Lindqvist", "Odom", "Barrett", "Mendez", "Hartley", "Ramsey", "Voss", "Coleman", "Dunn"],
  ASST_ROLES = ["rec", "dev", "tac"];
function W_asstMake(e, k, i, yr) {
  let h = TS(`${e.school.id}-${yr}-asst-${k}-${i}`),
    r = 44 + ((h % 100) / 100) * 22 + (((h >>> 8) % 100) / 100) * 22; // 44 to 88, bunched around 66
  return {
    id: `a${yr}${k}${i}`,
    name: ASST_FIRST[(h >>> 4) % ASST_FIRST.length] + " " + ASST_LAST[(h >>> 12) % ASST_LAST.length],
    rating: Math.round(r),
  };
}
// the level of an assistant in a perk formula: his paid level x rating / 65 (no named assistant, as in an old save before its first rollover: x 1)
function W_staffLv(e, k) {
  let lv = e.staff?.[k] || 0,
    a = e.asst?.[k];
  return a ? lv * (a.rating / 65) : lv;
}
// price multiplier for the person in a chair (or for a candidate)
function W_asstCostMult(person) {
  return person ? 0.85 + (le(person.rating, 40, 90) - 40) * 0.006 : 1;
}
function W_asstPool(e) {
  let pool = {};
  for (let k of ASST_ROLES) pool[k] = [0, 1, 2, 3].map((i) => W_asstMake(e, k, i, e.year));
  return pool;
}
// the yearly step at the rollover
function W_asstYear(e) {
  e.asst = e.asst || {};
  for (let k of ASST_ROLES) {
    let lv = e.staff?.[k] || 0,
      a = e.asst[k];
    // old save (or a level set before this item): the chair gets a named 65-rated assistant
    if (lv && !a) {
      a = e.asst[k] = { ...W_asstMake(e, k, 9, e.year), rating: 65, yrs: 1 };
      continue;
    }
    if (!a) continue;
    let role = STAFF_ROLES.find((r) => r.k === k).name,
      h = TS(`${e.school.id}-${e.year}-leave-${a.id}`),
      r1 = (h % 1000) / 1000,
      r2 = ((h >>> 10) % 1000) / 1000,
      pLeave = a.rating >= 72 ? 0.07 + (a.rating - 72) * 0.005 : 0.015,
      pPoach = 0.03 + Math.max(0, a.rating - 50) * 0.0015 + Math.max(0, 60 - (e.rep || 50)) * 0.0005;
    if (r1 < pLeave || r2 < pPoach) {
      let why = r1 < pLeave ? `${a.name} took a head coaching job elsewhere.` : `${a.name} was hired away by another school.`;
      Be(e, "Assistant coach left", `${role}: ${why} The chair is empty until you hire someone (Staff tab on the NIL budget page).`);
      e.asst[k] = null;
      e.staff = { ...(e.staff || {}), [k]: 0 };
    } else {
      ((a.yrs = (a.yrs || 1) + 1), (a.rating = Math.min(95, a.rating + ((h >>> 20) % 3 === 0 ? 2 : 1))));
    }
  }
  e.asstPool = W_asstPool(e);
}
