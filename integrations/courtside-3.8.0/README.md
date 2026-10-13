# Basketball game handoff for Claude

Package version 3.8.0. Redesigned athletes, uniforms, hoops, court markings and arena details, plus isolation, defensive styles, double-teams, screens, cuts and individual stamina; integration protocol remains version 1. See `CHANGELOG.md` and `preview.png`.

The game is complete as a standalone component. Integrate it into College Dynasty; the main app has not been changed by this handoff.

## Files

- `basketball-game.html`: the complete offline 5v5 court. CSS, drawing, controls and game logic are inline. No external libraries, server or downloads required. The current default renderer is lightweight WebGL 3D, with a Canvas 2D fallback.
- `college-dynasty-adapter.js`: creates match input from the career's actual starting five and scheduled opponent. Call it with the existing `W_at`, `W_tend`, `TS`, `logoFor` and `hqOppSchool` helpers. Injured/redshirt players are excluded; missing starters are filled from healthy players by minutes/overall.
- `embedding-demo.html`: working iframe host, demo rosters, final result display and JSON download. Open it directly in a browser.
- `example-match.json`: the input format, using clearly labeled demo players.
- `reference/`: the earlier integration implementation and shared season bookkeeping, retained only as optional examples. These files are not installed in the main app.

## Plug it in

Load the game in an iframe with `sandbox="allow-scripts"`. For College Dynasty's offline single-file build, embed its HTML through `srcDoc` instead of loading a separate path. Memoize the iframe or otherwise avoid resetting its `srcDoc` when React re-renders.

The game sends `{type:"college-dynasty-ready", version:1}` when ready. Verify `event.source === iframe.contentWindow`, then send:

```js
const match = CollegeDynastyBasketballAdapter.createMatch(career, scheduledGame, {
  W_at, W_tend, TS, TUNE, logoFor, hqOppSchool
});
iframe.contentWindow.postMessage({ type: "college-dynasty-start", match }, "*");
```

The wildcard supports local files and opaque sandbox origins; always verify the sending window. On a host with a fixed known origin, use that origin where supported.

Alternatively, set `window.COLLEGE_DYNASTY_MATCH` before the game's script runs, or call `window.CollegeDynastyBasketball.loadMatch(match)` inside the court. Public API also includes `getResult()` and `pause()`. Bad input produces `college-dynasty-error` when initialized through messages; direct API calls throw.

Each match needs `gid`, `year`, `seed` (career `rng`), and two teams. Team 0 is the controlled team, attacking right; team 1 is the opponent. Each team has `name`, optional `short`, and exactly five starting players, plus an optional `bench` array of up to 15 eligible reserves. Player IDs must be unique per team. Each player has `id`, `name`, `pos`, `ovr`, 16 `attrs`, and `tendencies` from `W_tend`. Optional `appearanceSeed` gives a stable numeric visual identity; the adapter uses the career face seed when available, otherwise a stable player-ID hash. Models have differentiated skin, hair and accessories, shaded limbs and jerseys, and defensive stances. No gameplay RNG is consumed for appearance. Optional `height` is in inches (60–96). Height controls the rendered player size; omitted heights default by position to PG 73, SG 76, SF 79, PF 81, C 83 inches. The adapter forwards actual career heights and preserves explicit opponent heights; compact opponents without heights get stable position-based estimates. Standalone and sample lineups use matching heights. Height is visual here; ratings still determine gameplay abilities. The historical reference integration predates height forwarding: use the current adapter.

