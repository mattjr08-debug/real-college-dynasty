// Part 2 of the real-data patch: real 2026-27 rosters, last season's real records, ratings from stats and recruiting rank.
// Called from tools/apply-real.js; safe to run again (each patch checks its marker).
const fs = require('fs'), path = require('path');
const J = f => path.join(path.resolve(__dirname, '..'), 'src/js', f);
function patch(file, marker, steps) {
  const p = J(file); let s = fs.readFileSync(p, 'utf8');
  if (s.includes(marker)) return;
  for (const [a, b] of steps) {
    const i = s.indexOf(a);
    if (i < 0) throw new Error(file + ': patch target not found: ' + a.slice(0, 70));
    if (s.indexOf(a, i + 1) >= 0) throw new Error(file + ': patch target not unique: ' + a.slice(0, 70));
    s = s.replace(a, () => b);
  }
  fs.writeFileSync(p, s);
}

// --- helper functions (global, next to W_tr) ---
patch('0021-group-ncFor.js', 'function W_realMk', [
  ['function W_p(e, o, y, pos) {', `// Real rosters: a school's real 2026-27 players as compact AI players. Last season's real per-game stats are kept as the "last season" line (hs).
function W_realMk(e, t) {
  const rt = REAL_ON && REAL_TEAMS[t.name];
  if (!rt) return null;
  const g = Math.max(20, rt.w + rt.l),
    R = rt.r.slice(0, 13).map((r) => {
      const p = { i: Ff(e, "w"), n: r[0], p: r[1], y: r[2], o: r[4], t: Math.max(r[4], r[5]), f: j(e, 1, 2147483647), s: { g: 0, p: 0, r: 0, a: 0, s: 0, b: 0, t: 0 } };
      if (r[6] != null) p.hs = [{ y: e.year - 1, g, p: Math.round(r[6] * g), r: Math.round(r[7] * g), a: Math.round(r[8] * g), s: 0, b: 0, t: 0 }];
      return p;
    });
  const lo = R.length ? Math.min(...R.map((p) => p.o)) : 55;
  while (R.length < 12) R.push(W_p(e, lo - 4 + j(e, -3, 2), j(e, 1, 2), Le[R.length % 5]));
  R.sort((a, b) => b.o - a.o);
  t.rating = W_tr(R);
  return R;
}
// the same real player as a full user-roster player (attributes shifted so the overall comes out at the real rating)
function W_realPlayer(e, r) {
  const o = r[4],
    P = Gf(e, "Roster", o, r[2], r[1]);
  P.name = r[0];
  P.height = r[3];
  P.age = 17 + r[2];
  let a = P.attrs.slice();
  for (let k = 0; k < 8; k++) {
    const d = o - W_ovr(a, P.pos);
    if (!d) break;
    a = a.map((v) => le(v + d, 25, 96));
  }
  P.attrs = a;
  P.ovr = W_ovr(a, P.pos);
  P.potential = Math.max(P.ovr, r[5]);
  return P;
}
function W_p(e, o, y, pos) {`],
  // no artificial tier boost for real schools: the roster is the rating
  ['tb = [0, 1, 3, 5, 7][tierOf(e)],', 'tb = REAL_ON ? 0 : [0, 1, 3, 5, 7][tierOf(e)],'],
  ['  for (let t of e.opponents)\n    ((t.coach = t.coach ||', '  if (REAL_ON) for (let t of e.opponents) e.rosters[t.id] || ((rr) => rr && (e.rosters[t.id] = rr))(W_realMk(e, t));\n  for (let t of e.opponents)\n    ((t.coach = t.coach ||'],
  ['  if (fresh && e.lb)\n    for (let l of e.league || []) {', '  if (fresh && (e.lb || REAL_ON))\n    for (let l of e.league || []) {'],
]);

patch('0013-group-uy.js', 'leagueBoost: REAL_ON', [['leagueBoost: 2.9', 'leagueBoost: REAL_ON ? 0 : 2.9']]);

