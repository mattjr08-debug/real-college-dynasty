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

const seenKeys = new Set(Object.keys(name27));
const out = {}, report = { sample: null, statMatched: 0, fr247: 0, noData: 0, players: 0, shortRosters: [] };
for (const s of schools) {
  const cand = new Map();
  // ESPN roster (authoritative list of who is here now)
  let espnAth = [];
  if (s.espn && fs.existsSync(RD(`espn-rosters/${s.espn}.json`))) { try { espnAth = JSON.parse(fs.readFileSync(RD(`espn-rosters/${s.espn}.json`), 'utf8')).athletes || []; } catch (e) {} }
  for (const a of espnAth) {
    const ht = a.height ? Math.round(a.height) : inches(a.displayHeight);
    const k = key(a.fullName || a.displayName);
    // a player the Torvik 2027 file puts at ANOTHER school (a transfer the ESPN page still lists here) is not on this roster
    const elsewhere = (name27[k] || []).find(p => p.team !== s.tv && Math.abs(p.ht - ht) <= 2);
    const here = (name27[k] || []).find(p => p.team === s.tv);
    if (elsewhere && !here) continue;
    cand.set(k, { name: a.fullName || a.displayName, ht, espnPos: a.position && a.position.abbreviation, y: yrNum(a.experience && (a.experience.displayValue || a.experience.abbreviation)), wt: a.weight });
  }
  for (const p of (t27[s.tv] || [])) { const k = key(p.name); const c = cand.get(k) || { name: p.name, ht: p.ht }; c.tv27 = p; c.ht = c.ht || p.ht; c.y = c.y || yrNum(p.yr); cand.set(k, c); }
  cand.forEach((_, k) => seenKeys.add(k));
  const R = [];
  for (const [k, c] of cand) {
    // last season's line: by Torvik id if he is in the 2027 file, else by name (unique, similar height)
    let st = c.tv27 ? byPid26.get(c.tv27.pid) : null;
    if (!st) { const m = (by26[k] || []).filter(p => !c.ht || Math.abs(p.ht - c.ht) <= 2); if (m.length === 1 && (!c.y || c.y > 1)) st = m[0]; }
    const y = c.y || (st ? Math.min(4, yrNum(st.yr) + 1) : 1);
    const ht = c.ht || (st && st.ht) || 77;
    const pos = (st && posFromRole(st.role)) || posFromEspn(c.espnPos, ht);
    let o, src;
    if (st && st.min >= 3 && st.gp >= 3) { o = qOvr(pctOf(shrunk(st))); src = 's'; report.statMatched++; }
    else if (y === 1 && (rkBy[k] || []).length) { const r = rkBy[k].sort((a, b) => (b.commit === s.name) - (a.commit === s.name))[0]; o = fr247(r.rank); src = 'r'; report.fr247++; }
    else { const m = (s.hi + s.lo) / 2; o = clamp(46 + (m - 48) * 0.33 + (y > 1 ? 4 : 0) + ((hash(k) % 7) - 3), 42, 66); src = 'n'; report.noData++; }
    if (y > 1 && src === 's') o += y === 2 ? 2 : y === 3 ? 1.5 : 1;       // a year older than the stats
    o = Math.round(clamp(o, 40, 97));
    const grow = { 1: 11, 2: 8, 3: 3, 4: 0 }[y] * (1 - Math.max(0, (o - 72) / 40));
    const t = Math.round(clamp(o + grow + ((hash(k + 't') % 5) - 2) * (y < 4 ? 1 : 0), o, 98));
    R.push({ n: c.name, p: pos, y, h: ht, o, t, src, ls: st ? { g: st.gp, m: Math.round(st.min), pt: +st.ppg.toFixed(1), rb: +st.rpg.toFixed(1), as: +st.apg.toFixed(1), tm: st.team } : null });
  }
  R.sort((a, b) => b.o - a.o);
  const keep = R.slice(0, 15);
  report.players += keep.length; if (keep.length < 10) report.shortRosters.push(`${s.name}:${keep.length}`);
  const tt = TT[s.tv] || {}, rec = String(tt.rec || '').match(/(\d+)-(\d+)/);
  out[s.name] = { w: rec ? +rec[1] : null, l: rec ? +rec[2] : null, cw: null, tr: tt.rank || null, r: keep };
  if (tt.conrec) { const m = tt.conrec.match(/(\d+)-(\d+)/); if (m) { out[s.name].cw = +m[1]; out[s.name].cl = +m[2]; } }
}
const lines = [`// REAL COLLEGE DYNASTY: last season's record and the 2026-27 roster of every school (generated by tools/build-real-rosters.js).`,
  `// Player: [name, pos, class 1-4, height in, ovr, potential, ppg, rpg, apg, last team, source (s stats, r recruit rank, n no data)].`,
  `var REAL_TEAMS = {`];