Attribute order is unchanged from College Dynasty: finishing, midrange, three-point, free throws, handling, passing, perimeter defense, interior defense, steals, blocks, offensive rebounding, defensive rebounding, speed, strength, vertical, stamina. Ratings affect the corresponding existing court mechanics. Both manual and AI steals now compare the defender’s steal rating directly against the handler’s handling rating; pass interceptions compare steal rating against passing. The matchup multiplier is exp((defender − resistance) / 60), capped at 0.4–2.0. Close reaches also risk a personal foul. Manual strip probability is capped at 55%, interceptions at 50%; existing proximity requirements, possession protection and reach cooldowns remain. Equal ratings retain the nerfed baseline (28% per close manual attempt, 4.5% per close normal AI attempt before gamble/shot-charge modifiers). Low handling also loses more ground on crossovers against strong perimeter defenders. Shooting ratings affect accuracy and green windows; defense affects contests; rebounding, strength and vertical affect board recovery; speed and stamina affect movement and fatigue. Standalone lineups now use distinct positional ratings and tendencies, matching the sample match, and their ratings are available under the court. Supplied career attributes take precedence. Free-throw ratings now affect make probability and the timing-meter green window. Personal fouls are exported as `pf`, remain unscaled, and are displayed alongside FT shooting in the final box score. Tendencies affect perimeter shooting, usage, passing, rebounding, gambling and late-game shooting. Compact opponent three-point tendencies use the career player formula with stable ID-based variation.

## Final result and season saving

On the final buzzer the court emits `college-dynasty-final` through `postMessage` and a local `CustomEvent`. The public `getResult()` returns a copy. The payload contains:

```js
{
  type: "college-dynasty-final", version: 1,
  gid, year, seed,         // seed is the updated RNG; write to career.rng
  score: [yourPoints, opponentPoints], ot, poss,
  box,                    // your starters and reserves who played
  opponentBox,            // opponent players who played
  teamStats               // aggregate shooting, assists, steals, rebounds, blocks
}
```

Each box row includes `id`, `name`, `pos`, `min`, `pts`, `reb`, `ast`, `stl`, `blk`, `to`, `fgm`, `fga`, `tpm`, `tpa`, `ftm`, `fta`, `pf`. Substituted players retain their own minutes and stats; unused reserves are omitted. Host adds `gp:1` when recording a completed game.

Claude should add a Play game option, then apply the result through the career reducer/save flow. Verify current game ID/year, eligible lineup, finite statistics, shooting arithmetic and player point totals; reject duplicate results. Use existing postgame bookkeeping so wins/losses, league days, records, morale and history update normally. Do not simulate a second game and replace its score. Preserve the existing save key. Add schema fields only if storing anything beyond the existing schedule/box-score format. Leaving before the final emits no completed result and must not advance the season. The component itself never writes localStorage.

## Gameplay included

All five controlled-team players have persistent, larger position badges (PG/SG/SF/PF/C), using the supplied roster positions. The controlled player’s badge has a green outline.

**B — screen / pick-and-roll:** a teammate sets a screen near the ball handler, briefly slows a defender on contact, then rolls toward the basket for a pass. Screens have a nine-second cooldown; set plays expire and clear on a possession change. The opponent can also call screens when pressured.

**Q — cut to the rim:** send an off-ball teammate toward the basket, then pass to him. Six-second cooldown. Ordinary passes also trigger give-and-go cuts.

**Directional F:** hold a movement direction and press F to select a defender in that direction. Without a direction, F keeps its nearest-player switching behavior.

**Individual stamina:** fatigue follows each player across control changes, affecting movement and shooting. Sprinting drains the controlled player's meter; other players accumulate movement fatigue and recover while stationary. Halftime restores everyone. Interior defenders help on nearby drives.

**K** passes on offense. On defense it selects the defender nearest the opposing ball handler and automatically guards him. Guarding follows the new ball handler after an opponent pass. WASD/arrows or **F** cancels auto guarding; **F** remains normal defender switching. The touch button changes between Pass and Guard ball. **J** steals on defense and crosses over on offense; **E** remains a steal shortcut. **L** jumps/blocks while guarding.