patch('0010-sy.js', 'REAL_TEAMS[u.name]', [
  ['  for (let i = 0; i < 15; i++) {\n    let d = Gf(o, "Roster"',
   `  const rr = REAL_ON && REAL_TEAMS[u.name];
  if (rr) {
    // the real 2026-27 roster, rated from last year's stats and recruiting rank
    rr.r.slice(0, 15).forEach((row) => o.roster.push(W_realPlayer(o, row)));
    for (let k = o.roster.length; k < 10; k++) o.roster.push(Gf(o, "Roster", Math.max(45, Math.min(...o.roster.map((p) => p.ovr)) - 5), j(o, 1, 2), Le[k % 5]));
  } else
  for (let i = 0; i < 15; i++) {
    let d = Gf(o, "Roster"`],
  ['      `${u.wins}\\u2013${30 - u.wins} last season. ${r} seniors graduated and ${n} players transferred. Build a roster of at least 8 players before opening night.`',
   '      rr\n        ? `${u.wins}\\u2013${rr.l} last season (#${rr.tr} in the final Torvik ratings). This is your real 2026-27 roster, each player rated from last year\\u2019s stats and recruiting rank. Fill the open spots before opening night.`\n        : `${u.wins}\\u2013${30 - u.wins} last season. ${r} seniors graduated and ${n} players transferred. Build a roster of at least 8 players before opening night.`'],
]);

patch('0033g-SchoolCatalog.js', 'REAL_TEAMS[o.name]', [
  ['rating = Math.max(42, Math.min(80, o.rating)),', 'rating = Math.max(42, Math.min(REAL_ON ? 99 : 80, o.rating)),'],
  ['wins = Math.max(2, Math.min(26,', 'wins = (REAL_TEAMS[o.name] || {}).w ?? Math.max(2, Math.min(26,'],
  ['rep = Math.max(5, Math.min(70,', 'rep = REAL_REP(o.name) ?? Math.max(5, Math.min(70,'],
  ['      wins,\n      budget,\n      rep,', '      wins,\n      losses: (REAL_TEAMS[o.name] || {}).l ?? 30 - wins,\n      budget,\n      rep,'],
]);

