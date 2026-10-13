# 4.0.0 (College Dynasty local change, not in the original package): the pixel court

- **The 3D court is gone; the game is a 2D pixel-art game.** Same engine, same rules, same AI, stats, box score, substitutions, fouls, shot clock and College Dynasty hookup. Only how it is drawn changed.
- **The picture:** a fixed 480 x 280 pixel buffer (one game unit is one pixel) scaled to the screen without smoothing (`image-rendering: pixelated`). The whole picture uses about 170 colours. Everything is drawn in code: maple floor with plank joints and grain, team-coloured lanes, lines exactly on the game's shot zones, crowd that bobs and jumps after scores, hoops with swaying nets and shot clocks, the scorer's table, the school's logo reduced to pixels in the centre circle.
- **Players:** sprites with a one-pixel dark outline, drawn from each player's appearance: 8 hairstyles, 6 beard looks, 5 builds (lean, athletic, strong, big man, long and lean), headbands, wristbands, sleeves, knee sleeves, shoes, numbers on the jerseys, heights. Poses: run, dribble, shoot, gather, pass, defend, screen, steal, block, rebound, four celebrations. Players face the way they run or toward the ball handler or hoop.
- **Overlays in pixel type:** a 3 x 5 pixel font for tags, pass preview, screen and cut labels, the shot meter with its green window, shot grades (EXCELLENT, GOOD, EARLY, LATE), ON FIRE flames, banners. Name tags never overlap.
- **Interface:** Press Start 2P (SIL OFL), square bevelled buttons, thick borders, a pixel scoreboard and pixel menus; the phone menu scrolls inside the court and no longer hides its title under the scoreboard.
- **Removed:** the WebGL renderer, the player model and textures, the camera button, the 2K-style 3D presentation (3.10), body and hair kits for the 3D model (3.11, 3.12), the older flat renderer, and the build files for the model. The court went from 6.3 MB to about 240 KB.
- **Tests:** the package suite's checks that were about 3D (camera, WebGL limits, mesh, textures, GPU loss) were replaced by pixel equivalents (129 checks); `tests/court-pixel.js` checks the pixel picture, palette, line positions, looks, facing and tags.

# 3.12.0 (College Dynasty local change, not in the original package): bodies and celebrations

- **Five body types.** The base model is a realistic but slim, average-build man (narrow shoulders, thin limbs, little muscle). `tools/make-athlete-bodies.py` reshapes the same rigged, UV-mapped mesh into lean (the original), athletic, strong, big man and long-and-lean builds: broader shoulders, chest and hips, fuller arms, thighs and calves with muscle bulges, thicker necks, and the jersey, shorts, socks and shoes are re-fitted to each. Guards are lean, athletic or long and lean; wings athletic, long and lean or strong; forwards strong, athletic or big; centers big or strong, picked from the player's appearance. The extra bodies are packed (16 bit positions and uvs, 8 bit normals and weights) and add about 2 MB. The old position-based width scaling was removed (the bodies do that now).
- **Celebrations.** After a made three, or any make that is not a layup or dunk, the scorer celebrates (1.1 s, 1.5 s for a three); after a dunk he lands and then celebrates. Four celebrations by player: fist pump, both arms wide and up, one finger to the sky with the other hand on the chest, and a flex. `animate(index, name, duration, then)` can now chain one animation into another.
- Blender 4.2 LTS was installed to inspect and render the original model; the build uses plain Python and does not need it.
- **Package test change:** `tests/game.js` now runs its original-mechanics checks with the random shooting fouls, non-shooting fouls and extra turnovers from 3.9.0 switched off (`courtTuneOverride = { sfScale: 0, nfScale: 0, toScale: 0 }`). The suite lets the game loop run between its steps, so how many frames run (and how many random numbers they draw) depends on how heavy the page is; the bigger court file shifted that and made shot, block and rebound checks fail at random (a different one each run). Those checks are about the original mechanics; `tests/court-realism.js` covers the new random events.