Two 20-minute halves, overtime, 30-second shot clock, distance-specific meters, AI passing/shooting/defense, reduced steals, sprint, crossover, blocks and rebounds. After every basket the receiving team must inbound. K, 1–5 or clicking a teammate passes; no dribbling/shooting from the inbound position. The game clock restarts on the catch. Five seconds without passing records a turnover; the opponent inbounds automatically.

Standalone test: `node tests/pixel-basketball.js` in the original workspace. Handoff interface test: `node tests/basketball-handoff.js`. Both use installed Chrome and temporary profiles.

The archive also includes a standalone test: run `npm install`, then `npm test` inside the package on macOS with Google Chrome installed. Other platforms should adjust the executable path in `tests/game.js`.

## Coaching controls

Offense matches College Dynasty: **Balanced**, **Perimeter**, **Inside-out**. Perimeter spaces the guards beyond the arc and increases their perimeter-shot preference. Inside-out sends the bigs near the rim, with guards available for kickouts and lower AI three-point preference. Balanced uses the regular movement system. Ratings still govern success.

Defense matches College Dynasty: **Man-to-man**, **2–3 zone**, **Full-court press**. Zone uses two upper and three lower anchors that shift toward nearby threats; its guard guide points to the nearest threat in your area. Press follows assignments across the floor with closer denial and more off-ball fatigue. Man-to-man preserves the original assignment/help scheme. K still explicitly guards the ball with the controlled player.

Isolation remains its own I/button control. Existing B screens, Q cuts and G double-teams remain. Optional match input `tactics: {offense, defense, pace, tmo}` initializes the selectors; both names must match the choices above. The current adapter forwards career offense, defense, pace and timeout style, along with eligible reserves. Pace is Slow/Balanced/Fast; tmo is Quick/Normal/Save. These are playable-court implementations of the coaching choices, not copies of the statistical possession simulator.

## Arena and athlete rendering (1.8.0)

Player models use adult athletic proportions, tapered jointed limbs, defensive stances, running shoe motion, overhead shooting poses, shaded uniforms, sleeve/knee accessories and front/back facial views. Height and strength still control visual stature and build, and appearanceSeed keeps each player's appearance stable. Position badges sit beside your players' feet to keep the taller models readable. The court has layered seating, finer maple boards and grain, varnish lighting, an inlaid center crest, LED edges, dimensional stanchions, angled glass and woven animated nets. Arena art is drawn locally; player geometry comes from the embedded CC0 human model described in ASSET-CREDITS.md. Rendering consumes no gameplay randomness. Court coordinates, controls and career protocol remain unchanged.

## Player lock (1.9.0)

Use the control selector above the scoreboard to choose Team control or lock to one of the five lineup players. It can be changed before play, during play or while paused. Lock remains on the chosen lineup slot through passes, rebounds, turnovers, inbounds, halves and overtime; a new game retains your choice. New supplied rosters refresh the slot labels.

While locked, you move only that player. Teammates dribble, pass and shoot using the same attributes and tendencies as the opponent AI. K immediately calls for a pass while off-ball (two-second request cooldown). Teammates attempt it even into coverage; normal interception risk still applies. A pending AI shooting windup is canceled to honor the call. Click your locked player to request a pass as well. When carrying the ball, shooting, passing, crossovers and 1–5 receiver selection work normally. F cannot switch away. On defense K has your locked player guard the ball instead of selecting the nearest teammate. Teammates inbound automatically if your locked player is not the inbounder; if you are the inbounder, the existing manual pass and five-second rule apply. A green ring shows the controlled player and a cyan ring shows a teammate ball handler.

Team control restores the original automatic offensive selection and defensive switching. The control mode is a local court preference, with no career-save changes and no input/output protocol changes.

Pause and resume using the button above the scoreboard. P is no longer a pause shortcut.

On defense, a gold arrow and GUARD badge identify your controlled player’s assignment. Normally this is the matching lineup opponent; K guarding points to the ball handler (or incoming pass receiver). The guide also supports player lock and active double-team helpers, and hides on offense and during shots/loose-ball rebounds.