for (const nm in out) { const t = out[nm]; lines.push(` ${JSON.stringify(nm)}: { w: ${t.w}, l: ${t.l}, cw: ${t.cw}, cl: ${t.cl ?? null}, tr: ${t.tr}, r: [` + t.r.map(p => JSON.stringify([p.n, p.p, p.y, p.h, p.o, p.t, p.ls ? p.ls.pt : null, p.ls ? p.ls.rb : null, p.ls ? p.ls.as : null, p.ls ? p.ls.tm : null, p.src])).join(',') + '] },'); }
lines.push('};');
fs.writeFileSync(path.join(ROOT, 'src/js/0000c-RealRosters.js'), lines.join('\n') + '\n');
// ---- REAL_PORTAL: real 2025-26 players who are on no 2026-27 roster (unsigned portal entrants), with their real stats ----
{
  // anyone with a photo file in a 2026-27 school folder is on that roster, so not an unsigned portal player
  for (const d of fs.readdirSync(RD('photos-src'))) { try { for (const f of fs.readdirSync(RD('photos-src/' + d))) seenKeys.add(key(f.replace(/\.[a-z]+$/i, ''))); } catch (e) {} }
  const pool = p26.filter(p => !seenKeys.has(key(p.name)) && /^(Fr|So|Jr)/.test(p.yr) && p.gp >= 5 && p.min >= 10);
  const rows = pool.map(p => {
    const y = Math.min(4, yrNum(p.yr) + 1);
    let o = qOvr(pctOf(shrunk(p))); o += y === 2 ? 2 : y === 3 ? 1.5 : 1; o = Math.round(clamp(o, 40, 97));
    const grow = { 2: 8, 3: 3, 4: 0 }[y] * (1 - Math.max(0, (o - 72) / 40));
    const t = Math.round(clamp(o + grow, o, 98));
    return { p, y, o, t };
  }).filter(r => r.o < 86).sort((a, b) => b.o - a.o);
  const full = csv(RD('torvik-players-2026.csv'));
  const raw = new Map(full.map(r => [r[32], r]));
  const arr = rows.slice(0, 160).map(({ p, y, o, t }) => {
    const r = raw.get(p.pid), gp = +r[3], n = x => Math.round(+x || 0), fga = +r[17] + +r[20], fta = +r[14], to = +r[12];
    const tov = to >= 100 ? 0 : to / (100 - to) * (fga + 0.44 * fta);
    return [p.name, posFromRole(p.role) || 'SF', y, p.ht, o, t, +p.ppg.toFixed(1), +p.rpg.toFixed(1), +p.apg.toFixed(1), p.team, 's',
      [gp, +(+r[4] * 0.4).toFixed(1), n(+r[61] * gp), n(+r[62] * gp), n(tov), n(+r[16] + +r[19]), n(fga), n(r[19]), n(r[20]), n(r[13]), n(fta)]];
  });
  fs.writeFileSync(path.join(ROOT, 'src/js/0000f-RealPortal.js'), '// REAL COLLEGE DYNASTY: real players from last season who are on no 2026-27 roster (the starting transfer portal). Same row layout as REAL_TEAMS.\nvar REAL_PORTAL = ' + JSON.stringify(arr) + ';\n');
  console.log('REAL_PORTAL', arr.length, 'of pool', rows.length); console.log(arr.slice(0, 25).map(a => `${a[0]} ${a[1]} y${a[2]} o${a[4]} ${a[6]}/${a[7]}/${a[8]} @${a[9]}`).join('\n'));
}
// ---- report ----
const rating = r => { const a = r.slice().sort((x, y) => y.o - x.o).slice(0, 8), w = [0.2, 0.17, 0.15, 0.13, 0.1, 0.09, 0.08, 0.08]; return Math.round(a.reduce((q, p, i) => q + p.o * w[i], 0) / w.slice(0, a.length).reduce((x, y) => x + y, 0)); };
const tr = Object.entries(out).map(([n, t]) => [n, rating(t.r), t.tr, t.w + '-' + t.l]).sort((a, b) => b[1] - a[1]);
console.log('schools', schools.length, 'noTorvik', noTv, 'noESPN', noEspn);
console.log(`players kept ${report.players}; with stats ${report.statMatched}; freshmen via 247 ${report.fr247}; no data ${report.noData}; short rosters (<10): ${report.shortRosters.join(', ')}`);
console.log('TOP 30 by roster rating (name, rating, Torvik rank last yr, record):\n' + tr.slice(0, 30).map(x => x.join(' | ')).join('\n'));
console.log('...bottom 8:\n' + tr.slice(-8).map(x => x.join(' | ')).join('\n'));
const xs = tr.filter(x => x[2]).map(x => x[1]), ys = tr.filter(x => x[2]).map(x => -x[2]); const mx = mean(xs), my = mean(ys); console.log('corr(rating, last-year Torvik rank) =', (xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0) / Math.sqrt(xs.reduce((a, x) => a + (x - mx) ** 2, 0) * ys.reduce((a, y) => a + (y - my) ** 2, 0))).toFixed(3));
for (const nm of (process.env.SHOW || 'Duke').split(',')) console.log('\n'+nm+' ('+out[nm].w+'-'+out[nm].l+'):\n' + out[nm].r.map(p => `${p.n} ${p.p} y${p.y} ${Math.floor(p.h/12)}-${p.h%12} o${p.o}/${p.t} [${p.src}] ${p.ls ? p.ls.pt + 'ppg ' + p.ls.rb + 'rpg ' + p.ls.as + 'apg @' + p.ls.tm : ''}`).join('\n'));
console.log('x'.slice(1)+'Duke roster:\n' + out['Duke'].r.map(p => `${p.n} ${p.p} y${p.y} ${p.h}in o${p.o}/${p.t} [${p.src}] ${p.ls ? p.ls.pt + 'ppg' : ''}`).join('\n'));
