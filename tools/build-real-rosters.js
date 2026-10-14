// Builds src/js/0000c-RealRosters.js: last season's record and the 2026-27 roster for every school, with player ratings.
// Inputs (realdata/): ESPN rosters, Torvik 2026 (last season) team + player files, Torvik 2027 (who plays where now), 247Sports class of 2026.
// Usage: node tools/build-real-rosters.js
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..'), RD = p => path.join(ROOT, 'realdata', p);
const csv = f => fs.readFileSync(f, 'utf8').trim().split('\n').map(l => { const o = []; let c = '', q = false; for (const ch of l) { if (ch === '"') q = !q; else if (ch === ',' && !q) { o.push(c); c = ''; } else c += ch; } o.push(c); return o; });
const strip = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '');
const key = n => strip(n).toLowerCase().replace(/\b(jr|sr|ii|iii|iv|v)\b\.?/g, '').replace(/[^a-z]/g, '');
const inches = h => { const m = String(h || '').match(/(\d+)\D+(\d+)/); return m ? +m[1] * 12 + +m[2] : 0; };
const hash = s => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

// ---- schools and name maps ----
const schools = []; { let conf = null; for (const l of fs.readFileSync(path.join(ROOT, 'data/real-schools.final.txt'), 'utf8').trim().split('\n')) { if (l[0] === '#') { conf = l.slice(2).split('|'); continue; } const f = l.split('|'); schools.push({ name: f[0], conf: conf[0], hi: +conf[1], lo: +conf[2] }); } }
const espnTeams = fs.readFileSync(RD('espn-team-ids.tsv'), 'utf8').trim().split('\n').map(l => { const [id, dn, loc] = l.split('\t'); return { id, dn, loc }; });
const nrm = s => strip(s).toLowerCase().replace(/&/g, ' and ').replace(/\(([^)]*)\)/g, ' $1 ').replace(/\./g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\bsaint\b/g, 'st').replace(/\bstate\b/g, 'st').replace(/\buniversity\b/g, '').replace(/\s+/g, ' ').trim();
const ESPN_OV = { 'New Orleans': '2443', 'Cal State Bakersfield': '2934', 'UT Rio Grande Valley': '292', 'NJIT': '2885', 'Detroit Mercy': '2174', 'New Haven': '2441', 'UMass': '113', 'San Jose State': '23', 'FIU': '2229', 'Appalachian State': '2026', 'LIU': '112358', 'Penn': '219', 'Albany': '399', 'Southeast Missouri': '2546', 'Southeastern Louisiana': '2545', 'USC Upstate': '2908', 'Tarleton': '2627' };
const TV_OV = { 'UConn': 'Connecticut', 'Miami': 'Miami FL', 'Miami (OH)': 'Miami OH', 'NC State': 'N.C. State', 'UMass': 'Massachusetts', 'Ole Miss': 'Mississippi', 'Texas A&M-Corpus Christi': 'Texas A&M Corpus Chris', 'UL Monroe': 'Louisiana Monroe', "Hawai'i": 'Hawaii', 'Cal State Fullerton': 'Cal St. Fullerton', 'Cal State Northridge': 'Cal St. Northridge', 'Penn': 'Pennsylvania', 'Seattle U': 'Seattle', 'Saint Francis (PA)': 'Saint Francis', 'Arkansas-Pine Bluff': 'Arkansas Pine Bluff', 'Charleston': 'College of Charleston', 'Omaha': 'Nebraska Omaha', 'IU Indianapolis': 'IU Indy', 'Appalachian State': 'Appalachian St.', 'Mississippi Valley State': 'Mississippi Valley St.', 'McNeese': 'McNeese St.', 'Tennessee State': 'Tennessee St.', 'UIC': 'Illinois Chicago', 'Sam Houston': 'Sam Houston St.', 'Loyola Maryland': 'Loyola MD', 'UT Martin': 'Tennessee Martin', 'Southeast Missouri': 'Southeast Missouri St.', 'Nicholls': 'Nicholls St.', 'California Baptist': 'Cal Baptist', 'Tarleton': 'Tarleton St.', 'Kansas City': 'UMKC', 'Grambling': 'Grambling St.' };
const teamRows = csv(RD('torvik-team-2026.csv')).slice(1);
const tvNames = new Set(teamRows.map(r => r[1])), tvByNorm = {}; tvNames.forEach(t => tvByNorm[nrm(t)] = t);
const espnByLoc = {}; espnTeams.forEach(t => (espnByLoc[nrm(t.loc)] = espnByLoc[nrm(t.loc)] || []).push(t));
for (const s of schools) {
  s.espn = ESPN_OV[s.name] || ((espnByLoc[nrm(s.name)] || [])[0] || {}).id || null;
  s.tv = TV_OV[s.name] && tvNames.has(TV_OV[s.name]) ? TV_OV[s.name] : (tvNames.has(s.name) ? s.name : tvByNorm[nrm(s.name)]) || null;
}
const noTv = schools.filter(s => !s.tv).map(s => s.name), noEspn = schools.filter(s => !s.espn).map(s => s.name);
// ---- Torvik ----
const TT = {}; for (const r of teamRows) TT[r[1]] = { conf: r[2], rec: r[3], adjoe: +r[4], adjde: +r[6], barthag: +r[8], conrec: r[14], rank: +r[0] };
const confEM = {}; { const acc = {}; for (const t of Object.values(TT)) { (acc[t.conf] = acc[t.conf] || []).push(t.adjoe - t.adjde); } for (const c in acc) confEM[c] = acc[c].reduce((a, b) => a + b, 0) / acc[c].length; }
const allEM = Object.values(TT).map(t => t.adjoe - t.adjde), lgEM = allEM.reduce((a, b) => a + b, 0) / allEM.length;
const P = r => ({ name: r[0], team: r[1], conf: r[2], gp: +r[3], min: +r[4], yr: r[25], ht: inches(r[26]), por: +r[28], bpm: +r[50], dpor: +r[48], ppg: +r[63], rpg: +r[59], apg: +r[60], role: r[64], rec: +r[34] || 0, pid: r[32] });
const p26 = csv(RD('torvik-players-2026.csv')).map(P), p27 = csv(RD('torvik-players-2027.csv')).map(P);
const byPid26 = new Map(p26.map(p => [p.pid, p])), by26 = {}; p26.forEach(p => (by26[key(p.name)] = by26[key(p.name)] || []).push(p));
// value of a player last season (z-scores on rotation players, bpm shifted for conference strength)
const rot = p26.filter(p => p.min >= 30 && p.gp >= 8);
const mean = a => a.reduce((x, y) => x + y, 0) / a.length, sd = (a, m) => Math.sqrt(mean(a.map(x => (x - m) ** 2)));
const adjB = p => p.bpm + 0.25 * ((confEM[p.conf] ?? lgEM) - lgEM);
const mP = mean(rot.map(p => p.por)), sP = sd(rot.map(p => p.por), mP), mB = mean(rot.map(adjB)), sB = sd(rot.map(adjB), mB);
const zVal = p => 0.62 * (p.por - mP) / sP + 0.38 * (adjB(p) - mB) / sB;
const prior = p => p.rec ? clamp((p.rec - 62) / 22, -1.2, 2.4) : -0.75; // last season's recruiting rating, if he had one
const shrunk = p => { const w = p.min / (p.min + 18); return w * zVal(p) + (1 - w) * prior(p); };
const refV = rot.map(shrunk).sort((a, b) => a - b);
const pctOf = v => { let lo = 0, hi = refV.length; while (lo < hi) { const m = (lo + hi) >> 1; if (refV[m] < v) lo = m + 1; else hi = m; } return lo / refV.length; };
// ---- earlier seasons (2025, 2024), class progression fitted from the data, and per-skill offsets ----
const yearObj = (pf, tf) => {
  const tt = {}; csv(RD(tf)).slice(1).forEach(r => tt[r[1]] = { conf: r[2], em: +r[4] - +r[6] });
  const acc = {}; Object.values(tt).forEach(t => (acc[t.conf] = acc[t.conf] || []).push(t.em));
  const ce = {}; for (const c in acc) ce[c] = mean(acc[c]); const all = Object.values(tt).map(t => t.em), lg = mean(all);
  const pl = csv(RD(pf)).map(P), rt = pl.filter(p => p.min >= 30 && p.gp >= 8);
  const aB = p => p.bpm + 0.25 * ((ce[p.conf] ?? lg) - lg);
  const m1 = mean(rt.map(p => p.por)), s1 = sd(rt.map(p => p.por), m1), m2 = mean(rt.map(aB)), s2 = sd(rt.map(aB), m2);
  return { by: new Map(pl.map(p => [p.pid, p])), z: p => 0.62 * (p.por - m1) / s1 + 0.38 * (aB(p) - m2) / s2 };
};
const Y25 = yearObj('torvik-players-2025.csv', 'torvik-team-2025.csv'), Y24 = yearObj('torvik-players-2024.csv', 'torvik-team-2024.csv');
// class progression in z units: average change in value from last season to this one for players with real minutes both years
const DELTA = { 1: 0.35, 2: 0.2, 3: 0.1, 4: 0 };
{ const acc = { 1: [], 2: [], 3: [] }; for (const p of p26) { const q = Y25.by.get(p.pid); if (!q || p.min < 30 || q.min < 30 || p.gp < 8 || q.gp < 8) continue; const c = yrNumEarly(q.yr); if (acc[c]) acc[c].push(zVal(p) - Y25.z(q)); }
  for (const c in acc) if (acc[c].length > 40) DELTA[c] = mean(acc[c]); }