## Shorter games and official adjusted statistics (2.0.0)

Standalone game format supports 20-, 15-, 10- and 5-minute halves. Both halves use the chosen length; overtime stays five minutes. A host can pass optional `halfSeconds: 1200 | 900 | 600 | 300` (defaults to 1200). The host owns this choice for embedded matches.

At the final buzzer, the score, both player boxes, team stats and possession count in the final message are the **official 40-minute adjusted result**. The original played result is retained under `actual` with score, box, opponentBox, teamStats, poss, ot and halfSeconds. `adjustmentFactor` and `statsBasis` describe the adjustment. Use the top-level fields to save the season; do not rescale them again. Actual/Official adjusted tabs show both full player boxes, and the main final scoreboard uses the official score.

Factor = (40 + 5 × overtime periods) / (2 × halfSeconds / 60 + 5 × overtime periods). Thus regulation 15/10/5-minute halves scale approximately 1.33/2/4 times, while 20-minute halves remain unchanged even in overtime. Counting stats and minutes are rounded; points are derived from adjusted made field goals, threes and free throws, and team scores equal their player-point totals. Small shooting-rounding corrections preserve the played winner. This is duration normalization, not a fabricated target score or a guarantee that the playable game produces the sim engine's exact statistical distribution.

Protocol version remains 1 with additive metadata. Main College Dynasty source is not changed by this package.

## Controls and timeouts (2.1.0)

**J** crosses over when your team has possession and attempts a steal on defense. **Space** is shooting: hold and release for an ordinary shot. While driving toward the basket within layup range, tap Space, then quickly press and hold Space again (within 0.3 seconds) to bring up the dunk meter. Release the second press in its green window. Finishing and vertical must both be at least 65 to attempt the dunk; contests and timing still affect success. J is the only crossover key; C has no gameplay action.

**Pause** freezes play without spending a timeout and does not allow substitutions or tactic changes. **Timeout** is separate: four per team, with at most three carried into the second half, matching College Dynasty defaults. Call one while holding the ball or during an inbound stoppage. Both clocks freeze. Change offense, defense, Quick/Normal/Save timeout style, player lock and any of the five lineup slots, then Resume game. Pace changes and substitutions are also available at halftime; pace can only change there. Optional Auto-call timeouts spends your limited supply on opposing scoring runs. The opponent also uses its limited timeouts against scoring runs.

Standalone teams have three reserves each. Embedded teams use only the bench supplied by the host; no reserves are invented for career matches. Player lock follows the chosen lineup slot when substituted. The adapter filters injured/redshirt reserves and supplies opponent reserves too. All exported boxes include reserves who played, and `timeoutsUsed` records each team's allocation consumed (including any excess forfeited at halftime, matching the sim).

Optional `timeoutRules: {total:4, carry:3}` comes from the adapter's optional TUNE helper (`timeouts`, `toCarry`). Defaults apply when absent. Protocol remains version 1.

## Toolbar presentation (2.1.1)

Labeled Player control, Offense and Defense menus; separate Play calls and Game controls groups. Timeout has a warm accent, Pause a mint accent, with quieter audio and restart buttons. Layout adapts to short laptop screens and phone widths. Controls and integration format are unchanged.

## Court-first athlete update (2.2.0)

The desktop court fills most of the available window with a compact horizontal toolbar, a floating score bug over the seating and a smaller status strip. Phone layouts keep their touch controls. The elevated full-court view preserves reliable passing hit targets. Athlete rendering uses filled, tapered shaded anatomy, jointed running and defensive poses, forward/backward and lateral facing, modeled shoes, jersey folds, accessories and stable individual faces. WebGL athletes now use a downloaded, continuous CC0 human mesh with GPU skeletal animation; the 2D fallback keeps its procedural artwork. Height and strength still affect appearance. Gameplay coordinates, controls, ratings and protocol remain unchanged.

