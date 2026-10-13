var Py = [
  { id: "HQ", label: "Program HQ", icon: Rs },
  { id: "Roster", label: "My roster", icon: nl },
  { id: "Recruiting", label: "Recruiting", icon: Va },
  { id: "Portal", label: "Transfer portal", icon: so },
  { id: "Board", label: "My recruits", icon: ro },
  { id: "Walkons", label: "Walk-on pool", icon: Gl },
  { id: "Rotation", label: "Coaching", icon: no },
  { id: "Schedule", label: "Schedule", icon: ql },
  { id: "Season", label: "Season center", icon: ba },
  { id: "NIL", label: "NIL budget", icon: ja },
  { id: "News", label: "League news", icon: Es },
  { id: "History", label: "Career history", icon: At },
  { id: "Settings", label: "Settings", icon: Rs },
];
var CFG0 = {
    sfx: !0,
    music: !1,
    vol: 0.35,
    track: "Chill",
    fit: !0,
    size: 17.5,
    autoCoach: !1,
    autoScout: !1,
    pop: {
      win: !0,
      start: !0,
      tour: !0,
      elim: !0,
      champ: !0,
      injury: !0,
      ret: !0,
      awards: !0,
      draft: !0,
      xfer: !0,
      offers: !0,
      move: !0,
      lost: !0,
    },
  },
  CFG = (() => {
    try {
      let o = JSON.parse(localStorage.getItem("real-college-dynasty-settings") || "{}");
      return { ...CFG0, ...o, pop: { ...CFG0.pop, ...(o.pop || {}) } };
    } catch {
      return { ...CFG0, pop: { ...CFG0.pop } };
    }
  })();
