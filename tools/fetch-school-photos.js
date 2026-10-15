// Run on the Mac. For roster rows with no photo, reads the school's official SIDEARM roster page, finds the player, takes his og:image headshot,
// resizes to 128 px (sips) and fills the "Photo file" column. Personal-use copy (same basis as fetch-portal-photos.js). Unmatched players are listed in photo-work/school-photos-missed.txt.
// Usage: node tools/fetch-school-photos.js [School name ...]   Then: node tools/build-photos.js && node tools/apply-real.js && node tools/build.js
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const ROOT = path.resolve(__dirname, '..'), CSV = path.join(ROOT, 'realdata/photos-src/Roster list 2026-27.csv'), PH = path.join(ROOT, 'realdata/photos-128');
const DOM = { 'Akron':'gozips.com','Alabama':'rolltide.com','Alabama State':'bamastatesports.com','Appalachian State':'appstatesports.com','Arizona':'arizonawildcats.com','Arizona State':'thesundevils.com','Arkansas':'arkansasrazorbacks.com','Arkansas State':'astateredwolves.com','Auburn':'auburntigers.com','BYU':'byucougars.com','Ball State':'ballstatesports.com','Baylor':'baylorbears.com','Boston College':'bceagles.com','Bowling Green':'bgsufalcons.com','Bryant':'bryantbulldogs.com','Buffalo':'ubbulls.com','Cal Poly':'gopoly.com','Cal State Bakersfield':'gorunners.com','California':'calbears.com','Canisius':'gogriffs.com','Central Arkansas':'ucasports.com','Central Michigan':'cmuchippewas.com','Charleston Southern':'csusports.com','Cincinnati':'gobearcats.com','Clemson':'clemsontigers.com','Cleveland State':'csuvikings.com','Colorado':'cubuffs.com','Dayton':'daytonflyers.com','DePaul':'depaulbluedemons.com','Delaware State':'dsuhornets.com','Duke':'goduke.com','East Carolina':'ecupirates.com','Eastern Michigan':'emueagles.com','Eastern Washington':'goeags.com','FIU':'fiusports.com','Fairfield':'fairfieldstags.com','Florida':'floridagators.com','Florida A&M':'famuathletics.com','Florida State':'seminoles.com','Gardner-Webb':'gwusports.com','Georgetown':'guhoyas.com','Georgia':'georgiadogs.com','Georgia Southern':'georgiasoutherneagles.com','Georgia Tech':'ramblinwreck.com','High Point':'highpointpanthers.com','Hofstra':'gohofstra.com','Houston':'uhcougars.com','Idaho':'govandals.com','Idaho State':'isubengals.com','Illinois':'fightingillini.com','Illinois State':'goredbirds.com','Indiana':'iuhoosiers.com','Iona':'icgaels.com','Iowa':'hawkeyesports.com','Iowa State':'cyclones.com','Jacksonville':'judolphins.com','James Madison':'jmusports.com','Kansas':'kuathletics.com','Kennesaw State':'ksuowls.com','Kent State':'kentstatesports.com','Kentucky':'ukathletics.com','LSU':'lsusports.net','Lamar':'lamarcardinals.com','Little Rock':'lrtrojans.com','Longwood':'longwoodlancers.com','Louisiana':'ragincajuns.com','Louisville':'gocards.com','Manhattan':'gojaspers.com','Marist':'goredfoxes.com','Marquette':'gomarquette.com','Marshall':'herdzone.com','Maryland':'umterps.com','Miami':'miamihurricanes.com','Miami (OH)':'miamiredhawks.com','Michigan':'mgoblue.com','Michigan State':'msuspartans.com','Middle Tennessee':'goblueraiders.com','Milwaukee':'milwaukeepanthers.com','Minnesota':'gophersports.com','Mississippi State':'hailstate.com','Mississippi Valley State':'mvsusports.com','Missouri':'mutigers.com','Morehead State':'msueagles.com','Morgan State':'morganstatebears.com','Nebraska':'huskers.com','New Orleans':'unoprivateers.com','Niagara':'purpleeagles.com','Norfolk State':'nsuspartans.com','North Alabama':'roarlions.com','North Carolina':'goheels.com','North Carolina Central':'nccueaglepride.com','North Dakota':'undsports.com','Northern Arizona':'nauathletics.com','Northern Colorado':'uncbears.com','Northern Iowa':'unipanthers.com','Northwestern':'nusports.com','Notre Dame':'fightingirish.com','Ohio State':'ohiostatebuckeyes.com','Oklahoma':'soonersports.com','Ole Miss':'olemisssports.com','Portland':'portlandpilots.com','Portland State':'goviks.com','Prairie View A&M':'pvpanthers.com','Princeton':'goprincetontigers.com','Queens':'queensroyals.com','Rhode Island':'gorhody.com','Rider':'gobroncs.com','Rutgers':'scarletknights.com','Sacred Heart':'sacredheartpioneers.com','Saint Francis (PA)':'sfudevils.com',"Saint Peter's":'saintpeterspeacocks.com','Sam Houston':'gobearkats.com','Samford':'samfordsports.com','Siena':'sienasaints.com','South Carolina State':'gobulldogs.com','South Dakota':'goyotes.com','Southern':'gojagsports.com','Stephen F. Austin':'sfajacks.com','Syracuse':'cuse.com','Temple':'owlsports.com','Tennessee':'utsports.com','Tennessee State':'tsutigers.com','Texas':'texassports.com','Texas A&M':'12thman.com','Texas A&M-Corpus Christi':'goislanders.com','Texas Southern':'tsusigerssports.com','UC Davis':'ucdavisaggies.com','UConn':'uconnhuskies.com','UIC':'uicflames.com','UL Monroe':'ulmwarhawks.com','UMBC':'umbcretrievers.com','UNLV':'unlvrebels.com','UTSA':'goutsa.com','Utah':'utahutes.com','Utah Tech':'utahtechtrailblazers.com','Vanderbilt':'vucommodores.com','Villanova':'villanova.com','Washington':'gohuskies.com','West Virginia':'wvusports.com','Western Michigan':'wmubroncos.com','Wofford':'woffordterriers.com','Wright State':'wsuraiders.com','Wyoming':'gowyo.com','Xavier':'goxavier.com' };
const UA = { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36' };
const strip = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '');
const key = n => strip(n).toLowerCase().replace(/\(.*?\)/g, '').replace(/\b(jr|sr|ii|iii|iv)\b\.?/g, '').replace(/[^a-z]/g, '');
const get = async u => { const r = await fetch(u, { headers: UA, redirect: 'follow', signal: AbortSignal.timeout(25000) }); if (!r.ok) throw new Error(r.status); return r; };
const safe = s => s.replace(/[\/:]/g, '');
const only = new Set(process.argv.slice(2));
const raw = fs.readFileSync(CSV, 'utf8'); const bom = raw.startsWith('﻿') ? '﻿' : '';
const lines = raw.replace(/^﻿/, '').replace(/\r/g, '').trim().split('\n');
const parse = l => (l.match(/"([^"]*)"/g) || []).map(s => s.slice(1, -1));
(async () => {
  const tmp = path.join(os.tmpdir(), 'schph'); fs.mkdirSync(tmp, { recursive: true });
  const cache = {}, missed = []; let got = 0;
  for (let i = 1; i < lines.length; i++) {
    const c = parse(lines[i]); const [, school, player, , , , , file] = c;
    if (file && fs.existsSync(path.join(PH, file))) continue;
    if (only.size && !only.has(school)) continue;
    const d = DOM[school]; if (!d) { missed.push(`${school}|${player}|no domain`); continue; }
    try {
      if (!cache[d]) {
        const links = new Set();
        for (const season of ['2026-27', '']) {
          try { const h = await (await get(`https://${d}/sports/mens-basketball/roster/${season}`)).text();
            for (const m of h.matchAll(/href="(\/sports\/mens-basketball\/roster\/(?:[^\/"]+\/)?[a-z0-9-]+\/\d+)"/g)) links.add(m[1]);
            if (links.size) break; } catch (e) {}
        }
        cache[d] = [...links]; if (!links.size) console.log('NO ROSTER PAGE', school, d);
      }
      const nk = key(player), last = key(player.split(' ').slice(-1)[0]);
      const slug = l => l.split('/').slice(-2)[0];
      const link = cache[d].find(l => key(slug(l)) === nk) || cache[d].find(l => key(slug(l)).includes(last) && key(slug(l))[0] === nk[0]);
      if (!link) { missed.push(`${school}|${player}|not on roster page`); continue; }
      const page = await (await get(`https://${d}${link}`)).text();
      const og = (page.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/) || page.match(/content="([^"]+)"[^>]+property="og:image"/) || [])[1];
      if (!og || /logo|default|placeholder|og-image|share|silhouette/i.test(og)) { missed.push(`${school}|${player}|no headshot`); continue; }
      const buf = Buffer.from(await (await get(og.replace(/&amp;/g, '&'))).arrayBuffer());
      if (buf.length < 2500) { missed.push(`${school}|${player}|tiny image`); continue; }
      const rel = `${safe(school)}/${safe(player)}.jpg`, out = path.join(PH, rel), src = path.join(tmp, 'x.img');
      fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(src, buf);
      cp.execFileSync('sips', ['-s', 'format', 'jpeg', '--resampleWidth', '128', src, '--out', out], { stdio: 'ignore' });
      lines[i] = c.slice(0, 7).concat([rel]).map(x => '"' + x + '"').join(','); got++;
      if (got % 20 === 0) { console.log('got', got); fs.writeFileSync(CSV, bom + lines.join('\n') + '\n'); }
      await new Promise(r => setTimeout(r, 150));
    } catch (e) { missed.push(`${school}|${player}|${e.message}`); }
  }
  fs.writeFileSync(CSV, bom + lines.join('\n') + '\n');
  fs.mkdirSync(path.join(ROOT, 'photo-work'), { recursive: true }); fs.writeFileSync(path.join(ROOT, 'photo-work/school-photos-missed.txt'), missed.join('\n') + '\n');
  console.log('added', got, 'missed', missed.length);
})();
