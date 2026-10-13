// Pro teams (fictional) for players who leave college: drafted players play for the team that picked them, players who turn pro undrafted sign somewhere.
// Nothing is stored: a player's team is worked out from his draft year and pick (or his name and year), so it is the same on every screen and in old saves.
// None of these names shares a word with any school name or mascot in the game (checked by tests/pro-teams.js), so a pro team can never be mistaken for a college.
const PRO_TEAMS = ["Aurora Voyagers", "Beacon Sparks", "Cobalt Rovers", "Dominion Marauders", "Glenmoor Whalers", "Halcyon Flyers", "Ironvale Pilots", "Marigold Prospectors", "Ravenswood Mavericks", "Thornfield Zephyrs", "Vantage Stags", "Zenith Express", "Brightwater Legends", "Calloway Meteors", "Eastgate Comets", "Foxhollow Sentries", "Havenport Nighthawks", "Mapleton Yetis", "Newbridge Gulls", "Pelican Racers", "Underhill Vanguards", "Wexford Outlaws", "Amberley Kodiaks", "Bramwell Thistles", "Corvale Current", "Draymont Mariners", "Eldrow Lanterns", "Farrowgate Drifters", "Kelmar Steamers", "Oriel Puffins"];
const PRO_ABROAD = ["Lisbon Alpen", "Berlin Crescents", "Istanbul Dingoes", "Barcelona Phoenix", "Athens Lions", "Belgrade Stallions", "Tel Aviv Typhoons", "Manila Kites", "Buenos Aires Navigators", "Zagreb Comets", "Seoul Hawks"];
// The order teams pick in a given draft year (a seeded shuffle; round two uses the same order).
const W_proOrderCache = {};
function W_proOrder(year) {
  return (W_proOrderCache[year] ||= PRO_TEAMS.map((t, i) => [TS(`draft-${year}-${i}`), t]).sort((a, b) => a[0] - b[0]).map((z) => z[1]));
}
const W_proForPick = (year, pk) => W_proOrder(year)[(Math.max(1, pk) - 1) % PRO_TEAMS.length];
// Where does a former player play now? a = { n, y (the year he left), fate/why, pk? }. Returns { team, kind: "pro" | "twoway" | "gleague" | "abroad", text } or null for players who did not turn pro.
function W_proTeam(e, a) {
  const fate = a.fate || a.why || "";
  if (/^Drafted/.test(fate)) {
    // a player who left after the season in year Y is picked in the draft that runs at the rollover, dated Y + 1 (that is the year in the draft log)
    const dy = a.y + 1;
    let pk = a.pk;
    if (!pk) {
      const log = (e.draftLog || []).find((d) => d.y === dy), hit = log && (log.picks || []).find((p) => p.n === a.n && (!a.id || p.id === a.id));
      pk = hit && hit.pk;
    }
    const team = pk ? W_proForPick(dy, pk) : PRO_TEAMS[TS(`${a.n}|${dy}|pick`) % PRO_TEAMS.length];
    return { team, kind: "pro", pk, text: `${team} \u00B7 pro` };
  }
  if (/^Turned pro/.test(fate)) {
    const h = TS(`${a.n}|${a.y}|signed`), r = h % 100, team = PRO_TEAMS[(h >>> 7) % PRO_TEAMS.length];
    if (r < 40) return { team, kind: "twoway", text: `${team} \u00B7 pro (two-way contract)` };
    if (r < 75) return { team, kind: "gleague", text: `${team} G League affiliate \u00B7 pro` };
    const club = PRO_ABROAD[(h >>> 11) % PRO_ABROAD.length];
    return { team: club, kind: "abroad", text: `${club} \u00B7 pro, overseas` };
  }
  return null;
}

window.__dbg && Object.assign(window.__dbg, { W_proTeam, W_proForPick, PRO_TEAMS, PRO_ABROAD });
