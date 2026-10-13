// Settings > Backups (item 21): the automatic season-end copies, restoring one, and the Export career reminder.
function BackupsPanel({ g: e }) {
  let [, bump] = (0, N.useState)(0),
    [msg, setMsg] = (0, N.useState)(""),
    [code, setCode] = (0, N.useState)(""),
    [move, setMove] = (0, N.useState)(""),
    list = backupList(),
    ex = exportStatus(e),
    when = (iso) => {
      try {
        return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
      } catch {
        return iso || "";
      }
    };
  return (0, s.jsxs)(s.Fragment, {
    children: [
      (0, s.jsx)(qe, {
        title: "Export a copy",
        meta: "Your career is stored in this browser on this device. A phone, a tablet or another browser cannot see it. An exported file can be copied anywhere and brought back with Import career.",
        children: (0, s.jsxs)("div", {
          className: "set-body",
          children: [
            (0, s.jsxs)("div", {
              className: "set-row backup-row",
              children: [
                (0, s.jsxs)("div", {
                  children: [
                    (0, s.jsx)("strong", {
                      children: ex.last ? `Last export: ${when(ex.last.at)}` : "You have not exported this career yet",
                    }),
                    (0, s.jsx)("small", {
                      className: ex.due ? "export-due-text" : undefined,
                      children: ex.due
                        ? `${ex.behind} finished seasons are not in any exported file. Export now to be safe.`
                        : "Export again after a few more seasons. The bottom bar reminds you after 2 seasons without one.",
                    }),
                  ],
                }),
                (0, s.jsx)(X, {
                  small: !0,
                  primary: ex.due,
                  onClick: () => {
                    (Dy(e), setMsg("Save file downloaded."), bump((n) => n + 1));
                  },
                  children: "Export career",
                }),
              ],
            }),
          ],
        }),
      }),
      (0, s.jsx)(qe, {
        title: "Move to another device",
        meta: "Send this career to your phone, tablet or another computer in two taps. Share sends the save file through the share menu (AirDrop, Messages, Mail, Files). Copy career code puts it on the clipboard so you can paste it on the other device. Either way the other device asks before it replaces anything, and tells you which copy is further along.",
        children: (0, s.jsxs)("div", {
          className: "set-body",
          children: [
            (0, s.jsxs)("div", {
              className: "set-row backup-row",
              children: [
                (0, s.jsx)("div", {
                  children: (0, s.jsx)("small", {
                    children: `Now: ${e.school.name}, ${e.year}–${String((e.year + 1) % 100).padStart(2, "0")}, ${(e.history || []).length} seasons finished.`,
                  }),
                }),
                (0, s.jsxs)("div", {
                  className: "row gap",
                  children: [
                    (0, s.jsx)(X, {
                      small: !0,
                      primary: !0,
                      onClick: async () => {
                        let r = await shareCareer(e);
                        setMove(
                          r === "shared"
                            ? "Shared. Open the file on the other device and use Import career."
                            : r === "cancelled"
                              ? "Share cancelled."
                              : "This browser has no share menu, so the save file was downloaded instead."
                        );
                        bump((n) => n + 1);
                      },
                      children: "Share career",
                    }),
                    (0, s.jsx)(X, {
                      small: !0,
                      onClick: async () => {
                        try {
                          let c = await careerCode(e);
                          await navigator.clipboard.writeText(c);
                          setMove(`Career code copied (${Math.round(c.length / 1024)} KB). Paste it into "Paste career code" on the other device.`);
                        } catch (err) {
                          setMove("Could not copy: " + (err instanceof Error ? err.message : "clipboard blocked") + ". Use Share career or Export career instead.");
                        }
                        bump((n) => n + 1);
                      },
                      children: "Copy career code",
                    }),
                  ],
                }),
              ],
            }),
            (0, s.jsxs)("div", {
              className: "set-row backup-row",
              children: [
                (0, s.jsx)("textarea", {
                  "aria-label": "Paste career code",
                  placeholder: "Paste a career code here (from Copy career code on your other device)",
                  rows: 2,
                  value: code,
                  onChange: (z) => setCode(z.target.value),
                  className: "career-code",
                }),
                (0, s.jsx)(X, {
                  small: !0,
                  onClick: async () => {
                    try {
                      let r = await readCareerCode(code);
                      if (
                        window.confirm(
                          `Replace the career on this device with ${r.game.school.name}, ${r.game.year}?\n\n${copyNote(e, r.game, r.at)}\n\nYour current career is kept under Undo until you play on.`
                        )
                      ) {
                        (Ny(r.game), (window.__undo = null), location.reload());
                      }
                    } catch (err) {
                      setMove(err instanceof Error ? err.message : "Could not read that code.");
                    }
                  },
                  children: "Load career code",
                }),
              ],
            }),
            move && (0, s.jsx)("small", { role: "status", className: "move-msg", children: move }),
          ],
        }),
      }),
      (0, s.jsx)(qe, {
        title: "Season backups",
        meta: `The game keeps a copy of your career at the end of each of the last ${BACKUP_KEEP} seasons. They sit in this same browser, so they protect against a bad decision or a damaged save, not against clearing the browser's data.`,
        children: (0, s.jsxs)("div", {
          className: "set-body",
          children: [
            list.length === 0 &&
              (0, s.jsx)("div", {
                className: "set-row",
                children: (0, s.jsx)("small", {
                  children: "No backups yet. The first one is made when a season ends (the Season review screen).",
                }),
              }),
            list.map((b, i) =>
              (0, s.jsxs)(
                "div",
                {
                  className: "set-row backup-row",
                  children: [
                    (0, s.jsxs)("div", {
                      children: [
                        (0, s.jsx)("strong", {
                          children: `${b.year}–${String((b.year + 1) % 100).padStart(2, "0")} · ${b.school}${
                            typeof b.wins === "number" ? ` · ${b.wins}–${b.losses}` : ""
                          }${b.result ? ` · ${b.result}` : ""}${b.start ? " · start of season" : ""}`,
                        }),
                        (0, s.jsx)("small", {
                          children: `${i === 0 ? "Newest. " : ""}Saved ${when(b.savedAt)} · ${b.kb} KB`,
                        }),
                      ],
                    }),
                    (0, s.jsxs)("div", {
                      className: "row gap",
                      children: [
                        (0, s.jsx)(X, {
                          small: !0,
                          onClick: async () => {
                            let d = await readBackup(b.key);
                            if (!d) return setMsg("That backup could not be read.");
                            if (
                              window.confirm(
                                `Go back to the ${b.start ? "start" : "end"} of the ${b.year}–${String((b.year + 1) % 100).padStart(2, "0")} season at ${b.school}? Your current career is kept under Undo until you play on.`
                              )
                            ) {
                              (Ny(d), (window.__undo = null), location.reload());
                            }
                          },
                          children: "Restore",
                        }),
                        (0, s.jsx)(X, {
                          small: !0,
                          onClick: async () => {
                            let d = await readBackup(b.key);
                            d ? (Dy(d), setMsg("Backup downloaded as a file.")) : setMsg("That backup could not be read.");
                          },
                          children: "Download",
                        }),
                      ],
                    }),
                  ],
                },
                b.key
              )
            ),
            msg && (0, s.jsx)("small", { role: "status", children: msg }),
          ],
        }),
      }),
    ],
  });
}
