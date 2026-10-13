function lc({ game: e, reload: a, error: t }) {
  let l = (0, jn.useRef)(null),
    [u, o] = (0, jn.useState)(""),
    [, tick] = (0, jn.useState)(0);
  // the Backups tab can export too: redraw this bar so the reminder goes away
  (0, jn.useEffect)(() => {
    let f = () => tick((n) => n + 1);
    return (window.addEventListener("cd-export", f), () => window.removeEventListener("cd-export", f));
  }, []);
  return (0, Ka.jsxs)("div", {
    className: "offline-controls",
    children: [
      (0, Ka.jsxs)("div", {
        className: "offline-label",
        children: [
          (0, Ka.jsx)("strong", { title: `Build ${BUILD_INFO.build}, commit ${BUILD_INFO.commit}`, children: `DESKTOP EDITION ${BUILD_INFO.version} \u00B7 BUILD ${BUILD_INFO.build}` }),
          (0, Ka.jsx)("span", {
            children: By()
              ? exportStatus(e).due
                ? `Offline \xB7 ${exportStatus(e).last ? exportStatus(e).behind + " seasons since your last export" : "not exported yet"}: Export career keeps a copy`
                : "Offline \xB7 saves on this computer"
              : "Export before closing to keep your progress",
          }),
        ],
      }),
      (0, Ka.jsx)("button", {
        className: exportStatus(e).due ? "btn small export-due" : "btn small",
        title: exportStatus(e).due ? "A file copy of your career is overdue: saves live in this browser only" : undefined,
        disabled: !e,
        onClick: () => {
          e && (Dy(e), o("Save file downloaded."), setTimeout(() => o(""), 5e3));
        },
        children: "Export career",
      }),
      (0, Ka.jsx)("button", {
        className: "btn small",
        onClick: () => l.current?.click(),
        children: "Import career",
      }),
      (0, Ka.jsx)("input", {
        ref: l,
        type: "file",
        accept: ".json,application/json",
        hidden: !0,
        onChange: async (r) => {
          let n = r.currentTarget,
            i = n.files?.[0];
          if (i)
            try {
              if (i.size > 16 * 1024 * 1024) throw new Error("This save file is too large.");
              let txt = await i.text(),
                d = Ey(txt),
                at = null;
              try {
                at = JSON.parse(txt).exportedAt;
              } catch {}
              if (
                e &&
                !window.confirm(
                  `Replace the current offline career with ${d.school.name}, ${d.year}?\n\n${copyNote(e, d, at)}\n\nExport your current career first if you want to keep both.`
                )
              )
                return;
              (Ny(d), a(), o("Career imported."), setTimeout(() => o(""), 5e3));
            } catch (d) {
              t(d instanceof Error ? d.message : "Could not import this save.");
            } finally {
              n.value = "";
            }
        },
      }),
      u && (0, Ka.jsx)("span", { className: "offline-message", role: "status", children: u }),
    ],
  });
}
