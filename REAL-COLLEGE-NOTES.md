# Real College Dynasty: what is real and what is not

This is the College Dynasty game with its made-up schools replaced by real Division I programs.

Real: 358 school names, mascots, cities and colors; 31 conferences with their real members (as best I know the 2025-26 and 2026-27 alignments);
a NIL budget for every school (Duke $27.5M at the top, small programs under $1M, six tiers) and a strength rating that puts the blue bloods on top.

Not real: the players. Rosters are still generated each season (real 2026-27 rosters change with the portal and cannot be checked from here).

Adjustments the schedule forced (it needs an even number of teams in every conference):
- Left out: Lindenwood, NJIT, New Orleans (and Detroit Mercy, Cal State Bakersfield from my first list).
- Moved: Dayton plays in the Big East, UMass in the Atlantic 10, Tulsa in the Missouri Valley, Kansas City in the WAC, Merrimack in the Northeast.
- No "move up a conference" job offers (real conferences do not work that way).

To change a school or conference: edit data/real-schools.final.txt, then run `node tools/apply-real.js && ./tools/make-real-app.sh`.

## Real records, rosters, ratings and budgets (added Oct 2026)
- **Records:** every school's 2025-26 record and Torvik rank come from Bart Torvik's season file. The school picker, your opening message and the coach's win goal use the real record; program reputation is set from the Torvik rank.
- **Rosters:** each school starts with its real 2026-27 preseason roster (ESPN), including transfers and signees. Your own roster is the real one too. Where a school has fewer than 12 listed players, the gaps are filled with generated players.
- **Ratings:** each player is rated from last year's stats (points/rebounds/assists, per-minute impact, strength of league) blended with their recruiting rank by minutes played. Freshmen use their 247Sports composite rank; players with no public data get a modest rating from a prior for their conference. A team's rating is the weighted mean of its best 8 players. Players' "last season" lines in the game are their real 2025-26 per-game stats (steals, blocks and turnovers were not available and show as 0).
- **Budgets:** estimates shaped by reports (CBS/Norlander, 247Sports, On3, Bleacher Report): a dozen-plus programs near or above $20M, a golden tier of about ten at $10M+, Duke at the top. No school's real budget is public, so treat every number as an estimate. Mid-majors and small schools use conference-level estimates.
- Run `node tools/build-real-rosters.js` then `node tools/apply-real.js && node tools/build.js` to refresh.

