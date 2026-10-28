// Random school button on the career start screen (October 2026).
// Usage: node tools/build.js && node tests/random-school.js [path-to-html]
// Checks: the button exists, every click selects exactly one school and opens its tier, the search box is cleared,
// repeated clicks give different schools, a random pick can start a career, and a phone-width screen does not scroll sideways.
const fs = require('fs'), path = require('path'), { chromium } = require('playwright-core');
const dist = path.join(__dirname, '../dist');
const FILE = path.resolve(process.argv[2] || path.join(dist, fs.readdirSync(dist).filter((f) => /^College-Dynasty-V.*\.html$/.test(f)).sort().pop()));
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
let failed = 0;
const check = (ok, msg) => { console.log((ok ? 'PASS  ' : 'FAIL  ') + msg); if (!ok) failed++; };

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('file://' + FILE); await page.waitForTimeout(800);
  const btn = page.locator('.random-school-btn');
  check(await btn.count() === 1, 'the Random school button is on the start screen');
  await page.locator('.school-search').fill('zzzz-no-such-school');
  const names = new Set(); let allOk = true;
  for (let i = 0; i < 12; i++) {
    await btn.click(); await page.waitForTimeout(120);
    const sel = await page.locator('.school-card.selected').count();
    const search = await page.locator('.school-search').inputValue();
    const open = await page.locator('.tier-group.open').count();
    const name = await page.locator('.start-summary p').first().innerText();
    if (sel !== 1 || search !== '' || open !== 1) allOk = false;
    names.add(name);
  }
  check(allOk, 'every click selects exactly one school, opens only its tier and clears the search box');
  check(names.size >= 5, `repeated clicks give different schools (${names.size} different in 12 clicks)`);
  const before = await page.locator('.start-summary p').first().innerText();
  await btn.click(); await page.waitForTimeout(120);
  check((await page.locator('.start-summary p').first().innerText()) !== before, 'a click never repeats the school that is already selected');
  await page.getByRole('button', { name: 'Take the job' }).click(); await page.waitForTimeout(2500);
  check(await page.locator('.app-shell').count() === 1, 'a random school starts a career');
  await page.close();

  const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true });
  await phone.goto('file://' + FILE); await phone.waitForTimeout(800);
  check(await phone.locator('.random-school-btn').isVisible(), 'the button shows on a 390 px phone');
  const h = await phone.locator('.random-school-btn').evaluate((e) => e.getBoundingClientRect().height);
  check(h >= 40, `the button is a big tap target (${Math.round(h)} px tall)`);
  const wide = await phone.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(wide <= 1, 'no sideways scrolling on the phone start screen');
  check(errors.length === 0, 'no page errors' + (errors.length ? ': ' + errors[0] : ''));
  await browser.close();
  console.log(failed ? `${failed} CHECK(S) FAILED` : 'All checks passed');
  process.exit(failed ? 1 : 0);
})();
