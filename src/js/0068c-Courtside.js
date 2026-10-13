// Courtside 3.8.0 integration. The original court stays intact and is decompressed on demand.
const COURTSIDE_GZIP = "@@COURTSIDE_GZIP@@";
let courtHTMLPromise;
function W_courtGame(e) {
  if (!e || e.live) return null;
  if (e.phase === "Regular season") return e.schedule.find(g => !g.played) || null;
  if (!["Conference tournament", "National tournament"].includes(e.phase)) return null;
  const pair = e.bracket?.[e.tournamentRound]?.find(g => !g.winner && (g.a.id === e.school.id || g.b.id === e.school.id));
  if (!pair) return null;
  const o = pair.a.id === e.school.id ? pair.b : pair.a;
  if (!e.rosters?.[o.id]) return null;
  return {id: `court-${e.year}-${e.tournament}-${e.tournamentRound}-${o.id}`, opponent:o.name,
    oppId:o.id, rating:o.rating, venue:"Neutral", kind:`${e.tournament} tournament`, played:false};
}
function W_courtMatch(e) {
  const g = W_courtGame(e);
  if (!g) throw Error("There is no playable scheduled game. Finish the current Game Day first.");
  // Shot priority: ranked players get a higher usage tendency (more shots) and a "priority" tendency (teammates look for them), see integrations/courtside-3.8.0/LOCAL-CHANGES.md.
  const pri = (e.shotPriority || []).slice(0, 5), W_tendPri = (p) => { const t = W_tend(p), i = pri.indexOf(p.id); return i < 0 ? t : {...t, usage: Math.min(2, t.usage * TUNE.spBoost[i]), priority: TUNE.spBoost[i]}; };
  const match = window.CollegeDynastyBasketballAdapter.createMatch(e, g, {W_at, W_tend: W_tendPri, TS, TUNE, logoFor, hqOppSchool});
  // Realism (court 3.9.0): your minutes plan from Coaching, the opponent's depth chart (best first: 29, 28, 26, 25, 24, 17, 15, 14, 12, 10), and the main game's home court and streak numbers.
  const minutesById = new Map(e.roster.map((p) => [p.id, p.minutes || 0])), depth = [29, 28, 26, 25, 24, 17, 15, 14, 12, 10];
  for (const p of [...match.teams[0].players, ...match.teams[0].bench]) p.minutes = minutesById.get(p.id) || 0;
  [...match.teams[1].players, ...match.teams[1].bench].sort((x, y) => y.ovr - x.ovr).forEach((p, i) => { p.minutes = depth[i] || 0; });
  match.simTune = {home: 6 * TUNE.f, heat: TUNE.heat, gain: 0.3, loss: 0.2, decay: 0.93, sf: TUNE.sf, nf: TUNE.nf, to: 0.09};
  return match;
}
function W_courtKey(e) {
  const m = W_courtMatch(e);
  return `${e.school.id}:${e.year}:${m.gid}:${e.rng}:${TS(JSON.stringify(m))}`;
}
function W_courtValidate(e, result, key, halfSeconds) {
  const g = W_courtGame(e), m = W_courtMatch(e);
  const fail = text => { throw Error("Court result rejected: " + text); };
  const integer = (v, max = 10000) => Number.isInteger(v) && v >= 0 && v <= max;
  if (key !== W_courtKey(e)) fail("the career or lineup changed. Reopen this game.");
  if (!result || result.type !== "college-dynasty-final" || result.version !== 1 || result.gid !== g.id || result.year !== e.year)
    fail("wrong game, season, or interface version.");
  if (e.schedule.some(n => n.id === result.gid && n.played)) fail("already recorded.");
  if (!integer(result.seed, 4294967295) || !integer(result.ot, 20) || !integer(result.poss, 10000) || result.poss < 1)
    fail("invalid RNG, overtime, or possession count.");
  if (![300,600,900,1200].includes(halfSeconds) || result.halfSeconds !== halfSeconds) fail("wrong half length.");
  const factor = (40 + 5 * result.ot) / (halfSeconds / 30 + 5 * result.ot);
  if (result.statsBasis !== "40-minute adjusted" || !Number.isFinite(result.adjustmentFactor) || Math.abs(result.adjustmentFactor-factor)>1e-9)
    fail("invalid official-stat adjustment.");
  const fields = ["min","pts","reb","ast","stl","blk","to","fgm","fga","tpm","tpa","ftm","fta","pf"];
  const boxes = (data, actual) => {
    if (!data || !Array.isArray(data.score) || data.score.length !== 2 || !data.score.every(v=>integer(v))) fail("invalid score.");
    if (!Array.isArray(data.teamStats) || data.teamStats.length !== 2 || data.teamStats.some(s=>!s || Object.values(s).some(v=>!integer(v)))) fail("invalid team totals.");
    return [data.box,data.opponentBox].map((rows,team) => {
      const roster = [...m.teams[team].players,...m.teams[team].bench], ids = new Set();
      if (!Array.isArray(rows) || !rows.length || rows.length>roster.length) fail("invalid roster box.");
      let sum = 0;
      const clean = rows.map(row => {
        const player = roster.find(p=>p.id===row.id);
        if (!player || ids.has(row.id)) fail("unknown or duplicate player.");
        ids.add(row.id);
        if (fields.some(f=>!integer(row[f]))) fail("invalid player statistics.");
        if (row.min>(actual ? halfSeconds/30 : 40)+5*result.ot+1 || row.pf>10 || row.fgm>row.fga || row.tpm>row.tpa || row.tpm>row.fgm || row.tpa>row.fga || row.ftm>row.fta || actual && row.fgm-row.tpm>row.fga-row.tpa || row.pts!==2*row.fgm+row.tpm+row.ftm)
          fail("inconsistent shooting or minutes.");
        sum += row.pts;
        return {id:player.id,name:player.name,pos:player.pos,...Object.fromEntries(fields.map(f=>[f,row[f]]))};
      });
      if (sum !== data.score[team]) fail("points do not match the player box.");
      const totals={made:"fgm",attempts:"fga",steals:"stl",rebounds:"reb",assists:"ast",blocks:"blk",freeThrowsMade:"ftm",freeThrowsAttempted:"fta",fouls:"pf"};
      for(const [k,v] of Object.entries(totals))
        if(data.teamStats[team][k]!==clean.reduce((n,p)=>n+p[v],0)) fail("team totals do not match the box.");
      return clean;
    });
  };
  const official = boxes(result,false), raw = boxes(result.actual,true);
  if (result.actual.gid!==g.id || result.actual.year!==e.year || result.actual.ot!==result.ot || result.actual.halfSeconds!==halfSeconds || !integer(result.actual.poss) || result.actual.poss<1 || result.poss!==Math.max(1,Math.round(result.actual.poss*factor))) fail("invalid actual-game metadata.");
  const expected = raw.map(rows=>rows.map(p=>{
    const n={...p};
    if(factor!==1) {
      for(const k of fields.filter(f=>f!=="pts"&&f!=="pf")) n[k]=Math.round(p[k]*factor);
      n.tpm=Math.min(n.tpm,n.fgm);n.tpa=Math.max(n.tpm,n.tpa);n.fga=Math.max(n.fgm,n.tpa,n.fga);
      n.fta=Math.max(n.ftm,n.fta);n.pts=2*n.fgm+n.tpm+n.ftm;
    }
    return n;
  }));
  const scores=expected.map(rows=>rows.reduce((n,p)=>n+p.pts,0)), actualScore=result.actual.score;
  if(factor!==1 && actualScore[0]!==actualScore[1]) {
    const winner=actualScore[0]>actualScore[1]?0:1, scorer=expected[winner].reduce((best,p)=>p.pts>best.pts?p:best);
    while(scores[winner]<=scores[1-winner]) {scorer.fgm++;scorer.fga=Math.max(scorer.fga,scorer.fgm);scorer.pts+=2;scores[winner]+=2;}
  }
  if(JSON.stringify(expected)!==JSON.stringify(official)) fail("official statistics differ from the documented adjustment.");
  let forfeit=null;
  if(result.forfeit!=null) {
    const f=result.forfeit;
    if(![0,1].includes(f.winner)||f.loser!==1-f.winner || typeof f.reason!=="string" || f.reason.length>500 || JSON.stringify(f)!==JSON.stringify(result.actual.forfeit)) fail("invalid forfeit.");
    forfeit={winner:f.winner,loser:f.loser,reason:f.reason};
  } else if(result.score[0]===result.score[1] || actualScore[0]===actualScore[1]) fail("a completed game cannot be tied.");
  if(!Array.isArray(result.timeoutsUsed)||result.timeoutsUsed.length!==2 || !result.timeoutsUsed.every(v=>integer(v,m.timeoutRules.total))) fail("invalid timeout count.");
  return {g, official, raw, factor, forfeit, win:forfeit ? forfeit.winner===0 : result.score[0]>result.score[1]};
}
function W_saveCourt(e, action) {
  // Complete validation before mutating the career, including all raw/normalized rows.
  const r=action.result, v=W_courtValidate(e,r,action.key,action.halfSeconds), g=v.g;
  const box=v.official[0].map(p=>({...p,gp:1})), opponentBox=v.official[1].map(p=>({...p,gp:1}));
  g.opponentBox=opponentBox;
  g.court={version:1,halfSeconds:r.halfSeconds,adjustmentFactor:v.factor,statsBasis:r.statsBasis,
    forfeit:v.forfeit,actual:{score:[...r.actual.score],box:v.raw[0],opponentBox:v.raw[1],ot:r.ot,poss:r.actual.poss,halfSeconds:r.halfSeconds}};
  e.rng=r.seed;
  W_finishPlayed(e,g,{l:e.roster.filter(p=>box.some(b=>b.id===p.id)),t:new Map(box.map(p=>[p.id,p.min])),u:box,
    us:r.score[0],them:r.score[1],ot:r.ot,poss:r.poss,tmo:[...r.timeoutsUsed],win:v.win});
  if(e.phase==="Regular season") {
    if(!e.schedule.some(g=>!g.played)) bS(e);
  } else {
    W_pst(e,g.oppId,g.them,!g.win,opponentBox);
    AS(e,g);
  }
}
// A separate save-slot-scoped checkpoint never advances a career. Stale checkpoints are ignored.
function W_courtSession(e) {
  try {
    const p=JSON.parse(localStorage.getItem(Gn+"-courtside")||"null");
    return p?.version===1 && p.key===W_courtKey(e) && [300,600,900,1200].includes(p.halfSeconds) && p.snapshot?.players?.length===10 ? p : null;
  } catch { return null; }
}
function W_courtRemember(key, halfSeconds, snapshot) {
  if(!snapshot || !Array.isArray(snapshot.players) || snapshot.players.length!==10 || JSON.stringify(snapshot).length>500000) throw Error("Invalid court checkpoint.");
  localStorage.setItem(Gn+"-courtside",JSON.stringify({version:1,key,halfSeconds,snapshot}));
}
async function W_courtHTML() {
  if (!courtHTMLPromise) courtHTMLPromise=(async()=>{
    const bytes=Uint8Array.from(atob(COURTSIDE_GZIP),c=>c.charCodeAt(0));
    const html=await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"))).text();
    // This bridge adds resumable saves only. Gameplay and model code remain the packaged version.
    const bridge=`<script>
      function courtSnapshot() {return JSON.parse(JSON.stringify(state));}
      function courtPostSnapshot(requestId) {if(match) parent.postMessage({type:'college-dynasty-checkpoint',version:1,gid:match.gid,year:match.year,requestId,snapshot:courtSnapshot()},'*');}
      addEventListener('message',event=>{
        if(event.source!==parent || event.data?.version!==1)return;
        const d=event.data;
        if(d.type==='college-dynasty-start') {ui.length.value=String(match.halfSeconds||1200);ui.options.hidden=true;ui.title.textContent='TAKE THE FLOOR.';}
        if(d.type==='college-dynasty-checkpoint-request') {if(active()) pause();courtPostSnapshot(d.requestId);}
        if(d.type==='college-dynasty-resume' && d.gid===match?.gid && d.year===match?.year && d.snapshot?.players?.length===10) {
          state=JSON.parse(JSON.stringify(d.snapshot));keys.clear();state.lastSpacePress=-Infinity;
          ui.length.value=String(state.halfSeconds);document.getElementById('player-lock').value=String(state.lockedPlayer);
          document.getElementById('offense-style').value=state.offense;document.getElementById('defense-style').value=state.defense;
          if(state.over) {ui.options.hidden=true;ui.overlay.hidden=false;ui.title.textContent='FINAL RESULT';ui.start.disabled=true;renderFinalStats(true);parent.postMessage(state.finalResult,'*');}
          else if(state.inTimeout) {state.paused=true;ui.overlay.hidden=false;ui.title.textContent='TIMEOUT';ui.start.textContent='Resume game →';openAdjustments();}
          else if(state.halftime) halftime();
          else if(!state.started) {ui.overlay.hidden=false;ui.options.hidden=true;ui.title.textContent="READY TO PLAY";ui.start.textContent="Let’s play →";}
          else {state.paused=true;ui.overlay.hidden=false;ui.options.hidden=true;ui.title.textContent="GAME SAVED";ui.start.textContent="Resume game →";}
          hud();draw();
        }
      });
      setInterval(()=>{if(match && state.started) courtPostSnapshot(null);},3000);
      addEventListener('pagehide',()=>courtPostSnapshot(null));
    <\/script>`;
    return html.replace('</body>',bridge+'</body>');
  })().catch(e=>{courtHTMLPromise=null;throw e;});
  return courtHTMLPromise;
}
function CourtsideGame({career,run,onClose}) {
  const saved=(0,N.useRef)(W_courtSession(career)).current;
  const [half,setHalf]=(0,N.useState)(saved?.halfSeconds||1200), [opened,setOpened]=(0,N.useState)(false),
    [html,setHTML]=(0,N.useState)(""), [error,setError]=(0,N.useState)(""), [result,setResult]=(0,N.useState)(null),
    [busy,setBusy]=(0,N.useState)(false), [abandon,setAbandon]=(0,N.useState)(false);
  const iframe=(0,N.useRef)(null), ready=(0,N.useRef)(false), exiting=(0,N.useRef)(false), keyRef=(0,N.useRef)(null);
  if(!keyRef.current) keyRef.current=W_courtKey(career);
  const key=keyRef.current;
  const config=(0,N.useRef)(null), originalFocus=(0,N.useRef)(document.activeElement);
  if(!config.current) config.current={...W_courtMatch(career),halfSeconds:half};
  (0,N.useEffect)(()=>{
    const old=document.body.style.overflow;document.body.style.overflow="hidden";
    return()=>{document.body.style.overflow=old;originalFocus.current?.focus?.();};
  },[]);
  (0,N.useEffect)(()=>{
    if(!opened)return;
    let alive=true;W_courtHTML().then(h=>{if(alive)setHTML(h);}).catch(e=>{if(alive)setError(e.message);});
    const handler=event=>{
      if(event.source!==iframe.current?.contentWindow)return;
      const d=event.data;
      if(!d || d.version!==1 && d.type!=="college-dynasty-error")return;
      if(d.type==="college-dynasty-ready" && !ready.current) {
        ready.current=true;
        event.source.postMessage({type:"college-dynasty-start",version:1,match:config.current},"*");
        if(saved)event.source.postMessage({type:"college-dynasty-resume",version:1,gid:config.current.gid,year:config.current.year,snapshot:saved.snapshot},"*");
        iframe.current?.focus();
      } else if(d.type==="college-dynasty-final") {
        try {W_courtValidate(career,d,key,half);setResult(d);setError("");}
        catch(e){setError(e.message);}
      } else if(d.type==="college-dynasty-checkpoint" && d.gid===config.current.gid && d.year===config.current.year) {
        try {W_courtRemember(key,half,d.snapshot);if(exiting.current && d.requestId===key)onClose();}
        catch(e){setError("The game could not be saved: "+e.message);exiting.current=false;}
      } else if(d.type==="college-dynasty-error")setError(String(d.message).slice(0,500));
    };
    addEventListener("message",handler);
    return()=>{alive=false;removeEventListener("message",handler);};
  },[opened]);
  const start=()=>{config.current.halfSeconds=half;setOpened(true);};
  const exit=()=>{
    if(!opened || !ready.current){onClose();return;}
    exiting.current=true;
    iframe.current.contentWindow.postMessage({type:"college-dynasty-checkpoint-request",version:1,requestId:key},"*");
  };
  const save=async()=>{
    setBusy(true);setError("");
    const ok=await run({type:"courtFinish",result,key,halfSeconds:half});
    if(ok){localStorage.removeItem(Gn+"-courtside");onClose();}
    else {setBusy(false);setError("The season could not accept this result. Your court checkpoint is retained. Close the court to read the career save message.");}
  };
  return (0,s.jsxs)("div",{className:"courtside-host",role:"dialog","aria-modal":true,"aria-label":"Play scheduled game",children:[
    (0,s.jsxs)("header",{className:"courtside-header",children:[
      (0,s.jsxs)("div",{className:"courtside-match",children:[(0,s.jsx)("small",{children:W_courtGame(career)?.venue+" · "+career.year}),
        (0,s.jsx)("strong",{children:career.school.short+" vs "+config.current.teams[1].short})]}),
      (0,s.jsx)(X,{onClick:exit,disabled:busy,children:opened?"Save & exit":"Close"}),
      opened&&(0,s.jsx)(X,{onClick:()=>setAbandon(true),disabled:busy,children:"Abandon"})]}),
    error&&(0,s.jsx)("div",{className:"courtside-error",role:"alert",children:error}),
    !opened ? (0,s.jsxs)("div",{className:"courtside-setup",children:[
      (0,s.jsx)("p",{className:"eyebrow",children:"COURTSIDE · PLAY YOUR SCHEDULED GAME"}),
      (0,s.jsx)("h2",{children:saved?"Your game is saved.":"Take the floor."}),
      (0,s.jsx)("p",{children:"Your starting five and bench. Your opponent. Your season."}),
      (0,s.jsxs)("label",{children:["Half length ",(0,s.jsx)("select",{"aria-label":"Half length",value:half,disabled:!!saved,onChange:e=>setHalf(Number(e.target.value)),children:[20,15,10,5].map(n=>(0,s.jsx)("option",{value:n*60,children:n+" minutes"},n))})]}),
      (0,s.jsx)("p",{className:"muted",children:"Shortened games count as official 40-minute adjusted scores and stats. Actual played stats are kept too; fouls stay unscaled."}),
      (0,s.jsx)(X,{primary:true,onClick:start,children:saved?"Resume saved game":"Enter court"}),
      saved&&(0,s.jsx)(X,{onClick:()=>setAbandon(true),children:"Discard saved game"}),
      (0,s.jsx)("p",{className:"muted",children:"Move: WASD/arrows · Shoot: hold/release Space · K: pass/call/guard · J: crossover/steal · L: block. Pause, timeouts, subs and Credits are inside the court."})]}) :
      html ? (0,s.jsx)("iframe",{id:"courtside-frame",ref:iframe,title:"Courtside basketball",sandbox:"allow-scripts allow-popups allow-popups-to-escape-sandbox",srcDoc:html,allow:"autoplay; fullscreen"}) : (0,s.jsx)("div",{className:"courtside-loading",children:"Preparing the arena…"}),
    result&&(0,s.jsxs)("footer",{className:"courtside-result",children:[
      (0,s.jsx)("strong",{children:`Official final: ${result.score[0]} – ${result.score[1]}`}),
      (0,s.jsx)("span",{children:`Played ${result.actual.score[0]} – ${result.actual.score[1]} · ${half/60}-minute halves`}),
      (0,s.jsx)(X,{primary:true,disabled:busy,onClick:save,children:busy?"Saving…":"Save official result to season"})]}),
    abandon&&(0,s.jsxs)("div",{className:"courtside-confirm",children:[(0,s.jsxs)("div",{children:[
      (0,s.jsx)("h2",{children:"Abandon this game?"}), (0,s.jsx)("p",{children:"This removes the court checkpoint. Your schedule, season stats and record will stay as they were before tipoff."}),
      (0,s.jsx)(X,{onClick:()=>setAbandon(false),children:"Keep playing"}),
      (0,s.jsx)(X,{onClick:()=>{localStorage.removeItem(Gn+"-courtside");onClose();},children:"Abandon game"})]})]})
  ]});
}