## Full-window court (2.2.1)

Desktop layout uses the entire available viewport width and height, with the court filling the space between the compact coaching toolbar and status strips. It no longer has a fixed width cap or a height-based width limit. Athlete and ball rendering compensate for the wider floor so their proportions stay natural. Click-to-pass uses the actual canvas bounds. Touch layouts retain their controls.

## 3D broadcast presentation (3.0.0)

The default view now uses actual WebGL geometry: articulated low-poly athletes, perspective hardwood, elevated baskets with glass backboards, nets and stepped arena seating. A smoothly following broadcast camera tracks possession and considers the locked player. Models turn smoothly and use shared primitive meshes for running, dribbling, shooting, jumping and defense. Ratings, height and stable appearance identities remain intact.

The offline renderer is entirely inline, including the downloaded CC0 human mesh. No external engine or runtime fetch is required. Floor markings are uploaded as a cached texture. Stands and hoops are baked into material batches; players reuse static vertex buffers. Resolution is capped at 1800 × 1100 and DPR 1.25, then reduced automatically after sustained slow frames. The renderer uses a 1024px four-tap live shadow map and inexpensive material lighting; shadows disable when adaptive quality drops to 0.7 or below. No postprocessing pipeline is required. Current action previews use about 461 draw calls including the shadow pass. `graphicsInfo()` on the existing public API reports renderer, draw count, frames, resolution, quality and recent frame interval. It does not change the integration protocol.

Pass clicks use projected player positions; labels, guard guidance and shot meters follow the 3D camera. If WebGL is unavailable or its context is lost, the game continues with its 2D renderer and the same controls. Earlier rendering sections describe prior artwork and the fallback. This is an original lightweight sports-game presentation, not NBA 2K assets or its engine.

## 3D polish and camera choices (3.1.0)

Standalone project now lives in `Courtside-Basketball`. The court uses corrected normal lighting, soft fill and inexpensive material highlights. Athletes have shaped shoulder/waist jersey meshes, navy home shorts and jersey text rendered on the front and back of the 3D model. The old floating chest-number overlay is removed. The arena has denser batched seating, benches and courtside boards; floor texture excludes the old flat crowd.

Use the camera button above the court to cycle Broadcast, Courtside and Wide. Broadcast follows possession closer to play; Courtside lowers the angle; Wide centers the full court. Visual choices do not change ratings, controls or game results. Rendering stays below the 650 draw-call budget in the checks and uses shared meshes, cached textures and adaptive resolution.

## Rules and feedback audit (3.2.0)

See RULES.md for supported rules and remaining simplifications. Added ten-second advancement and return-to-backcourt violations; both award the other team possession with an inbound and credit a turnover. Offensive rim rebounds reset to 20 seconds; blocks do not reset the clock. Timeout resets the backcourt count while preserving the shot clock. AI avoids voluntary backcourt passes. Camera follows pass receivers rather than drifting to center, with smoother player-lock zoom. Persistent shot feedback reports type, timing, coverage and outcome.

## Officiating and animation update (3.3.0)

Reach/contact and shooting fouls, offensive charges against planted defenders outside the restricted area, two/three-shot fouls and and-ones are playable. Team fouls reset for half two, carry into overtime, and award one-and-one on fouls 7–9 and two shots from foul 10; offensive fouls do not award bonus shots. Five personal fouls disqualify a player and automatically use an eligible reserve. With no reserve, the team plays shorthanded; inactive players cannot receive passes or re-enter.

Free throws stop game and possession clocks. Hold/release Space (or Hold Shoot on touch) for the free-throw meter; AI and off-ball player-lock teammates take their own attempts. A missed front end ends the one-and-one; a final miss produces a live rebound. A ten-second attempt limit prevents a stall. Awarded free throws finish before the final result, including at the buzzer. Made FTs count as one point, never as field goals; missed fouled shots are removed from FGA/3PA. Result boxes carry `ftm`, `fta`, and `pf`. Team totals also carry `freeThrowsMade`, `freeThrowsAttempted`, and `fouls`. Preserve `pf` in the host save schema if storing it; the standalone cannot change that schema.

