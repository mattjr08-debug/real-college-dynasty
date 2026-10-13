// Adds last season's full real stat line to every player in src/js/0000c-RealRosters.js (row index 11):
// [games, mpg, steals, blocks, turnovers, fgm, fga, tpm, tpa, ftm, fta] (season totals except mpg). Run after build-real-rosters.js. Idempotent.
const fs=require('fs'),path=require('path'),vm=require('vm');
const ROOT=path.join(__dirname,'..'),F=path.join(ROOT,'src/js/0000c-RealRosters.js');
const src=fs.readFileSync(F,'utf8');
const ctx={};vm.createContext(ctx);vm.runInContext(src.replace('var REAL_TEAMS','REAL_TEAMS'),ctx);
const T=ctx.REAL_TEAMS||vm.runInContext('REAL_TEAMS',ctx);
const csv=f=>fs.readFileSync(f,'utf8').trim().split('\n').map(l=>{const o=[];let c='',q=false;for(const ch of l){if(ch==='"')q=!q;else if(ch===','&&!q){o.push(c);c=''}else c+=ch}o.push(c);return o});
const rows=csv(path.join(ROOT,'realdata/torvik-players-2026.csv'));
const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\b(jr|sr|ii|iii|iv|v)\b\.?/g,'').replace(/[^a-z]/g,'');
const M={};for(const r of rows){(M[norm(r[0])+'|'+r[1]]=M[norm(r[0])+'|'+r[1]]||[]).push(r)}
let hit=0,miss=0;
for(const nm in T)for(const p of T[nm].r){
  p.length=Math.min(p.length,11);
  if(p[6]==null||!p[9]){continue}
  const c=(M[norm(p[0])+'|'+p[9]]||[]).filter(r=>Math.abs((+r[63])-p[6])<0.06);
  if(c.length!==1){miss++;continue}
  const r=c[0],gp=+r[3],n=x=>Math.round(+x||0);
  const fgm=+r[16]+ +r[19],fga=+r[17]+ +r[20],ftm=+r[13],fta=+r[14],to=+r[12];
  const tov=to>=100?0:to/(100-to)*(fga+0.44*fta);
  p[11]=[gp,+(+r[4]*0.4).toFixed(1),n((+r[61])*gp),n((+r[62])*gp),n(tov),n(fgm),n(fga),n(r[19]),n(r[20]),n(ftm),n(fta)];hit++;
}
const lines=src.split('\n');const out=[];let inT=false;
for(const l of lines){const m=l.match(/^ ("(?:[^"\\]|\\.)*"): \{ w:/);if(m){const nm=JSON.parse(m[1]);const t=T[nm];out.push(` ${m[1]}: { w: ${t.w}, l: ${t.l}, cw: ${t.cw}, cl: ${t.cl??null}, tr: ${t.tr}, r: [`+t.r.map(p=>JSON.stringify(p)).join(',')+'] },');}else out.push(l)}
fs.writeFileSync(F,out.join('\n'));
console.log('stat lines added',hit,'unmatched',miss);