// --- odd-sized real conferences: one team sits out each round (a bye). A ghost slot keeps the round-robin working. ---
// The user's bye day becomes a nonconference game against a fixed outside opponent (same pick in both schedulers, kept out of that day's pairings).
patch('0026-W_sched.js', 'W_byeOpp', [
  ['function W_sched(e) {', `function W_ghost(a) {
  a = [...a];
  if (a.length % 2) a.splice(1, 0, null); // odd conference: a ghost team; whoever faces it has a bye
  return a;
}
function W_byeOpp(e, d) {
  const inL = new Set(e.league.map((x) => x.id)),
    c = e.opponents.filter((o) => !inL.has(o.id));
  return c.length ? c[TS(String(e.school.id) + "|" + e.year + "|" + d) % c.length] : null;
}
function W_sched(e) {`],
  [`      for (let g of groups) {
        let o = [...g],
          n = o.length,
          k = (d - 12) % (n - 1);
        if (n < 4 || n % 2) continue;
        for (let r = 0; r < k; r++) o = [o[0], o[n - 1], ...o.slice(1, -1)];
        for (let r = 0; r < n / 2; r++) {
          let x = o[r],
            y = o[n - 1 - r];
          x !== me && y !== me && pairs.push([x, y]);
        }
      }`,
`      let fill = null;
      for (let g of groups) {
        if (g.length < 4) continue;
        let o = W_ghost(g),
          n = o.length,
          k = (d - 12) % (n - 1);
        for (let r = 0; r < k; r++) o = [o[0], o[n - 1], ...o.slice(1, -1)];
        for (let r = 0; r < n / 2; r++) {
          let x = o[r],
            y = o[n - 1 - r];
          if (!x || !y) {
            (x || y) === me && (fill = W_byeOpp(e, d));
            continue;
          }
          x !== me && y !== me && pairs.push([x, y]);
        }
      }
      fill && (pairs = pairs.filter((p) => p[0] !== fill.id && p[1] !== fill.id));`],
]);
patch('0009-Zf.js', 'W_ghost', [
  ['  let a = e.league.map((l) => l.id),\n    n = a.length;', '  let a = W_ghost(e.league.map((l) => l.id)),\n    n = a.length;'],
  ['    if (r === 0) a = e.league.map((q) => q.id);', '    if (r === 0) a = W_ghost(e.league.map((q) => q.id));'],
  ['      o = e.league.find((q) => q.id === u);\n', '      o = u == null ? W_byeOpp(e, 12 + l) : e.league.find((q) => q.id === u);\n    if (!o) {\n      a = [a[0], a[a.length - 1], ...a.slice(1, -1)];\n      continue;\n    }\n'],
  ['      kind: "Conference",\n      played: !1,', '      kind: u == null ? "Nonconference" : "Conference", // odd-sized conference: this is the bye day\n      played: !1,'],
]);
// logos the user supplied (src/js/0000d-RealLogos.js, made by tools/build-logos.js): shown wherever a school logo is drawn; schools without one keep the generated shield
{
  const mp = J('manifest.json'), man = JSON.parse(fs.readFileSync(mp, 'utf8'));
  if (fs.existsSync(J('0000d-RealLogos.js')) && !man.files.includes('0000d-RealLogos.js')) { man.files.splice(man.files.indexOf('0000b-RealSchools.js') + 1, 0, '0000d-RealLogos.js'); fs.writeFileSync(mp, JSON.stringify(man, null, 1) + '\n'); }
}
patch('0064-group-Hy.js', 'REAL_LOGOS', [
  ['  if (LOGO_SHAPES[e.id]) return LOGO_SHAPES[e.id];', '  if (typeof REAL_LOGOS !== "undefined" && REAL_LOGOS[e.name]) return \'<image href="\' + REAL_LOGOS[e.name] + \'" x="2" y="2" width="96" height="96" preserveAspectRatio="xMidYMid meet"/>\';\n  if (LOGO_SHAPES[e.id]) return LOGO_SHAPES[e.id];'],
]);
// player photos the user supplied: index in src/js/0000e-RealPhotos.js (tools/build-photos.js), images in a "photos" folder next to the game file
{
  const mp = J('manifest.json'), man = JSON.parse(fs.readFileSync(mp, 'utf8'));
  if (fs.existsSync(J('0000e-RealPhotos.js')) && !man.files.includes('0000e-RealPhotos.js')) { man.files.splice(man.files.indexOf('0000b-RealSchools.js') + 1, 0, '0000e-RealPhotos.js'); fs.writeFileSync(mp, JSON.stringify(man, null, 1) + '\n'); }
}
patch('0064-group-Hy.js', 'REAL_PHOTO_PATH', [
  ['function qy({ p: e, size: a = "" }) {\n', `function qy({ p: e, size: a = "" }) {
  let ph = typeof REAL_PHOTO_PATH === "function" ? REAL_PHOTO_PATH(e.faceSeed) : null;
  if (ph)
    return (0, Hy.jsx)("div", {
      role: "img",
      "aria-label": \`\${e.name} photo\`,
      className: \`portrait realistic-face photo \${a}\`,
      style: typeof ph === "string" ? { backgroundImage: \`url("\${ph}")\`, backgroundPosition: "center top", backgroundSize: "cover", backgroundRepeat: "no-repeat" } : { backgroundImage: \`url("\${ph.url}")\`, backgroundPosition: \`\${ph.x}% \${ph.y}%\`, backgroundSize: \`\${ph.w}% \${ph.h}%\`, backgroundRepeat: "no-repeat" },
    });
`],
]);
// a real player carries his photo in his face seed (seeds from 1e9 up are photo numbers); matching is by school and name
patch('0021-group-ncFor.js', 'REAL_PHOTO_SEED', [
  ['      const p = { i: Ff(e, "w"), n: r[0], p: r[1], y: r[2], o: r[4], t: Math.max(r[4], r[5]), f: j(e, 1, 2147483647),', '      const rs = j(e, 1, 2147483647),\n        p = { i: Ff(e, "w"), n: r[0], p: r[1], y: r[2], o: r[4], t: Math.max(r[4], r[5]), f: (typeof REAL_PHOTO_SEED === "function" && REAL_PHOTO_SEED(r[0], t.name)) || rs,'],
  ['  P.age = 17 + r[2];\n', '  P.age = 17 + r[2];\n  const sd = typeof REAL_PHOTO_SEED === "function" && REAL_PHOTO_SEED(r[0], school);\n  sd && (P.faceSeed = sd);\n'],
  ['function W_realPlayer(e, r) {', 'function W_realPlayer(e, r, school) {'],
]);
patch('0010-sy.js', 'row, u.name', [['W_realPlayer(o, row)', 'W_realPlayer(o, row, u.name)']]);
// conference tournament in a conference with fewer than 8 teams (the ASUN has 7): the top seed gets a bye
patch('0015-group-IS.js', 'id: "bye"', [
  ['  ((e.seedMap = {}), a.forEach((h, k) => (e.seedMap[h.id] = k + 1)));', '  ((e.seedMap = {}), a.forEach((h, k) => (e.seedMap[h.id] = k + 1)));\n  while (F === 8 && a.length < 8) a.push({ id: "bye", name: "Bye", short: "BYE", rating: 0, wins: 0, losses: 0, cw: 0, cl: 0 });'],
  ['    F === 12 && at >= 0 && at < 4 && Rn(e, !1),', '    ((F === 12 && at >= 0 && at < 4) || (at === 0 && a.some((x) => x.id === "bye"))) && Rn(e, !1),'],
]);
patch('0045-Rn.js', 'id === "bye"', [
  ['  for (let u of t) {\n    if ((u.a.id === e.school.id', '  for (let u of t) {\n    if (u.a.id === "bye" || u.b.id === "bye") {\n      // short conference: the top seed advances without playing\n      ((u.winner = u.a.id === "bye" ? u.b : u.a), (u.sa = u.sb = 0), l.push(u.winner));\n      continue;\n    }\n    if ((u.a.id === e.school.id'],
]);
patch('0071-XC.js', 'REAL_CONFS.length', [['REAL DIVISION I SCHOOLS \\xB7 31 CONFERENCES', 'REAL DIVISION I SCHOOLS \\xB7 " + REAL_CONFS.length + " CONFERENCES']]);
patch('0033e-NilBudgets.js', 'REAL_ADJB', [['W_nilSet(e, t, baseline * f * k)', 'W_nilSet(e, t, REAL_ON ? REAL_ADJB(baseline * f * k) : baseline * f * k)']]);
patch('0071-XC.js', 'W_loss(f)', [['"\\u2013", 30 - f.wins]', '"\\u2013", W_loss(f)]']]);
patch('0073-ZC.js', 'W_loss(e.school)', [['${30 - e.school.wins}', '${W_loss(e.school)}']]);
patch('0106a-ProgramScope.js', 'W_loss(e.school)', [['losses: Math.max(0, 30 - e.school.wins), est: true', 'losses: W_loss(e.school), est: true']]);

