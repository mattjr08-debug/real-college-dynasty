// One-off: puts every school in the conference it plays in for 2026-27 (Bart Torvik's 2027 conference column) and adds the 7 D1 schools that were missing.
// Reads data/real-schools.final.txt (backs it up to data/real-schools.2025-26-alignment.txt the first time) and rewrites it.
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..'), F = path.join(ROOT, 'data/real-schools.final.txt'), BK = path.join(ROOT, 'data/real-schools.2025-26-alignment.txt');
if (!fs.existsSync(BK)) fs.copyFileSync(F, BK);
const lines = fs.readFileSync(BK, 'utf8').trim().split('\n');
const csv = f => fs.readFileSync(path.join(ROOT, 'realdata', f), 'utf8').trim().split('\n').slice(1).map(l => l.split(','));
const t26 = csv('torvik-team-2026.csv'), t27 = csv('torvik-team-2027.csv');
const rank = {}; t26.forEach(r => (rank[r[1]] = +r[0]));
const c27 = {}; t27.forEach(r => (c27[r[1]] = r[2]));
const NAMES = { B10: 'Big Ten', B12: 'Big 12', ACC: 'ACC', SEC: 'SEC', BE: 'Big East', WCC: 'West Coast', MWC: 'Mountain West', A10: 'Atlantic 10', Amer: 'American', Slnd: 'Southland', MAC: 'Mid-American', MVC: 'Missouri Valley', BSth: 'Big South', CAA: 'Coastal Athletic', Ivy: 'Ivy League', CUSA: 'Conference USA', Sum: 'Summit League', BW: 'Big West', Horz: 'Horizon League', BSky: 'Big Sky', ASun: 'ASUN', SB: 'Sun Belt', Pat: 'Patriot League', Metro: 'MAAC', MEAC: 'MEAC', SC: 'Southern Conference', AE: 'America East', OVC: 'Ohio Valley', SWAC: 'SWAC', NEC: 'Northeast', P12: 'Pac-12', UAC: 'United Athletic' };
// strength band of each conference (hi, lo) for schools that have no roster data
const BAND = {}; { for (const l of lines) if (l[0] === '#') { const [n, hi, lo] = l.slice(2).split('|'); BAND[n] = [+hi, +lo]; } }
BAND['Pac-12'] = [84, 60]; BAND['United Athletic'] = [60, 46]; BAND['MAAC'] = BAND['MAAC'] || [62, 48];
// the Torvik name for each of our schools (same overrides as build-real-rosters.js, plus the few that differ)
const TV = Object.assign(eval('(' + fs.readFileSync(path.join(ROOT, 'tools/build-real-rosters.js'), 'utf8').match(/const TV_OV = (\{[^\n]*\});/)[1] + ')'), { 'Saint Francis (PA)': 'Saint Francis' });
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/\./g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\bsaint\b/g, 'st').replace(/\bstate\b/g, 'st').replace(/\s+/g, ' ').trim();
const byNorm = {}; t26.forEach(r => (byNorm[norm(r[1])] = r[1]));
const ADD = [
  'Detroit Mercy|Titans|Detroit, MI|#BA0C2F||',
  'New Orleans|Privateers|New Orleans, LA|#0033A0||',
  'Lindenwood|Lions|St. Charles, MO|#C99700||',
  'NJIT|Highlanders|Newark, NJ|#D2232A||',
  'New Haven|Chargers|West Haven, CT|#0A2D6E||',
  'Cal State Bakersfield|Roadrunners|Bakersfield, CA|#1F3A93||',
  'UT Rio Grande Valley|Vaqueros|Edinburg, TX|#E8590C||',
];
const all = [];
for (const l of lines) if (l[0] !== '#') all.push(l.replace(/\|+$/, ''));
for (const l of ADD) all.push(l.replace(/\|+$/, ''));
const groups = {};
const unknown = [];
for (const l of all) {
  const name = l.split('|')[0];
  const has = n => t26.some(r => r[1] === n);
  const tv = TV[name] && has(TV[name]) ? TV[name] : has(name) ? name : byNorm[norm(name)];
  let code = tv && (c27[tv] || (tv === 'Saint Francis' ? 'NEC' : null));
  if (!code) { unknown.push(name); continue; }
  const conf = NAMES[code];
  if (!conf) { unknown.push(name + ' (' + code + ')'); continue; }
  (groups[conf] = groups[conf] || []).push({ l, r: rank[tv] || 999 });
}
if (unknown.length) { console.error('Could not place:', unknown); process.exit(1); }
const order = ['ACC', 'Big Ten', 'SEC', 'Big 12', 'Big East', 'Atlantic 10', 'Pac-12', 'Mountain West', 'American', 'West Coast', 'Missouri Valley', 'Conference USA', 'Sun Belt', 'Mid-American', 'Coastal Athletic', 'Horizon League', 'MAAC', 'Northeast', 'Patriot League', 'Ivy League', 'America East', 'Big West', 'ASUN', 'Ohio Valley', 'Southern Conference', 'Southland', 'Summit League', 'Big Sky', 'Big South', 'United Athletic', 'SWAC', 'MEAC'];
for (const c of Object.keys(groups)) if (!order.includes(c)) order.push(c);
const out = [];
for (const c of order) {
  if (!groups[c]) continue;
  const b = BAND[c] || [60, 48];
  out.push('# ' + c + '|' + b[0] + '|' + b[1]);
  groups[c].sort((a, b) => a.r - b.r).forEach(x => out.push(x.l));
}
fs.writeFileSync(F, out.join('\n') + '\n');
console.log(order.filter(c => groups[c]).map(c => c + ' ' + groups[c].length).join(', '), '\nTotal', all.length);
