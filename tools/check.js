#!/usr/bin/env node
// Smart check: builds the game ONCE, works out which tests matter for what changed, and runs the independent ones side by side.
//   node tools/check.js                 what changed since the last commit (uncommitted files)  -> the matching tests
//   node tools/check.js --since <rev>   also everything committed since <rev>
//   node tools/check.js --all           every quick-enough test (not the long-career, full screen or phone tests)
//   node tools/check.js --list          only print the plan
//   node tools/check.js --jobs 3        how many tests at the same time (default: half the CPU cores, 2 to 4)
const { execSync, spawn } = require('child_process'), os = require('os'), path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..'), argv = process.argv.slice(2), has = f => argv.includes(f), val = f => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };
const sh = c => { try { return execSync(c, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).replace(/\s+$/, ''); } catch (e) { return ''; } };   // right-trim only: the first status line starts with a space (' M file')

// 1) what changed
let files = new Set(sh('git status --porcelain --untracked-files=all').split('\n').filter(Boolean).filter(l => !/^.?D|^D/.test(l.slice(0, 2))).map(l => l.slice(3).replace(/^"|"$/g, '').split(' -> ').pop()).filter(f => fs.existsSync(path.join(ROOT, f))));   // a deleted file is not a changed file
const since = val('--since'); if (since) sh(`git diff --name-only ${since}..HEAD`).split('\n').filter(Boolean).forEach(f => files.add(f));
files = [...files].filter(f => !/^(claude-log|tools\/prompts)\//.test(f));
const ALL = has('--all');
const m = re => files.some(f => re.test(f));
const srcNum = f => { const x = /^src\/js\/(\d{4})/.exec(f); return x ? Number(x[1]) : null; };
const logic = files.some(f => { const n = srcNum(f); return n !== null && n < 60; });                       // engine, world, offseason, reducer (files 0000 to 0059)
const schema = m(/^src\/js\/0060-/);                                                                          // the Zod save schema lives in 0060
const ui = ALL || m(/^src\/(css\/|index\.template\.html)/) || files.some(f => { const n = srcNum(f); return n !== null && n >= 61; }) || m(/^src\/assets\//);
// Screen files that belong to ONE page: a change there only needs that page checked at every width. Anything else (styles, the template, shared components, unknown files) runs every page.
const PAGE_OF = [[/^src\/js\/(0067-(About|Backups|Diag)Panel|0068-SettingsPage)\.js$/, ['Settings']], [/^src\/js\/(0102-RevenuePanel|0103-MarketPanel|0103b-StaffPanel)\.js$/, ['NIL budget']],
  [/^src\/js\/(0106-HistoryLeaders|0107-AlumniPanel|0108-TeamHistory)\.js$/, ['Career history']], [/^src\/js\/(0079b-ConfRankPanel|0079c-PortalTracker|0079d-ClassRankPanel|0079e-AdvStatsPanel|0080-NewsPage)\.js$/, ['League news']],
  [/^src\/js\/0079-Top25Panel\.js$/, ['League news', 'Season center']], [/^src\/js\/(0096b-RecruitTable|0062b-Transfer)\.js$/, ['Recruiting']]];
let targetPages = null;
if (ui && !ALL) { const uiFiles = files.filter(f => /^src\//.test(f) || /^tools\/build/.test(f)); const pages = new Set(); let full = false;
  for (const f of uiFiles) { const hit = PAGE_OF.find(([re]) => re.test(f)); if (hit) hit[1].forEach(x => pages.add(x)); else if (/^src\/js\/(\d{4})/.test(f) && srcNum(f) < 61) continue; else full = true; }
  if (!full && pages.size) targetPages = [...pages]; }
const emg = m(/^edit-my-game\/(plan|estimate)\.js$/), emgApp = m(/^edit-my-game\/(main|renderer|preload)\.js$/);

// 2) the plan
const T = [];                                           // { name, cmd, env }
const add = (name, cmd, env = {}) => { if (!T.some(t => t.name === name)) T.push({ name, cmd, env }); };
add('main smoke test', 'node tests/smoke.js');
if (ui) { add(targetPages ? `screen fit (strict overflow, only: ${targetPages.join(', ')})` : 'screen fit (strict overflow)', 'node tests/overflow.js', targetPages ? { OVERFLOW_PAGES: targetPages.join(',') } : {}); add('quick screen test', 'node tests/ui.js', { UI_MODE: 'quick' }); }
if (logic || ALL) { add('realism table', 'node tests/realism.js'); add('quick balance check', 'node tests/balance.js', { TRIALS: '2', SEASONS: '3' }); }
if (logic || schema || ALL) { add('old saves still load', 'node tests/save-compat.js'); add('save round trip', 'node tests/save-roundtrip.js'); }
if (logic || m(/^src\/js\/0107-|^tests\/favorites/) || ALL) add('favorites', 'node tests/favorites.js');
if (logic || m(/^src\/js\/0037|^src\/js\/0048|^tests\/ui-offseason/) || ALL) add('offseason click-through', 'node tests/ui-offseason.js');
if (emg || ALL) { add('plan logic', 'node tests/plan.js'); add('time estimates', 'node tests/estimate.js'); }
if (emgApp || has('--app')) add('Edit My Game app', 'node tests/edit-app.js');
const KNOWN = { overflow: ['screen fit (strict overflow)', 'node tests/overflow.js'], ui: ['quick screen test', 'node tests/ui.js', { UI_MODE: 'quick' }], realism: ['realism table', 'node tests/realism.js'], balance: ['quick balance check', 'node tests/balance.js', { TRIALS: '2', SEASONS: '3' }],
  plan: ['plan logic', 'node tests/plan.js'], estimate: ['time estimates', 'node tests/estimate.js'], favorites: ['favorites', 'node tests/favorites.js'], 'edit-app': ['Edit My Game app', 'node tests/edit-app.js'], 'save-compat': ['old saves still load', 'node tests/save-compat.js'],
  'save-roundtrip': ['save round trip', 'node tests/save-roundtrip.js'], 'ui-offseason': ['offseason click-through', 'node tests/ui-offseason.js'] };
files.filter(f => /^tests\/[a-z0-9-]+\.js$/.test(f)).forEach(f => { const base = path.basename(f, '.js'); if (KNOWN[base]) add(...KNOWN[base]); else if (!['smoke', 'longcareer', 'mobile'].includes(base)) add(`${base} (its own test changed)`, `node tests/${base}.js`); });

console.log(`Changed: ${files.length} file(s)${ALL ? ' (running everything quick)' : ''}. Kinds: ${[logic && 'game logic', schema && 'save schema', ui && 'screens', (emg || emgApp) && 'Edit My Game'].filter(Boolean).join(', ') || 'notes or tests only'}.`);
console.log('Plan: ' + T.map(t => t.name).join(' | ')); if (has('--list')) process.exit(0);

// 3) run: one build, then the tests side by side
const t0 = Date.now(); try { execSync('node tools/build.js', { cwd: ROOT, stdio: 'ignore' }); } catch (e) { console.log('BUILD FAILED'); process.exit(1); }
const LOAD = require('./load.js').pick(), JOBS = Number(val('--jobs')) || LOAD.tests; let next = 0; const results = [];
console.log(`Mac is ${LOAD.level} (load ${LOAD.load} on ${LOAD.cores} cores): ${JOBS} test(s) at a time, ${LOAD.browsers} browser window(s) each in the screen-fit test.`);
const runOne = t => new Promise(res => { const s = Date.now(); let out = ''; const c = spawn('/bin/sh', ['-c', t.cmd], { cwd: ROOT, env: { OVERFLOW_JOBS: String(LOAD.browsers), ...process.env, ...t.env } });
  c.stdout.on('data', d => out += d); c.stderr.on('data', d => out += d);
  c.on('close', code => { const r = { name: t.name, ok: code === 0, secs: Math.round((Date.now() - s) / 1000), tail: out.trim().split('\n').slice(-3).join(' | ').slice(0, 200), fails: out.split('\n').filter(l => /^FAIL|FAIL /.test(l)).slice(0, 4) }; results.push(r); console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}  (${r.secs}s)`); res(); }); });
(async () => { await Promise.all(Array.from({ length: JOBS }, async () => { while (next < T.length) await runOne(T[next++]); }));
  const bad = results.filter(r => !r.ok); console.log(`\n${bad.length ? bad.length + ' CHECK(S) FAILED' : 'All checks passed'}: ${results.length} test(s), ${Math.round((Date.now() - t0) / 1000)} seconds in total, ${JOBS} at a time.`);
  bad.forEach(r => { console.log(`  ${r.name}: ${r.tail}`); r.fails.forEach(f => console.log('     ' + f)); }); process.exit(bad.length ? 1 : 0); })();
