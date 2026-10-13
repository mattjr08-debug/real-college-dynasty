// Personal-use download (SIDEARM Sports terms 2.3 allow copying site content for personal use) of the 2025-26 roster headshots
// of the real starting-portal players. Output: realdata/portal-photos-raw/<Player>.<ext> + credits.json
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..'), OUT = path.join(ROOT, 'realdata/portal-photos-raw');
const DOM = { 'Vanderbilt': 'vucommodores.com', 'Utah Tech': 'utahtechtrailblazers.com', 'Southern Utah': 'suutbirds.com', 'California': 'calbears.com',
  'Michigan St.': 'msuspartans.com', 'Idaho St.': 'isubengals.com', 'BYU': 'byucougars.com', 'Gardner Webb': 'gwusports.com', 'Niagara': 'purpleeagles.com',
  'Youngstown St.': 'ysusports.com', 'Eastern Michigan': 'emueagles.com', 'Quinnipiac': 'gobobcats.com', "Mount St. Mary's": 'mountathletics.com',
  'Canisius': 'gogriffs.com', 'Sacred Heart': 'sacredheartpioneers.com', 'Northern Arizona': 'nauathletics.com', 'Alabama St.': 'bamastatesports.com',
  'Rider': 'gobroncs.com', 'Central Michigan': 'cmuchippewas.com', 'Maryland': 'umterps.com', 'Miami FL': 'miamihurricanes.com' };
const UA = { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36' };
const key = n => n.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\(.*?\)/g, '').replace(/\b(jr|sr|ii|iii|iv)\b\.?/g, '').replace(/[^a-z]/g, '');
const get = async (u) => { const r = await fetch(u, { headers: UA, redirect: 'follow' }); if (!r.ok) throw new Error(r.status + ' ' + u); return r; };
(async () => {
  const want = fs.readFileSync('/tmp/portal.txt', 'utf8').trim().split('\n').map(l => l.split('|'));
  const skip = new Set(['Myles Rice', 'Noam Dovrat']);
  const credits = fs.existsSync(path.join(OUT, 'credits.json')) ? JSON.parse(fs.readFileSync(path.join(OUT, 'credits.json'), 'utf8')) : {}; const rosterCache = {};
  for (const [name, school] of want) {
    if (skip.has(name) || ['jpg', 'png'].some((x) => fs.existsSync(path.join(OUT, `${name}.${x}`)))) continue;
    const d = DOM[school]; if (!d) { console.log('NO DOMAIN', name, school); continue; }
    try {
      let links = rosterCache[d];
      if (!links) {
        links = [];
        for (const season of ['2025-26', '']) {
          try { const h = await (await get(`https://${d}/sports/mens-basketball/roster/${season}`)).text();
            for (const m of h.matchAll(/href="(\/sports\/mens-basketball\/roster\/[a-z0-9-]+\/\d+)"/g)) links.push(m[1]);
            if (links.length) break; } catch (e) {}
        }
        rosterCache[d] = links;
      }
      const nk = key(name), last = key(name.split(' ').slice(-1)[0]);
      let link = links.find(l => key(l.split('/')[4]) === nk) || links.find(l => key(l.split('/')[4]).includes(last) && key(l.split('/')[4])[0] === nk[0]);
      if (!link) { console.log('NOT ON ROSTER PAGE', name, school, d, links.length); continue; }
      const page = await (await get(`https://${d}${link}`)).text();
      const og = (page.match(/<meta[^>]+(?:property|name)="og:image"[^>]+content="([^"]+)"/) || page.match(/content="([^"]+)"[^>]+(?:property|name)="og:image"/) || [])[1];
      if (!og || /logo|default|og-image|share/i.test(og)) { console.log('NO HEADSHOT', name, og || ''); continue; }
      const url = og.replace(/&amp;/g, '&');
      const buf = Buffer.from(await (await get(url)).arrayBuffer());
      const ext = /png/i.test(url) ? 'png' : 'jpg';
      fs.writeFileSync(path.join(OUT, `${name}.${ext}`), buf);
      credits[name] = { page: `https://${d}${link}`, image: url, notice: (page.match(/©\s*\d{4}[^<"]{0,60}/) || [''])[0] };
      console.log('OK', name, buf.length, url.slice(0, 90));
    } catch (e) { console.log('ERR', name, e.message); }
    await new Promise(r => setTimeout(r, 1200));
  }
  fs.writeFileSync(path.join(OUT, 'credits.json'), JSON.stringify(credits, null, 1));
})();