function yrNumEarly(s) { s = String(s || '').toLowerCase(); return /^fr/.test(s) ? 1 : /^so/.test(s) ? 2 : /^jr/.test(s) ? 3 : /^sr/.test(s) ? 4 : 0; }
// value of a player from up to three seasons (older seasons count less and get the class progression added)
const valueOf = st => {
  const parts = [[st.min, zVal(st), 1]]; const q = Y25.by.get(st.pid), r = q && Y24.by.get(st.pid);
  let c = yrNumEarly(st.yr);
  if (q && q.min >= 5) { parts.push([q.min * 0.5, Y25.z(q) + (DELTA[yrNumEarly(q.yr)] || 0), 0.5]); }
  if (r && r.min >= 5 && q) { parts.push([r.min * 0.25, Y24.z(r) + (DELTA[yrNumEarly(r.yr)] || 0) + (DELTA[yrNumEarly(q.yr)] || 0), 0.25]); }
  const W = parts.reduce((a, x) => a + x[0], 0), z = parts.reduce((a, x) => a + x[0] * x[1], 0) / W, w = W / (W + 18);
  return w * z + (1 - w) * prior(st);
};
// skill offsets: how this player's real numbers compare with players at his position (16 attributes, base36 digits, 10 = no change)
const POSG = {}; for (const p of rot) (POSG[posFromRoleEarly(p.role)] = POSG[posFromRoleEarly(p.role)] || []).push(p);
function posFromRoleEarly(r) { return { 'Pure PG': 'PG', 'Scoring PG': 'PG', 'Combo G': 'SG', 'Wing G': 'SG', 'Wing F': 'SF', 'Stretch 4': 'PF', 'PF/C': 'PF', 'C': 'C', 'Center': 'C' }[r] || 'SF'; }
const RAW26 = new Map(csv(RD('torvik-players-2026.csv')).map(r => [r[32], r]));
const met = r => { const g = i => +r[i] || 0, twoa = g(17), thra = g(20), fta = g(14), min = g(4); return {
  two: [g(18), twoa / (twoa + 60)], ftr: [g(24), 0.5], three: [g(21), thra / (thra + 80)], thrr: [thra / Math.max(1, twoa + thra), 0.6], ft: [g(15), fta / (fta + 50)],
  to: [-g(12), 0.7], ast: [g(11), 0.8], stl: [g(23), 0.8], blk: [g(22), 0.8], orb: [g(9), 0.8], drb: [g(10), 0.8], min: [g(4), 1] }; };
