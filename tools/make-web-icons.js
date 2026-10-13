// Renders the phone home-screen icons (web-extras/icon-180/192/512.png) from desktop/icon.html with headless Chrome.
// Phones round the corners themselves, so the dark background fills the whole square here.
// Usage: node tools/make-web-icons.js   (only needed again if the icon design changes)
const path = require('path'), fs = require('fs'), { chromium } = require('playwright-core');
const ROOT = path.resolve(__dirname, '..'), OUT = path.join(ROOT, 'web-extras');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const svg = fs.readFileSync(path.join(ROOT, 'desktop/icon.html'), 'utf8')
  .replace('<rect x="40" y="40" width="944" height="944" rx="215"', '<rect x="0" y="0" width="1024" height="1024"');
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  for (const size of [180, 192, 512]) {
    const page = await browser.newPage({ viewport: { width: size, height: size } });
    await page.setContent(svg.replace('<svg ', `<svg style="width:${size}px;height:${size}px;display:block" `));
    await page.screenshot({ path: path.join(OUT, `icon-${size}.png`), omitBackground: false });
    await page.close();
    console.log('Wrote', `web-extras/icon-${size}.png`);
  }
  await browser.close();
})();
