# Real College Dynasty

College Dynasty with real Division I schools instead of made-up ones.

- **GitHub:** https://github.com/mattjr08-debug/real-college-dynasty (private). First commit `ecade4f`, 2026-10-12.
- **Mac folder:** ~/Documents/Real College Dynasty (not linked to the repo yet: clone it, or add the remote here).
- **Data:** 365 real D-I schools in their 2026-27 conferences, real 2026-27 rosters (ESPN), 2025-26 stats (Torvik), estimated NIL budgets, 5,089 player photos, 365 logos. See `REAL-COLLEGE-NOTES.md`.
- **Engine:** the same engine as College Dynasty. Engine changes are copied over by hand; the two repos are separate.
- **Not in git** (see `.gitignore`): `dist/`, `dist-app/`, `desktop/node_modules`, `desktop/game`, `_to_delete/`, `realdata/test`, `realdata/phone-pub`.

## Features added
- Search for players and schools (magnifier, `/` or Ctrl/Cmd+K); the career page also finds a school by a player name.

## Open items
- Photos for the 230 players still without one (`photo-work/Missing players - found vs still missing.csv`, Status = STILL MISSING). 371 of the original 601 were added Oct 13.
- Short rosters: Saint Francis (PA), Queens, Lindenwood.
- Replace the generated starting-portal slots.