var Sfx = {
  ctx: null,
  n(f, t, d, ty, v) {
    let c = this.ctx,
      o = c.createOscillator(),
      g = c.createGain();
    ((o.type = ty || "sine"),
      (o.frequency.value = f),
      g.gain.setValueAtTime(1e-4, c.currentTime + t),
      g.gain.linearRampToValueAtTime(v || 0.12, c.currentTime + t + 0.02),
      g.gain.exponentialRampToValueAtTime(1e-4, c.currentTime + t + d),
      o.connect(g),
      g.connect(c.destination),
      o.start(c.currentTime + t),
      o.stop(c.currentTime + t + d + 0.05));
  },
  p(k) {
    if (!CFG.sfx) return;
    try {
      let C = window.AudioContext || window.webkitAudioContext;
      if (!C) return;
      ((this.ctx = this.ctx || new C()), this.ctx.resume());
      ({
        win: () => [523, 659, 784].forEach((f, i) => this.n(f, i * 0.09, 0.28, "triangle")),
        loss: () => [392, 330].forEach((f, i) => this.n(f, i * 0.14, 0.3, "sine", 0.1)),
        sign: () => [660, 880].forEach((f, i) => this.n(f, i * 0.1, 0.25, "sine")),
        buzzer: () => this.n(110, 0, 0.7, "sawtooth", 0.18),
        fanfare: () =>
          [523, 659, 784, 1047, 784, 1047].forEach((f, i) => this.n(f, i * 0.12, 0.35, "square", 0.08)),
        whistle: () => this.n(1800, 0, 0.3, "sine", 0.1),
      })[k]?.();
    } catch {}
  },
};
function saveCfg() {
  try {
    localStorage.setItem("real-college-dynasty-settings", JSON.stringify(CFG));
  } catch {}
}
var Music = {
  ctx: null,
  gain: null,
  timer: null,
  n: 0,
  noise: null,
  get on() {
    return !!this.timer;
  },
  tone(f, t, d, ty, v) {
    let c = this.ctx,
      o = c.createOscillator(),
      g = c.createGain();
    ((o.type = ty),
      (o.frequency.value = f),
      g.gain.setValueAtTime(1e-4, t),
      g.gain.linearRampToValueAtTime(v, t + Math.min(0.08, d / 3)),
      g.gain.exponentialRampToValueAtTime(1e-4, t + d),
      o.connect(g),
      g.connect(this.gain),
      o.start(t),
      o.stop(t + d + 0.05));
  },
  hat(t, v) {
    let c = this.ctx;
    if (!this.noise) {
      let b = c.createBuffer(1, c.sampleRate * 0.2, c.sampleRate),
        d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      this.noise = b;
    }
    let s0 = c.createBufferSource(),
      f = c.createBiquadFilter(),
      g = c.createGain();
    ((s0.buffer = this.noise),
      (f.type = "highpass"),
      (f.frequency.value = 7e3),
      g.gain.setValueAtTime(v, t),
      g.gain.exponentialRampToValueAtTime(1e-4, t + 0.06),
      s0.connect(f),
      f.connect(g),
      g.connect(this.gain),
      s0.start(t),
      s0.stop(t + 0.1));
  },
  kick(t) {
    let c = this.ctx,
      o = c.createOscillator(),
      g = c.createGain();
    (o.frequency.setValueAtTime(140, t),
      o.frequency.exponentialRampToValueAtTime(42, t + 0.14),
      g.gain.setValueAtTime(0.9, t),
      g.gain.exponentialRampToValueAtTime(1e-4, t + 0.2),
      o.connect(g),
      g.connect(this.gain),
      o.start(t),
      o.stop(t + 0.25));
  },
  tick() {
    let c = this.ctx,
      t = c.currentTime + 0.05,
      n = this.n++,
      tr = CFG.track,
      ch = [
        [220, 261.6, 329.6],
        [174.6, 220, 261.6],
        [261.6, 329.6, 392],
        [196, 246.9, 293.7],
      ],
      A = ch[Math.floor(n / 8) % 4];
    if (tr === "Chill") {
      (n % 8 === 0 && A.forEach((f) => this.tone(f, t, 5.2, "sine", 0.09)),
        this.tone(A[n % 3] * 2, t, 1.1, "triangle", 0.07),
        n % 4 === 2 && this.tone(A[0] / 2, t, 1.6, "sine", 0.1));
    } else if (tr === "Arena") {
      (n % 2 === 0 && this.kick(t),
        this.hat(t + 0.18, 0.12),
        n % 4 === 0 && this.tone(A[0] / 2, t, 0.45, "sawtooth", 0.09),
        n % 8 === 0 && A.forEach((f) => this.tone(f, t, 0.7, "square", 0.035)),
        n % 2 === 1 && this.tone(A[(n >> 1) % 3] * 2, t, 0.25, "triangle", 0.06));
    } else {
      (n % 16 === 0 && (this.tone(110, t, 9, "sine", 0.1), this.tone(165, t, 9, "sine", 0.05)),
        n % 5 === 0 && this.tone(A[n % 3] * 4, t, 2.4, "sine", 0.035));
    }
  },
  start() {
    if (this.timer) return;
    let C = window.AudioContext || window.webkitAudioContext;
    if (!C) return;
    (this.ctx ||
      ((this.ctx = new C()), (this.gain = this.ctx.createGain()), this.gain.connect(this.ctx.destination)),
      (this.gain.gain.value = CFG.vol),
      this.ctx.resume());
    let bpm = CFG.track === "Arena" ? 112 : CFG.track === "Chill" ? 76 : 64;
    ((this.timer = setInterval(
      () => this.tick(),
      (6e4 / bpm / (CFG.track === "Chill" ? 1 : 2)) * (CFG.track === "Chill" ? 1 : 1)
    )),
      this.tick());
  },
  stop() {
    this.timer && (clearInterval(this.timer), (this.timer = null));
  },
  setVol(v) {
    this.gain && (this.gain.gain.value = v);
  },
  restart() {
    (this.stop(), CFG.music && this.start());
  },
};
function applyCfg() {
  (document.body.classList.toggle("roomy", !CFG.fit),
    (document.documentElement.style.fontSize = CFG.size + "px"));
}
(applyCfg(),
  (window.__music = Music),
  document.addEventListener(
    "click",
    () => {
      CFG.music && !Music.on && Music.start();
    },
    { once: !0 }
  ));
