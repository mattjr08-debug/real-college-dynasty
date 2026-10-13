# Courtside 3.8.0 integration

This project is an isolated copy of College Dynasty source commit **4fec7c7**. Neither live project was modified. Nothing was pushed, published, or installed over the existing desktop app.

## Play

Build with `npm run build`, then open `dist/College-Dynasty-V13.html`. Start or import a career, begin the season, and press **Play Game** in the page header. The usual simulation and Game Day options remain available. Tournament games are playable when your team has a scheduled bracket opponent.

Choose 20-, 15-, 10-, or 5-minute halves. The court uses the real starting lineup, healthy eligible bench, scheduled opponent, ratings, tendencies, heights, colors, and home-school branding. Team 0 always remains user controlled, including away games.

Inside the court, the existing controls, limited timeouts, substitutions, player lock, officiating, models, animations, and perfect-release behavior are preserved. Pause is separate from a timeout. The integrated court is the original packaged `integrations/courtside-3.8.0/basketball-game.html`, unchanged.

**Save & exit** keeps a court checkpoint without advancing the career. Open Play Game again to resume; the clock remains paused until Resume game is pressed. Checkpoints are also saved about every three seconds while the court is running. Refreshing unexpectedly can lose up to that interval. Checkpoints belong to the current browser/app and save slot; they are separate from exported career files. **Abandon** removes the checkpoint and leaves the season as it was before tipoff.

At the final buzzer, inspect Actual/Official stats inside the court, then press **Save official result to season** in the host footer. The top-level 40-minute adjusted score and statistics are official and are not scaled again. Actual points and player boxes are retained separately. Personal fouls remain unscaled. A finished game can also be saved and exited before its official result is recorded.

## Implementation

- `src/js/0068b-CourtsideAdapter.js`: the provided roster/branding adapter, copied unchanged.
- `src/js/0068c-Courtside.js`: active-game selection, match fingerprint, result validation, checkpoint bridge, and full-window React host.
- `tools/build.js`: gzip/base64 embeds the court. It is decompressed only on entering the court, using the browser's built-in DecompressionStream. There are no runtime fetches or external engine dependencies.
- `W_finishPlayed` in `src/js/0014-ny.js`: the original postgame effects, extracted without changing their order or tuning. Both the statistical simulator and the played court use this function. Played games do not run the user-game simulator a second time.
- `courtFinish` reducer action validates all data before mutation, applies the court's ending RNG, updates the same career bookkeeping and league day, and uses the existing bracket/season progression. `Rn` and `AS` accept an optional already-played game; their normal simulation path is unchanged.
- `W_pst` accepts a supplied opponent box for played games, preserving real opponent statistics rather than generating them.
- The save schema preserves `opponentBox`, `tmo`, `court` metadata, and optional player appearance colors. The original career save keys are unchanged. Checkpoints use the active save key plus `-courtside` and a separate versioned envelope.
- Only messages from the mounted iframe are accepted. Final messages must be version 1 and match the current game, year, half length and career/roster fingerprint. Player IDs, numeric bounds, shooting arithmetic, score totals, raw statistics and the exact documented normalization are checked. Stale, malformed, duplicate, or wrong-game results cannot advance the season.

## Verification

Run `npm run test:courtside` for the added functional tests. These use the game's supported Canvas fallback to avoid GPU contention during repeated reloads; `COURTSIDE_WEBGL=1 npm run test:courtside` repeats them with the original 3D renderer. `tests/courtside-baseline.json` pins complete career hashes from the untouched build for two seeded full-season simulations.

The existing overflow test now includes the integrated court at all five required widths. The desktop test accepts an executable path so the isolated build can be tested using a throwaway user-data directory, without replacing or writing to the real installed app.

The historical compatibility test now uses read-only Git archives rather than worktrees, and closes each temporary browser context. With source exports that have no Git history, supply `COMPAT_HISTORY=/path/to/repository COMPAT_BASELINE=4fec7c7 node tests/save-compat.js`. This reads historical commits without modifying that repository.

See the accompanying final test report for actual test outcomes.

## Credits and limitations

**Human** by **Real_jseals**, CC BY 4.0. Original model: https://sketchfab.com/3d-models/human-87b70e4027d84b68a3ca5d34fd5688fc; creator: https://sketchfab.com/real_jseals; license: https://creativecommons.org/licenses/by/4.0/. The model was rigged, fitted with uniforms and accessories, recolored, and prepared for basketball animation. Credits and modification notices remain accessible under **Model credits** in the court and in `integrations/courtside-3.8.0/ASSET-CREDITS.md`.

This preserves the package's supported rules and approximations; it does not claim complete NCAA officiating. See `integrations/courtside-3.8.0/RULES.md`. The renderer is original lightweight basketball presentation, not NBA 2K assets. WebGL falls back to Canvas when unavailable. Modern Chrome and the supplied Electron runtime support offline court decompression.

Shortened-game normalization preserves played production and its winner; it does not force the game's statistical distribution to match the statistical simulator. The existing simulator and its tuning remain unchanged. Personal fouls are retained in individual game boxes; the pre-existing season aggregate format has no personal-foul column.

The trimmed integration package contains all runtime assets inline. The original larger model-authoring package remains beside the source handoff in `basketball-handoff-3.8.0.zip`.
