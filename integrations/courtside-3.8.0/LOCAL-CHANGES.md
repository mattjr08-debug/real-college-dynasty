# Local changes to the packaged court (3.8.0)

- **3.8.1, keys 1 to 5 are positions (PG, SG, SF, PF, C), pass on offense and take that player on defense**: see CHANGELOG.md. Edited functions: `down()` (the number-key branch), the new `positionSlot()` and the new `takePlayer()` just above `switchPlayer()`; the key help line in the page header text.
- The standalone project in ~/Documents/Courtside-Basketball does NOT have this change.
- **3.8.2, `priority` tendency**: see CHANGELOG.md. Edited: `aiStep` (the pass-target sort). College Dynasty's `W_courtMatch` (src/js/0068c-Courtside.js) supplies the tendency.
- **3.8.3, Box score button**: see CHANGELOG.md. Edited: the HUD button row, a new modal and three functions placed just above `callTimeout()`.
- **3.9.0, realism pass** (computer offense by expected points, rotations, home court, streaks, fouls and turnovers at the main game's rates, offensive rebounds, clutch passing, Auto-sub button, autoplay test mode): see CHANGELOG.md. Edited: `shoot()` (the make chance is now `shotInfo()`), `aiStep()`, `giveBall()`, `possession()`, the dead-ball branches of `step()`, the rebound and interception code, three `state.autoplay` conditions, the HUD button row; new functions above `shoot()`. Package tests edited: three (see CHANGELOG).
- **3.10.0 to 3.12.0** (presentation, players, bodies and celebrations): see CHANGELOG.md. Package tests: tests/game.js now switches off random fouls and turnovers after load (see CLAUDE.md, 'The package test suite and random fouls').