const SKILLSTAT = {}; for (const pg in POSG) { const m = POSG[pg].map(p => met(RAW26.get(p.pid))), o = {}; for (const k in m[0]) { const v = m.map(x => x[k][0]), mu = mean(v); o[k] = [mu, sd(v, mu) || 1]; } SKILLSTAT[pg] = o; }
const skillK = (st, pos) => {
  const r = RAW26.get(st.pid); if (!r || st.min < 8) return '';
  const m = met(r), S = SKILLSTAT[pos] || SKILLSTAT.SF, z = k => clamp(((m[k][0] - S[k][0]) / S[k][1]) * m[k][1], -2.5, 2.5), tw = st.min / (st.min + 25);
  const v = [0.6 * z('two') + 0.4 * z('ftr'), 0.7 * z('two'), 0.7 * z('three') + 0.3 * z('thrr'), z('ft'), 0.5 * z('to') + 0.5 * z('ast'), z('ast'), 0.7 * z('stl') + 0.3 * z('blk'), 0.6 * z('blk') + 0.4 * z('drb'), z('stl'), z('blk'), z('orb'), z('drb'), 0, 0, 0.4 * z('blk'), 0.5 * z('min')];
  const meas = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15], off = v.map(x => x * 5 * tw), mu = mean(meas.map(i => off[i]));
  return off.map((x, i) => (meas.includes(i) ? clamp(Math.round(x - mu), -9, 9) : 0) + 10).map(x => x.toString(36)).join('') + clamp(Math.round(+r[6] || 20), 5, 35).toString(36); // 17th char: his real usage rate
};
const refV2 = rot.map(valueOf).sort((a, b) => a - b);
const pctOf2 = v => { let lo = 0, hi = refV2.length; while (lo < hi) { const m = (lo + hi) >> 1; if (refV2[m] < v) lo = m + 1; else hi = m; } return lo / refV2.length; };
const ovrOf = st => qOvr(pctOf2(valueOf(st) + (DELTA[yrNumEarly(st.yr)] || 0)));
// the base game's own scale for its top 9 players per team (measured from 3 generated leagues)
const QS = [44,49,51,52,53,53,54,55,55,56,56,57,57,57,58,58,59,59,59,60,60,60,60,61,61,61,62,62,62,62,63,63,63,63,64,64,64,65,65,65,65,66,66,66,67,67,67,68,68,68,69,69,69,70,70,70,71,71,71,72,72,72,73,73,74,74,74,75,75,76,76,77,77,78,78,78,79,79,80,81,81,82,82,83,84,84,85,86,86,87,88,89,90,91,92,93,93,94,96,97,97];
const qOvr = pc => { const x = clamp(pc, 0, 1) * 100, i = Math.floor(x), f = x - i; return QS[i] + (QS[Math.min(100, i + 1)] - QS[i]) * f; };
// ---- 247 class of 2026 ----
const rk = JSON.parse(fs.readFileSync(RD('r247-2026.json'), 'utf8')), rkBy = {}; rk.forEach(r => (rkBy[key(r.name)] = rkBy[key(r.name)] || []).push(r));
const fr247 = rank => rank <= 5 ? 95 - (rank - 1) * 1 : rank <= 15 ? 90 - (rank - 6) * 0.45 : rank <= 30 ? 85.5 - (rank - 16) * 0.33 : rank <= 60 ? 80.5 - (rank - 31) * 0.15 : rank <= 100 ? 76 - (rank - 61) * 0.13 : rank <= 150 ? 70.5 - (rank - 101) * 0.07 : rank <= 250 ? 66.5 - (rank - 151) * 0.04 : 62.5 - (rank - 251) * 0.02;
// ---- position ----
const posFromRole = r => ({ 'Pure PG': 'PG', 'Scoring PG': 'PG', 'Combo G': 'SG', 'Wing G': 'SG', 'Wing F': 'SF', 'Stretch 4': 'PF', 'PF/C': 'PF', 'C': 'C', 'Center': 'C' }[r]);
const posFromEspn = (a, ht) => { const x = String(a || '').toUpperCase(); if (['PG', 'SG', 'SF', 'PF', 'C'].includes(x)) return x; if (x === 'G') return ht && ht <= 75 ? 'PG' : 'SG'; if (x === 'GF' || x === 'G/F') return 'SF'; if (x === 'F') return ht && ht >= 80 ? 'PF' : 'SF'; if (x === 'FC' || x === 'F/C') return 'PF'; return ht >= 81 ? 'C' : ht >= 78 ? 'PF' : ht >= 76 ? 'SF' : ht >= 74 ? 'SG' : 'PG'; };
const yrNum = s => { s = String(s || '').toLowerCase(); return /^fr|^freshman|^rs fr|redshirt fr/.test(s) ? 1 : /^so|sophomore/.test(s) ? 2 : /^jr|junior/.test(s) ? 3 : /^sr|senior|grad/.test(s) ? 4 : 0; };
// ---- 2027 rows by team and name (where each returning player plays NOW) ----
const t27 = {}, name27 = {}; for (const p of p27) { (t27[p.team] = t27[p.team] || []).push(p); (name27[key(p.name)] = name27[key(p.name)] || []).push(p); }