Ball handlers stepping over court boundaries turn it over at that edge. Modeled blocked-ball deflections retain the last defender touch for boundary possession. Moving more than the allowed gather distance while holding the shooting meter is traveling; automatic dribbling stays legal. Late reachable touches on descending shots above the rim are defensive goaltending or offensive interference. These use modeled locations/reach rather than a full foot/contact physics solver.

Shared poses cover idle breathing, running/sprinting, defensive slides, dribbling, crossover, passing, catching, gather/jump shot, layup, dunk, steal reach, block, rebound, landing, screen, cut, inbound, free throw/lane wait, contact/foul reaction and celebration. Arena detail includes six crowd tiers, baseline stands, aisle rails, entry tunnels, benches, scorer tables, officials, arena signage and brief crowd/net reactions after makes. Shared meshes, batched scenery and adaptive render resolution keep the component offline and lightweight.

See `RULES.md` for the remaining approximations; this is not a claim of complete NCAA officiating.

If no player remains eligible, the result has `forfeit: {loser, winner, reason}` (team indices 0/1). Scores and boxes retain played points; the host should use `forfeit.winner` for the season decision rather than comparing those scores.

## Athlete movement update (3.4.0)

`athleteRig` drives both 3D and fallback joints. Dribbling drops the hips, bends the knees, leans the body forward and moves the ball-side hand with the low bounce while the opposite arm shields. Defense uses a wider base and lateral stepping rather than a forward running gait; shot gathers prompt a hands-up contest.

Layups and dunks have separate rigs and release timing. Layups drive a knee and extend one finishing hand; dunks gather with two hands, rise toward the hoop and keep the ball attached until the rim finish. Made and missed finishes recover through landing. Visual approach/reach interpolations do not change shot probabilities, player attributes, controls, seed or season result logic. Personal height remains part of the skeleton and dunk extension.

## Directional handling and anatomy (3.5.0)

Human input and AI movement select the dribbling hand, with lateral directions interpreted relative to the attacking basket. Idle preserves the current hand. A smooth hand blend carries the ball across the body during a direction change; J begins the crossover from the current hand. This visual state consumes no randomness and does not alter handling ratings or steal probabilities.

Player surfaces now use profiled muscle contours and a shaped jaw/cheek/skull mesh, smaller joints, modeled palms/fingers, close-fitting hair, facial details and refined shoes. These remain original stylized athletes rather than scanned NBA 2K assets or photorealistic characters. Shared meshes and the existing adaptive resolution/fallback remain in use.

## Historical downloaded model update (3.6.0, replaced in 3.7.0)

The WebGL game now uses a real downloaded Quaternius human mesh rather than assembling the player body from primitive shapes. Face, ears, fingers, torso and limbs belong to a continuous weighted skin. Eighteen GPU bone groups follow the shared basketball action rig for dribbling, crossover, running, defense, contest/block, passing/catching, gathering/shooting, layups, dunks, rebounding, contact, free throws and landing. Team uniforms are fitted mesh overlays; height/build and appearance remain tied to the player.

All model bytes are embedded, so opening basketball-game.html directly works offline. Source GLB, CC0 license, conversion tool and provenance are included; see ASSET-CREDITS.md. These are game-ready human models with stylized facial proportions, not photorealistic scans. The 2D fallback and gameplay rules are retained.

## Historical realistic 3D presentation (3.7.0, player replaced in 3.8.0)

