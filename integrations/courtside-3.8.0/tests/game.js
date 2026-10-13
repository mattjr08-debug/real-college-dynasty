// Standalone Pixel Hoops checks. Uses a temporary browser profile, no career saves.
const path = require("path");
const { chromium } = require("playwright-core");

(async () => {
  const browser = await chromium.launch({
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: true,
  });
  const errors = [];
  const check = (ok, label) => {
    if (!ok) throw new Error(label);
    console.log("PASS " + label);
  };
  try {
    const page = await browser.newPage({
      viewport: { width: 1200, height: 900 },
    });
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(
      "file://" + path.resolve(__dirname, "../basketball-game.html"),
    );
    await page.screenshot({ path: "/tmp/pixel-hoops-menu-desktop.png" });
    // College Dynasty 3.9.0 added random shooting fouls, non-shooting fouls and live-ball turnovers (courtTune). These checks are about the original mechanics
    // (a missed shot is a rebound, a block is a block), so they run with those switched off; tests/court-realism.js covers the new ones.
    await page.evaluate(() => { window.courtTuneOverride = { sfScale: 0, nfScale: 0, toScale: 0 }; });
    check(await page.evaluate(()=>{
      for(const team of [0,1])for(const range of [18,48,95,140,220])for(let trial=0;trial<40;trial++){
        reset();state.started=true;state.inbound=0;state.owner=team*5;const p=state.players[state.owner];p.x=team?37+range:443-range;p.y=140;p.energy=.15;p.attrs[0]=p.attrs[1]=p.attrs[2]=10;
        if(range===18)p.attrs[0]=p.attrs[14]=65;
        const defender=state.players[(1-team)*5];defender.x=p.x+3;defender.y=p.y;defender.vx=defender.vy=0;defender.reach=0;
        const meter=shotMeter(p);state.charge=meter.peak;releaseShot();
        if(!state.flight?.made||state.flight.release!=="PERFECT")return false;
        flightStep(1);if(state.score[team]!==meter.points||p.box.fgm!==1)return false;
      }return true;
    }),'perfect releases always score across five shot types, both teams, low ratings, fatigue and heavy contests');
    check(await page.evaluate(()=>{
      reset();state.started=true;state.inbound=0;const p=state.players[0];p.x=350;p.y=140;state.charge=shotMeter(p).peak;releaseShot();
      const q=state.players[5];q.x=p.x;q.y=p.y;q.jump=.3;q.blocking=true;state.flight.fouled=null;flightStep(.05);
      return state.flight===null&&state.score[0]===0&&q.box.blk===1&&p.box.fga===1&&p.box.fgm===0;
    }),'a legal block still stops a perfect release and credits the block');
    check(await page.evaluate(()=>{
      reset();state.started=true;state.inbound=0;const p=state.players[0];p.attrs[3]=1;p.energy=.1;
      for(let i=0;i<100;i++){state.freeThrows={shooter:0,remaining:1,stage:"ready",wait:0};state.owner=0;state.charge=shotMeter(p).peak;releaseShot();if(!state.flight?.made)return false;completeFreeThrow(state.flight);}
      state.freeThrows={shooter:0,remaining:1,stage:"ready",wait:0};releaseFreeThrow(-1);
      return p.box.ftm===100&&state.score[0]===100&&!state.flight.made;
    }),'perfect free throws always count at low ratings; attempt-time violations still miss');
    check(await page.evaluate(()=>{
      reset();const p=state.players[0];p.x=303;p.y=140;state.players.slice(5).forEach(q=>{q.x=20;q.y=20;});p.attrs[2]=95;p.energy=1;
      const strong=shotMeter(p).green;p.attrs[2]=20;const weak=shotMeter(p).green;p.attrs[2]=95;p.energy=.1;const tired=shotMeter(p).green;p.energy=1;state.players[5].x=p.x+5;state.players[5].y=p.y;const contested=shotMeter(p).green;
      state.players[5].x=20;state.players[5].y=20;p.x=223;const deep=shotMeter(p).green;
      return strong>weak&&strong>tired&&strong>contested&&strong>deep&&releaseQuality(shotMeter(p).peak+shotMeter(p).green+.01,shotMeter(p))<1;
    }),'ratings, fatigue, contests and deeper range narrow the same visible perfect window used by shooting');
    check(await page.evaluate(()=>{
      let misses=0;for(let i=0;i<100;i++){reset();state.started=true;state.inbound=0;state.seed=i+1;const p=state.players[0];p.x=223;p.y=140;p.attrs[2]=10;p.energy=.1;shoot(.6,"EARLY");if(!state.flight.made)misses++;}return misses>30;
    }),'early releases retain attribute-based make probability rather than the perfect-release guarantee');

    check(await page.evaluate(()=>{
      reset();state.started=true;state.inbound=0;state.selected=0;state.players.forEach((p,i)=>{p.x=390+i%5*8;p.y=60+i%5*35;});const before=state.players.map(p=>({x:p.x,y:p.y}));possession(1,true);
      if(state.players.some((p,i)=>distance(p,before[i])>.001))return false;
      let smooth=true;for(let k=0;k<150&&state.inbound;k++){const prior=state.players.map(p=>({x:p.x,y:p.y}));step(1/60);smooth=smooth&&state.players.every((p,i)=>p.disqualified||distance(p,prior[i])<3);}
      return smooth&&!state.inbound&&state.inboundCount===5&&state.players[0].x<before[0].x-60&&Math.abs(state.players[state.owner].x-469)<.5&&state.time===1200;
    }),'post-basket defenders run back, inbounder reaches baseline without snapping, clocks/count stay stopped during setup');
    check(await page.evaluate(()=>{
      reset();state.started=true;state.inbound=0;state.players.forEach(p=>{p.x=420;p.y=140;});possession(0,true);
      for(let k=0;k<120;k++)step(1/60);if(state.inbound<=0||state.inboundCount!==5||state.players[state.owner].x<=11)return false;
      for(let k=0;k<600&&state.inbound;k++)step(1/60);if(state.inbound)return false;const team=state.attack;for(let k=0;k<330&&state.attack===team;k++)step(1/60);return state.attack!==team&&state.players[0].box.to===1;
    }),'long inbound walks finish naturally and the five-second violation begins only after reaching the spot');
    check(await page.evaluate(()=>{
      reset();state.started=true;state.inbound=0;const before=state.players.map(p=>({x:p.x,y:p.y}));startFreeThrows(0,2);if(state.players.some((p,i)=>distance(p,before[i])>.001))return false;
      const time=state.time;down(' ');up(' ');if(state.charge!==null)return false;let bounded=true;for(let k=0;k<150&&state.freeThrows.setupTargets;k++){const prior=state.players.map(p=>({x:p.x,y:p.y}));step(.05);bounded=bounded&&state.players.every((p,i)=>distance(p,prior[i])<7);}
      return bounded&&!state.freeThrows.setupTargets&&state.freeThrows.wait===0&&state.time===time;
    }),'free-throw players walk to lane positions with bounded movement and no premature attempt timer');
    check(await page.evaluate(()=>{
      reset();state.started=true;state.inbound=0;state.players[0].x=398;state.players[0].y=140;shoot(1);state.flight.dunk=true;state.flight.shotType='DUNK';let smooth=true;
      for(let k=0;k<25&&state.flight;k++){const p=state.players[0],before={x:p.x,y:p.y};flightStep(1/60);smooth=smooth&&distance(p,before)<3&&distance(p,athleteRig(p,0).position)<.001;}
      return smooth&&state.players[0].x>398;
    }),'dunk approach moves the actual player and the rendered model together instead of sliding back after landing');
    check(await page.evaluate(()=>{
      reset();state.started=true;state.inbound=0;state.teamFouls[1]=6;const time=state.time;
      callFoul(5,0);if(callTimeout())return false;if(!state.freeThrows?.oneAndOne || state.players[5].box.pf!==1 || state.teamFouls[1]!==7)return false;
      for(let i=0;i<150&&state.freeThrows?.setupTargets;i++)step(.1);step(.8);down(" ");step(.58);up(" ");if(!state.flight?.freeThrow||state.players[0].box.fta!==1||state.time!==time)return false;
      state.flight.made=false;flightStep(1);return !state.freeThrows&&!!state.loose&&state.players[0].box.fga===0;
    }),"seventh foul gives one-and-one, a missed front end is live, Space meters the FT and clock stops");
    check(await page.evaluate(()=>{
      reset();state.started=true;state.inbound=0;state.teamFouls[1]=9;callFoul(5,0);
      if(state.freeThrows.oneAndOne||state.freeThrows.remaining!==2)return false;
      releaseFreeThrow(1);state.flight.made=false;flightStep(1);if(state.freeThrows?.remaining!==1)return false;
      releaseFreeThrow(1);state.flight.made=true;flightStep(1);
      return state.players[0].box.ftm===1&&state.players[0].box.fta===2&&state.players[0].box.pts===1&&state.score[0]===1&&state.players[0].box.fga===0&&state.attack===1&&state.awaitingInbound;
    }),"tenth foul gives two free throws and accurate FT-only scoring and exports");
    check(await page.evaluate(()=>{
      reset();state.started=true;state.inbound=0;state.teamFouls[0]=10;
      callFoul(0,5,{offensive:true});return !state.freeThrows&&state.attack===1&&state.players[0].box.to===1&&state.players[0].box.pf===1;
    }),"offensive fouls give a turnover and never award bonus free throws");
    check(await page.evaluate(()=>{
      reset();state.started=true;state.inbound=0;state.players[0].x=310;state.players[0].y=140;shoot(1);
      const points=state.flight.points;state.flight.fouled=5;state.flight.made=false;flightStep(1);
      if(state.players[0].box.fga!==0||state.players[0].box.tpa!==0||state.freeThrows?.remaining!==points)return false;
      reset();state.started=true;state.inbound=0;state.players[0].x=410;state.players[0].y=140;shoot(1);state.flight.fouled=5;state.flight.made=true;flightStep(1);
      return state.players[0].box.fgm===1&&state.freeThrows?.remaining===1&&state.score[0]===2;
    }),"missed fouled shots do not count as field attempts; made fouled baskets get an and-one");
    check(await page.evaluate(()=>{
      reset();state.started=true;state.inbound=0;const old=state.players[5].id;state.players[5].box.pf=4;callFoul(5,0);
      const out=state.bench[1].find(p=>p.id===old);if(!out?.disqualified||out.box.pf!==5||state.players[5].id===old)return false;
      state.inTimeout=true;state.paused=true;state.bench[0][0].disqualified=true;
      return !substitute(0,0);
    }),"fifth foul substitutes an eligible reserve, preserves stats and blocks re-entry");
    check(await page.evaluate(()=>{
      reset();state.started=true;state.inbound=0;giveBall(0);state.players[0].x=459;state.players[0].y=140;keys.add("d");step(.1);keys.clear();
      return state.attack===1&&state.players[0].box.to===1&&state.awaitingInbound&&state.resetTargets[state.owner].x===469;
    }),"dribbling across a boundary turns it over with an inbound at that edge");
    check(await page.evaluate(()=>{
      reset();state.started=true;state.inbound=0;state.owner=null;state.loose={x:459,y:140,team:0,lastTouch:5,age:0,vx:90,vy:0};step(.1);
      return state.attack===0&&state.awaitingInbound;
    }),"a defender's deflection out of bounds keeps possession with the offense");
    check(await page.evaluate(()=>{
      reset();state.started=true;state.inbound=0;state.players[0].x=300;state.players[0].y=140;
      for(const p of state.players.slice(1)){p.x=100;p.y=80;}down(" ");keys.add("d");for(let i=0;i<70&&state.attack===0;i++)step(1/60);keys.clear();
      return state.attack===1&&state.awaitingInbound&&state.players[0].box.to===1;
    }),"moving too far after the shot gather causes traveling instead of infinite carried-ball movement");
    check(await page.evaluate(()=>{
      reset();state.started=true;state.inbound=0;state.players[0].x=350;state.players[0].y=140;shoot(1);
      const f=state.flight;f.dunk=false;f.t=f.duration*.998;const p=state.players[5];p.x=f.to.x;p.y=f.to.y;p.height=84;p.jump=.25;p.blocking=true;
      if(!checkGoaltending(f)||state.score[0]!==f.points||state.players[5].box.blk!==0)return false;
      reset();state.started=true;state.inbound=0;state.players[0].x=350;state.players[0].y=140;shoot(1);
      const g=state.flight;g.t=g.duration*.998;const q=state.players[1];q.x=g.to.x;q.y=g.to.y;q.height=84;q.jump=.25;q.blocking=true;
      return checkGoaltending(g)&&state.score[0]===0&&state.attack===1&&q.box.to===1;
    }),"late defensive touches award the basket; offensive interference awards no points or block");
    check(await page.evaluate(()=>{
      reset();state.started=true;state.inbound=0;callFoul(5,0,{shooting:true,points:2});state.foulPause=0;
      const before=state.time;pause();step(2);if(state.freeThrows.wait!==0||state.time!==before)return false;pause();
      state.lockedPlayer=1;for(let i=0;i<150&&state.freeThrows?.setupTargets;i++)step(.1);step(1);if(!state.flight?.freeThrow)return false;
      return state.time===before;
    }),"pause freezes free throws and off-ball player-lock teammates take their own free throws");
    check(await page.evaluate(()=>{
      reset();state.started=true;state.inbound=0;
      const p=state.players[0];p.attrs[3]=30;startFreeThrows(0,1);const narrow=shotMeter(p).green;
      let weak=0,strong=0;for(const [ratingValue,key] of [[30,"weak"],[95,"strong"]]){state.seed=777;p.attrs[3]=ratingValue;for(let i=0;i<600;i++){state.freeThrows={shooter:0,remaining:1,stage:"ready",wait:0};releaseFreeThrow(.6);if(state.flight.made){if(key==="weak")weak++;else strong++;}}}
      return strong>weak+120&&shotMeter(p).green>narrow;
    }),"free-throw ratings affect both success probability and meter difficulty");
    check(await page.evaluate(()=>{
      reset();state.started=true;state.inbound=0;const p=state.players[0];
      const actions=["pass","catch","crossover","shoot","layup","dunk","block","rebound","steal","foul","contact","celebrate","landing"];
      for(const action of actions){animate(0,action,.5);const pose=animationPose(p,0);if(pose.name!==action||!Number.isFinite(pose.t))return false;draw();}
      updateAnimations(.6);if(p.animation)return false;
      for(const mode of ["idle","run","sprint","defense","dribble","gather","inbound","screen","cut","freeThrow","laneWait"]){p.animation=null;state.owner=mode==="dribble"||mode==="gather"||mode==="inbound"?0:1;state.attack=mode==="defense"?1:0;p.vx=mode==="run"?50:mode==="sprint"?120:0;p.vy=0;state.charge=mode==="gather"?0:null;state.awaitingInbound=mode==="inbound";state.play=mode==="screen"?{screener:0}:null;state.cutter=mode==="cut"?{index:0}:null;state.freeThrows=mode==="freeThrow"||mode==="laneWait"?{shooter:mode==="freeThrow"?0:1}:null;if(animationPose(p,0).name!==mode)return false;draw();}
      return CollegeDynastyBasketball.graphicsInfo().drawCalls<4000;
    }),"every gameplay action has a renderable shared pose with bounded drawing cost");
    check(await page.evaluate(()=>{
      reset();state.started=true;state.inbound=0;state.period=2;state.time=0;callFoul(5,0,{shooting:true,points:2});state.foulPause=0;
      releaseFreeThrow(1);state.flight.made=true;flightStep(1);releaseFreeThrow(1);state.flight.made=true;flightStep(1);
      for(let i=0;i<30&&!state.over;i++)step(.1);
      return state.over && state.finalResult.actual.score[0]===2 && state.finalResult.actual.box[0].ftm===2 && state.finalResult.actual.opponentBox[0].pf===1 && state.finalResult.actual.teamStats[0].freeThrowsMade===2;
    }),"free throws awarded at the buzzer finish before final scores and foul/FT exports are frozen");
    check(await page.evaluate(()=>{
      reset();state.started=true;state.inbound=0;state.bench[1]=[];state.players[5].box.pf=4;callFoul(5,0);
      if(!state.players[5].disqualified)return false;possession(1,true);
      for(let i=0;i<35;i++)step(.1);
      return state.owner!==5 && state.players[5].box.pf===5 && state.players[5].box.min===0;
    }),"without reserves a fouled-out player stays inactive and an eligible teammate inbounds");
    check(await page.evaluate(()=>{
      reset();state.started=true;state.inbound=0;state.players[0].x=410;state.players[0].y=140;shoot(1);state.flight.fouled=5;
      const p=state.players[5];p.x=410;p.y=140;p.jump=.3;p.blocking=true;flightStep(.05);
      return state.freeThrows?.remaining===2 && state.players[0].box.fga===0 && p.box.blk===0 && p.box.pf===1;
    }),"illegal shooting contact still awards free throws when the shot is blocked");
    check(await page.evaluate(()=>{
      reset();state.started=true;state.inbound=0;const p=state.players[0];p.animation=null;const low=athleteRig(p,0);
      if(low.crouch<.5||low.pose.lean<.15||low.ballHand[1]-low.crouch>2.05)return false;
      state.owner=5;state.attack=1;p.vx=75;p.motionPhase=Math.PI/2;const defense=athleteRig(p,0);
      if(defense.crouch<.6||Math.abs(defense.legs[0].foot[0]-defense.legs[1].foot[0])<1.4)return false;
      reset();state.started=true;state.inbound=0;state.players[0].x=410;state.players[0].y=140;shoot(1);state.flight.shotType="LAYUP";state.flight.dunk=false;state.flight.t=state.flight.duration*.65;
      const layup=athleteRig(state.players[0],0);state.flight.dunk=true;state.flight.t=state.flight.duration*.85;const dunk=athleteRig(state.players[0],0);
      const maxY=r=>Math.max(...r.arms.map(a=>a.hand[1]));
      return layup.finish&&dunk.finish&&Math.abs(layup.arms[0].hand[1]-layup.arms[1].hand[1])>2&&Math.abs(dunk.arms[0].hand[1]-dunk.arms[1].hand[1])<.01&&dunk.lift+maxY(dunk)*(state.players[0].height/76)>=10&&layup.legs.some(l=>l.knee[1]>2);
    }),"low dribbling, lateral defense, one-hand knee-drive layups and two-hand rim-height dunks use distinct rigs");
    check(await page.evaluate(()=>{
      reset();state.started=true;state.inbound=0;const p=state.players[0];
      for(const action of ["dribble","defense","crossover","gather","pass","catch","shoot","layup","dunk","landing","block","rebound","screen","steal"]){animate(0,action,.6);for(let k=0;k<6;k++){p.animation.remaining=.6-k*.1;const r=athleteRig(p,0);if(![r.lift,r.crouch,...r.legs.flatMap(l=>[...l.hip,...l.knee,...l.foot]),...r.arms.flatMap(a=>[...a.shoulder,...a.elbow,...a.hand])].every(Number.isFinite))return false;draw();}}
      return CollegeDynastyBasketball.graphicsInfo().drawCalls<4000;
    }),"all articulated rig phases render with finite joints inside the graphics budget");
    check(await page.evaluate(()=>{
      reset();state.started=true;state.inbound=0;const p=state.players[0];p.animation=null;const seed=state.seed;
      keys.add("d");updateDribbleHand(p,.2);keys.clear();if(p.dribbleSide!==1)return false;
      keys.add("a");updateDribbleHand(p,.02);keys.clear();if(p.dribbleSide!==-1||p.handBlend<=-1||p.handBlend>=1)return false;
      updateDribbleHand(p,.5);if(p.handBlend>-.95)return false;
      keys.add("w");updateDribbleHand(p,.2);keys.clear();if(p.dribbleSide!==1)return false;
      keys.add("s");updateDribbleHand(p,.2);keys.clear();if(p.dribbleSide!==-1)return false;
      const ball=athleteRig(p,0).ballHand;if(ball[0]>=0)return false;
      const held=p.dribbleSide;updateDribbleHand(p,.1);
      return p.dribbleSide===held&&state.seed===seed;
    }),"movement chooses the dribble hand, side changes interpolate and idle preserves the hand without consuming RNG");
    check(await page.evaluate(()=>{
      reset();const p=state.players[5];p.vx=70;p.vy=0;updateDribbleHand(p,.5);if(p.dribbleSide!==1)return false;
      p.vx=-70;updateDribbleHand(p,.5);if(p.dribbleSide!==-1)return false;
      p.vx=0;p.vy=70;updateDribbleHand(p,.5);return p.dribbleSide===1&&Math.abs(p.handBlend)<=1;
    }),"AI movement changes dribble hands with the same directional rule");
    await page.evaluate(()=>reset());

    check(await page.evaluate(()=>{
      reset();state.started=true;state.inbound=0;
      state.players[0].x=100;giveBall(0,30,true);state.backcourtSeconds=.01;
      if(!checkBackcourt(.02)||state.attack!==1||!state.awaitingInbound||state.players[0].box.to!==1)return false;
      reset();state.started=true;state.inbound=0;state.players[0].x=300;giveBall(0,30,true);
      if(checkBackcourt(.1))return false;state.players[0].x=200;
      return checkBackcourt(.1)&&state.attack===1&&state.players[0].box.to===1;
    }), "ten-second advancement and returning to the backcourt cause turnovers and mandatory inbounds");
    check(await page.evaluate(()=>{
      reset();state.started=true;state.inbound=0;state.players[0].x=100;giveBall(0,23,true);state.backcourtSeconds=2;
      callTimeout();const ok=state.backcourtSeconds===10&&state.shotClock===23;ui.start.onclick();return ok;
    }), "a timeout resets the backcourt count while preserving the shot clock");
    check(await page.evaluate(()=>{
      reset();state.started=true;state.inbound=0;state.players[0].x=410;state.players[0].y=140;
      shoot(1);state.flight.made=false;flightStep(1);
      if(!state.loose||state.shotClock!==20||!state.loose.rim)return false;
      const rebound=state.players[0];rebound.x=state.loose.x;rebound.y=state.loose.y;
      for(const p of state.players.slice(1)){p.x=90;p.y=80;}state.loose.age=.3;
      step(1/60);if(state.owner!==0||state.shotClock!==20)return false;
      reset();state.started=true;state.inbound=0;state.players[0].x=410;state.players[0].y=140;
      state.shotClock=7;shoot(1);state.players[5].x=410;state.players[5].y=140;state.players[5].blocking=true;state.players[5].jump=.3;flightStep(.05);
      return state.loose?.rim===false&&state.shotClock===7;
    }), "offensive rim rebounds use 20 seconds and blocked shots preserve the prior clock");
    await page.evaluate(()=>reset());
    check(await page.evaluate(()=>!document.getElementById('camera-view')&&typeof arena3D==='undefined'&&typeof createArena3D==='undefined'),"the pixel court has one fixed view: no camera button and no 3D renderer");

    check(await page.evaluate(()=>{draw();const g=CollegeDynastyBasketball.graphicsInfo();return g.renderer.startsWith('Pixel')&&g.width===480&&g.height===280&&g.drawCalls>0&&g.drawCalls<4000;}),"the pixel court draws at a fixed 480 x 280 resolution with a bounded number of drawing operations");
    
    check(await page.evaluate(()=>{reset();state.started=true;state.paused=true;const seed=state.seed;for(const name of ['idle','run','sprint','dribble','defense','crossover','pass','catch','shoot','gather','layup','dunk','block','rebound','steal','screen','cut','inbound','freeThrow','laneWait','foul','contact','landing','celebrate']){animate(0,name,1);for(let k=0;k<3;k++)draw();}const g=CollegeDynastyBasketball.graphicsInfo(),ok=state.seed===seed&&g.drawCalls<4000;reset();return ok;}),"pixel players draw every action state without gameplay randomness");
    check(await page.evaluate(()=>{const c=document.getElementById('asset-credits');return !!c&&/pixel art/i.test(c.textContent)&&/Press Start 2P/.test(c.textContent);}),"the pixel art and the pixel typeface are credited in the court");
    check(await page.evaluate(()=>{
      const config=JSON.parse(JSON.stringify(match||{gid:'appearance-test',year:2026,seed:777,teams:standaloneTeams}));config.teams[0].players[0].skinColor='#784c32';config.teams[0].players[0].hairColor='#23120c';
      const clean=validateMatch(config),p=clean.teams[0].players[0],a=playerAppearance(p),seed=state.seed;playerAppearance(p);
      config.teams[0].players[0].skinColor='red';let rejected=false;try{validateMatch(config);}catch{rejected=true;}
      return a.skin==='#784c32'&&a.hair==='#23120c'&&state.seed===seed&&rejected&&JSON.stringify(playerAppearance({id:'stable-human'}))===JSON.stringify(playerAppearance({id:'stable-human'}));
    }),'host can set valid skin/hair colors; fallback appearance is stable and consumes no game randomness');
    const logoMatch=JSON.parse(require('fs').readFileSync(path.resolve(__dirname,'../example-match.json'),'utf8'));
    await page.evaluate(config=>{window.brandingPreviousMatch=match;config.homeTeam=1;config.teams[0].logo='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#0000ff"/></svg>');config.teams[1].logo='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#ff0000"/></svg>');CollegeDynastyBasketball.loadMatch(config);pxBackdropKey='';},logoMatch);
    await page.waitForFunction(()=>courtLogo.status==='loaded');
    check(await page.evaluate(()=>{pxBackdropKey='';drawPixel();const pixel=pxBackdrop.getContext('2d').getImageData(240,140,1,1).data;const c=CollegeDynastyBasketball.getCourtIdentity();return c.homeTeam===1&&c.name==='Demo Away'&&pixel[0]>245&&pixel[1]<10&&pixel[2]<10;}),'away schedule uses opponent home logo as the decoded center-court image');
    await page.evaluate(()=>{const config=JSON.parse(JSON.stringify(match));config.homeTeam=0;CollegeDynastyBasketball.loadMatch(config);pxBackdropKey='';});
    await page.waitForFunction(()=>courtLogo.status==='loaded'&&courtIdentity().homeTeam===0);
    check(await page.evaluate(()=>{pxBackdropKey='';drawPixel();const pixel=pxBackdrop.getContext('2d').getImageData(240,140,1,1).data;return pixel[2]>245&&pixel[0]<10&&CollegeDynastyBasketball.getCourtIdentity().name==='Demo Home';}),'loading the next home game replaces the old logo without a stale texture');
    check(await page.evaluate(()=>{const config=JSON.parse(JSON.stringify(match));config.homeTeam=null;CollegeDynastyBasketball.loadMatch(config);pxBackdropKey='';const identity=CollegeDynastyBasketball.getCourtIdentity();let rejected=false;try{CollegeDynastyBasketball.loadMatch({...config,homeTeam:2});}catch(e){rejected=true;}const ok=identity.homeTeam===null&&identity.name==='NEUTRAL COURT'&&!courtLogo.image&&rejected;match=window.brandingPreviousMatch;delete window.brandingPreviousMatch;reset();return ok;}),'neutral venues clear school branding and invalid home indices are rejected');
    check(await page.evaluate(()=>{state.players[state.owner].x=410;for(let i=0;i<10;i++){draw();}const projected=playerScreenPoint(state.players[state.owner]);return Number.isFinite(projected.x)&&Number.isFinite(projected.y)&&projected.x>0&&projected.x<480;}),"players map to clickable screen coordinates");

    check(await page.evaluate(() => {
      reset(); state.started = true; state.cooldown = 999;
      state.players[0].x = 280; state.players[0].y = 140;
      down("i"); up("i");
      if (!state.isolation || state.play || state.cutter) return false;
      const target = {x:340,y:48};
      const before = distance(state.players[1],target);
      step(.1);
      if (distance(state.players[1],target) >= before) return false;
      pass(1); flightStep(1);
      if (state.isolation) return false;
      state.flight = null; giveBall(0); state.inbound = 0;
      callIsolation(); callScreen();
      if (state.isolation || !state.play) return false;
      state.screenCooldown[0] = 0; state.play = null;
      callIsolation(); advancePlays(6.1);
      return !state.isolation;
    }), "isolation spreads teammates, ends on a pass or timeout, and yields to a screen");
    check(await page.evaluate(() => {
      reset(); state.started = true;
      down("t"); up("t"); if (state.defense !== "tight") return false;
      down("t"); up("t"); if (state.defense !== "paint") return false;
      down("t"); up("t"); if (state.defense !== "balanced") return false;
      state.paused = true; down("t"); up("t");
      return state.defense === "balanced";
    }), "defensive styles cycle and respect pause");
    check(await page.evaluate(() => {
      const run = defense => {
        reset(); state.started = true; state.defense = defense;
        giveBall(5); state.inbound = 0; state.cooldown = 999;
        state.players[5].x = 240; state.players[5].y = 140;
        for (let i=0;i<5;i++) {state.players[i].x=120;state.players[i].y=50+i*40;}
        state.players[0].x=190;state.players[0].y=140;
        state.selected = 0; state.guardBall = true;
        state.aiCharge = {t:999,quality:0};
        for (let i=0;i<40;i++) step(.05);
        return {gap:distance(state.players[0],state.players[5]),energy:state.players[1].energy};
      };
      const tight=run("tight"), paint=run("paint");
      return tight.gap + 8 < paint.gap && tight.energy < paint.energy;
    }), "tight defense closes the gap and drains more teammate energy than paint defense");
    check(await page.evaluate(() => {
      reset(); state.started = true; giveBall(5); state.inbound = 0;
      state.selected=0;
      state.players[5].x=310;state.players[5].y=140;
      state.players[0].x=295;state.players[0].y=140;
      state.players[1].x=305;state.players[1].y=165;
      for (let i=2;i<5;i++) {state.players[i].x=440;state.players[i].y=230;}
      for (let i=6;i<10;i++) {state.players[i].x=440;state.players[i].y=230;}
      state.players[6].x=180;state.players[6].y=140;
      down("g"); up("g");
      if (state.doubleTeam?.helper !== 1 || state.doubleCooldown !== 8) return false;
      const command=state.doubleTeam; callDoubleTeam();
      if (state.doubleTeam !== command) return false;
      state.aiTime=1;state.aiDecision=0; aiStep(.1);
      if (state.flight?.type !== "pass" || state.flight.target !== 6) return false;
      state.flight=null;giveBall(0);
      return state.doubleTeam === null;
    }), "double-team selects a helper, has a cooldown, invites an AI escape pass, and clears on turnover");
    await page.locator("#player-lock").selectOption("4");
    check(await page.evaluate(() => {
      reset(); state.started=true; state.inbound=0;
      if(state.lockedPlayer!==4 || state.selected!==4) return false;
      state.players[4].energy=.6;giveBall(0);
      if(state.selected!==4 || state.stamina!==.6) return false;
      down(" ");up(" ");down("j");up("j");
      if(state.charge!==null || state.crossTime!==0) return false;
      for(let i=5;i<10;i++){state.players[i].x=440;state.players[i].y=230;}
      state.players[0].x=100;state.players[0].y=140;
      state.players[4].x=200;state.players[4].y=140;
      down("k");up("k");
      if(state.flight?.target!==4 || state.selected!==4) return false;
      flightStep(1);
      if(state.owner!==4 || state.selected!==4) return false;
      pass(1);flightStep(1);
      if(state.owner!==1 || state.selected!==4) return false;
      giveBall(5); state.players[0].x=state.players[5].x-10;
      down("k");up("k");down("f");up("f");
      if(state.selected!==4) return false;
      possession(0,true);
      return state.selected===4 && state.awaitingInbound;
    }), "player lock persists through passes, defensive guarding and inbounds; off-ball K calls for the ball");
    check(await page.evaluate(() => {
      reset();state.started=true;state.inbound=0;giveBall(0);
      state.players[0].x=400;state.players[0].y=140;
      for(let i=5;i<10;i++){state.players[i].x=30;state.players[i].y=230;}
      state.aiTime=2;state.aiDecision=0;
      aiStep(.1); if(!state.aiCharge || state.selected!==4) return false;
      aiStep(.5); if(state.flight?.type!=="shot" || state.flight.team!==0) return false;
      state.flight=null;possession(0,true);state.inbound=0;
      for(let i=0;i<22;i++)step(.1);
      if(state.awaitingInbound || state.selected!==4 || state.players[state.owner]?.team!==0) return false;
      state.requestCooldown=0;state.owner=0;state.players[4].x=200;state.players[4].y=140;
      state.players[5].x=200;state.players[5].y=140;
      down("k");up("k");
      if(state.flight?.type!=="pass" || state.flight.target!==4 || state.selected!==4) return false;
      setPlayerLock(-1);giveBall(1);
      return state.selected===1 && state.lockedPlayer===-1;
    }), "off-ball teammates shoot and inbound automatically, K attempts a pass even when covered, and team control can resume");
    check(await page.evaluate(() => {
      reset();state.started=true;setPlayerLock(4);state.period=2;state.time=120;state.seed=4242;
      let stable=true;
      for(let i=0;i<100000 && !state.over;i++) {
        if(state.awaitingInbound && !state.inbound && state.owner===4 && !state.flight)pass(0);
        step(.1);stable = stable && state.selected===4;
      }
      const ok=state.over && stable && state.stats[0].attempts>0 && state.stats[1].attempts>0;
      setPlayerLock(-1);reset();
      return ok;
    }), "a locked-player game finishes with teammate offense and no automatic control switches");
    check(await page.evaluate(() => {
      reset();state.started=true;giveBall(5);state.selected=2;
      if(guardAssignment()!==7)return false;
      guardBall();if(guardAssignment()!==5)return false;
      setPlayerLock(1);state.guardBall=false;
      if(guardAssignment()!==6)return false;
      state.guardBall=true;state.owner=null;state.flight={type:"pass",team:1,target:8};
      if(guardAssignment()!==8)return false;
      state.flight={type:"shot",team:1};if(guardAssignment()!==null)return false;
      state.flight=null;state.loose={x:200,y:140};if(guardAssignment()!==null)return false;
      state.loose=null;giveBall(0);if(guardAssignment()!==null)return false;
      setPlayerLock(-1);reset();return true;
    }), "guard arrow follows positional assignments, K guarding and player lock; hides on offense and rebounds");
    check(await page.evaluate(() => {
      for(const seconds of [900,600,300]) {
        ui.length.value=String(seconds);reset();
        if(state.time!==seconds || state.halfSeconds!==seconds)return false;
        state.started=true;halftime();ui.start.onclick();
        if(state.period!==2 || state.time!==seconds)return false;
        state.score=[20,15];
        state.players[0].box={...emptyBox(),pts:20,fgm:10,fga:20,min:seconds*2/60};
        state.players[5].box={...emptyBox(),pts:15,fgm:5,fga:12,tpm:5,tpa:8,min:seconds*2/60};
        finish();const result=window.CollegeDynastyBasketball.getResult();
        if(Math.abs(result.adjustmentFactor-1200/seconds)>.0001 || result.actual.score[0]!==20)return false;
        if(result.score[0]!==result.box.reduce((a,p)=>a+p.pts,0) || result.score[0]<=result.score[1])return false;
        if(result.box.some(p=>p.pts!==2*p.fgm+p.tpm+p.ftm || p.fga<p.fgm || p.tpa<p.tpm))return false;
        if(document.querySelectorAll("#final-box tbody tr").length!==10)return false;
        renderFinalStats(false);
        if(!document.querySelector("#final-box .box-note").textContent.includes("Played score: 20"))return false;
      }
      ui.length.value="1200";reset();return true;
    }), "15/10/5-minute halves resume correctly; official adjusted stats retain actual boxes and match shooting totals");
    await page.locator("#offense-style").selectOption("Perimeter");
    await page.locator("#defense-style").selectOption("paint");
    check(await page.evaluate(() => {
      if(state.offense!=="Perimeter" || state.defense!=="paint")return false;
      state.started=true;giveBall(5);state.selected=2;
      if(guardAssignment()!==state.players.indexOf(zoneMark(state.players[2])))return false;
      const pref=shotPreference(state.players[0]);state.offense="Inside-out";
      const ok=pref>shotPreference(state.players[0]) && document.querySelector('[data-key="i"]')!==null;
      reset();return ok;
    }), "College Dynasty offense/defense selectors affect shooting preference and zone assignment while keeping Isolation");
    check(await page.evaluate(() => {
      reset();state.started=true;state.inbound=0;
      down("j");up("j");if(state.crossTime!==.25 || state.charge!==null)return false;
      reset();state.started=true;giveBall(5);state.cooldown=0;state.selected=0;
      state.players[0].x=216;state.players[0].y=140;state.players[5].x=200;state.players[5].y=140;
      state.players[0].attrs[8]=99;state.players[5].attrs[4]=0;state.seed=1;
      down("j");up("j");return state.owner===0 && state.stats[0].steals===1;
    }), "J crosses on offense and attempts a steal on defense without shooting");
    check(await page.evaluate(() => {
      reset();state.started=true;state.inbound=0;state.cooldown=999;
      state.players[0].x=390;state.players[0].y=140;
      for(let i=5;i<10;i++){state.players[i].x=30;state.players[i].y=230;}
      keys.add("d");down(" ");up(" ");
      if(state.flight || state.pendingSpaceRelease<=0)return false;
      step(.1);down(" ");
      if(!state.dunkAttempt || shotMeter(state.players[0]).label!=="DUNK")return false;
      state.charge=shotMeter(state.players[0]).peak;up(" ");keys.clear();
      if(state.flight?.shotType!=="DUNK" || state.flight.quality!==1)return false;
      reset();state.started=true;state.inbound=0;state.players[0].x=300;
      keys.add("d");down(" ");up(" ");state.tick+=.1;down(" ");
      const outside=!state.dunkAttempt;keys.clear();reset();return outside;
    }), "double-tap Space while driving in layup range opens a timed dunk; outside the paint it does not");
    check(await page.evaluate(() => {
      reset();state.started=true;state.inbound=0;
      const count=state.timeoutRemaining[0];pause();
      if(state.timeoutRemaining[0]!==count || ui.title.textContent!=="PAUSED.")return false;
      if(substitute(0,0))return false;
      pause();state.players[0].box.pts=7;state.players[0].box.min=4;
      const oldId=state.players[0].id,benchId=state.bench[0][0].id;
      if(!callTimeout() || state.timeoutRemaining[0]!==3)return false;
      const time=state.time,clock=state.shotClock;step(1);
      if(state.time!==time || state.shotClock!==clock)return false;
      if(!document.querySelector('#adjustments select[aria-label="Pace (halftime only)"]').disabled)return false;
      if(!substitute(0,0) || state.players[0].id!==benchId || state.bench[0][0].id!==oldId || state.bench[0][0].box.pts!==7)return false;
      ui.start.onclick();if(state.paused || state.inTimeout)return false;
      for(let i=0;i<3;i++){if(!callTimeout())return false;ui.start.onclick();}
      if(callTimeout() || state.timeoutRemaining[0]!==0)return false;
      reset();state.started=true;halftime();
      const pace=document.querySelector('#adjustments select[aria-label="Pace (halftime only)"]');
      if(pace.disabled)return false;pace.value="Fast";pace.dispatchEvent(new Event("change"));
      ui.start.onclick();
      const ok=state.timeoutRemaining.every(n=>n===3) && state.pace==="Fast";
      reset();return ok;
    }), "pause spends no timeout; four limited timeouts allow subs, preserve player boxes and carry only three to half two");
    const attributes = await page.evaluate(() => {
      const strips = (handling, steals) => {
        reset();
        state.seed = 4242;
        state.players[5].attrs[4] = handling;
        state.players[0].attrs[8] = steals;
        let successes = 0;
        for (let i = 0; i < 2000; i++) {
          giveBall(5);
          state.cooldown = state.stealCooldown = 0;
          state.players[5].x = 200; state.players[5].y = 140;
          state.players[0].x = 216; state.players[0].y = 140;
          state.selected = 0;
          steal();
          successes += state.owner === 0;
        }
        return successes / 2000;
      };
      const interceptions = (passing) => {
        reset();
        state.seed = 4242;
        state.players[0].attrs[5] = passing;
        state.players[5].attrs[8] = 70;
        state.difficulty = "normal";
        let successes = 0;
        for (let i = 0; i < 2000; i++) {
          giveBall(0);
          state.players[0].x = 100; state.players[0].y = 140;
          state.players[1].x = 200; state.players[1].y = 140;
          for (let j = 5; j < 10; j++) { state.players[j].x = 440; state.players[j].y = 240; }
          state.players[5].x = 150; state.players[5].y = 140;
          pass(1);
          flightStep(state.flight.duration / 2);
          successes += state.owner === 5;
        }
        return successes / 2000;
      };
      const shots = (three) => {
        reset();
        state.seed = 4242;
        state.players[0].attrs[2] = three;
        state.players[0].x = hoops[1].x - 140; state.players[0].y = hoops[1].y;
        for (let j = 5; j < 10; j++) state.players[j].x = 30;
        let made = 0;
        for (let i = 0; i < 2000; i++) {
          state.flight = null; state.owner = 0;
          shoot(.65);
          made += state.flight.made;
        }
        return made / 2000;
      };
      const weakHandling = strips(35, 70), strongHandling = strips(95, 70);
      const weakSteals = strips(70, 35), strongSteals = strips(70, 95);
      const weakPassing = interceptions(35), strongPassing = interceptions(95);
      const weakShooting = shots(35), strongShooting = shots(95);
      const defender = state.players[5], handler = state.players[0];
      defender.attrs[8] = 70; handler.attrs[4] = 35;
      const aiWeakHandling = stripChance(defender, handler, levels.normal.steal);
      handler.attrs[4] = 95;
      const aiStrongHandling = stripChance(defender, handler, levels.normal.steal);
      reset();
      return { weakHandling, strongHandling, weakSteals, strongSteals,
        weakPassing, strongPassing, weakShooting, strongShooting,
        aiWeakHandling, aiStrongHandling,
        varied: state.players[0].attrs[4] > state.players[4].attrs[4] + 30 };
    });
    console.log("Rating trials:", JSON.stringify(attributes));
    check(attributes.weakHandling > attributes.strongHandling * 1.7,
      "low handling is easier to strip in 2,000 seeded attempts per rating");
    check(attributes.strongSteals > attributes.weakSteals * 1.7,
      "steal rating affects actual manual steal success");
    check(attributes.aiWeakHandling > attributes.aiStrongHandling * 1.7,
      "AI uses the same handling matchup with its lower steal baseline");
    check(attributes.weakPassing > attributes.strongPassing * 1.7,
      "low passing increases interceptions in identical passing lanes");
    check(attributes.strongShooting > attributes.weakShooting + .15,
      "shooting ratings change actual shot success at equal distance and timing");
    check(attributes.varied, "standalone lineups have distinct positional attributes");

    check(
      await page.evaluate(
        () =>
          state.players.length === 10 &&
          state.players.filter((p) => p.team === 0).length === 5,
      ),
      "five players per team",
    );
    check(
      (await page.locator("header h1").count()) === 0,
      "standalone game title is removed for College Dynasty embedding",
    );
    check(
      await page.evaluate(() => {
        reset();
        state.started = true;
        giveBall(5);
        state.inbound = 0;
        state.cooldown = 999;
        const carrier = state.players[5];
        carrier.x = 300;
        carrier.y = 140;
        for (let i = 0; i < 5; i++) {
          state.players[i].x = 60;
          state.players[i].y = 50 + i * 35;
        }
        state.players[2].x = 260;
        state.players[2].y = 140;
        state.selected = 4;
        down("k");
        up("k");
        const before = distance(state.players[2], carrier);
        step(0.1);
        const switched =
          state.selected === 2 &&
          state.guardBall &&
          distance(state.players[2], carrier) < before;
        const y = state.players[2].y;
        keys.add("w");
        step(0.1);
        keys.clear();
        return switched && !state.guardBall && state.players[2].y < y;
      }),
      "K selects the nearest defender and guards the ball; movement restores manual control",
    );
    check(
      await page.evaluate(() => {
        state.players[6].x = 320;
        state.players[6].y = 220;
        state.players[1].x = 300;
        state.players[1].y = 220;
        giveBall(5);
        down("k");
        up("k");
        giveBall(6);
        const followed = state.selected === 1 && state.guardBall;
        down("k");
        up("k");
        const stayed = state.selected === 1;
        giveBall(0);
        down("k");
        up("k");
        return (
          followed &&
          stayed &&
          !state.guardBall &&
          state.flight?.type === "pass" &&
          state.flight.team === 0
        );
      }),
      "guarding follows a new ball handler, repeated K stays on ball, and K still passes on offense",
    );
    check(
      await page.evaluate(() => {
        reset();
        state.started = true;
        giveBall(5);
        state.selected = 4;
        state.paused = true;
        down("k");
        up("k");
        const unchanged = state.selected === 4 && !state.guardBall;
        state.paused = false;
        down("k");
        up("k");
        switchPlayer();
        return unchanged && !state.guardBall;
      }),
      "K respects pause and F returns to normal switching",
    );
    check(
      await page.evaluate(() => {
        reset();
        state.started = true;
        giveBall(0);
        state.inbound = 0;
        state.players[0].x = 250;
        state.players[0].y = 140;
        down("b");
        up("b");
        if (!state.play) return false;
        const play = state.play,
          screener = state.players[play.screener];
        Object.assign(screener, play.target);
        Object.assign(state.players[5], play.target);
        advancePlays(0.01);
        const rolled =
          play.phase === "roll" &&
          state.players[5].stun > 0 &&
          play.target.x === 412;
        pass(play.screener);
        return (
          rolled &&
          state.flight?.type === "pass" &&
          state.flight.target === play.screener &&
          state.screenCooldown[0] > 0
        );
      }),
      "B calls a screen, contact slows the defender, and the screener rolls for a pass",
    );
    check(
      await page.evaluate(() => {
        reset();
        state.started = true;
        giveBall(0);
        state.inbound = 0;
        down("q");
        up("q");
        if (!state.cutter) return false;
        const runner = state.players[state.cutter.index],
          x = runner.x;
        step(0.2);
        const moved = runner.x > x && state.cutCooldown > 0;
        possession(1, true);
        return moved && !state.cutter && !state.play;
      }),
      "Q sends a teammate cutting to the rim and possession changes clear set plays",
    );
    check(
      await page.evaluate(() => {
        reset();
        state.started = true;
        giveBall(0);
        state.inbound = 0;
        state.players[0].energy = 0.3;
        state.stamina = 0.3;
        state.players[1].energy = 0.9;
        giveBall(1);
        const fresh = Math.abs(state.stamina - 0.9) < 0.001;
        giveBall(0);
        const tired = Math.abs(state.stamina - 0.3) < 0.001;
        state.players[2].vx = 80;
        state.players[2].energy = 0.8;
        step(0.2);
        return fresh && tired && state.players[2].energy < 0.8;
      }),
      "stamina follows individual players and off-ball movement accumulates fatigue",
    );
    check(
      await page.evaluate(() => {
        reset();
        state.started = true;
        giveBall(5);
        state.inbound = 0;
        state.selected = 0;
        state.players[0].x = 200;
        state.players[0].y = 140;
        for (let i = 1; i < 5; i++) {
          state.players[i].x = 100;
          state.players[i].y = 140;
        }
        state.players[3].x = 280;
        keys.add("d");
        switchPlayer();
        keys.clear();
        return state.selected === 3;
      }),
      "holding a direction with F selects a defender in that direction",
    );
    check(
      await page.evaluate(() => {
        reset();
        state.started = true;
        state.seed = 4242;
        let won = 0;
        for (let i = 0; i < 2000; i++) {
          // Each reach is an independent trial, not a 2000-foul career (2000 trials, not 400: a fixed seed on a small sample can land just outside the range, College Dynasty 3.9.0).
          state.players[0].disqualified=false;state.players[0].box.pf=0;state.teamFouls=[0,0];state.freeThrows=null;state.foulPause=0;
          giveBall(5);state.inbound=0;
          state.cooldown = 0;
          state.stealCooldown = 0;
          state.players[5].x = 200;
          state.players[5].y = 140;
          state.players[0].x = 216;
          state.players[0].y = 140;
          state.selected = 0;
          steal();
          if (state.owner === 0) won++;
        }
        return won / 2000 > 0.18 && won / 2000 < 0.38;
      }),
      "manual steals succeed far less often than the old 72% chance",
    );
    check(
      await page.evaluate(() => {
        reset();
        state.started = true;
        giveBall(5);
        state.cooldown = 0;
        state.selected = 0;
        state.seed = 42;
        state.players[0].x = 100;
        state.players[0].y = 140;
        state.players[5].x = 122;
        state.players[5].y = 140;
        const seed = state.seed;
        steal();
        if (
          state.owner !== 5 ||
          state.seed !== seed ||
          state.stealCooldown !== 1.6
        )
          return false;
        steal();
        return state.seed === seed && state.owner === 5;
      }),
      "steals require close contact and cannot be spammed",
    );
    check(
      await page.evaluate(() => {
        reset();
        state.started = true;
        giveBall(0);
        state.cooldown = 0;
        state.seed = 1;
        state.players[0].x = 200;
        state.players[0].y = 140;
        for (let i = 1; i < 10; i++) {
          state.players[i].x = 430;
          state.players[i].y = 220;
        }
        state.players[5].x = 215;
        state.players[5].y = 140;
        step(1 / 60);
        if (state.aiStealCooldown !== 1.8 || state.owner !== 0) return false;
        const seed = state.seed;
        for (let i = 0; i < 40; i++) {
          state.players[5].x = state.players[0].x + 15;
          state.players[5].y = state.players[0].y;
          step(1 / 60);
        }
        return (
          state.seed === seed && state.owner === 0 && state.aiStealCooldown > 1
        );
      }),
      "computer waits between steal attempts instead of repeatedly reaching",
    );
    check(
      await page.evaluate(() => {
        reset();
        state.started = true;
        state.seed = 4000;
        state.players[0].x = 100;
        state.players[0].y = 140;
        state.players[1].x = 200;
        state.players[1].y = 140;
        for (let i = 5; i < 10; i++) {
          state.players[i].x = 430;
          state.players[i].y = 220;
        }
        state.players[5].x = 150;
        state.players[5].y = 140;
        pass(1);
        flightStep(state.flight.duration * 0.5);
        if (!state.flight || state.flight.checkedDefenders.length !== 1)
          return false;
        const seed = state.seed;
        flightStep(0.001);
        return state.seed === seed && state.owner === null;
      }),
      "a defender gets one interception chance per pass, not a new chance every frame",
    );
    check(
      await page.evaluate(() => {
        reset();
        const a = state.players[0],
          b = state.players[1],
          defender = state.players[5];
        a.x = 100;
        a.y = 140;
        b.x = 200;
        b.y = 140;
        for (let i = 5; i < 10; i++) {
          state.players[i].x = 430;
          state.players[i].y = 220;
        }
        const clear = passRisk(a, b);
        defender.x = 150;
        defender.y = 140;
        return clear === 0 && passRisk(a, b) === 1;
      }),
      "passing lane guidance identifies a defender between teammates",
    );
    check(
      await page.evaluate(
        () =>
          canvas.width === 1440 &&
          canvas.height === 840 &&
          ctx.getTransform().a === 3,
      ),
      "high-resolution drawing preserves logical court coordinates",
    );
    await page.locator("#difficulty").selectOption("hard");
    await page.locator("#length").selectOption("1200");
    await page.getByRole("button", { name: "Let’s play" }).click();
    check(
      await page.evaluate(
        () =>
          state.difficulty === "hard" &&
          state.time === 1200 &&
          state.period === 1,
      ),
      "college format begins with a 20-minute first half",
    );
    check(
      await page.evaluate(() => {
        reset();
        state.started = true;
        state.players[0].x = 220;
        state.players[0].y = 140;
        for (let i = 1; i < 10; i++) {
          state.players[i].x = 400;
          state.players[i].y = 220;
        }
        state.players[5].x = 240;
        state.players[5].y = 140;
        // Equal ratings isolate the cooldown/animation behavior in this check.
        state.players[0].attrs[4] = state.players[5].attrs[6] = 70;
        keys.add("w");
        const untouched = state.stamina;
        down("c"); up("c");
        if (state.crossCooldown !== 0 || state.stamina !== untouched) return false;
        down("j");
        up("j");
        const before = state.stamina;
        crossover();
        if (state.stamina !== before || state.players[5].stun !== 0.5)
          return false;
        for (let i = 0; i < 12; i++) step(1 / 60);
        keys.clear();
        return (
          state.players[0].y < 117 &&
          state.stamina < 1 &&
          state.crossCooldown > 2 &&
          state.players[5].stun > 0 &&
          state.owner === 0
        );
      }),
      "crossover bursts in your direction, makes nearby defenders hesitate, and costs stamina",
    );
    check(
      await page.evaluate(() => {
        reset();
        state.started = true;
        state.stamina = 0.1;
        crossover();
        if (state.crossTime !== 0) return false;
        state.stamina = 1;
        state.charge = 0.2;
        crossover();
        if (state.crossTime !== 0) return false;
        state.charge = null;
        giveBall(5);
        crossover();
        return state.crossTime === 0;
      }),
      "crossover is unavailable without stamina, while shooting, or on defense",
    );
    check(
      await page.evaluate(() => {
        reset();
        state.started = true;
        state.players[0].x = 100;
        state.players[0].y = 140;
        state.players[1].x = 140;
        state.players[1].y = 60;
        state.players[2].x = 180;
        state.players[2].y = 140;
        state.players[3].x = 140;
        state.players[3].y = 210;
        state.players[4].x = 60;
        state.players[4].y = 200;
        keys.add("w");
        const preview = passTarget();
        pass();
        keys.clear();
        return preview === 1 && state.flight.target === preview;
      }),
      "directional pass preview matches the actual receiver",
    );
    await page.evaluate(() => {
      reset();
      state.started = true;
      ui.overlay.hidden = true;
      state.players[0].x = 80;
      state.players[0].y = 140;
      state.cooldown = 999;
    });
    await page.keyboard.press("3");
    check(
      await page.evaluate(
        () => state.flight?.type === "pass" && state.flight.target === 2,
      ),
      "number key passes directly to that teammate",
    );
    await page.evaluate(() => {
      reset();
      state.started = true;
      ui.overlay.hidden = true;
      state.players[0].x = 80;
      state.players[0].y = 140;
      state.players[3].x = 220;
      state.players[3].y = 100;
      state.cooldown = 999;
    });
    const click = await page.evaluate(() => {
      const r = canvas.getBoundingClientRect(),
        p = state.players[3];
      return {
        x: r.left + (playerScreenPoint(p).x * r.width) / 480,
        y: r.top + (playerScreenPoint(p).y * r.height) / 280,
      };
    });
    await page.mouse.click(click.x, click.y);
    check(
      await page.evaluate(
        () => state.flight?.type === "pass" && state.flight.target === 3,
      ),
      "clicking a teammate starts a direct pass",
    );
    check(
      await page.evaluate(() => {
        for (const [charge, label] of [
          [0.1, "EARLY"],
          [0.7, "PERFECT"],
          [1, "LATE"],
        ]) {
          reset();
          state.started = true;
          state.players[0].x = 220;
          state.players[0].y = 140;
          state.charge = charge;
          up(" ");
          if (
            state.lastRelease.label !== label ||
            state.flight.release !== label
          )
            return false;
          state.flight.made = true;
          flightStep(1);
          hud();
          if (!ui.shotinfo.textContent.includes("MADE")) return false;
        }
        reset();
        state.started = true;
        state.charge = 0.1;
        up(" ");
        state.flight.made = false;
        flightStep(1);
        return state.lastRelease.result === "MISS";
      }),
      "shot feedback distinguishes early, perfect, late, made, and missed shots",
    );
    await page.evaluate(() => {
      reset();
      state.started = true;
      ui.overlay.hidden = true;
    });
    await page.evaluate(() => {
      state.inbound = 0;
      state.cooldown = 999;
    });
    const x = await page.evaluate(() => state.players[state.selected].x);
    await page.keyboard.down("d");
    await page.waitForTimeout(300);
    await page.keyboard.up("d");
    check(
      await page.evaluate((x) => state.players[state.selected].x > x + 10, x),
      "keyboard movement after clicking Start",
    );
    check(
      await page.evaluate(() => {
        const run = (sprint) => {
          reset();
          state.started = true;
          state.inbound = 0;
          state.cooldown = 999;
          state.players[0].x = 50;
          state.players[0].y = 140;
          for (let i = 1; i < 10; i++) state.players[i].x = 300;
          keys.add("d");
          if (sprint) keys.add("shift");
          for (let i = 0; i < 30; i++) step(1 / 60);
          return { x: state.players[0].x, stamina: state.stamina };
        };
        const walk = run(false),
          sprint = run(true);
        keys.clear();
        return sprint.x > walk.x + 15 && sprint.stamina < walk.stamina;
      }),
      "sprint is faster and uses stamina",
    );
    check(
      await page.evaluate(() => {
        reset();
        state.started = true;
        state.seed = 42;
        state.shotClock = 12;
        state.players[0].x = 90;
        state.players[0].y = 100;
        state.players[1].x = 170;
        state.players[1].y = 100;
        for (let i = 5; i < 10; i++) state.players[i].x = 440;
        pass(1);
        flightStep(0.6);
        return (
          state.owner === 1 &&
          state.selected === 1 &&
          state.shotClock === 12 &&
          state.assist.passer === 0
        );
      }),
      "pass switches control, tracks assists, and preserves shot clock",
    );
    check(
      await page.evaluate(() => {
        state.players[1].x = 100;
        state.players[1].y = 140;
        state.players[2].x = 200;
        state.players[2].y = 140;
        state.players[5].x = 150;
        state.players[5].y = 140;
        window.courtTuneOverride = { intercept: 1 };   // College Dynasty 3.9.0 lowers interceptions in real games; this test is about the lane itself
        let ok = false;
        for (let t = 0; t < 40 && !ok; t++) { state.players[1].x = 100; state.players[1].y = 140; state.players[2].x = 200; state.players[2].y = 140; state.players[5].x = 150; state.players[5].y = 140; state.stats[1].steals = 0; giveBall(1); state.inbound = 0; pass(2); flightStep(state.flight.duration / 2); ok = state.owner === 5 && state.stats[1].steals === 1; }
        window.courtTuneOverride = { sfScale: 0, nfScale: 0, toScale: 0 };   // back to the suite's setting (no random fouls or turnovers)
        return ok;
      }),
      "defender intercepts a pass through a closed lane",
    );
    check(
      await page.evaluate(() => {
        reset();
        state.started = true;
        state.seed = 42;
        state.players[0].x = 425;
        state.players[0].y = 140;
        shoot(1);
        state.flight.made = true;
        const dunk = state.flight.dunk;
        flightStep(1);
        return (
          dunk &&
          state.score[0] === 2 &&
          state.stats[0].made === 1 &&
          state.attack === 1 &&
          state.inbound > 0
        );
      }),
      "dunk scores two and starts opponent inbound",
    );
    check(
      await page.evaluate(() => {
        possession(0);
        state.inbound = 0;
        state.players[0].x = 280;
        shoot(1);
        state.flight.made = true;
        flightStep(1);
        return state.score[0] === 5;
      }),
      "outside the arc scores three",
    );
    check(
      await page.evaluate(() => {
        possession(0);
        state.inbound = 0;
        shoot(0);
        state.flight.made = false;
        flightStep(1);
        if (!state.loose || state.owner !== null) return false;
        state.players[0].x = state.loose.x;
        state.players[0].y = state.loose.y;
        state.loose.age = 0.3;
        state.opponentTimeout = 0; // Complete the AI timeout from the preceding scoring run.
        step(1 / 60);
        return state.owner === 0 && state.stats[0].rebounds === 1;
      }),
      "missed shot becomes a recoverable loose ball",
    );
    check(
      await page.evaluate(() => {
        reset();
        state.started = true;
        possession(1);
        state.inbound = 0;
        state.players[5].x = 150;
        state.players[5].y = 140;
        state.players[0].x = 155;
        state.players[0].y = 140;
        state.players[6].x = 100;
        state.players[6].y = 70;
        for (let i = 1; i < 5; i++) {
          state.players[i].x = 420;
          state.players[i].y = 220;
        }
        state.aiTime = 2;
        state.aiDecision = 0;
        aiStep(0.02);
        return state.flight?.type === "pass" && state.flight.team === 1;
      }),
      "computer passes out of pressure",
    );
    check(
      await page.evaluate(() => {
        reset();
        state.started = true;
        possession(1);
        state.inbound = 0;
        state.players[5].x = 90;
        state.players[5].y = 140;
        for (let i = 0; i < 5; i++) state.players[i].x = 400;
        state.aiTime = 2;
        state.aiDecision = 0;
        aiStep(0.02);
        if (!state.aiCharge || state.flight) return false;
        aiStep(0.5);
        return state.flight?.type === "shot";
      }),
      "computer telegraphs its shot before releasing",
    );
    check(
      await page.evaluate(() => {
        reset();
        state.started = true;
        giveBall(5);
        state.players[5].x = 100;
        state.players[5].y = 140;
        state.players[0].x = 117;
        state.players[0].y = 140;
        state.selected = 0;
        down("l");
        up("l");
        shoot(1);
        flightStep(0.02);
        return (
          state.stats[0].blocks === 1 &&
          state.loose &&
          !state.flight &&
          state.score[1] === 0
        );
      }),
      "timed jump blocks a nearby shot into a loose ball",
    );
    check(
      await page.evaluate(() => {
        reset();
        state.started = true;
        giveBall(5);
        state.players[5].x = 100;
        state.players[5].y = 140;
        state.players[0].x = 250;
        state.players[0].y = 140;
        jumpPlayer(0);
        shoot(1);
        flightStep(0.02);
        return state.stats[0].blocks === 0 && state.flight?.type === "shot";
      }),
      "jumping far away cannot block the shot",
    );
    check(
      await page.evaluate(() => {
        reset();
        state.started = true;
        state.owner = null;
        // Neutral rebound attributes isolate the extra reach from jumping.
        state.players[0].attrs = Array(16).fill(70);
        state.loose = { x: 220, y: 140, team: 1, age: 0.3 };
        for (let i = 0; i < 10; i++) {
          state.players[i].x = 400;
          state.players[i].y = 220;
        }
        state.players[0].x = 200;
        state.players[0].y = 140;
        state.selected = 0;
        jumpPlayer(0);
        step(1 / 60);
        return state.owner === 0 && state.stats[0].rebounds === 1;
      }),
      "jump extends the reach for a rebound",
    );
    check(
      await page.evaluate(() => {
        reset();
        state.started = true;
        const p = state.players[1];
        jumpPlayer(1);
        const before = p.jumpCooldown;
        p.jump = 0;
        jumpPlayer(1);
        return p.jump === 0 && p.jumpCooldown === before;
      }),
      "jump cooldown prevents repeated jumping",
    );
    check(
      await page.evaluate(() => {
        reset();
        state.started = true;
        const before = state.players.map((p) => ({ x: p.x, y: p.y }));
        possession(1);
        if (
          state.players.some(
            (p, i) => p.x !== before[i].x || p.y !== before[i].y,
          )
        )
          return false;
        const time = state.time;
        step(0.1);
        return (
          state.time === time &&
          state.players.some((p, i) => p.x !== before[i].x) &&
          state.players.every((p, i) => distance(p, before[i]) <= 32 * skill(p, 12) + 0.01)
        );
      }),
      "players move smoothly into position after baskets while the clock waits",
    );
    check(
      await page.evaluate(() => {
        reset();
        state.started = true;
        state.owner = null;
        state.selected = 0;
        state.players[0].x = 100;
        state.players[0].y = 140;
        down("l");
        const first = state.players[0].jump;
        up("l");
        return first === 0.5;
      }),
      "manual jump starts the animation",
    );
    await page.evaluate(() => {
      reset();
      state.started = true;
      ui.overlay.hidden = true;
      giveBall(5);
    });
    await page.keyboard.press("l");
    check(
      await page.evaluate(() => state.players[state.selected].jump > 0),
      "L keyboard control jumps on defense",
    );
    check(
      await page.evaluate(() => {
        reset();
        state.started = true;
        state.shotClock = 0.001;
        step(1 / 60);
        return state.attack === 1 && state.shotClock === 30;
      }),
      "shot clock turnover",
    );
    check(
      await page.evaluate(() => {
        const shots = [
          [18, "DUNK", 2],
          [48, "LAYUP", 2],
          [95, "MIDRANGE", 2],
          [140, "3PT", 3],
          [220, "DEEP 3", 3],
        ];
        for (const [range, label, points] of shots) {
          reset();
          state.started = true;
          state.players[0].x = 443 - range;
          state.players[0].y = 140;
          const meter = shotMeter(state.players[0]);
          if (
            meter.label !== label ||
            releaseQuality(meter.peak, meter) !== 1 ||
            releaseQuality(0, meter) !== 0 ||
            releaseQuality(meter.duration, meter) !== 0
          )
            return false;
          state.charge = meter.peak;
          hud();
          draw();
          if (ui.shotinfo.textContent !== "RELEASE NOW!") return false;
          up(" ");
          if (
            state.flight.shotType !== label ||
            state.flight.points !== points ||
            state.flight.quality !== 1
          )
            return false;
          const red = { x: 37 + range, y: 140, team: 1 };
          if (shotMeter(red).label !== label) return false;
        }
        return SHOT_METERS.every(
          (m, i) =>
            !i ||
            m.green / m.duration <
              SHOT_METERS[i - 1].green / SHOT_METERS[i - 1].duration,
        );
      }),
      "all five distance meters drive timing and shot type; closer shots have wider green zones",
    );
    await page.evaluate(() => {
      reset();
      state.started = true;
      ui.overlay.hidden = true;
      state.inbound = 0;
      state.players[0].x = 300;
      state.players[0].y = 140;
      state.cooldown = 999;
      for (let i = 5; i < 10; i++) {
        state.players[i].x = 50;
        state.players[i].y = 240;
      }
    });
    await page.keyboard.down(" ");
    const greenCue = await page.waitForFunction(() => state.charge > .5 && ui.shotinfo.textContent === "RELEASE NOW!", null, { timeout: 3000 });
    check(await greenCue.jsonValue(), "green shot timing cue");
    await page.keyboard.up(" ");
    check(
      await page.evaluate(() => state.flight?.type === "shot"),
      "release shoots",
    );
    await page.keyboard.press("p");
    check(await page.evaluate(() => !state.paused), "P no longer pauses the game");
    await page.getByRole("button", { name: "Pause", exact: true }).click();
    const t = await page.evaluate(() => state.time);
    await page.waitForTimeout(150);
    check(
      await page.evaluate((t) => state.time === t, t),
      "pause freezes clock",
    );
    await page.getByRole("button", { name: "Back to the court" }).click();
    check(
      await page.evaluate(() => {
        reset();state.started=true;state.inbound=0;ui.overlay.hidden=true;
        state.flight = null;
        state.time = 0.001;
        state.period = 1;
        state.score = [4, 4];
        step(1 / 60);
        const before = state.time;
        step(1);
        pause();
        return (
          state.halftime &&
          state.paused &&
          !state.over &&
          state.overtime === 0 &&
          state.time === before &&
          ui.start.textContent.includes("second half")
        );
      }),
      "first-half buzzer pauses at halftime even when tied",
    );
    await page.getByRole("button", { name: "Start second half" }).click();
    check(
      await page.evaluate(
        () =>
          state.period === 2 &&
          state.time === 1200 &&
          !state.paused &&
          !state.halftime &&
          state.score[0] === 4 &&
          state.score[1] === 4 &&
          state.shotClock === 30,
      ),
      "second half starts at 20:00 and retains the score",
    );
    check(
      await page.evaluate(() => {
        state.flight = null;
        state.time = 0.001;
        state.inbound = 0;
        state.score = [4, 4];
        step(1 / 60);
        return state.overtime === 1 && state.time === 300 && !state.over;
      }),
      "tied regulation game gets five minutes of overtime",
    );
    check(
      await page.evaluate(() => {
        state.inbound = 0;
        state.score = [6, 2];
        state.time = 0.001;
        giveBall(0);
        shoot(1);
        state.flight.made = true;
        step(1 / 60);
        if (state.over) return false;
        for (let i = 0; i < 180 && !state.over; i++) step(1 / 60);
        return (
          state.over &&
          state.score[0] > 6 &&
          state.finalResult.actual.score[0] === state.score[0] && document.querySelectorAll("#final-box tbody tr").length >= 10
        );
      }),
      "shot at buzzer counts before final stats",
    );
    await page.getByRole("button", { name: "Play again" }).click();
    check(
      await page.evaluate(
        () => state.score.every((n) => n === 0) && state.started && !state.over,
      ),
      "replay resets match",
    );
    await page.locator("#sound").click();
    check(
      await page.evaluate(() => soundOn && audioContext?.state === "running"),
      "optional arcade audio starts",
    );
    await page.locator("#sound").click();
    check(await page.evaluate(() => !soundOn), "audio can be muted");
    check(
      await page.evaluate(() => {
        // Simulate three complete games to catch AI stalls and invalid positions.
        for (const difficulty of ["easy", "normal", "hard"]) {
          reset();
          state.started = true;
          state.time = 1200;
          state.difficulty = difficulty;
          state.seed = 412;
          let sawHalftime = false;
          for (let i = 0; i < 100000 && !state.over; i++) {
            step(0.1);
            if (state.halftime) {
              sawHalftime = true;
              ui.start.onclick();
            }
          }
          if (
            !state.over ||
            !sawHalftime ||
            state.period !== 2 ||
            state.stats[1].attempts === 0 ||
            state.players.some(
              (p) => !p.disqualified && (
                !Number.isFinite(p.x) ||
                (!state.awaitingInbound && (p.x < (state.over ? 11 : 21) || p.x > (state.over ? 469 : 459))) ||
                p.y < (state.awaitingInbound || state.over ? 17 : 27) ||
                p.y > (state.awaitingInbound || state.over ? 263 : 253)),
            )
          )
            throw new Error(JSON.stringify({difficulty, over:state.over, time:state.time,
              sawHalftime, period:state.period, attempts:state.stats[1].attempts,
              inbound:state.inbound, awaitingInbound:state.awaitingInbound,
              players:state.players.map(p=>({x:p.x,y:p.y}))}));
        }
        return true;
      }),
      "40-minute matches with halftime finish on every difficulty with valid positions",
    );
    await page.evaluate(() => {
      reset();
      state.started = true;
      ui.overlay.hidden = true;
      state.inbound = 0;
      state.cooldown = 999;
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "/tmp/pixel-hoops-desktop-v2.png" });
    await page.setViewportSize({ width: 1280, height: 720 });
    const layout = await page.evaluate(() => ({
      page: document.documentElement.scrollHeight,
      viewport: innerHeight,
      parts: [
        ...document.querySelectorAll("header,.board,.arena,.readout,footer"),
      ].map((e) => [e.tagName, e.className, e.getBoundingClientRect().height]),
    }));
    check(
      await page.evaluate(
        () =>
          document.documentElement.scrollHeight <= innerHeight &&
          document.documentElement.scrollWidth <= innerWidth,
      ),
      "game fits a laptop screen without page scrolling" +
        (layout.page > layout.viewport ? ": " + JSON.stringify(layout) : ""),
    );
    check(await page.evaluate(() => {
      const court=canvas.getBoundingClientRect();
      return court.width>=innerWidth*.97 && court.width*court.height>=innerWidth*innerHeight*.75;
    }), "court fills the desktop width and at least 75% of the window area");
    const mobile = await browser.newPage({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    mobile.on("pageerror", (e) => errors.push(e.message));
    await mobile.goto(
      "file://" + path.resolve(__dirname, "../basketball-game.html"),
    );
    check(
      await mobile.evaluate(() => {
        const arena = document.querySelector(".arena").getBoundingClientRect(),
          card = document.querySelector(".card").getBoundingClientRect();
        return card.top >= arena.top && card.bottom <= arena.bottom;
      }),
      "phone menu fits over the court",
    );
    await mobile.screenshot({ path: "/tmp/pixel-hoops-menu-mobile.png" });
    await mobile.getByRole("button", { name: "Let’s play" }).click();
    check(
      await mobile.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      "phone has no sideways overflow",
    );
    check(
      await mobile.locator('[data-key="shift"]').isVisible(),
      "touch sprint button",
    );
    await mobile.evaluate(() => {
      state.inbound = 0;
      giveBall(0);
      state.cooldown = 999;
      state.players[1].x = 220;
      state.players[1].y = 100;
      // Freeze movement while measuring native touch coordinates; input remains live.
      window.__touchCheckStep=step;step=()=>{};draw();
    });
    const tap = await mobile.evaluate(() => {
      const r = canvas.getBoundingClientRect(),
        p = state.players[1];
      return {
        x: r.left + (playerScreenPoint(p).x * r.width) / 480,
        y: r.top + (playerScreenPoint(p).y * r.height) / 280,
      };
    });
    await mobile.touchscreen.tap(tap.x, tap.y);
    check(
      await mobile.evaluate(
        () => state.flight?.type === "pass" && state.flight.target === 1 || state.owner === 1 && state.assist?.passer === 0,
      ),
      "tapping a teammate passes correctly on the high-resolution court",
    );
    await mobile.evaluate(() => {
      step=window.__touchCheckStep;delete window.__touchCheckStep;
      giveBall(0);
    });
    await mobile.evaluate(() => {
      state.inbound = 0;
      state.cooldown = 999;
    });
    await mobile
      .locator('[data-key="j"]')
      .dispatchEvent("pointerdown", { pointerId: 1 });
    await mobile
      .locator('[data-key="j"]')
      .dispatchEvent("pointerup", { pointerId: 1 });
    check(
      await mobile.evaluate(() => state.crossCooldown > 0 && state.stamina < 1),
      "touch crossover works",
    );
    await mobile
      .locator('[data-key="b"]')
      .dispatchEvent("pointerdown", { pointerId: 1 });
    await mobile
      .locator('[data-key="b"]')
      .dispatchEvent("pointerup", { pointerId: 1 });
    check(
      await mobile.evaluate(() => state.play?.team === 0),
      "touch screen calls a pick and roll",
    );
    await mobile
      .locator('[data-key="q"]')
      .dispatchEvent("pointerdown", { pointerId: 1 });
    await mobile
      .locator('[data-key="q"]')
      .dispatchEvent("pointerup", { pointerId: 1 });
    check(
      await mobile.evaluate(
        () => state.cutter?.team === 0 && state.cutter.index !== state.owner,
      ),
      "touch cut sends an off-ball teammate to the rim",
    );
    await mobile.evaluate(() => {
      state.inbound = 0;
      giveBall(5);
    });
    await mobile
      .locator('[data-key="k"]')
      .dispatchEvent("pointerdown", { pointerId: 1 });
    await mobile
      .locator('[data-key="k"]')
      .dispatchEvent("pointerup", { pointerId: 1 });
    check(
      await mobile.evaluate(
        () => state.guardBall && state.players[state.selected].team === 0,
      ),
      "touch K button guards the opposing ball handler",
    );
    await mobile
      .locator('[data-key="l"]')
      .dispatchEvent("pointerdown", { pointerId: 1 });
    await mobile
      .locator('[data-key="l"]')
      .dispatchEvent("pointerup", { pointerId: 1 });
    check(
      await mobile.evaluate(() => state.players[state.selected].jump > 0),
      "touch jump / block works",
    );
    await mobile.evaluate(() => {
      giveBall(0);
    });
    const shoot = mobile.locator('[data-key=" "]');
    await mobile.waitForTimeout(1000);
    await shoot.dispatchEvent("pointerdown", { pointerId: 1 });
    await mobile.waitForTimeout(620);
    await shoot.dispatchEvent("pointerup", { pointerId: 1 });
    check(
      await mobile.evaluate(() => state.flight?.type === "shot"),
      "touch shoot hold and release",
    );
    await mobile.evaluate(() => {
      reset(); state.started=true; state.inbound=0; state.cooldown=999; ui.overlay.hidden=true;
    });
    await mobile.locator("#defense-style").selectOption("tight");
    for (const key of ["i"]) {
      await mobile.locator(`[data-key="${key}"]`).dispatchEvent("pointerdown", {pointerId:1});
      await mobile.locator(`[data-key="${key}"]`).dispatchEvent("pointerup", {pointerId:1});
    }
    check(await mobile.evaluate(() => !!state.isolation && state.defense === "tight"),
      "touch controls call isolation and change defensive style");
    await mobile.evaluate(() => {giveBall(5);state.inbound=0;});
    await mobile.locator('[data-key="g"]').dispatchEvent("pointerdown", {pointerId:1});
    await mobile.locator('[data-key="g"]').dispatchEvent("pointerup", {pointerId:1});
    check(await mobile.evaluate(() => !!state.doubleTeam), "touch control calls a double-team");
    await mobile.locator("#player-lock").selectOption("2");
    check(await mobile.evaluate(() => state.lockedPlayer===2 && state.selected===2),
      "phone player-lock selector controls the selected teammate");
    await mobile.locator("#player-lock").selectOption("-1");
    await mobile.screenshot({ path: "/tmp/pixel-hoops-mobile-v2.png" });
    await page.waitForTimeout(250);
    check(await page.evaluate(()=>{const seed=state.seed;draw();draw();return CollegeDynastyBasketball.graphicsInfo().renderer.startsWith('Pixel')&&state.seed===seed;}),"drawing the pixel court never touches the game's random numbers");
    const fallback=await browser.newPage({viewport:{width:1000,height:700}});
    await fallback.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){if(type==="webgl")return null;return original.call(this,type,...args);};});
    await fallback.goto("file://"+path.resolve(__dirname,"../basketball-game.html"));
    check(await fallback.evaluate(()=>{reset();state.started=true;draw();return CollegeDynastyBasketball.graphicsInfo().renderer.startsWith('Pixel')&&!document.querySelector('#arena-3d');}),"devices without WebGL get exactly the same pixel court (nothing depends on a graphics card)");
    await fallback.close();
    check(errors.length === 0, "no JavaScript errors");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
