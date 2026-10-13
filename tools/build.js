// Builds the single-file game from src/ into dist/.   Usage: node tools/build.js [--check]
// --check compares the result with original/College-Dynasty-V12.original.html (byte for byte).
const fs = require('fs'), path = require('path'), crypto = require('crypto'), zlib = require('zlib');
const ROOT = path.resolve(__dirname, '..'), SRC = path.join(ROOT, 'src');
const rd = p => fs.readFileSync(path.join(SRC, p), 'utf8');
const man = JSON.parse(rd('js/manifest.json'));
const { buildInfo, whatsNew, safeJson } = require('./build-info');
const template = rd('index.template.html');
const version = (template.match(/<title>College Dynasty \S+ (V\d+)<\/title>/) || [])[1] || 'build';
// the build stamp (build number, commit, date) and the "What's new" digest are filled in here (src/js/0067-BuildInfo.js)
const js = (rd('js/_prefix.txt') + man.files.map(f => rd('js/' + f)).join(man.sep || '') + rd('js/_suffix.txt'))
  .replace('@@BUILD_INFO@@', () => safeJson(buildInfo(ROOT, version)))
  .replace('@@WHATS_NEW@@', () => safeJson(whatsNew(ROOT)))
  .replace('@@COURTSIDE_GZIP@@', () => zlib.gzipSync(fs.readFileSync(path.join(ROOT, 'integrations/courtside-3.8.0/basketball-game.html')), {level:9}).toString('base64'));
const atlas = fs.readFileSync(path.join(SRC, 'assets/face-atlas.jpg')).toString('base64');
const css1 = rd('css/tailwind.css').replace('@@ASSET:face-atlas.jpg@@', () => 'data:image/jpeg;base64,' + atlas);
const out = template
  .replace('@@CSS:tailwind@@', () => css1)
  .replace('@@CSS:ui-polish@@', () => rd('css/ui-polish.css'))
  .replace('@@JS@@', () => js);
const name = version;
fs.mkdirSync(path.join(ROOT, 'dist'), { recursive: true });
const dest = path.join(ROOT, 'dist', `College-Dynasty-${name}.html`);
fs.writeFileSync(dest, out);
// build.json (build number, commit, date) next to the game: the website copy is compared with the page the phone already has (item 52)
fs.writeFileSync(path.join(ROOT, 'dist', 'build.json'), JSON.stringify(buildInfo(ROOT, version)));
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
console.log('Built', dest, `(${Buffer.byteLength(out)} bytes)`);
if (process.argv.includes('--check')) {
  const orig = fs.readFileSync(path.join(ROOT, 'original/College-Dynasty-V12.original.html'));
  const same = sha(orig) === sha(Buffer.from(out));
  console.log(same ? 'CHECK PASSED: identical to the original file.' : 'CHECK: differs from the original file.');
  process.exit(same ? 0 : 1);
}