// --- real last-season stat lines (steals, blocks, turnovers, shooting, real games) ---
patch('0021-group-ncFor.js', 'function W_realLine', [
  ['function W_realMk(e, t) {', `// r[11] = [games, mpg, stl, blk, to, fgm, fga, tpm, tpa, ftm, fta] (season totals) from tools/add-real-stats.js
function W_realLine(r, g) {
  const x = r[11], G = x ? x[0] : g;
  return { G, p: Math.round(r[6] * G), r: Math.round(r[7] * G), a: Math.round(r[8] * G), s: x ? x[2] : 0, b: x ? x[3] : 0, t: x ? x[4] : 0 };
}
function W_realMk(e, t) {`],
  ['p.hs = [{ y: e.year - 1, g, p: Math.round(r[6] * g), r: Math.round(r[7] * g), a: Math.round(r[8] * g), s: 0, b: 0, t: 0 }];', '{ const L = W_realLine(r, g); p.hs = [{ y: e.year - 1, g: L.G, p: L.p, r: L.r, a: L.a, s: L.s, b: L.b, t: L.t }]; }'],
  ['  P.potential = Math.max(P.ovr, r[5]);\n  return P;', `  P.potential = Math.max(P.ovr, r[5]);
  if (r[6] != null) {
    const x = r[11], L = W_realLine(r, 30);
    P.history = [{ year: e.year - 1, team: r[9] || school, stats: { ...zs(), gp: L.G, min: Math.round((x ? x[1] : 20) * L.G), pts: L.p, reb: L.r, ast: L.a, stl: L.s, blk: L.b, to: L.t, fgm: x ? x[5] : 0, fga: x ? x[6] : 0, tpm: x ? x[7] : 0, tpa: x ? x[8] : 0, ftm: x ? x[9] : 0, fta: x ? x[10] : 0 } }];
  }
  return P;`],
]);