# 3.11.0 (College Dynasty local change, not in the original package): players

- **Bodies face the way the player faces.** The torso, neck, head, hands and feet were oriented with a fixed world direction (vertical bones always used +z), so every player's chest and face pointed at the near sideline whatever way he ran or shot; only the arms and legs followed his direction. Every bone now takes the player's facing (`frame(a, b, fwd)` in `drawHuman`), so players face their hoop, the ball handler, or where they run, and the jersey back (HOME and number) shows when they face away.
- **Heads follow the play.** The ball handler looks where he is going; everyone else turns neck and head toward the ball (or where a pass or shot is headed), up to about 60 degrees, eased so it never snaps (`gazeMap`, stored on the player as `gaze` for tests). The hair, beard and headband turn with the head.
- **Player variety** from each player's appearance seed: 8 hairstyles (low cut, high-top, afro, short twists, long braids, cornrows, man bun, bald), occasional dyed hair, facial hair (none, goatee, full beard, goatee and mustache), and builds that depend on position as well as strength (centers broader, guards leaner). Built from the same shapes as the headband, fitted to the measured head of the model (head centre (0, 5.66, 0.20), crown 6.08, chin 5.28, nose z 0.42 in rig coordinates). The headband was refitted so it wraps the head.
- The shoe, wristband, sleeve and knee-sleeve variety from 3.10.0 is unchanged.

# 3.10.0 (College Dynasty local change, not in the original package): 2K-style presentation

- **Broadcast score bug:** team-colored blocks, big tabular scores, the clock in the middle with the shot clock hanging under it (it pulses red under five seconds), timeouts left as dots, team fouls, BONUS, and a marker on the team with the ball. Barlow Condensed (SIL Open Font License) is embedded for the scoreboard and every label on the court.
- **Player tags:** the player you control gets a bobbing arrow and his number and name; teammates show the key that passes to them (1 PG, 2 SG ...); the opposing ball handler shows his number and name.
- **Streaks:** three or four makes in a row set a player ON FIRE (flames at his feet and a banner), a run of misses leaves him ICE COLD (frost and a banner). Uses the heat from 3.9.0.
- **Shot grades:** EXCELLENT / GOOD / EARLY / LATE rises over the shooter after a release, followed by BUCKET or MISS.
- **Players:** wristbands (team trim or white), an arm sleeve on some players, a knee sleeve on some, and shoe colors (white, black, team trim, gold, red) chosen from each player's appearance.
- **Camera:** sits closer so the players are bigger, leads the play a little, follows the ball across the court as well as along it, and limits its sideways travel from how wide the view is so a baseline never slides out of frame.
- A soft vignette and top light sit over the arena.

# 3.9.0 (College Dynasty local change, not in the original package): realism pass

