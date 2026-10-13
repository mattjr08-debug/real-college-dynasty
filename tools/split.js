// One-time tool: splits the single-file game into readable source files under src/.
// The split is lossless: build.js can recreate the original file byte for byte.
const fs = require('fs'), path = require('path'), acorn = require('acorn');
const ROOT = path.resolve(__dirname, '..'), SRC = path.join(ROOT, 'src');
const html = fs.readFileSync(path.join(ROOT, 'original/College-Dynasty-V12.original.html'), 'utf8');
for (const d of ['css', 'js', 'assets']) fs.mkdirSync(path.join(SRC, d), { recursive: true });
const W = (p, t) => fs.writeFileSync(path.join(SRC, p), t);

// 1. HTML template with placeholders for the two style blocks and the script block
const blocks = [...html.matchAll(/<(script|style)([^>]*)>([\s\S]*?)<\/\1>/g)];
if (blocks.length !== 3) throw new Error('Expected 3 blocks, found ' + blocks.length);
const [s1, s2, sc] = blocks;
const tpl = html.slice(0, s1.index) + `<style${s1[2]}>@@CSS:tailwind@@</style>` +
  html.slice(s1.index + s1[0].length, s2.index) + `<style${s2[2]}>@@CSS:ui-polish@@</style>` +
  html.slice(s2.index + s2[0].length, sc.index) + `<script${sc[2]}>@@JS@@</script>` +
  html.slice(sc.index + sc[0].length);
W('index.template.html', tpl);

// 2. CSS: pull the embedded face atlas image out into a real .jpg file
const m = [...s1[3].matchAll(/url\((["']?)data:image\/jpeg;base64,([^)"']+)\1\)/g)];
if (m.length !== 1) throw new Error('Expected 1 embedded image, found ' + m.length);
const b64 = m[0][2];
if (Buffer.from(b64, 'base64').toString('base64') !== b64) throw new Error('Image is not canonical base64');
fs.writeFileSync(path.join(SRC, 'assets/face-atlas.jpg'), Buffer.from(b64, 'base64'));
W('css/tailwind.css', s1[3].replace(m[0][0], () => `url(${m[0][1]}@@ASSET:face-atlas.jpg@@${m[0][1]})`));
W('css/ui-polish.css', s2[3]);

// 3. JavaScript: split the bundle's top-level statements into files
const js = sc[3];
const ast = acorn.parse(js, { ecmaVersion: 'latest', sourceType: 'script' });
const stmts = ast.body[0].expression.callee.body.body, n = stmts.length;
const text = i => js.slice(stmts[i].start, i < n - 1 ? stmts[i + 1].start : stmts[i].end);
const find = (from, s) => { for (let i = from; i < n; i++) if (js.startsWith(s, stmts[i].start)) return i; throw new Error('marker not found: ' + s); };
const appStart = find(0, 'var Le='), zodStart = find(appStart, 'var x={}'), zodEnd = find(zodStart, 'var zC=E');
const nm = st => st.type === 'FunctionDeclaration' ? st.id.name : st.type === 'VariableDeclaration' && st.declarations[0].id.name ? st.declarations[0].id.name : 'stmt';
const files = [];
const add = (name, t) => files.push({ name: String(files.length).padStart(4, '0') + '-' + name.replace(/[^\w$-]/g, '_') + '.js', text: t });
let t0 = ''; for (let i = 0; i < appStart; i++) t0 += text(i);
add('vendor-react-and-libs', t0);
const seg = (a, b) => {
  let cur = null;
  for (let i = a; i < b; i++) {
    const t = text(i), big = stmts[i].type === 'FunctionDeclaration' && t.length >= 600;
    if (big) { if (cur) { add(cur.name, cur.text); cur = null; } add(nm(stmts[i]), t); continue; }
    if (!cur) cur = { name: 'group-' + nm(stmts[i]), text: '' };
    cur.text += t;
    if (cur.text.length > 15000) { add(cur.name, cur.text); cur = null; }
  }
  if (cur) add(cur.name, cur.text);
};
seg(appStart, zodStart);
let tz = ''; for (let i = zodStart; i <= zodEnd; i++) tz += text(i);
add('vendor-zod', tz);
seg(zodEnd + 1, n);
for (const f of files) W('js/' + f.name, f.text);
W('js/_prefix.txt', js.slice(0, stmts[0].start));
W('js/_suffix.txt', js.slice(stmts[n - 1].end));
W('js/manifest.json', JSON.stringify({ sep: '', files: files.map(f => f.name) }, null, 1));
console.log('Split done:', files.length, 'JavaScript files from', n, 'statements.');