// --- real players who enter the portal / move schools keep their real last-season stats ---
patch('0037-group-W_pt.js', 'const PS = ', [
  ['function W_mkp(e, p, t) {\n  {', 'function W_mkp(e, p, t) {\n  {\n    const PS = p.s && p.s.g > 0 ? p.s : (p.hs || []).at(-1) || p.s;   // this season, else the last real season'],
  ['            gp: p.s.g,\n            min: p.s.g * 27,\n            pts: p.s.p,\n            reb: p.s.r,\n            ast: p.s.a,\n            stl: p.s.s,\n            blk: p.s.b,\n            tpm: p.s.t,', '            gp: PS.g,\n            min: PS.g * 27,\n            pts: PS.p,\n            reb: PS.r,\n            ast: PS.a,\n            stl: PS.s,\n            blk: PS.b,\n            to: PS.t,'],
  ['    s: { g: 0, p: 0, r: 0, a: 0, s: 0, b: 0, t: 0 },\n  });\n  R.sort', '    s: { g: 0, p: 0, r: 0, a: 0, s: 0, b: 0, t: 0 },\n    hs: ((h) => (h && h.stats && h.stats.gp ? [{ y: h.year, g: h.stats.gp, p: h.stats.pts, r: h.stats.reb, a: h.stats.ast, s: h.stats.stl || 0, b: h.stats.blk || 0, t: h.stats.to || 0 }] : undefined))((a.history || []).at(-1)),\n  });\n  R.sort'],
]);

// --- the starting transfer portal: real unsigned players (REAL_PORTAL) in place of the first generated transfers ---
patch('0021-group-ncFor.js', 'function W_realPortalP', [
  ['// the same real player as a full user-roster player', `// a real portal player (row layout as REAL_TEAMS, last team in r[9]) as a full prospect with his real stat line as history
function W_realPortalP(e, r) {
  const o = r[4], P = Gf(e, "Transfer", o, r[2], r[1]);
  P.name = r[0]; P.height = r[3]; P.age = 17 + r[2];
  const sd = typeof REAL_PHOTO_SEED === "function" && REAL_PHOTO_SEED(r[0], "_portal");
  sd && (P.faceSeed = sd);
  let a = P.attrs.slice();
  for (let k = 0; k < 8; k++) { const d = o - W_ovr(a, P.pos); if (!d) break; a = a.map((v) => le(v + d, 25, 96)); }
  P.attrs = a; P.ovr = W_ovr(a, P.pos); P.potential = Math.max(P.ovr, r[5]);
  const x = r[11], gp = x ? x[0] : 30;
  P.history = [{ year: e.year - 1, team: r[9], stats: { ...zs(), gp, min: Math.round((x ? x[1] : 20) * gp), pts: Math.round(r[6] * gp), reb: Math.round(r[7] * gp), ast: Math.round(r[8] * gp), stl: x ? x[2] : 0, blk: x ? x[3] : 0, to: x ? x[4] : 0, fgm: x ? x[5] : 0, fga: x ? x[6] : 0, tpm: x ? x[7] : 0, tpa: x ? x[8] : 0, ftm: x ? x[9] : 0, fta: x ? x[10] : 0 } }];
  return P;
}
// the same real player as a full user-roster player`],
]);
patch('0005-Vf.js', 'W_realPortalP', [
  ['o = Gf(e, t, u, t === "Transfer" ? j(e, 2, 4) : 1, a < HS ? PH[a % PH.length] : Le[a % 5]);', 'o = t === "Transfer" && REAL_ON && typeof REAL_PORTAL !== "undefined" && REAL_PORTAL[a - HS] ? W_realPortalP(e, REAL_PORTAL[a - HS]) : Gf(e, t, u, t === "Transfer" ? j(e, 2, 4) : 1, a < HS ? PH[a % PH.length] : Le[a % 5]);'],
  ['t === "Transfer" &&\n      (o.history = [', 't === "Transfer" && !(o.history && o.history.length) &&\n      (o.history = ['],
]);
console.log('Real rosters patches applied');