## Update: all 365 schools, 2026-27 conferences (Oct 10, 2026)
- This **replaces** the earlier notes about 358 teams, left-out schools and the swapped conferences. Added: Detroit Mercy, New Orleans, Lindenwood, NJIT, New Haven, Cal State Bakersfield, UT Rio Grande Valley. That is every Division I team in Bart Torvik's 2026-27 file (365). West Florida (in transition from Division II) is left out.
- Every school sits in the conference it plays in for 2026-27 (Torvik's 2027 conference column): the new Pac-12 (Gonzaga, San Diego State, Utah State, Boise State, Colorado State, Fresno State, Oregon State, Washington State, Texas State), the United Athletic Conference (the old WAC/ASUN merger), Dayton in the Atlantic 10, UMass in the MAC, Tulsa in the American, Merrimack in the MAAC, and so on. 32 conferences. The old alignment is saved in `data/real-schools.2025-26-alignment.txt`.
- Conferences with an odd number of teams (Big East 11, Pac-12 9, American 13, ...) now work: each round one team has a bye. If it is your bye day you play a fixed nonconference opponent that day, so you get 16 or 17 conference games instead of 18. The ASUN (7 teams) gives its top seed a bye in the conference tournament.
- Saint Francis (PA) is missing from Torvik's 2026-27 file, so it has only a couple of known players; Queens and Lindenwood have short rosters too. Generated players fill the gaps.

## Logos and player photos (Oct 10, 2026)
- Logos and player photos are files you supplied, kept in `realdata/` (logos in `logos-src`/`logos-96`, photos in `photos-src`/`photos-128`). `node tools/build-logos.js` and `node tools/build-photos.js` rebuild the indexes, then `node tools/apply-real.js && node tools/build.js`.
- Photos are matched by school and player name. The photo is saved with the player (through his face seed), so it follows him through transfers and the draft. A player with no photo file keeps the generated face. New recruits and generated filler players have no photos.
- The game file needs its `photos` folder next to it; `tools/make-real-app.sh` copies it into the app.

## Real stats, starting portal and portal photos (Oct 10)
- tools/add-real-stats.js adds each player's full 2025-26 line (games, mpg, stl, blk, TO, FG/3P/FT) to 0000c-RealRosters.js as row[11]. Run it after build-real-rosters.js (which rewrites that file).
- build-real-rosters.js also writes 0000f-RealPortal.js (REAL_PORTAL): 2025-26 players with eligibility left who are on no 2026-27 roster (ESPN, Torvik 2027 or a photo folder). They fill the first slots of the starting transfer portal (W_realPortalP).
- Portal headshots: realdata/photos-128/_portal. 2 from Wikimedia Commons (Myles Rice: Maryland GovPics, CC BY 4.0; Noam Dovrat: CC BY-SA 4.0). 24 from school roster pages (SIDEARM Sports terms 2.3 allow copying for personal use only), sources listed in realdata/portal-photos-raw/credits.json. Personal use only: do not share the game with these photos.
- Phone layout: REAL-PHONE-SCROLL in src/css/ui-polish.css lets the page scroll on screens narrower than 1000px.

## Missing photos added (Oct 13, 2026)
- 371 of the 601 photo-less roster players got photos from `photo-work/Missing Player Photos Found 2026-27.zip` (198) and `New Photos Found 2026-10-12.zip` (173). Resized to 128 px wide, saved as `realdata/photos-128/<School>/<Player>.jpg`, and appended to `realdata/photos-src/Roster list 2026-27.csv` (Jersey and ESPN ID blank). Photos now total 5,089.
- Then `node tools/build-photos.js && node tools/apply-real.js && node tools/build.js`; `python3 tools/build-sprites.py` rebuilt the phone sprite sheets (now 5: photos-0..4.jpg). The phone page is NOT republished yet, and the Mac app was not repackaged (`zsh tools/make-real-app.sh`).
- 157 players are still STILL MISSING (73 more found Oct 13 from team sites: Appalachian State, Longwood, Merrimack, Mount St. Mary's, Quinnipiac, South Carolina, Southern Utah, Georgia Tech and others; Manhattan placeholders rejected). The Mac app and the phone page (version 10, now with search) were rebuilt with them.

## New app icon (Oct 13, 2026)
- `data/app-icon.svg` is a new original icon: basketball on a navy card with a gold "RCD" and floor line. `tools/make-real-app.sh` renders it into the Mac app icon (checked in the packaged app). Old icon is in git history.
- The phone page (claude.ai artifact) takes its tab icon from the artifact settings, not from this file, so it is unchanged.

## Search (Oct 13, 2026)
- In game: `src/js/0112d-GameSearch.js` (GameSearch). Magnifier button in the top bar, `/` (outside a text box) or Ctrl/Cmd+K. Search every school and every player (all teams, your roster, recruits, portal, walk-ons). Enter opens the top result. A school opens the team view, another team's player opens the player card, your player opens your window, a recruit jumps to Recruiting / Transfer portal / Walk-on pool. Wired in `0070-oc.js`, listed in `manifest.json` after `0112c-FavStar.js`.
- Career page: `0071-XC.js` `W_careerPlayerHits`: typing a player's name also finds his school and shows "Player: name . pos . class . OVR" on the school card (uses REAL_TEAMS).
- The same in-game search was added to College Dynasty (its CLAUDE.md has the note). Tested in a headless browser; Mac apps for both rebuilt, College Dynasty phone site republished.

## Oct 13 (night): sim stat fix, real-only portal, real injuries hook
- **Stat bug:** other teams' players averaged up to 40 ppg and 17 rpg (national leaders). Cause: real ratings span 40 to 97 (the original game's span was narrower), and `W_game` weights shots by `((attr)+50)/130 ^ 5` and rebounds by `^2.6`, so one 95 among 60s took about 40% of his team's shots. New knobs `TUNE.gUse` (2) and `TUNE.gReb` (1.6) in `W_game` only: national leaders now about 26 ppg, 13 rpg, 9 apg. Your own games (`ny`) were already fine (top scorer 15 to 19 ppg across 10 schools); `TUNE.nUse` can override `ny`'s exponent if ever needed.
- **Rosters:** ESPN's 2026-27 preseason rosters (fetched Oct 10, season label "2026-27"), e.g. Duke shows Rippey, Williams, Arnold as freshmen. Coverage is only as current as ESPN's lists.
- **Portal after season 1:** the 80 made-up transfers are no longer generated after the first season in Real mode (`Vf(e, true)` in `wS`); the pool is the 300 high school recruits plus the 170 best real entrants (`W_pt`). Year 1 still has the 31 real unsigned players (all there are: everyone else from 2025-26 is on a 2026-27 roster) plus generated fill.
- **Real injuries:** `tools/fetch-injuries.js` reads ESPN's per-athlete injury lists and writes `src/js/0000g-RealInjuries.js` (`REAL_INJURIES`: name, school, injury, games). `W_applyRealInjuries` (career start, `0021-group-ncFor.js`) injures your players for those games (news item, `p.realInj`); other teams' players sit out (`p.ij` in `W_game`). On Oct 13 ESPN listed NO injuries for any of 5,226 players (preseason), so the file is empty. Re-run it near the season and rebuild. Tested with two fake entries.

## Oct 13 (late): more accurate real player overalls
- **Three seasons, not one** (`valueOf` in `tools/build-real-rosters.js`): a player's value blends 2026 (full weight), 2025 (half) and 2024 (quarter), each season z-scored against its own year and conference strength, shrunk toward his recruiting prior by minutes.
- **Class progression from data**: `DELTA` is the average year-over-year change in value for linked 2025 to 2026 players by class (fitted when 40+ pairs exist), replacing the old +2/+1.5/+1 guess.
- **Per-skill attributes**: row[12] is a 16-character base36 string (10 = no change) of offsets from real stats compared with players at his position (2P%, free-throw rate, 3P% and 3-point rate, FT%, assist and turnover rate, steal, block and rebound rates, minutes). Used by `W_at` (AI players, `p.k`), `W_realPlayer`, `W_realPortalP` and `W_mkp` through `W_kOff`. `add-real-stats.js` keeps it.
- **Team calibration**: after ratings, each school's roster rating is pulled 60% (cap 8 points, `PULL` env) toward the strength its Torvik 2027 preseason rank implies. 279 of 364 teams moved, mean 1.4 points.
- **Back-test** (89 real players, 16 schools, sim season vs real 2025-26 per game): ppg sim 10.5 vs real 10.4 (corr 0.31), rpg 3.95 vs 3.92 (0.59), apg 1.99 vs 2.05 (0.75). Averages match; ppg correlation is the weak spot (shot share is set by overall and role, not real usage).
- Run order after changing ratings: `build-real-rosters.js`, then `add-real-stats.js`, then `build-photos.js`, `apply-real.js`, `build.js`. Existing careers keep their old ratings: start a new career.

## Oct 13 (late night): real usage rate in the sim
- The 17th character of each real player's `k` string is his real Torvik usage rate (5-35). `W_ug(p)` (0023) turns it into a shot-share multiplier `1 + TUNE.ugUse x (usage - 20)` (ugUse 0.03, clamped 0.65-1.5). It feeds the usage tendency in `ny` (your games, via `W_tend`) and the shooter pick in `W_game` (other teams). Your real players keep it in `p.tend.k`.
- Role changes: shooter weights are shares of whoever is on the floor, so missing teammates, more minutes (plans, rotation size, Star player) or shot priority raise a player's share automatically. New `TUNE.ugEff` (efficiency cost of extra share, centered by `ugCtr` 1.2) exists but is OFF (0): any value above 0 also lowered POINTS (top scorer 19.7 ppg at 0, 18.4 at 0.025, 18.2 at 0.04; a #1 shot-priority star 22.6 ppg at 0, 20.8 at 0.012), and the owner wants percentages allowed to dip but points never to fall.
- Back-test (same 89 players): ppg correlation 0.31 -> 0.39 (ugUse 0.03; 0.44 at 0.045 but top scorers reached 28.4 ppg). Leaders 27.8/26.4/26.1 ppg, rebounds 12.4. The full balance and realism tests were not re-run for this change.

- Checked Oct 14 (15 schools, one season each, defaults): team 80.9 ppg, FG 45.0%, 3P 36.0%, FT 76.4% on 21.4, 13.4 TO, 34.8 reb, 14.7 ast, 7.1 stl, 3.4 blk; best scorer 19.7 ppg. Same as with usage off (80.3 ppg, 44.8%): the usage change did not move team numbers. A #1 shot-priority star: 22.6 ppg at 44.7% (best player with no priority: 16.6 at 43.2%).

## Oct 14: roster and class audit (what was wrong, what changed)
- **Finding 1, classes:** ESPN's class labels were last season's for 207 schools (ESPN files labeled "2026-27" still carried 2025-26 classes: a Virginia freshman who is really a sophomore). Before the fix 1,079 of 2,979 players checked against Torvik's 2027 file were one class too low, and 2,381 players kept last year's class. Now the class is Torvik's 2027 label, else last season's class + 1, else ESPN (+1 when the file is stale). Check: 3,071 of 3,079 players equal Torvik's 2027 label (the other 8 are name collisions with different players).
- **Finding 2, graduated players:** about 1,080 players who finished their last season in 2025-26 as seniors (or were on a stale ESPN list) were still on rosters (Virginia's Dallin Hall and Devin Tillis, NC State's Ven-Allen Lubin, Alyn Breed, Scottie Ebube...). They are dropped unless Torvik's 2027 file lists them at that school (204 fifth-year seniors stay, for example Seth Trimble at Louisville).
- **Finding 3, stale ESPN files:** 51 files are labeled 2025-26 and 156 more are 2026-27 in name only. For those schools: last year's non-seniors one class up, Torvik 2027 players, and 247 class-of-2026 commits.
- **Result:** 4,505 players (was 5,115): classes 487 freshmen / 1,385 sophomores / 1,147 juniors / 1,486 seniors. Schools with fewer than 10 real players get generated filler to reach 12.
- **Limit:** unranked freshmen and late transfers are missing for schools whose ESPN file is stale (ESPN has not updated them; Torvik's 2027 file also has no freshmen). Re-run `tools/fetch-rosters.sh` (Mac, ESPN blocks the cloud) when ESPN refreshes. `tools/build-real-rosters.js` prints the stale-school count and players dropped.
- Audit scripts: `/tmp` only (compare generated rows with Torvik 2026 and 2027 labels).

## Oct 14 (later): R badge and ESPN refresh
- **R badge:** a small blue "R" after the name of every real player (names in REAL_TEAMS / REAL_PORTAL), on every screen: rosters, recruiting and portal lists, tables, team views, news. Done in the link layer (`W_isRealName` and the `rl-real` class in `0112b-TeamPlayerViews.js`, style at the end of `ui-polish.css`). It is a name match, so a generated player who happens to share a real player's name would also show an R (rare).
- **ESPN refresh (fetched on the Mac, pushed via branch `espn-refresh`):** 347 of 361 files are now labeled 2026-27 (was 155) and 207 changed. Real players in the game: 4,723 (was 4,505). Classes still match Torvik 2027 (3,070 of 3,078). 14 files are still labeled 2025-26 (Harvard, New Hampshire, Oral Roberts, Alcorn State, ...).
- **Still missing:** ESPN itself lists only 11 to 12 players for many schools (it adds late transfers and unranked freshmen as schools post them), ESPN's other endpoints return the same list, and On3 / 247 / Fox portal trackers block automated access. About 98 schools still have fewer than 12 real players (filled with generated players). Re-fetch ESPN every week or two; `realdata/fetch-rosters.sh` (Mac, delete the old files first) then rebuild.
- **On3 transfers (Oct 14):** `realdata/on3-transfers.json` = 894 committed or enrolled 2026 transfers `[name, pos, ht, old school, new school, hs class, C/E, date]`, read from On3's public wire API (`api.on3.com/public/rdb/v2/transfers/latest?sportKey=2&year=2026&page=N&limit=50`, 48 pages) through the browser pane and the Mac (cloud shell cannot reach On3). `build-real-rosters.js` adds each to his new school if he is not already there (62 were new), drops him from his old school (7), and rates him from his last-season Torvik line. Most (832) were already on rosters through ESPN or Torvik 2027. Schools under 12 real players: 98 -> 89. Page 46 of the wire failed to download (about 1 record).
- **Still missing:** unranked high school freshmen, JUCO and international signees. On3's recruit rankings only list the top 150 and 247 the top 400, so they cannot fill it. To refresh: repeat the On3 pull (the API call above, run from the Mac with an Origin/Referer of https://www.on3.com), then rebuild.
