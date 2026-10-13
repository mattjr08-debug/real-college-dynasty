function PC(e) {
  return JSON.stringify(
    { format: "college-dynasty-save", version: 1, saveVersion: SAVE_VERSION, exportedAt: new Date().toISOString(), game: e },
    null,
    2
  );
}
function Dy(e) {
  let a = PC(e),
    t = URL.createObjectURL(new Blob([a], { type: "application/json" })),
    l = document.createElement("a");
  ((l.href = t),
    (l.download = `College-Dynasty-${e.school.short}-${e.year}-Save.json`),
    document.body.append(l),
    l.click(),
    l.remove(),
    setTimeout(() => URL.revokeObjectURL(t), 1e4),
    noteExport(e));
}
function Ey(e) {
  let a;
  try {
    a = JSON.parse(e);
  } catch {
    throw new Error("This file is not valid JSON. Select a College Dynasty save file.");
  }
  if (!a || typeof a != "object") throw new Error("Choose a save file created by Export career.");
  let t = a;
  if (t.format !== "college-dynasty-save" || t.version !== 1)
    throw new Error("Choose a save file created by Export career.");
  return repairCareer(t.game, []);
}
function Ny(e) {
  let a = ac(e),
    t = null;
  try {
    t = My();
  } catch {}
  if (t)
    try {
      localStorage.setItem(Ty, JSON.stringify(t));
    } catch {}
  Ry({
    game: a,
    revision: (t?.revision || 0) + 1,
    savedAt: new Date().toISOString(),
    lastAction: `import-${Date.now()}`,
  });
}
var jn = Fe(at());
var Ka = Fe(Dt());
