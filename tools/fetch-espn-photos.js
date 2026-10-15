// Run on a machine that can reach ESPN (the Mac). For every roster row with no photo file, downloads the ESPN headshot
// (a.espncdn.com/.../players/full/<ESPN ID>.png), resizes it to 128 px wide with sips (macOS) and fills in the "Photo file" column.
// Usage: node tools/fetch-espn-photos.js   Then: node tools/build-photos.js && node tools/apply-real.js && node tools/build.js
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.resolve(__dirname, '..'), CSV = path.join(ROOT, 'realdata/photos-src/Roster list 2026-27.csv'), PH = path.join(ROOT, 'realdata/photos-128');
const raw = fs.readFileSync(CSV, 'utf8'); const bom = raw.startsWith('﻿') ? '﻿' : '';
const lines = raw.replace(/^﻿/, '').replace(/\r/g, '').trim().split('\n');
const parse = l => (l.match(/"([^"]*)"/g) || []).map(s => s.slice(1, -1));
const safe = s => s.replace(/[\/:]/g, '');
(async () => {
  let got = 0, none = 0, tiny = 0; const tmp = path.join(require('os').tmpdir(), 'espnph'); fs.mkdirSync(tmp, { recursive: true });
  for (let i = 1; i < lines.length; i++) {
    const c = parse(lines[i]); const [conf, school, player, jersey, pos, cls, id, file] = c;
    if (file && fs.existsSync(path.join(PH, file))) continue;
    if (!id) { none++; continue; }
    let buf = null;
    for (const u of [`https://a.espncdn.com/i/headshots/mens-college-basketball/players/full/${id}.png`, `https://a.espncdn.com/combiner/i?img=/i/headshots/mens-college-basketball/players/full/${id}.png&w=350&h=254`]) {
      try { const r = await fetch(u, { headers: { 'user-agent': 'Mozilla/5.0 (Macintosh)' } }); if (r.ok) { buf = Buffer.from(await r.arrayBuffer()); if (buf.length > 2500) break; buf = null; } } catch (e) {}
    }
    if (!buf) { none++; continue; }
    const rel = `${safe(school)}/${safe(player)}.jpg`, out = path.join(PH, rel), src = path.join(tmp, id + '.png');
    fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(src, buf);
    try { cp.execFileSync('sips', ['-s', 'format', 'jpeg', '--resampleWidth', '128', src, '--out', out], { stdio: 'ignore' }); } catch (e) { tiny++; continue; }
    lines[i] = c.slice(0, 7).concat([rel]).map(x => '"' + x + '"').join(','); got++;
    if (got % 25 === 0) console.log('got', got);
    await new Promise(r => setTimeout(r, 120));
  }
  fs.writeFileSync(CSV, bom + lines.join('\n') + '\n');
  console.log('added', got, 'no headshot', none, 'resize failed', tiny);
})();