// ---- On3 transfer commitments (realdata/on3-transfers.json: [name, pos, ht, old school, new school, hs class, C/E, date]) ----
const ON3 = fs.existsSync(RD('on3-transfers.json')) ? JSON.parse(fs.readFileSync(RD('on3-transfers.json'), 'utf8')) : [];
const nk3 = x => String(x || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\bst\.?(?=\s|$)/g, 'state').replace(/&/g, 'and').replace(/[^a-z0-9]/g, '');
const ON3ALIAS = { 'loyolachi': 'loyolachicago', 'loyolamd': 'loyolamaryland', 'miamifl': 'miami', 'miamioh': 'miamioh', 'unc': 'northcarolina', 'ole miss': 'mississippi', 'olemiss': 'mississippi', 'ucf': 'centralflorida', 'uconn': 'connecticut', 'lsu': 'lsu', 'vcu': 'vcu', 'byu': 'byu', 'usc': 'usc', 'smu': 'smu', 'unlv': 'unlv', 'utep': 'utep', 'utsa': 'utsa', 'uab': 'uab' };
const schoolBy3 = new Map(); for (const sc of schools) { for (const nm of [sc.name, sc.tv]) if (nm) schoolBy3.set(nk3(nm), sc.name); }
const ON3MAP = { 'George Washington University': 'George Washington', "Saint Mary's College of California": "Saint Mary's", 'Grand Canyon University': 'Grand Canyon', 'Gonzaga University': 'Gonzaga', 'University of California-San Diego': 'UC San Diego', 'College of Charleston': 'Charleston', 'Queens University of Charlotte': 'Queens', 'The University of Texas at Arlington': 'UT Arlington', 'Long Island University': 'LIU', 'Middle Tennessee State': 'Middle Tennessee', 'Arkansas-Little Rock': 'Little Rock', 'The University of Texas Rio Grande Valley': 'UT Rio Grande Valley', 'Stonehill College': 'Stonehill', 'California State University-Bakersfield': 'Cal State Bakersfield', 'University of California-Santa Barbara': 'UC Santa Barbara', 'Purdue University Fort Wayne': 'Purdue Fort Wayne', 'Denver University': 'Denver', 'Pennsylvania': 'Penn', 'St. Bonaventure University': 'St. Bonaventure', 'University of Massachusetts-Lowell': 'UMass Lowell', 'California State University-Northridge': 'Cal State Northridge', 'USF': 'South Florida', 'University of Maryland-Baltimore County': 'UMBC', 'Belmont University': 'Belmont', 'Bryant University': 'Bryant', 'University of California-Irvine': 'UC Irvine', 'University of California-Riverside': 'UC Riverside', 'California Baptist University': 'California Baptist', 'Cleveland State University': 'Cleveland State', 'Fairfield University': 'Fairfield', 'Manhattan College': 'Manhattan', 'Santa Clara University': 'Santa Clara', 'Seattle University': 'Seattle U', 'University of North Carolina Wilmington': 'UNC Wilmington', 'University of San Francisco': 'San Francisco', 'University of Southern Indiana': 'Southern Indiana', 'Southeast Missouri State': 'Southeast Missouri', 'Wisconsin-Milwaukee': 'Milwaukee', 'Illinois-Chicago': 'UIC', 'Missouri-Kansas City': 'Kansas City', 'Massachusetts': 'UMass', 'Connecticut': 'UConn', 'Loyola (Chi)': 'Loyola Chicago', 'Hawaii': "Hawai'i", 'New Jersey Institute of Technology': 'NJIT', 'McNeese State': 'McNeese', 'Nicholls State': 'Nicholls', 'Tarleton State': 'Tarleton' };
const on3School = nm => { if (ON3MAP[nm] && schoolBy3.has(nk3(ON3MAP[nm]))) return schoolBy3.get(nk3(ON3MAP[nm])); const k = nk3(nm); return schoolBy3.get(k) || schoolBy3.get(ON3ALIAS[k] || '') || null; };
const on3Moved = {}, on3In = {}, on3Unmatched = {};
for (const r of ON3) { const nw = on3School(r[4]), old = on3School(r[3]); if (!nw) { on3Unmatched[r[4]] = (on3Unmatched[r[4]] || 0) + 1; continue; } const k = key(r[0]); (on3Moved[k] = on3Moved[k] || []).push({ old, nw, r }); (on3In[nw] = on3In[nw] || []).push(r); }
const seenKeys = new Set(Object.keys(name27)); const staleSchools = [];
const out = {}, report = { gone: 0, sample: null, statMatched: 0, fr247: 0, noData: 0, players: 0, shortRosters: [] };
for (const s of schools) {
  const cand = new Map();
  // ESPN roster (authoritative list of who is here now)
  let espnAth = [];
  if (s.espn && fs.existsSync(RD(`espn-rosters/${s.espn}.json`))) { try { espnAth = JSON.parse(fs.readFileSync(RD(`espn-rosters/${s.espn}.json`), 'utf8')).athletes || []; } catch (e) {} }
  let espnStale = false; if (s.espn && fs.existsSync(RD(`espn-rosters/${s.espn}.json`))) { try { const sd = JSON.parse(fs.readFileSync(RD(`espn-rosters/${s.espn}.json`), 'utf8')).season; espnStale = !(sd && sd.displayName === '2026-27'); } catch (e) {} }
  // ESPN sometimes labels last season's roster as 2026-27: if most of its freshmen already played here last season, the classes were never advanced
  if (!espnStale && espnAth.length) { const fr = espnAth.filter(x => yrNum(x.experience && (x.experience.displayValue || x.experience.abbreviation)) === 1); const had = fr.filter(x => (by26[key(x.fullName || x.displayName)] || []).some(p => p.team === s.tv && yrNum(p.yr) === 1)); if (fr.length >= 3 && had.length / fr.length > 0.34) { espnStale = true; report.laggedLabel = (report.laggedLabel || 0) + 1; } }
  if (espnStale) staleSchools.push(s.name); // ESPN still shows last season's roster: keep its non-seniors (one class up), Torvik 2027 and 247 commits
  for (const a of espnAth) {
    const ht = a.height ? Math.round(a.height) : inches(a.displayHeight);
    const k = key(a.fullName || a.displayName);
    // a player the Torvik 2027 file puts at ANOTHER school (a transfer the ESPN page still lists here) is not on this roster
    const elsewhere = (name27[k] || []).find(p => p.team !== s.tv && Math.abs(p.ht - ht) <= 2);
    const here = (name27[k] || []).find(p => p.team === s.tv);
    if (elsewhere && !here) continue;
    // he played here last season but Torvik's 2027 file does not list him here: graduated, drafted or transferred out
    // (only seniors: Torvik's 2027 file leaves out low-minute players who are still on the team)
    if (!here && (by26[k] || []).some(p => p.team === s.tv && yrNum(p.yr) === 4 && (!ht || Math.abs(p.ht - ht) <= 2))) { report.gone++; continue; }
    if (espnStale && !here && yrNum(a.experience && (a.experience.displayValue || a.experience.abbreviation)) === 4) { report.gone++; continue; }
    if ((on3Moved[k] || []).some(m => m.old === s.name && m.nw !== s.name) && !(on3Moved[k] || []).some(m => m.nw === s.name)) { report.xferOut = (report.xferOut || 0) + 1; continue; }
    cand.set(k, { name: a.fullName || a.displayName, ht, espnPos: a.position && a.position.abbreviation, y: yrNum(a.experience && (a.experience.displayValue || a.experience.abbreviation)), wt: a.weight, stale: espnStale });
  }
  for (const p of (t27[s.tv] || [])) { const k = key(p.name); if ((on3Moved[k] || []).some(m => m.old === s.name && m.nw !== s.name)) { report.xferOut = (report.xferOut || 0) + 1; continue; } const c = cand.get(k) || { name: p.name, ht: p.ht }; c.tv27 = p; c.ht = c.ht || p.ht; c.y = yrNum(p.yr) || c.y; c.y27 = 1; cand.set(k, c); }
  // transfers who committed here (On3)
  for (const r of (on3In[s.name] || [])) { const k = key(r[0]); if (cand.has(k)) { cand.get(k).on3 = 1; continue; } report.xferIn = (report.xferIn || 0) + 1; cand.set(k, { name: r[0], ht: inches(r[2]), y: Math.min(4, Math.max(1, 2026 - (r[5] || 2023))), espnPos: r[1] === 'CG' ? 'G' : r[1], on3: 1, on3old: r[3], lastResort: 1 }); }
  // incoming 2026 freshmen who signed here (the only way a stale-ESPN school gets them)
  if (espnStale) for (const r of rk) if (r.commit === s.name) { const k = key(r.name); if (!cand.has(k)) cand.set(k, { name: r.name, ht: inches(r.ht), y: 1, espnPos: r.pos }); }
  cand.forEach((_, k) => seenKeys.add(k));
  const R = [];
  for (const [k, c] of cand) {
    // last season's line: by Torvik id if he is in the 2027 file, else by name (unique, similar height)
    let st = c.tv27 ? byPid26.get(c.tv27.pid) : null;
    if (!st) { const m = (by26[k] || []).filter(p => !c.ht || Math.abs(p.ht - c.ht) <= 2); if (m.length === 1) st = m[0]; }
    // class for 2026-27: Torvik's 2027 label, else last season's class + 1 (ESPN's label is often last season's), else ESPN
    const y = c.y27 && c.y ? c.y : st && yrNum(st.yr) ? Math.min(4, yrNum(st.yr) + 1) : c.y ? (c.stale ? Math.min(4, c.y + 1) : c.y) : 1;
    const ht = c.ht || (st && st.ht) || 77;
    const pos = (st && posFromRole(st.role)) || posFromEspn(c.espnPos, ht);
    let o, src;
    if (st && st.min >= 3 && st.gp >= 3) { o = ovrOf(st); src = 's'; report.statMatched++; }
    else if (y === 1 && (rkBy[k] || []).length) { const r = rkBy[k].sort((a, b) => (b.commit === s.name) - (a.commit === s.name))[0]; o = fr247(r.rank); src = 'r'; report.fr247++; }
    else { const m = (s.hi + s.lo) / 2; o = clamp(46 + (m - 48) * 0.33 + (y > 1 ? 4 : 0) + ((hash(k) % 7) - 3), 42, 66); src = 'n'; report.noData++; }
    o = Math.round(clamp(o, 40, 97));
    const grow = { 1: 11, 2: 8, 3: 3, 4: 0 }[y] * (1 - Math.max(0, (o - 72) / 40));
    const t = Math.round(clamp(o + grow + ((hash(k + 't') % 5) - 2) * (y < 4 ? 1 : 0), o, 98));
    R.push({ n: c.name, p: pos, y, h: ht, o, t, src, k: st ? skillK(st, pos) : '', ls: st ? { g: st.gp, m: Math.round(st.min), pt: +st.ppg.toFixed(1), rb: +st.rpg.toFixed(1), as: +st.apg.toFixed(1), tm: st.team } : null });
  }
  R.sort((a, b) => b.o - a.o);
  const keep = R.slice(0, 15);
  report.players += keep.length; if (keep.length < 10) report.shortRosters.push(`${s.name}:${keep.length}`);
  const tt = TT[s.tv] || {}, rec = String(tt.rec || '').match(/(\d+)-(\d+)/);
  out[s.name] = { w: rec ? +rec[1] : null, l: rec ? +rec[2] : null, cw: null, tr: tt.rank || null, r: keep };
  if (tt.conrec) { const m = tt.conrec.match(/(\d+)-(\d+)/); if (m) { out[s.name].cw = +m[1]; out[s.name].cl = +m[2]; } }
}
// ---- team calibration: roster strength follows the Torvik 2027 preseason order (partial pull, capped) ----
{
  const rt = r => { const a = r.slice().sort((x, y) => y.o - x.o).slice(0, 8), w = [0.2, 0.17, 0.15, 0.13, 0.1, 0.09, 0.08, 0.08]; return a.reduce((q, p, i) => q + p.o * w[i], 0) / w.slice(0, a.length).reduce((x, y) => x + y, 0); };
  const b27 = {}; csv(RD('torvik-team-2027.csv')).slice(1).forEach(r => b27[r[1]] = +r[8]);
  const names = schools.filter(x => x.tv && b27[x.tv] != null && out[x.name]).sort((a, b) => b27[b.tv] - b27[a.tv]);
  const raw = names.map(x => rt(out[x.name].r)), dist = raw.slice().sort((a, b) => b - a);
  const PULL = +(process.env.PULL || 0.6), CAP = 8; let moved = 0, sum = 0;
  names.forEach((x, i) => {
    const d = Math.round(clamp((dist[i] - raw[i]) * PULL, -CAP, CAP)); sum += Math.abs(d); if (!d) return; moved++;
    for (const p of out[x.name].r) { const o2 = Math.round(clamp(p.o + d, 40, 97)); p.t = Math.round(clamp(p.t + (o2 - p.o), o2, 98)); p.o = o2; }
  });
  console.log(`calibrated ${moved} of ${names.length} teams, mean |shift| ${(sum / names.length).toFixed(2)}`);
}
const lines = [`// REAL COLLEGE DYNASTY: last season's record and the 2026-27 roster of every school (generated by tools/build-real-rosters.js).`,
  `// Player: [name, pos, class 1-4, height in, ovr, potential, ppg, rpg, apg, last team, source (s stats, r recruit rank, n no data)].`,
  `var REAL_TEAMS = {`];
