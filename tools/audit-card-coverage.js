// Coverage audit: school and player names on every page and tab that are NOT clickable (and names inside sentences that do not open when clicked).
const path = require('path'), os = require('os'); const ROOT = path.join(os.homedir(), 'Documents', 'College-Dynasty'), KEY = 'college-dynasty-offline-v6';
const { chromium } = require(path.join(ROOT, 'node_modules/playwright-core'));
const missed = new Map(), sentenceFail = [], stats = { screens: 0, plainNames: 0, linked: 0, sentences: 0 };
(async () => {
  const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  for (const phase of ['season', 'offseason']) {
    const ctx = await b.newContext({ viewport: { width: 1408, height: 774 } }), p = await ctx.newPage(); p.on('dialog', d => d.accept());
    await p.goto('file://' + path.join(ROOT, 'dist/College-Dynasty-V13.html')); await p.waitForTimeout(400);
    await p.evaluate(({ KEY, phase }) => { const d = __dbg, e = d.sy('lone', 'Coach T', 'Development', 31), a = x => d.fy(e, x); a({ type: 'autoRecruit' }); a({ type: 'startSeason', finish: false, auto: true });
      if (phase === 'season') a({ type: 'sim', count: 14, auto: true }); else { let g = 0; while (e.phase !== 'Season review' && g++ < 300) a({ type: 'sim', count: 'season', auto: true }); (e.xfers || []).filter(x => x.status === 'pending').forEach(x => a({ type: 'xferDecision', ids: [x.id], stay: false })); (e.draft || []).filter(x => x.status === 'pending').forEach(x => a({ type: 'draftDecision', ids: [x.id], stay: false })); a({ type: 'nextYear' }); }
      localStorage.setItem(KEY, JSON.stringify({ game: e, revision: 1, savedAt: new Date().toISOString() })); localStorage.setItem('college-dynasty-settings', JSON.stringify({ tut: 'done' })); }, { KEY, phase });
    await p.reload(); await p.waitForSelector('.app-shell'); await p.waitForTimeout(700);
    const closeAll = async () => { for (let i = 0; i < 4 && (await p.locator('.modal').count()); i++) { const x = p.locator('.modal').last().locator('.icon-btn').first(); if (await x.count()) await x.click().catch(() => {}); else await p.keyboard.press('Escape'); await p.waitForTimeout(250); } };
    const names = await p.evaluate(KEY => { const e = JSON.parse(localStorage.getItem(KEY)).game, pl = new Set(), tm = new Set(); for (const o of e.opponents) { if (o.id !== e.school.id) tm.add(o.name); for (const q of e.rosters[o.id] || []) pl.add(q.n); } for (const q of e.roster) pl.add(q.name); return { players: [...pl], teams: [...tm], own: e.school.name }; }, KEY);
    const audit = async (where) => {
      stats.screens++;
      const r = await p.evaluate(({ players, teams }) => { const P = new Set(players), T = new Set(teams), out = [], clickableAncestor = (el) => { for (let a = el.parentElement, n = 0; a && n < 7; a = a.parentElement, n++) { if (/^(BUTTON|A)$/.test(a.tagName) || a.getAttribute('role') === 'button') return a.tagName.toLowerCase(); if (getComputedStyle(a).cursor === 'pointer' && !a.classList.contains('lk-team') && !a.classList.contains('lk-player')) return 'pointer'; if (a.tagName === 'MAIN') break; } return ''; };
        let linked = 0; for (const el of document.querySelectorAll('main *')) { if (el.childElementCount) continue; const t = el.textContent.replace(/\s+/g, ' ').trim(); if (!t || t.length < 4 || t.length > 40) continue; const isP = P.has(t), isT = T.has(t); if (!isP && !isT) continue; if (el.classList.contains('lk-team') || el.classList.contains('lk-player')) { linked++; continue; } out.push({ kind: isT ? 'school' : 'player', text: t, tag: el.tagName.toLowerCase(), cls: String(el.className).slice(0, 30), inside: clickableAncestor(el), ctx: (el.closest('tr, li, .card, .team-card, section') || el.parentElement).className.toString().slice(0, 30) }); }
        // names inside sentences: where to click
        const spots = []; for (const sec of document.querySelectorAll('main')) { const w = document.createTreeWalker(sec, NodeFilter.SHOW_TEXT); let node; while ((node = w.nextNode())) { const txt = node.textContent; if (txt.trim().length < 25) continue; for (const n of [...T, ...P]) { if (n.length < 7) continue; const at = txt.indexOf(n); if (at < 0) continue; const range = document.createRange(); range.setStart(node, at); range.setEnd(node, at + n.length); const rc = range.getClientRects()[0]; if (rc && rc.width > 4 && rc.top > 60 && rc.bottom < innerHeight - 10) { spots.push({ n, x: rc.left + rc.width / 2, y: rc.top + rc.height / 2, school: T.has(n) }); break; } } if (spots.length >= 4) break; } }
        return { out, linked, spots }; }, names);
      stats.linked += r.linked; stats.plainNames += r.out.length;
      for (const m of r.out) { const key = `${m.kind} | ${m.tag}.${m.cls} | in:${m.inside || 'none'} | ${where.split(' > ').slice(1).join(' > ')}`; const cur = missed.get(key) || { n: 0, ex: m.text }; cur.n++; missed.set(key, cur); }
      for (const sp of r.spots.slice(0, 2)) { stats.sentences++; const before = await p.locator('.modal').count(); await p.mouse.click(sp.x, sp.y); await p.waitForTimeout(450); const after = await p.locator('.modal').count(); if (after <= before) sentenceFail.push(`${where}: clicking "${sp.n}" inside a sentence opened nothing`); else { const txt = await p.locator('.modal').last().textContent(); if (!txt.toLowerCase().includes(sp.n.toLowerCase())) sentenceFail.push(`${where}: "${sp.n}" in a sentence opened ${txt.slice(0, 40)}`); } await closeAll(); }
    };
    for (const pg of ['Program HQ', 'My roster', 'Recruiting', 'Coaching', 'Schedule', 'Season center', 'NIL budget', 'League news', 'Career history']) {
      await closeAll(); await p.getByText(pg, { exact: true }).first().click().catch(() => {}); await p.waitForTimeout(700); await audit(`${phase} > ${pg}`);
      const tabs = await p.locator('main .chips button, main .profile-tabs button, main .toolbar button').allTextContents(); const uniq = [...new Set(tabs.map(t => t.trim()).filter(t => t && t.length < 28 && !/^(View schedule|Begin season|Export|Import|Auto|Advance|Sim|Play|Save|Next|Add|Open|Reset)/i.test(t)))].slice(0, 9);
      for (const tab of uniq) { await closeAll(); await p.locator('main').getByRole('button', { name: tab, exact: true }).first().click({ timeout: 4000 }).catch(() => {}); await p.waitForTimeout(500); await audit(`${phase} > ${pg} > ${tab}`); }
    }
    await ctx.close();
  }
  await b.close();
  console.log(`screens ${stats.screens}; linked names ${stats.linked}; names that are NOT links ${stats.plainNames}; sentence clicks tried ${stats.sentences}`);
  console.log('--- names that are not links (grouped by element, place and what they sit inside):'); [...missed.entries()].sort((a, b) => b[1].n - a[1].n).slice(0, 30).forEach(([k, v]) => console.log(`${String(v.n).padStart(4)}  ${k}   e.g. "${v.ex}"`));
  console.log('--- sentence clicks that failed:'); console.log(sentenceFail.length ? [...new Set(sentenceFail)].slice(0, 20).join('\n') : 'none');
})().catch(e => { console.error('FAILED:', e.message.split('\n')[0]); process.exit(1); });
