// Audit: click school and player names on every page and tab (in season, season review, offseason) and check the right card opens with sane data.
const path = require('path'), os = require('os'); const ROOT = path.join(os.homedir(), 'Documents', 'College-Dynasty'), KEY = 'college-dynasty-offline-v6';
const { chromium } = require(path.join(ROOT, 'node_modules/playwright-core'));
const issues = [], seen = { players: 0, teams: 0, pages: 0 };
const bad = (where, what) => { issues.push(`${where}: ${what}`); };
(async () => {
  const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  for (const phase of ['season', 'review', 'offseason']) {
    const ctx = await b.newContext({ viewport: { width: 1408, height: 774 } }), p = await ctx.newPage(), errors = []; p.on('pageerror', e => errors.push(e.message)); p.on('dialog', d => d.accept());
    await p.goto('file://' + path.join(ROOT, 'dist/College-Dynasty-V13.html')); await p.waitForTimeout(400);
    await p.evaluate(({ KEY, phase }) => { const d = __dbg, e = d.sy('lone', 'Coach T', 'Development', 31), a = x => d.fy(e, x); a({ type: 'autoRecruit' }); a({ type: 'startSeason', finish: false, auto: true });
      if (phase === 'season') a({ type: 'sim', count: 14, auto: true }); else { let g = 0; while (e.phase !== 'Season review' && g++ < 300) a({ type: 'sim', count: 'season', auto: true }); if (phase === 'offseason') { (e.xfers || []).filter(x => x.status === 'pending').forEach(x => a({ type: 'xferDecision', ids: [x.id], stay: false })); (e.draft || []).filter(x => x.status === 'pending').forEach(x => a({ type: 'draftDecision', ids: [x.id], stay: false })); a({ type: 'nextYear' }); } }
      localStorage.setItem(KEY, JSON.stringify({ game: e, revision: 1, savedAt: new Date().toISOString() })); localStorage.setItem('college-dynasty-settings', JSON.stringify({ tut: 'done' })); }, { KEY, phase });
    await p.reload(); await p.waitForSelector('.app-shell'); await p.waitForTimeout(700);
    const game = () => p.evaluate(KEY => JSON.parse(localStorage.getItem(KEY)).game, KEY);
    const closeAll = async () => { for (let i = 0; i < 4 && (await p.locator('.modal').count()); i++) { const x = p.locator('.modal').last().locator('.icon-btn').first(); if (await x.count()) await x.click().catch(() => {}); else await p.keyboard.press('Escape'); await p.waitForTimeout(250); } };
    const audit = async (where) => {
      seen.pages++; await p.waitForTimeout(500);
      const els = await p.evaluate(() => { const pick = (sel) => [...document.querySelectorAll(sel)].map((e, i) => ({ i, text: e.textContent.trim(), row: ((e.closest('tr') || e.closest('li') || e.parentElement.parentElement || e.parentElement).innerText || '').replace(/\s+/g, ' ').slice(0, 140) })); return { players: pick('main .lk-player'), teams: pick('main .lk-team') }; });
      const sample = (arr, n) => arr.length <= n ? arr : Array.from({ length: n }, (_, k) => arr[Math.floor(k * (arr.length - 1) / (n - 1))]);
      for (const t of sample(els.teams, 2)) {
        seen.teams++; await p.locator('main .lk-team').nth(t.i).click({ timeout: 8000 }).catch(e => bad(where, `team "${t.text}" could not be clicked: ${e.message.split('\n')[0]}`)); await p.waitForTimeout(500);
        const n = await p.locator('.modal').count(); if (!n) { bad(where, `clicking team "${t.text}" opened nothing`); continue; }
        const txt = await p.locator('.modal').last().textContent(); const rows = await p.locator('.modal').last().locator('tbody tr').count();
        if (!txt.toLowerCase().includes(t.text.toLowerCase())) bad(where, `team "${t.text}" opened a different team: ${txt.slice(0, 60)}`); if (rows < 8) bad(where, `team "${t.text}" shows only ${rows} players`); if (/undefined|NaN|\[object/.test(txt)) bad(where, `team "${t.text}" view has bad text: ${(txt.match(/.{20}(undefined|NaN|\[object).{20}/) || [''])[0]}`);
        await closeAll(); if (await p.locator('.modal').count()) bad(where, 'a modal would not close');
      }
      for (const pl of sample(els.players, 3)) {
        seen.players++; const before = await p.locator('.modal').count(); await p.locator('main .lk-player').nth(pl.i).click({ timeout: 8000 }).catch(e => bad(where, `player "${pl.text}" could not be clicked: ${e.message.split('\n')[0]}`)); await p.waitForTimeout(500);
        const n = await p.locator('.modal').count(); if (n <= before) { bad(where, `clicking player "${pl.text}" opened nothing (row: ${pl.row})`); continue; }
        const txt = await p.locator('.modal').last().textContent();
        if (!txt.toLowerCase().includes(pl.text.toLowerCase())) bad(where, `player "${pl.text}" opened someone else: ${txt.slice(0, 50)}`);
        if (/undefined|NaN|\[object/.test(txt)) bad(where, `card for "${pl.text}" has bad text: ${(txt.match(/.{25}(undefined|NaN|\[object).{15}/) || [''])[0]}`);
        // the school in the same row must be the school on the card
        const g = await game(), school = g.opponents.map(o => o.name).filter(nm => pl.row.includes(nm)).sort((a, b) => b.length - a.length)[0];
        if (school && !txt.includes(school) && !txt.includes(g.school.name)) bad(where, `player "${pl.text}" in a row for ${school} opened a card for another school: ${(txt.match(/PF|SF|PG|SG|C(?= ·)/) || [''])[0]} ${txt.slice(0, 120).replace(/\s+/g, ' ')}`);
        await closeAll(); if (await p.locator('.modal').count()) bad(where, 'a modal would not close');
      }
    };
    const pages = ['Program HQ', 'My roster', 'Recruiting', 'Coaching', 'Schedule', 'Season center', 'NIL budget', 'League news', 'Career history'];
    for (const pg of pages) {
      await closeAll(); await p.getByText(pg, { exact: true }).first().click().catch(() => {}); await p.waitForTimeout(700); await audit(`${phase} > ${pg}`);
      const tabs = await p.locator('main .chips button, main .profile-tabs button, main .toolbar button').allTextContents(); const uniq = [...new Set(tabs.map(t => t.trim()).filter(t => t && t.length < 28 && !/^(View schedule|Begin season|Export|Import|Auto|Advance|Sim|Play|Save|Next|Add|Open|Reset)/i.test(t)))].slice(0, 9);
      for (const tab of uniq) { await closeAll(); await p.locator('main').getByRole('button', { name: tab, exact: true }).first().click({ timeout: 4000 }).catch(() => {}); await p.waitForTimeout(500); await audit(`${phase} > ${pg} > ${tab}`); }
    }
    if (errors.length) bad(phase, 'JavaScript errors: ' + errors.slice(0, 2).join(' | '));
    await ctx.close();
  }
  await b.close();
  console.log(`audited ${seen.pages} screens, clicked ${seen.teams} school names and ${seen.players} player names`);
  console.log(issues.length ? `${issues.length} ISSUES:\n` + [...new Set(issues)].slice(0, 40).join('\n') : 'no issues');
})().catch(e => { console.error('FAILED:', e.message.split('\n')[0]); process.exit(1); });
