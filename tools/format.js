// Makes the app code readable: formats every non-vendor JS file with Prettier,
// then proves nothing changed by comparing the parsed code (AST) of the rebuilt game with the original.
// Usage: node tools/format.js        (run tools/split.js first to start from the lossless split)
const fs = require('fs'), path = require('path'), acorn = require('acorn'), prettier = require('prettier');
const ROOT = path.resolve(__dirname, '..'), JS = path.join(ROOT, 'src/js');
const man = JSON.parse(fs.readFileSync(path.join(JS, 'manifest.json'), 'utf8'));

const strip = n => {
  if (Array.isArray(n)) return n.map(strip);
  if (n && typeof n === 'object') {
    const o = {};
    for (const k of Object.keys(n)) {
      if (k === 'start' || k === 'end') continue;
      if (k === 'raw' && n.type === 'Literal') continue;
      o[k] = strip(n[k]);
    }
    return o;
  }
  return n;
};
const scriptOf = html => html.match(/<script>([\s\S]*?)<\/script>/)[1];
const parse = js => JSON.stringify(strip(acorn.parse(js, { ecmaVersion: 'latest', sourceType: 'script' })));

(async () => {
  let done = 0;
  for (const f of man.files) {
    if (f.includes('vendor')) continue;
    const p = path.join(JS, f), src = fs.readFileSync(p, 'utf8');
    const out = await prettier.format(src, { parser: 'babel', printWidth: 110, singleQuote: false, trailingComma: 'es5', quoteProps: 'preserve' });
    fs.writeFileSync(p, out); done++;
  }
  man.sep = '\n';
  fs.writeFileSync(path.join(JS, 'manifest.json'), JSON.stringify(man, null, 1));
  console.log('Formatted', done, 'files. Rebuilding and verifying...');
  require('child_process').execFileSync('node', [path.join(__dirname, 'build.js')], { stdio: 'inherit' });
  const built = fs.readFileSync(path.join(ROOT, 'dist/College-Dynasty-V13.html'), 'utf8');
  const orig = fs.readFileSync(path.join(ROOT, 'original/College-Dynasty-V12.original.html'), 'utf8');
  const same = parse(scriptOf(built)) === parse(scriptOf(orig));
  console.log(same ? 'VERIFIED: the formatted code is identical to the original program (same parsed structure).'
                   : 'MISMATCH: formatted code differs from the original program.');
  process.exit(same ? 0 : 1);
})();
