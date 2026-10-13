// Diagnostic: finds the first top-level statement whose parsed structure differs between two builds.
const fs = require('fs'), path = require('path'), acorn = require('acorn');
const ROOT = path.resolve(__dirname, '..');
const strip = n => Array.isArray(n) ? n.map(strip) : n && typeof n === 'object'
  ? Object.fromEntries(Object.keys(n).filter(k => !(k === 'start' || k === 'end' || (k === 'raw' && n.type === 'Literal'))).map(k => [k, strip(n[k])])) : n;
const body = f => { const h = fs.readFileSync(f, 'utf8'); const js = h.match(/<script>([\s\S]*?)<\/script>/)[1];
  return acorn.parse(js, { ecmaVersion: 'latest', sourceType: 'script' }).body[0].expression.callee.body.body.map(s => strip(s)); };
const a = body(path.join(ROOT, 'original/College-Dynasty-V12.original.html')), b = body(path.join(ROOT, 'dist/College-Dynasty-V13.html'));
console.log('statements:', a.length, b.length);
const diffPath = (x, y, p) => {
  if (JSON.stringify(x) === JSON.stringify(y)) return null;
  if (x && y && typeof x === 'object' && typeof y === 'object') {
    for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) { const r = diffPath(x[k], y[k], p + '.' + k); if (r) return r; }
  }
  return p + ': ' + JSON.stringify(x)?.slice(0, 120) + '  VS  ' + JSON.stringify(y)?.slice(0, 120);
};
let shown = 0;
for (let i = 0; i < Math.min(a.length, b.length) && shown < 5; i++) {
  const r = diffPath(a[i], b[i], 'stmt' + i);
  if (r) { console.log(r); shown++; }
}
console.log(shown ? 'differences listed above' : 'no per-statement differences found');
