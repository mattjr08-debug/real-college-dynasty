// Item 53: moving a career between devices. Three ways to carry it: the normal file (Export / Import career), the share sheet
// (a phone or Mac sends the file straight to AirDrop, Messages, Mail or Files) and a career code (copy on one device, paste on the
// other). All three carry the same data as Export career; Import and the code both say how the two copies differ.
// "How far a career has come" = finished seasons, then the year, then the phase.
function careerProgress(g) {
  return (g && g.history ? g.history.length : 0) * 10 + (g && g.phase === "Season review" ? 5 : 0);
}
function copyNote(cur, inc, at) {
  let when = "";
  try {
    when = at ? new Date(at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "";
  } catch {}
  let li = `${inc.school.name}, ${inc.year}-${String((inc.year + 1) % 100).padStart(2, "0")} season, ${(inc.history || []).length} seasons finished${when ? `, copied ${when}` : ""}`;
  if (!cur) return `This copy: ${li}.`;
  let lc = `${cur.school.name}, ${cur.year}-${String((cur.year + 1) % 100).padStart(2, "0")} season, ${(cur.history || []).length} seasons finished`,
    a = careerProgress(inc),
    b = careerProgress(cur),
    rel =
      inc.school.id !== cur.school.id
        ? "These are two different careers (different schools)."
        : a > b
          ? "The copy you are loading is AHEAD of the one on this device."
          : a < b
            ? "The copy you are loading is BEHIND the one on this device: loading it would lose progress."
            : "Both copies are at the same point.";
  return `${rel}\nLoading: ${li}.\nOn this device now: ${lc}.`;
}
async function careerCode(e) {
  let text = PC(e);
  noteExport(e);
  return typeof CompressionStream > "u" ? text : await gzipText(text);
}
// accepts a career code (gz1:...), the text of an export file, or either with spaces and line breaks around it
async function readCareerCode(raw) {
  let t = String(raw || "").trim();
  if (!t) throw new Error("Paste the career code first.");
  if (t.startsWith("gz1:")) {
    if (typeof DecompressionStream > "u") throw new Error("This browser cannot open a career code. Use a file instead.");
    t = await gunzipText(t.replace(/\s+/g, ""));
  }
  let at = null;
  try {
    at = JSON.parse(t).exportedAt;
  } catch {}
  return { game: Ey(t), at };
}
// Share sheet: sends the save file through the system share menu when the browser has one (phones, Safari, Chrome on Mac); otherwise downloads it
async function shareCareer(e) {
  let name = `College-Dynasty-${e.school.short}-${e.year}-Save.json`,
    file = new File([PC(e)], name, { type: "application/json" });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "College Dynasty career", text: `${e.school.name}, ${e.year}` });
      noteExport(e);
      return "shared";
    } catch (err) {
      if (err && err.name === "AbortError") return "cancelled";
    }
  }
  Dy(e);
  return "downloaded";
}
