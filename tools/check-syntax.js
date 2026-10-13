// node tools/check-syntax.js: extracts the app script (the longest <script>) from the built file and runs node --check on it.
const fs = require('fs'), path = require('path'), os = require('os'), { execFileSync } = require('child_process');
const html = fs.readFileSync(path.join(__dirname, '../dist/College-Dynasty-V13.html'), 'utf8');
const js = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).sort((a, b) => b.length - a.length)[0];
const f = path.join(os.tmpdir(), 'cd-app-check.js');
fs.writeFileSync(f, js);
execFileSync(process.execPath, ['--check', f], { stdio: 'inherit' });
console.log('Syntax OK');
