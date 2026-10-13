// Which seasons belong to the program you coach now. A job change keeps the coaching history (e.history) but starts a new program, so Career history can show
// "Current program" or "All time", and the "last season" record in the header is the program's own, not the school you left.
// Season records carry the school id (sid) and name (school) from now on. Older saves are inferred: seasons from the year of the last job change on
// belong to this program (e.jobYear, or the "New job" news item when the save has no jobYear).
function W_jobStartYear(e) {
  if (typeof e.jobYear === "number") return e.jobYear;
  const jobs = (e.news || []).filter((n) => n.title === "New job");
  return jobs.length ? Math.max(...jobs.map((n) => n.year)) : -Infinity;
}
function W_progHist(e) {
  const from = W_jobStartYear(e);
  return e.history.filter((h) => (h.sid ? h.sid === e.school.id : h.year >= from));
}
function W_hasOtherProgram(e) {
  return W_progHist(e).length < e.history.length;
}
// last season's record of THIS program: its own last season; or, before it has played one, the record it had when you took the job
function W_lastRecord(e) {
  const mine = W_progHist(e);
  if (mine.length) return mine.at(-1);
  if (W_hasOtherProgram(e)) return e.prevRec || { wins: e.school.wins, losses: W_loss(e.school), est: true };
  return e.history.at(-1) || null;
}
window.__dbg && Object.assign(window.__dbg, { W_lastRecord, W_progHist, W_hasOtherProgram });