This release used the Blender Studio realistic male base, with Blender-baked weights and natural proportions. Mesh-bound uniforms/numbers, modeled facial anatomy, fitted hair, directional dribbling, wide defensive stances and articulated finishes are retained. The court uses narrow maple boards, live athlete shadows, material-specific lighting and a lower broadcast camera. The crowd is a lightweight human LOD; officials are weighted humans in striped uniforms. A 1024px shadow map adds one scene pass, with bounded buffers and adaptive quality. This is a realistic human base rather than NBA 2K artwork or photorealistic player scans. See ASSET-CREDITS.md for the source, CC0 license and editable mesh.

## Claude integration: the home school owns center court

**Keep team 0 as the controlled roster and team 1 as the opponent. Do not reorder them for away games.** Pass `homeTeam: 0` for your home games, `homeTeam: 1` for away games, and `homeTeam: null` for neutral games. The adapter reads `scheduledGame.venue` (`Home`, `Away`, `Neutral`) and supplies this automatically. Older inputs without the field default to team 0.

Each team may supply `color`, `secondaryColor`, and `logo`. `logo` must be an embedded PNG, JPEG, WebP or SVG data URL (maximum 2.5 million characters). Pass the career's **logoFor** and **hqOppSchool** functions in the helper object shown above: the adapter wraps the game's existing SVG logo artwork with its school color and embeds it. If your app uses a different logo function, supply the equivalent helper or set `match.teams[index].logo` before sending the match. No remote image URL is required.

The center floor displays the decoded home-school image and school name, uses the home palette at both baskets, and gives the home side white uniforms. Loading a different game replaces the image and cached floor texture. Missing/failed images use a home-school monogram; neutral venues use neutral branding. `CollegeDynastyBasketball.getCourtIdentity()` reports home index, school identity, colors and logo decode status for integration checks. Logos/colors are presentation data only; all roster IDs, ratings, tendencies, rules, official results and save handling keep the existing protocol.

## Continuous movement (3.7.1)

Live possession changes retain current player positions. After baskets, players run to their defensive/inbound targets using speed ratings, stamina and stun effects. The inbounder walks/runs all the way to the designated baseline or sideline; no end-of-timer snap occurs. The game clock stays stopped during throw-in setup, and the five-second count begins only once the inbounder arrives. Other players continue repositioning during the throw-in, with manual movement available for the selected off-ball player and full-court press assignments preserved. Recovery defenders sprint toward their basket and live transitions preserve fast-break space.

Free-throw players walk into their lineup before the attempt timer or shot input starts. Layup/dunk approaches update real player positions; the 3D and 2D rigs follow those positions and land there. Initial new-game placement and substitutions remain dead-ball roster setup. No integration field changes are required.

## Perfect releases (3.7.2)

Perfect timing guarantees a made field goal or free throw; a legal block can still stop a field goal. The visible perfect window gets smaller with lower shooting ratings, fatigue, close contests and deeper range. Dunk timing also considers vertical. Early/late releases retain rating-based probabilities. Normal foul, interference and violation rules still apply. The same mechanics apply to both teams; AI does not receive an automatic perfect release.

## Textured Human model (3.8.0)

Replaced the player mesh with the owner-supplied **Human by Real_jseals (CC BY 4.0)**. Its original facial/skin UV texture and normal map are embedded for offline play. Fitted an 18-bone basketball skeleton plus sleeveless jerseys, shorts, socks, shoes and hair overlays; team names/numbers remain printed on the weighted jerseys. The model follows existing movement, dribble, defense, shot, layup, dunk, block and recovery poses, with height/build variation preserved. The prepared athlete is 11,256 triangles, reducing the previous mesh cost. Crowd LOD remains Blender Studio CC0.

Optional per-player `skinColor` and `hairColor` accept six-digit hex colors (for example `"#784c32"`). The adapter carries supplied roster colors for starters and reserves; otherwise stable ID-derived colors are used. This consumes no game RNG. Protocol remains version 1. Preserve attribution in the game's Model credits and ASSET-CREDITS.md. The supplied source, textures, editable rig and preparation steps are included.
