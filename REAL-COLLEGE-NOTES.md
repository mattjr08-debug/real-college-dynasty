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
- 230 players are still STILL MISSING in `photo-work/Missing players - found vs still missing.csv` (see HANDOFF for schools to try).