The court is calibrated so a full game lands near real college basketball per 40 minutes, with real College Dynasty teams at every school level (computer vs computer, 40 matchups): about 71 possessions a team (real 68), 75 points (73), 44% shooting (44), 32% from three (34), 57% of baskets assisted (53), 12 turnovers (12), 8 steals (6), 19 fouls (17). Before this pass the court played at about twice real pace (144 possessions, 153 points).
- **Computer offense by expected points.** Every option is worth its expected points (the same make chance a real shot uses, so ratings, openness, distance, fatigue, streaks and tendencies drive the choice; three-point tendency changes how much a three is worth). Each possession has its own natural length (10 to 32 seconds); a great look (open at the rim, or an elite look) is taken at any time; once the possession has run its length the ball handler takes the best shot he has or passes to the best one; with 3 seconds left the shot goes up (no more shot-clock violations from passing at the end). The bar is relative to how well the team shoots, so weak and strong teams play at a similar pace. All of it is `courtTune()` (override with `window.courtTuneOverride` or `match.simTune.court`).
- **Rotations.** Players carry a `minutes` plan (out of 40; College Dynasty sets yours from Coaching and the opponent's from its depth chart). At dead balls the coach (always for the opponent; for your team while the new **Auto-sub** button is on) takes out a player who is over his pace (6 minutes of room), tired (energy under half) or in foul trouble, and brings in a rested player who is behind his plan, same position first. Stints are at least 5 minutes of a 40-minute game; not in the first minutes, not in overtime, not in a close finish unless someone is in foul trouble or spent, never your locked player.
- **Home court.** `match.homeTeam` 0 or 1 gives that side +1.8 points of make chance and the visitor -1.8 (the main game's 6 rating points x 0.003). Neutral games and the standalone page have none.
- **Hot and cold shooters.** A made shot warms a player (+0.3) and a miss cools him (-0.2) on a -1 to +1 scale that fades 7% per possession; heat moves his make chance by 0.07 x heat.
- **Fouls and turnovers at the main game's rates.** `match.simTune` carries `sf` (shooting fouls, 0.11 per shot, more when contested or at the rim), `nf` (a foul away from the shot, 0.216 per possession) and `to` (extra live-ball turnovers, 0.09 per possession) from College Dynasty's TUNE. These apply to your team too.
- **Offensive rebounds** go to the offense about 28 to 30% of the time (a nearby defender wins some of the offense's boards).
- **Clutch time.** In the last four minutes of a game within six points, the ball handler looks for the best and most clutch teammates (`passValue`).
- **Test mode.** `state.autoplay = true` lets the computer play both teams so full games can be run headlessly. Never on in a real game.
- `state.lastShotChance` keeps the make chance of the last shot (for tests). Perfect timing still guarantees a made shot; human-controlled shooting is unchanged.
- Package tests changed for these behaviors (still 130 checks): the manual-steal check uses 2000 trials, the closed-lane interception check tries up to 40 times at full interception strength, and the final box-score row check allows substitutes (10 or more rows).

# 3.8.3 (College Dynasty local change, not in the original package)

New **Box score** button next to Pause. It opens a live box score for both teams (MIN, PTS, FG, 3PT, FT, REB, AST, STL, BLK, TO, PF; the five on the floor first with a dot, then bench players who have played, then team totals with shooting percentages) from the same player boxes the final result uses, labeled as played. Play freezes while it is open and resumes when it is closed (a pause, timeout or halftime that was already on stays as it was). Escape or clicking outside closes it. It also works after the final buzzer. Changed in `basketball-game.html`: the button, a `#live-box` modal, and `openBoxScore()`, `renderLiveBox()`, `closeBoxScore()`.

# 3.8.2 (College Dynasty local change, not in the original package)

Optional player tendency **`priority`** (0 to 2, default 1). The AI ball handler looks for a teammate with a higher `priority` first when it chooses a pass target (`aiStep`: the shot-opportunity ranking gets `+40 * (priority - 1)`). College Dynasty sets it from Coaching > Shot priority, together with a higher `usage` so those players shoot more. With every priority at 1 the ranking is unchanged.

# 3.8.1 (College Dynasty local change, not in the original package)

Keys **1 to 5** are positions: **1 = PG, 2 = SG, 3 = SF, 4 = PF, 5 = C**. Each key goes to whoever is playing that position in your lineup right now (your five on the floor are sorted by position, ties by lineup order, so a lineup with no SF still gives every key a player; substitutions are followed automatically). On offense the key passes to that player (as before, but by position instead of lineup slot). New: on defense, or on a loose ball, the key takes control of that player, like **F** but by number. While Player lock is on, the number keys do not switch players (the existing message appears). The on-screen key help lists them. Changed in `basketball-game.html`: `down()`, and the new `positionSlot()` and `takePlayer()`. If the court is ever re-exported from the original project, this change has to be applied again.

# 3.8.0 — Owner-supplied textured human players

Replaced the player mesh with the owner-supplied **Human by Real_jseals (CC BY 4.0)**. Its original facial/skin UV texture and normal map are embedded for offline play. Fitted an 18-bone basketball skeleton plus sleeveless jerseys, shorts, socks, shoes and hair overlays; team names/numbers remain printed on the weighted jerseys. The model follows existing movement, dribble, defense, shot, layup, dunk, block and recovery poses, with height/build variation preserved. The prepared athlete is 11,256 triangles, reducing the previous mesh cost. Crowd LOD remains Blender Studio CC0.

Optional per-player `skinColor` and `hairColor` accept six-digit hex colors (for example `"#784c32"`). The adapter carries supplied roster colors for starters and reserves; otherwise stable ID-derived colors are used. This consumes no game RNG. Protocol remains version 1. Preserve attribution in the game's Model credits and ASSET-CREDITS.md. The supplied source, textures, editable rig and preparation steps are included.

# 3.7.2 — Perfect releases reward timing

- Perfect timing guarantees a made field goal or free throw; a legal block can still stop a field goal. The visible perfect window gets smaller with lower shooting ratings, fatigue, close contests and deeper range. Dunk timing also considers vertical. Early/late releases retain rating-based probabilities. Normal foul, interference and violation rules still apply. The same mechanics apply to both teams; AI does not receive an automatic perfect release.
- Added guaranteed-release, blocked-perfect, free-throw, timing-difficulty and non-perfect regression checks.

# 3.7.1 — Continuous transitions instead of position snaps

- Post-score inbound setup uses normal rating/stamina-scaled running, with no 320-unit rush or forced baseline assignment.
- Defenders retreat to their end; press defenders still follow receivers. Live recovery and transition runs use sprint movement.
- Five-second inbound count starts after the inbounder reaches the spot; receivers/defenders keep moving during the throw-in.
- Free-throw participants walk to the line/lane positions with clocks and attempt timer stopped; shooting input waits for readiness.
- Dunk/layup approaches advance the actual player position and the model together; landing starts at the true finishing position.
- New bounded movement, recovery, inbound timing, free-throw walking and physical finish regression checks.

# 3.7.0 — Realistic humans, lit arena, home-school floor

- Replaced the superhero body with Blender Studio's CC0 realistic male mesh and properly fitted Blender heat-weighted skeleton.
- Natural athlete proportions, closer-fitting mesh hair and facial details, lower dribbling with a separate bouncing ball, and body-bound jersey numbers.
- Soft four-tap 1024px live shadows, material-specific skin/fabric/floor lighting, restrained tone mapping and a lower broadcast camera.
- Fine staggered maple boards, one home-color court palette, structural trusses and arena fascia, human crowd LODs and striped realistic officials.
- `homeTeam: 0 | 1 | null`, per-team logo/color fields, actual home logo at center court, neutral fallback and stale-image protection.
- Adapter reads scheduled venue and optional career `logoFor` / `hqOppSchool` helpers; roster order and controlled team remain the same.
- Full gameplay/graphics and adapter checks, actual decoded home/away logo pixel checks, bounded batches and context-loss fallback.

# 3.6.0 — Downloaded rigged human players

- Replaced primitive player bodies with the CC0 Quaternius Superhero Male human mesh: continuous anatomy, modeled face, eyes, eyebrows and individual fingers.
- GPU skinning with 18 retargeted bone groups covers existing basketball action states; all ten athletes share static mesh buffers.
- Fitted sleeveless uniforms, shorts, socks and shoes; height/build, team colors and stable individual appearance retained.
- Embedded asset bytes keep standalone and iframe versions offline; source GLB, conversion tool, provenance and license included.
- Existing gameplay/rules, J crossover, L block and F switch controls retained. Graphics budget and fallback checks retained.

# 3.5.1 — L blocks, F switches

- L now jumps/blocks; F now switches players.
- Keyboard, touch buttons, hints, help and checks use the same mapping.

# 3.5.0 — Directional dribbling and sculpted anatomy

- Dribble hand follows human/AI movement; smooth side transitions and idle-hand persistence.
- J crossover starts from the current hand; seeded gameplay probabilities unchanged.
- Profiled muscle contours, shaped jaw/cheek/head and smaller elbow/knee joints.
- Modeled palms/fingers, close-fitting hair, brows/lips and refined shoes.
- Direction-switch/AI/seed checks and existing gameplay/graphics checks.

# 3.4.0 — Lower stances and articulated finishes

- Fuller shoulders, thighs, forearms and fitted shorts; shared athlete skeleton for both renderers.
- Low bent-knee dribble stance, waist/hip shielding and synchronized low hand/ball bounce.
- Wide defensive stance, lateral foot placement and separate hands-up / reaching poses.
- Layup gather, one-leg knee drive, one-handed extension and shorter finishing arc.
- Two-handed dunk windup, rising approach, rim-height finish, late hand release and landing recovery.
- Ball stays attached to the finishing hand(s) until release; finish shadows follow the athlete.
- Pose-phase, stance and rim-height checks, plus existing rules/control/embedding checks.

# 3.3.0 — Playable officiating and richer arena animation

- Personal/contact/shooting/offensive fouls; free throws, one-and-one/double bonus, and-ones and fifth-foul substitutions.
- Ratings affect FT accuracy and meter width; clocks stop and awarded FTs finish at the buzzer.
- Gather traveling, modeled goaltending/offensive interference, dribbler/deflection boundary calls and edge inbounds.
- FT/PF box scores and team totals; official short-game scaling preserves personal fouls.
- Smoother and fuller athlete anatomy, hair variants and action-specific articulated poses shared with 2D fallback.
- Landing, catch/pass, screen/cut, contact, inbound, free-throw, crowd and net reactions.
- Expanded arena tiers/baseline seating, aisles, tunnels, benches, scorer tables, officials and signage.
- New rule, animation, full-match and export checks; bounded graphics and context-loss fallback retained.

# 3.2.1 — J-only crossover

- Removed the C crossover shortcut and duplicate touch button.
- J crosses over on offense and steals on defense, with matching button labels and cooldowns.

# 3.2.0 — Rules audit, backcourt and shot-clock fixes

- Ten-second backcourt advancement and return-to-backcourt violations.
- Offensive rebounds use 20 seconds; blocks preserve the clock.
- Timeout resets backcourt count, not the shot clock.
- AI avoids voluntary backcourt passes.
- Camera tracks passing receivers and eases player-lock framing.
- Persistent shot feedback and backcourt countdown guidance.
- RULES.md explicitly distinguishes supported features from unimplemented NCAA rules.

# 3.1.0 — Better athletes, lighting and camera choices

- Shaped jersey meshes, front/back uniform lettering and improved shorts.
- Correct normals, soft fill lighting and subtle material highlights.
- Closer Broadcast camera plus Courtside and Wide options.
- Denser batched stands, benches and courtside boards; removed flat crowd from the floor texture.
- Preserved all gameplay and protocol 1; project follows Claude's move into Courtside-Basketball.

# 3.0.0 — Offline 3D broadcast court

- Real WebGL court, articulated low-poly athletes, elevated baskets, glass, nets and arena seating.
- Smooth following camera, with player-lock framing and projected click-to-pass/HUD guidance.
- Shared meshes, batched static geometry, capped resolution and automatic quality adjustment.
- Smooth turning and shooting, dribbling, jumping, running and defensive poses.
- Working 2D fallback when WebGL is unavailable or lost.
- Existing controls, ratings, timeout/substitution rules and protocol 1 preserved.

# 2.2.1 — Full-window court

- Desktop game uses the full window width and available height.
- Removed fixed and height-based width limits; compact toolbar and status strips.
- Preserved athlete and basketball proportions on wider court views.
- Tested desktop court coverage above 75% of window area.

# 2.2.0 — Larger court and modeled athletes

- Court fills most of the desktop window; compact toolbar and floating broadcast score bug.
- Filled and shaded athletic anatomy, articulated poses and lateral facing.
- New uniform shading, fabric folds, shorts, shoes and individual facial details.
- Existing height, strength, animations, controls and career integration preserved.

# 2.1.1 — Organized coaching toolbar

- Persistent labels for player control, offense and defense.
- Separate play calls and game controls, with clear Double team labeling and keyboard hints.
- Polished toolbar surface, consistent sizing and distinct Timeout/Pause accents.
- Compact laptop and responsive phone layouts.

# 2.1.0 — Context controls, driving dunks and real timeouts

- J crosses over on offense and steals on defense; Space shoots.
- Double-tap Space while driving in layup range, holding the second press, opens a dunk meter for capable finishers.
- Separate Pause and Timeout: four timeouts, at most three carried to half two.
- Timeout and halftime coaching dialogs with offense, defense, timeout style and substitutions; pace changes at halftime.
- Standalone reserves, supplied career benches and preserved substitution stats in final boxes.
- Adapter forwards eligible reserves, pace, timeout style and College Dynasty timeout rules.

# 2.0.0 — Short halves, official adjusted boxes and dynasty tactics

- 20/15/10/5-minute halves, with the same selected length in both halves and five-minute overtime.
- Final player box scores for both teams; Actual and Official adjusted tabs.
- Short-game score, boxes and possessions normalize to a standard college game for season integration, retaining the actual result separately.
- Integer shooting totals determine official points, preserving box/score consistency and the played winner.
- College Dynasty offense choices: Balanced, Perimeter, Inside-out; defense: Man-to-man, 2–3 zone, Full-court press.
- Real spacing, shooting preference, zone positioning and press denial/fatigue behavior; Isolation remains separate.
- Adapter forwards career tactics; optional halfSeconds input selects embedded game duration. Final metadata is additive to protocol 1.

# 1.9.3 — K calls for the ball

- In player lock on offense, off-ball K immediately requests a pass to the locked player.
- Removed coverage refusal; guarded passes still carry normal interception risk.
- Cancels a teammate shot windup to honor the pass call; existing cooldown and live-ball requirements remain.

# 1.9.2 — Defensive assignment guide

- Gold arrow, target ring and GUARD badge show who your controlled player should defend.
- Follows positional assignments, K ball guarding, incoming passes and player lock.
- Hides on offense and while shots or loose-ball rebounds are in progress.

# 1.9.1 — Pause button only

- Removed the P keyboard pause shortcut and its control hint.
- Pause/resume remains on the top Pause button.

# 1.9.0 — Player lock

- Selector switches between normal team control and any starting-five slot, including before tipoff and while paused.
- Locked control survives passes, rebounds, possession changes and inbounds.
- Off-ball teammates use possession AI; K or clicking the locked player requests a pass if open.
- Locked defense uses the chosen player for K guarding; L cannot switch away.
- Teammates handle inbounds when the locked player is not the inbounder; manual inbound rules still apply to the locked inbounder.
- Cyan teammate ball-handler ring distinguishes possession from the green controlled-player ring.
- Covered pass request checks, cooldown, teammate shooting/inbounds, completed locked game and phone selector covered by tests.
- Team control and career integration protocol remain available unchanged.

# 1.8.0 — Arena and athlete visual upgrade

- Adult athletic proportions with longer legs, tapered limbs, articulated knees, layered shoes and uniform folds.
- Stable hairstyles, skin tones, accessories and front/back views that respond to movement.
- Overhead ball-holding pose during shot charging and an elevated visual release arc.
- Soft directional shadows; team position badges moved beside the feet for model readability.
- Layered arena seating, finer hardwood grain, varnish lighting and a center-court inlay.
- Padded steel stanchions, angled transparent backboards, detailed orange rims and woven moving nets.
- Local canvas artwork preserves height/build variation, seeded gameplay and integration protocol.

# 1.7.0 — Tactical possessions

- Isolation clears teammates to perimeter spots; ends on a pass, another play or six-second timeout.
- Balanced, Tight and Paint defensive styles change on-ball spacing, help coverage and off-ball fatigue.
- Double-team sends a helper for four seconds, with an eight-second cooldown and an uncovered receiver as the tradeoff.
- AI recognizes traps and passes out earlier; receiver choices weigh shooting ability and open space.
- New I/T/G controls have touch buttons, active indicators and countdowns above the scoreboard.
- Verified tactical movement, pause, cleanup, AI escape passing and touch controls, alongside full-game checks.
- Integration protocol and career input/output format remain version 1.

# 1.6.0 — Clearer rating matchups

- Low handling is easier to strip; high steal ratings improve success for player and AI defenders.
- Passing ratings now have a stronger effect on closed-lane interception risk.
- Crossover effectiveness compares handling against perimeter defense.
- Existing steal cooldowns, range limits and possession protection remain.
- Standalone guards, wings and bigs have varied attributes and tendencies, matching the sample roster.
- Ratings panel available in standalone play; includes handling, steals, defense and rebounding.
- Dunk rating requirements apply to standalone as well as supplied career players.
- Seeded comparative checks cover handling, steals, passing and shooting. Integration protocol remains version 1.

# 1.5.0 — Refined player models

- Rounded athletic shoulders, thicker shaded limbs, more natural faces and improved uniform detailing.
- Stable player-specific skin tones, haircuts, beards, headbands and leg accessories.
- Wider defensive stances and a subtle body lean during movement.
- Optional appearanceSeed carried from career face seeds for consistent player identity.
- Height scaling and persistent positions remain intact. Gameplay and message protocol stay unchanged.

# 1.4.2 — Height-aware player models

- Model height now follows supplied height in inches instead of jersey slot.
- Standalone PG/SG/SF/PF/C have realistic heights, matching the demo roster; opponents vary slightly.
- Adapter preserves actual career and supplied opponent heights, and estimates missing compact opponent heights consistently.
- Player detail display includes height. Existing integrations can omit height and retain position defaults; message protocol stays version 1.

# 1.4.1 — Clearer team positions

- Persistent position badges for all five players on the controlled team.
- Larger bold type, dark backgrounds and bright outlines; selected player has a green outline.
- Supplied career positions are used when available. Gameplay and embedding protocol are unchanged.

# 1.4.0 — Players and arena redesign

- Taller, position-sized athletes with articulated running, dribbling, jumping and blocking poses.
- Distinct home/away uniforms, fabric shading, sleeves, hairstyles, facial details and varied footwear.
- Finer maple grain, lane ticks, sideline marks, scorer's table and more detailed spectator seats.
- Padded hoop supports, glass backboards, moving nets and live shot-clock displays.
- Repositioned pass and shot feedback for the taller models. Physics and integration protocol remain unchanged.

# 1.3.0 — More advanced gameplay

- B calls a screen; defender contact leads to a roll toward the basket. AI can use screens too.
- Q calls off-ball cuts, with give-and-go cuts following ordinary passes.
- Added interior help defense and directional L switching.
- Stamina follows individual players; fatigue affects movement and shooting, with halftime recovery.
- Screen and Cut touch buttons, play labels and updated control instructions.
- Added set-play, fatigue, directional switching and touch checks. Embedding protocol stays version 1.

# 1.2.0 — Guard the ball with K

- K automatically selects the nearest defender and stays with the opposing ball handler.
- Guarding follows the ball after opponent passes; directional movement or L restores manual control.
- K still passes and inbounds on offense. The touch button adapts to possession.
- Added keyboard and touch guard checks; roster/result message protocol remains version 1.

# 1.1.0 — Visual polish

- Brighter maple court, reflected arena lighting, home crest and team-colored painted areas.
- Sharper broadcast scoreboard, darker arena framing and refreshed menus.
- More distinct uniforms, player labels, sleeves and a glowing control indicator.
- Shot meter glow during the green release window.
- Team identity redraws correctly when the host loads another match.

The roster input and final-result message protocol remains version 1. Inbounds, attributes, tendencies and result export retain their existing behavior.
