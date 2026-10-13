# Rules and feature audit — 3.3.0

The component preserves the agreed College Dynasty gameplay and integration features. It is an arcade interpretation of college basketball, not a complete NCAA officiating engine.

## Implemented

- Reach/contact/shooting fouls and modeled offensive charges; personal and team totals. Two/three-shot fouls and made-shot and-ones. Seventh through ninth team fouls award one-and-one, tenth onward two shots; offensive fouls do not award bonus. Team fouls reset at halftime and carry into overtime.
- Free-throw meter uses FT rating; Space/touch shoots, off-ball AI shoots automatically. Game/shot clocks stop, ten-second attempt limit, missed front end ends one-and-one, last misses are reboundable. Awarded shots finish at the buzzer. FT and unscaled personal foul stats are exported.
- Fifth personal foul automatically uses an eligible reserve; disqualified players cannot re-enter or interact. Without reserves the team plays shorthanded.
- Ball-handler boundary crossings cause turnovers; modeled blocked-ball deflections use last touch. Out-of-bounds inbounds move to the nearest court edge.
- Traveling when a shot gather carries the ball past its movement allowance; automatic dribbling does not produce random traveling calls.
- Reachable late touches on a descending shot above the rim award defensive goaltending points or an offensive-interference turnover.

- Five players per team; real supplied starters and eligible reserves, ratings and AI tendencies.
- Two 20-minute halves by default; 15/10/5-minute options; five-minute overtime on a tie.
- Official 40-minute adjusted scores/boxes for short games, with actual played stats retained.
- 30-second possession clock; 20-second offensive reset after a modeled rim miss; a block does not reset the clock. Defensive rebounds get 30 seconds.
- Ten seconds to advance from backcourt; same-team catches/dribbles back over halfcourt after frontcourt control cause a turnover. Position checks approximate feet using the player's floor location and a small halfcourt margin.
- Timeout resets the backcourt count. Passing keeps the count; inbounds, timeouts and pause stop the count.
- Mandatory inbound after baskets and modeled violations; five-second inbound violations count as turnovers. K, 1–5 and teammate clicks inbound.
- Four timeouts per team, at most three into half two, matching College Dynasty defaults; unlimited separate Pause. Timeout adjustments and substitutions, pace at halftime. No extra overtime timeout, matching the current dynasty sim.
- J crossover/steal, Space shooting and double-tap driving dunk, K pass/guard/call-for-ball, player lock, defensive guidance, screens, cuts, isolation, defensive schemes and individual fatigue.
- Final scores/player boxes exported for the host to save through its season bookkeeping. The standalone component does not save a career itself.

## Still simplified or absent

- Full forfeit administration (a no-eligible-player stop is exported as `forfeit`, retaining played statistics), technical/flagrant fouls, replay review, simultaneous-foul administration and detailed block/charge foot-contact physics.
- Double dribble, offensive three seconds and held balls/alternating possession. Traveling is a shot-gather distance check, not a full pivot/foot-step simulation. Goaltending/interference tests modeled descending-shot reach, not backboard/cylinder contact physics.
- Non-out-of-bounds violations and fouls use the nearest edge; exact NCAA designated frontcourt throw-in spots are not implemented. Unforced errant passes and airborne catch/foot contact are not modeled.
- Detailed foot/contact officiating, airball/rim detection and exact corner-three geometry. Modeled misses contact the rim; blocks are distinguished.
- NCAA clock behavior after made baskets, media timeout durations and broadcasts, coach challenges and officiating reviews. Game clock waits for the inbound catch after every made basket as the original playable-game convention.
- NCAA overtime timeout additions; the package follows the current College Dynasty timeout allocation instead.

Rule reference: [NCAA men's basketball playing rules](https://www.ncaa.org/championships/playing-rules/mens-basketball-playing-rules/), including the 2025–26 major-rules comparison for shot-clock resets and backcourt counting.

Bonus/foul-out reference: [NCAA 2025–26 major rules comparison](https://ncaaorg.s3.amazonaws.com/championships/sports/basketball/rules/common/2025-26PRXBB_MajorRulesDifferences.pdf).

### Movement and dead-ball readiness (3.7.1)

Inbound setup no longer moves players at an artificial relocation speed or snaps the inbounder to the line. The five-second count begins after physical arrival; clocks remain stopped beforehand. Free-throw lineups walk into place before their attempt timer starts. Live defenders recover with rating/stamina-based movement, so they can be beaten in transition.

## Shot timing

Perfect timing guarantees a made field goal or free throw; a legal block can still stop a field goal. The visible perfect window gets smaller with lower shooting ratings, fatigue, close contests and deeper range. Dunk timing also considers vertical. Early/late releases retain rating-based probabilities. Normal foul, interference and violation rules still apply. The same mechanics apply to both teams; AI does not receive an automatic perfect release.
