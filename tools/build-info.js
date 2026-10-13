// Build stamp and "What's new" digest for the game (item 32). Used by tools/build.js and tools/build-rev.js.
//   buildInfo(root, version, rev)  ->  { version, build, commit, dirty, date }
//     build  = number of commits so far (goes up by one with every commit, so it tells two builds apart)
//     commit = short commit id of `rev` (default: HEAD);  dirty = the source has uncommitted changes (only for HEAD)
//   whatsNew(root)  ->  [{ id, date, title, text }] newest first, built from claude-log/*.json (the instruction log):
//     the title the owner gave the instruction plus the first plain paragraph of what Claude Code reported.
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');

function git(root, args) {
  try { return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return ''; }
}

function buildInfo(root, version, rev) {
  const target = rev || 'HEAD';
  return {
    version,
    build: Number(git(root, ['rev-list', '--count', target])) || 0,
    commit: git(root, ['rev-parse', '--short', target]) || 'unknown',
    dirty: rev ? false : git(root, ['status', '--porcelain', '--', 'src']) !== '',
    date: new Date().toISOString(),
  };
}

// Plain text from the first real paragraph of a report: no headings, bullets, bold marks or code marks, at most `max` characters
function firstParagraph(text, max = 320) {
  const body = String(text || '').replace(/\r/g, '').split('\n').filter(l => !/^#{1,6}\s/.test(l.trim())).join('\n');
  const paras = body.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const p = paras.find(x => !/^#{1,6}\s/.test(x) && !/^[-*]\s/.test(x) && !/^\d+\.\s/.test(x) && x.length > 20) || paras[0] || '';
  const plain = p.replace(/\*\*|__|`/g, '').replace(/\s*\n\s*/g, ' ').replace(/\s+/g, ' ').trim();
  return plain.length > max ? plain.slice(0, max).replace(/\s+\S*$/, '') + '…' : plain;
}

function whatsNew(root) {
  const dir = path.join(root, 'claude-log');
  if (!fs.existsSync(dir)) return [];
  const rows = [];
  for (const f of fs.readdirSync(dir).filter(f => /^\d{4}-.*\.json$/.test(f)).sort()) {
    let j; try { j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch { continue; }
    if (j.exitCode !== 0 || !j.output) continue;            // failed or empty runs are not news
    rows.push({ id: j.id || f.slice(0, 4), date: String(j.finishedAt || j.startedAt || '').slice(0, 10), title: String(j.title || '').trim(), text: firstParagraph(j.output) });
  }
  return rows.reverse();
}

// JSON that is safe to place inside a <script> block
const safeJson = v => JSON.stringify(v).replace(/</g, '\\u003c').split(String.fromCharCode(0x2028)).join('\\u2028').split(String.fromCharCode(0x2029)).join('\\u2029');

module.exports = { buildInfo, whatsNew, firstParagraph, safeJson };
