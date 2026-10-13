// Builds the game as it was at a git revision, without touching src/ or dist/ (for before/after comparisons).
// Usage: node tools/build-rev.js <rev> <output.html>      e.g. node tools/build-rev.js HEAD~1 /tmp/old.html
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const [rev, outFile] = process.argv.slice(2);
if (!rev || !outFile) { console.log('Usage: node tools/build-rev.js <rev> <output.html>'); process.exit(1); }
const ROOT = path.resolve(__dirname, '..');
const show = (p, enc = 'utf8') => execFileSync('git', ['show', `${rev}:src/${p}`], { cwd: ROOT, encoding: enc, maxBuffer: 64 << 20 });
const man = JSON.parse(show('js/manifest.json'));
const { buildInfo, whatsNew, safeJson } = require('./build-info');
const tpl = show('index.template.html'), version = (tpl.match(/<title>College Dynasty \S+ (V\d+)<\/title>/) || [])[1] || 'build';
const js = (show('js/_prefix.txt') + man.files.map(f => show('js/' + f)).join(man.sep || '') + show('js/_suffix.txt'))
  .replace('@@BUILD_INFO@@', () => safeJson(buildInfo(ROOT, version, rev)))
  .replace('@@WHATS_NEW@@', () => safeJson(whatsNew(ROOT)));
const atlas = show('assets/face-atlas.jpg', 'buffer').toString('base64');
const css1 = show('css/tailwind.css').replace('@@ASSET:face-atlas.jpg@@', () => 'data:image/jpeg;base64,' + atlas);
const out = tpl
  .replace('@@CSS:tailwind@@', () => css1)
  .replace('@@CSS:ui-polish@@', () => show('css/ui-polish.css'))
  .replace('@@JS@@', () => js);
fs.writeFileSync(path.resolve(outFile), out);
console.log('Built', rev, '->', path.resolve(outFile), `(${Buffer.byteLength(out)} bytes)`);