for (const nm in out) { const t = out[nm]; lines.push(` ${JSON.stringify(nm)}: { w: ${t.w}, l: ${t.l}, cw: ${t.cw}, cl: ${t.cl ?? null}, tr: ${t.tr}, r: [` + t.r.map(p => JSON.stringify([p.n, p.p, p.y, p.h, p.o, p.t, p.ls ? p.ls.pt : null, p.ls ? p.ls.rb : null, p.ls ? p.ls.as : null, p.ls ? p.ls.tm : null, p.src, null, p.k || null])).join(',') + '] },'); }
lines.push('};');
fs.writeFileSync(path.join(ROOT, 'src/js/0000c-RealRosters.js'), lines.join('\n') + '\n');
// ---- REAL_PORTAL: real 2025-26 players who are on no 2026-27 roster (unsigned portal entrants), with their real stats ----
{
  // anyone with a photo file in a 2026-27 school folder is on that roster, so not an unsigned portal player
  for (const d of fs.readdirSync(RD('photos-src'))) { try { for (const f of fs.readdirSync(RD('photos-src/' + d))) seenKeys.add(key(f.replace(/\.[a-z]+$/i, ''))); } catch (e) {} }
  const pool = p26.filter(p => !seenKeys.has(key(p.name)) && /^(Fr|So|Jr)/.test(p.yr) && p.gp >= 5 && p.min >= 10);
  const rows = pool.map(p => {
    const y = Math.min(4, yrNum(p.yr) + 1);
    let o = Math.round(clamp(ovrOf(p), 40, 97));
    const grow = { 2: 8, 3: 3, 4: 0 }[y] * (1 - Math.max(0, (o - 72) / 40));
    const t = Math.round(clamp(o + grow, o, 98));
    return { p, y, o, t, k: skillK(p, posFromRole(p.role) || 'SF') };
  }).filter(r => r.o < 86).sort((a, b) => b.o - a.o);
  const full = csv(RD('torvik-players-2026.csv'));
  const raw = new Map(full.map(r => [r[32], r]));
  const arr = rows.slice(0, 160).map(({ p, y, o, t, k }) => {
    const r = raw.get(p.pid), gp = +r[3], n = x => Math.round(+x || 0), fga = +r[17] + +r[20], fta = +r[14], to = +r[12];
    const tov = to >= 100 ? 0 : to / (100 - to) * (fga + 0.44 * fta);
    return [p.name, posFromRole(p.role) || 'SF', y, p.ht, o, t, +p.ppg.toFixed(1), +p.rpg.toFixed(1), +p.apg.toFixed(1), p.team, 's',
      [gp, +(+r[4] * 0.4).toFixed(1), n(+r[61] * gp), n(+r[62] * gp), n(tov), n(+r[16] + +r[19]), n(fga), n(r[19]), n(r[20]), n(r[13]), n(fta)], k];
  });
  fs.writeFileSync(path.join(ROOT, 'src/js/0000f-RealPortal.js'), '// REAL COLLEGE DYNASTY: real players from last season who are on no 2026-27 roster (the starting transfer portal). Same row layout as REAL_TEAMS.\nvar REAL_PORTAL = ' + JSON.stringify(arr) + ';\n');
  console.log('REAL_PORTAL', arr.length, 'of pool', rows.length); console.log(arr.slice(0, 25).map(a => `${a[0]} ${a[1]} y${a[2]} o${a[4]} ${a[6]}/${a[7]}/${a[8]} @${a[9]}`).join('\n'));
}
// ---- report ----
const rating = r => { const a = r.slice().sort((x, y) => y.o - x.o).slice(0, 8), w = [0.2, 0.17, 0.15, 0.13, 0.1, 0.09, 0.08, 0.08]; return Math.round(a.reduce((q, p, i) => q + p.o * w[i], 0) / w.slice(0, a.length).reduce((x, y) => x + y, 0)); };
const tr = Object.entries(out).map(([n, t]) => [n, rating(t.r), t.tr, t.w + '-' + t.l]).sort((a, b) => b[1] - a[1]);
console.log('On3 transfers added', report.xferIn || 0, 'removed from old school', report.xferOut || 0, 'unmatched new schools', JSON.stringify(on3Unmatched));
console.log('stale ESPN schools', staleSchools.length, 'players dropped as gone', report.gone);
console.log('schools', schools.length, 'noTorvik', noTv, 'noESPN', noEspn);
console.log(`players kept ${report.players}; with stats ${report.statMatched}; freshmen via 247 ${report.fr247}; no data ${report.noData}; short rosters (<10): ${report.shortRosters.join(', ')}`);
console.log('TOP 30 by roster rating (name, rating, Torvik rank last yr, record):\n' + tr.slice(0, 30).map(x => x.join(' | ')).join('\n'));
console.log('...bottom 8:\n' + tr.slice(-8).map(x => x.join(' | ')).join('\n'));
const xs = tr.filter(x => x[2]).map(x => x[1]), ys = tr.filter(x => x[2]).map(x => -x[2]); const mx = mean(xs), my = mean(ys); console.log('corr(rating, last-year Torvik rank) =', (xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0) / Math.sqrt(xs.reduce((a, x) => a + (x - mx) ** 2, 0) * ys.reduce((a, y) => a + (y - my) ** 2, 0))).toFixed(3));
for (const nm of (process.env.SHOW || 'Duke').split(',')) console.log('\n'+nm+' ('+out[nm].w+'-'+out[nm].l+'):\n' + out[nm].r.map(p => `${p.n} ${p.p} y${p.y} ${Math.floor(p.h/12)}-${p.h%12} o${p.o}/${p.t} [${p.src}] ${p.ls ? p.ls.pt + 'ppg ' + p.ls.rb + 'rpg ' + p.ls.as + 'apg @' + p.ls.tm : ''}`).join('\n'));
console.log('x'.slice(1)+'Duke roster:\n' + out['Duke'].r.map(p => `${p.n} ${p.p} y${p.y} ${p.h}in o${p.o}/${p.t} [${p.src}] ${p.ls ? p.ls.pt + 'ppg' : ''}`).join('\n'));
