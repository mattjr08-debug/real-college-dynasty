var Gn =
    "real-college-dynasty-offline-v6" +
    (() => {
      try {
        let q = localStorage.getItem("real-college-dynasty-slot");
        return q && q !== "1" ? "-s" + q : "";
      } catch {
        return "";
      }
    })(),
  Ty = Gn + "-backup",
  gl = null,
  du = !0,
  Pn = !1,
  ec = !1,
  A = x.number().finite(),
  Fn = x.object({
    gp: A,
    min: A,
    pts: A,
    reb: A,
    ast: A,
    stl: A,
    blk: A,
    to: A,
    fgm: A,
    fga: A,
    tpm: A,
    tpa: A,
    ftm: A,
    fta: A,
  }),
  $f = x.object({
    id: x.string(),
    name: x.string().max(100),
    pos: x.enum(["PG", "SG", "SF", "PF", "C"]),
    pos2: x.string().optional(),
    age: A,
    height: A,
    year: x.number().int().min(1).max(4),
    number: A,
    faceSeed: A.optional(),
    appearanceSeed: A.optional(),
    skinColor: x.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
    hairColor: x.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
    progress: A.optional(),
    decisionRound: A.optional(),
    decisionYear: A.optional(),
    committedTo: x.string().optional(),
    fid: x.string().optional(),
    why: x.string().optional(),
    fate: x.string().optional(),
    bd: x.any().optional(),
    vis: A.optional(),
    ov: A.optional(),
    pwv: A.optional(),
    landed: A.optional(),
    wb: A.optional(),
    origin: x.string().optional(),
    portrait: x.number().int().min(0).max(15),
    ovr: A,
    potential: A,
    attrs: x.array(A).length(16),
    morale: A,
    nil: A,
    ask: A,
    awardBump: A.optional(),
    ih: x.any().optional(),
    dlog: x.any().optional(),
    hsStars: A.optional(),
    sg: A.optional(),
    pers: x.string().optional(),
    home: A.optional(),
    prefs: x.any().optional(),
    rv: x.any().optional(),
    ld: x.string().optional(),
    tend: x.any().optional(),
    hi: x.any().optional(),
    dev: x.string().optional(),
    pn: A.optional(),
    intl: x.boolean().optional(),
    cty: x.string().optional(),
    adj: A.optional(),
    rank: A.optional(),
    pitched: x.any().optional(),
    decommit: A.optional(),
    role: x.string(),
    promise: x.string(),
    minutes: A,
    training: x.string(),
    redshirt: x.boolean(),
    redshirtUsed: x.boolean(),
    injury: A,
    susp: A.optional(),
    realInj: x.string().optional(),
    med: A.optional(),
    medUsed: x.boolean().optional(),
    stars: A,
    source: x.string(),
    priority: x.string(),
    interest: A,
    scouted: A,
    target: x.boolean(),
    status: x.string(),
    offer: x.object({ nil: A, role: x.string() }).optional(),
    stats: Fn,
    history: x.array(x.object({ year: A, stats: Fn, team: x.string().optional() })),
    recent: x.array(x.object({ opponent: x.string(), pts: A, reb: A, ast: A, stl: A.optional(), blk: A.optional(), min: A })),
    growth: A,
    newSigning: x.boolean(),
    talked: x.boolean(),
  }),
  Xs = x.object({
    id: x.string(),
    name: x.string(),
    short: x.string(),
    rating: A,
    wins: A,
    losses: A,
    cw: A,
    cl: A,
    budget: A.optional(),
    conf: A.optional(),
    coach: x.any().optional(),
    sr: A.optional(),
    qw: A.optional(),
    bl: A.optional(),
    qd: x.array(A).nullable().optional(),
    pf: A.optional(),
    pa: A.optional(),
    po: A.optional(),
    pr: A.optional(),
  }),
  qC = x.object({
    id: x.string(),
    opponent: x.string(),
    oppId: x.string(),
    rating: A,
    venue: x.string(),
    kind: x.string(),
    played: x.boolean(),
    guarantee: A.optional(),
    event: x.string().optional(),
    rd: A.optional(),
    bk: x.string().optional(),
    rival: x.boolean().optional(),
    poss: A.optional(),
    tmo: x.array(A).length(2).optional(),
    opponentBox: x.array(Fn.extend({ id: x.string(), name: x.string(), pos: x.string(), pf: A.optional() })).optional(),
    court: x.object({ version: x.literal(1), halfSeconds: A, adjustmentFactor: A,
      statsBasis: x.string(), actual: x.any(), forfeit: x.any().optional() }).optional(),
    us: A.optional(),
    them: A.optional(),
    win: x.boolean().optional(),
    ot: A.optional(),
    box: x
      .array(Fn.extend({ id: x.string(), name: x.string(), pos: x.string(), pf: A.optional() }))
      .optional(),
  }),
  HC = x.object({
    schema: x.union([x.literal(1), x.literal(2)]),
    baseBudget: A.optional(),
    guaranteeIncome: A.optional(),
    rosters: x.any().optional(),
    sch: x.any().optional(),
    sres: x.any().optional(),
    rev: x.any().optional(),
    staff: x.any().optional(),
    asst: x.any().optional(),
    asstPool: x.any().optional(),
    skills: x.any().optional(),
    contract: x.any().optional(),
    earn: A.optional(),
    pm: x.any().optional(),
    mkt: A.optional(),
    ctRes: x.any().optional(),
    vac: x.array(x.any()).optional(),
    confWinners: x.any().optional(),
    pre: x.any().optional(),
    live: x.any().optional(),
    lastLive: x.any().optional(),
    wm: A.optional(),
    lb: A.optional(),
    don: x.any().optional(),
    negs: x.array(x.any()).optional(),
    alumni: x.array(x.any()).optional(),
    favAlum: x.array(x.string()).optional(),
    favPlayers: x.array(x.string()).optional(),
    classes: x.array(x.any()).optional(),
    rival: x.any().optional(),
    h2h: x.any().optional(),
    diff: x.string().optional(),
    minPreset: x.string().optional(),
    rotSize: x.number().optional(),
    starId: x.string().optional(),
    prevRec: x.any().optional(),
    jobYear: x.number().optional(),
    recs: x.any().optional(),
    confs: x.any().optional(),
    confNames: x.any().optional(),
    nt: x.number().optional(),
    nilMk: x.number().optional(),
    nilMed: x.number().optional(),
    lnews: x.array(x.any()).optional(),
    draftLog: x.array(x.any()).optional(),
    tmoves: x.any().optional(),
    nwin: x.any().optional(),
    seedMap: x.any().optional(),
    elim: x.any().optional(),
    xfers: x.array(x.any()).optional(),
    pw: A.optional(),
    pv: A.optional(),
    ov: A.optional(),
    pst: x.any().optional(),
    rel: A.optional(),
    tierShift: A.optional(),
    draft: x.array(x.any()).optional(),
    ncCustom: x.boolean().optional(),
    confBracket: x.any().optional(),
    natBracket: x.any().optional(),
    classHist: x.array(x.any()).optional(),
    nitBracket: x.any().optional(),
    poll: x.any().optional(),
    jobOffers: x.array(x.string()).optional(),
    tenureStart: A.optional(),
    heat: A.optional(),
    fired: x.boolean().optional(),
    achieved: x.record(x.string(), A).optional(),
    crep: A.optional(),
    firedMsg: x.string().optional(),
    walkons: x.array($f).max(100).optional(),
    signingEvents: x
      .array(
        x.object({
          id: x.string(),
          playerId: x.string(),
          name: x.string(),
          ovr: A,
          pos: x.string(),
          year: A,
          round: A,
          nil: A,
          origin: x.string(),
        })
      )
      .max(100)
      .optional(),
    rng: A,
    seq: A,
    year: A,
    school: x.object({
      id: x.string(),
      name: x.string(),
      mascot: x.string(),
      short: x.string(),
      city: x.string(),
      color: x.string(),
      wins: A,
      budget: A,
      rep: A,
      rating: A,
      league: x.string(),
      difficulty: x.string(),
      story: x.string(),
      gi: A.optional(),
      generated: x.boolean().optional(),
    }),
    coach: x.string(),
    specialty: x.string(),
    level: A,
    phase: x.enum([
      "Offseason",
      "Regular season",
      "Conference tournament",
      "National tournament",
      "Season review",
    ]),
    round: A,
    scouts: A,
    budget: A,
    rep: A,
    chemistry: A,
    roster: x.array($f).max(15),
    prospects: x.array($f).max(600),
    departed: x.array(
      x.object({
        name: x.string(),
        reason: x.string(),
        ovr: A,
        faceSeed: A.optional(),
        portrait: A.optional(),
        pos: x.string().optional(),
      })
    ),
    league: x.array(Xs).min(8).max(18),
    schedule: x.array(qC).max(60),
    nc: x.array(x.object({ teamId: x.string(), venue: x.string(), guarantee: A.optional(), event: x.string().optional(), rd: A.optional() })).length(12),
    opponents: x.array(Xs).min(63),
    lineup: x.array(x.string()).max(5),
    shotPriority: x.array(x.string()).max(5).optional(),
    tactics: x.object({ offense: x.string(), defense: x.string(), pace: x.string(), tmo: x.string().optional() }),
    tacLock: x.object({ offense: x.boolean().optional(), defense: x.boolean().optional(), pace: x.boolean().optional() }).optional(),
    history: x.array(
      x.object({
        year: A,
        sid: x.string().optional(),
        goal: A.optional(),
        school: x.string().optional(),
        wins: A,
        losses: A,
        cw: A,
        cl: A,
        rep: A,
        budget: A,
        award: x.string(),
        result: x.string(),
        leader: x.string(),
        recruits: x.array(x.string()),
        hl: x.any().optional(),
        tsos: A.optional(),
        cc: x.boolean().optional(),
        bt: x.string().optional(),
        awards: x.any().optional(),
        games: x.any().optional(),
        conf: x.any().optional(),
        nat: x.any().optional(),
        nit: x.any().optional(),
        players: x.array(x.object({ name: x.string(), pos: x.string(), ovr: A, stats: Fn })),
      })
    ),
    news: x.array(x.object({ title: x.string(), body: x.string(), year: A })),
    bracket: x.array(
      x.array(
        x.object({
          a: Xs,
          b: Xs,
          sa: A.optional(),
          sb: A.optional(),
          winner: Xs.optional(),
          ff: A.optional(),
          pi: A.optional(),
          slot: x.array(x.any()).optional(),
        })
      )
    ),
    tournament: x.string(),
    tournamentRound: A,
    confChampion: x.boolean(),
    berth: x.string(),
    result: x.string(),
    signings: x.array(x.string()),
    lastBudget: A,
  });
function ac(e) {
  let a = HC.safeParse(e);
  if (!a.success)
    throw new Error(
      "This is not a valid College Dynasty career save. Choose a file made with Export career."
    );
  let t = a.data;
  if (
    new Set(t.roster.map((l) => l.id)).size !== t.roster.length ||
    t.lineup.some((l) => l !== "" && !t.roster.some((u) => u.id === l)) ||
    t.nc.some((l) => !t.opponents.some((u) => u.id === l.teamId))
  )
    throw new Error("The save file contains an incomplete roster or schedule.");
  return hy(t);
}
function Zs(e) {
  return JSON.parse(JSON.stringify(e));
}
// Save format number written into every save. Saves from before this existed have none (treated as 0).
// Bump it when the shape of the saved wrapper changes, and add a step to migrateSaveWrapper below.
var SAVE_VERSION = 1,
  PRELOAD_KEY = Gn + "-preload";
// What the last load did (read by tests): { from, repaired: [...] }
window.__saveLoad = { from: null, repaired: [] };
function migrateSaveWrapper(a, steps) {
  if (!a || typeof a != "object") return a;
  // A bare career (no save record around it) is wrapped
  if (!a.game && Array.isArray(a.roster) && a.school) {
    steps.push("wrapped a bare career in a save record");
    a = { game: a };
  }
  if (!Number.isInteger(a.revision) || a.revision < 0) {
    a.revision = Number.isFinite(a.revision) && a.revision >= 0 ? Math.floor(a.revision) : 0;
    steps.push("reset the save counter");
  }
  if (typeof a.savedAt != "string") {
    a.savedAt = new Date().toISOString();
    steps.push("restored the save time");
  }
  return a;
}
// Tries to fix a career that fails the schema or the integrity checks; returns the opened career or throws.
function repairCareer(g, steps) {
  if (!g || typeof g != "object") throw new Error("empty career");
  for (let pass = 0; pass < 6; pass++) {
    try {
      return ac(g);
    } catch (err) {
      let r = HC.safeParse(g),
        changed = !1;
      if (!r.success) {
        for (let iss of r.error.issues) {
          let path = iss.path,
            key = path[path.length - 1],
            par = path.slice(0, -1).reduce((o, k) => (o == null ? o : o[k]), g);
          if (par == null || typeof par != "object" || key === undefined) continue;
          if (iss.code === "invalid_type" && (iss.received === "null" || iss.received === "undefined")) {
            if (iss.expected === "number") par[key] = 0;
            else if (!Array.isArray(par)) delete par[key];
            else continue;
            changed = !0;
          } else if (iss.code === "invalid_type" && iss.expected === "number" && typeof par[key] == "string" && isFinite(+par[key])) {
            par[key] = +par[key];
            changed = !0;
          } else if (iss.code === "too_big" && typeof par[key] == "string") {
            par[key] = par[key].slice(0, iss.maximum);
            changed = !0;
          }
        }
        if (changed) steps.push("fixed damaged values");
      } else if (Array.isArray(g.roster) && Array.isArray(g.lineup) && Array.isArray(g.nc) && Array.isArray(g.opponents)) {
        // Integrity problems: duplicate players, a lineup spot nobody fills, a schedule slot for a missing team
        let seen = new Set(),
          ids = new Set(g.opponents.map((u) => u.id)),
          r0 = g.roster.length,
          l0 = g.lineup.join(),
          s0 = g.nc.length;
        g.roster = g.roster.filter((u) => !seen.has(u.id) && seen.add(u.id));
        g.lineup = g.lineup.filter((l) => l === "" || seen.has(l));
        g.nc = g.nc.filter((l) => ids.has(l.teamId));
        if (g.roster.length !== r0 || g.lineup.join() !== l0 || g.nc.length !== s0) {
          changed = !0;
          steps.push("fixed the roster or schedule");
        }
      }
      if (!changed) throw err;
    }
  }
  return ac(g);
}
// Performance log: how long each action took (including waiting for the save lock and writing the save).
// Kept in memory and in localStorage (last 200) so it survives a reload; shown in Settings > Diagnostics.
var PERF_KEY = "real-college-dynasty-perflog",
  perfLog = (() => {
    try {
      let l = JSON.parse(localStorage.getItem(PERF_KEY) || "[]");
      return Array.isArray(l) ? l.slice(-200) : [];
    } catch {
      return [];
    }
  })(),
  perfSaveKb = 0;
function perfRecord(action, ms) {
  perfLog.push({ at: new Date().toISOString(), action, ms: Math.round(ms), kb: perfSaveKb });
  if (perfLog.length > 200) perfLog.splice(0, perfLog.length - 200);
  try {
    localStorage.setItem(PERF_KEY, JSON.stringify(perfLog));
  } catch {}
}
function perfSlowest(n) {
  return perfLog
    .slice()
    .sort((x, y) => y.ms - x.ms)
    .slice(0, n);
}
function perfClear() {
  perfLog.length = 0;
  try {
    localStorage.removeItem(PERF_KEY);
  } catch {}
}
window.__perf = { log: () => perfLog.slice(), slowest: perfSlowest };
function My() {
  if (ec && gl) return ((du = !1), Zs(gl));
  let e;
  try {
    ((e = localStorage.getItem(Gn)), (du = !0));
  } catch {
    return ((du = !1), gl ? Zs(gl) : null);
  }
  if (e) {
    // Automatic copy of the save before it is loaded (never allowed to break the real save)
    try {
      localStorage.setItem(PRELOAD_KEY, e);
    } catch {}
    let steps = [];
    try {
      let a = migrateSaveWrapper(JSON.parse(e), steps),
        from = Number.isInteger(a.saveVersion) ? a.saveVersion : 0;
      a.game = repairCareer(a.game, steps);
      a.saveVersion = SAVE_VERSION;
      window.__saveLoad = { from, repaired: steps };
      if (steps.length || from !== SAVE_VERSION) Ry(a);
      return ((gl = a), (Pn = !0), Zs(a));
    } catch {
      window.__saveLoad = { from: null, repaired: steps, failed: !0 };
      throw new Error("The saved career could not be opened. Import an exported career file to recover it.");
    }
  }
  return Pn && gl ? Zs(gl) : ((Pn = !0), null);
}
// "Start a new career" on the Career unavailable screen: keep the unreadable save under "-broken", then clear it
function clearBrokenSave() {
  try {
    let raw = localStorage.getItem(Gn);
    raw && localStorage.setItem(Gn + "-broken", raw);
    localStorage.removeItem(Gn);
  } catch {}
  ((gl = null), (Pn = !0));
}
function Ry(e) {
  e.saveVersion = SAVE_VERSION;
  let a = JSON.stringify(e);
  perfSaveKb = Math.round(a.length / 1024);
  try {
    (localStorage.setItem(Gn, a), (du = !0), (ec = !1));
    takeBackup(e, a);
  } catch {
    // Out of room: drop the automatic pre-load copy, then the rolling backups, and try again before going session-only
    try {
      (localStorage.removeItem(PRELOAD_KEY), localStorage.setItem(Gn, a), (du = !0), (ec = !1));
    } catch {
      try {
        (dropBackups(), localStorage.setItem(Gn, a), (du = !0), (ec = !1));
      } catch {
        ((du = !1), (ec = !0));
      }
    }
  }
  ((gl = Zs(e)), (Pn = !0));
}
// Rolling backups (item 21): a copy of the career at the end of each of the last BACKUP_KEEP seasons, taken the first time the
// phase becomes "Season review". Each is gzip-compressed (a save is very repetitive, so it shrinks to a fraction of its size and
// the browser's storage limit of about 5 MB is not used up), stored beside the save under Gn + "-bk-A/B/C" and listed newest
// first in Gn + "-bk-index". They live in the same browser as the career, so they guard against mistakes (a bad decision, a
// damaged save), not against losing the browser's data: Export career is for that. A backup is never allowed to break the real
// save, and a browser without CompressionStream simply makes no backups.
var BACKUP_KEEP = 4,
  BACKUP_KEYS = [Gn + "-bk-A", Gn + "-bk-B", Gn + "-bk-C", Gn + "-bk-D"],
  BACKUP_INDEX = Gn + "-bk-index",
  EXPORT_KEY = Gn + "-export",
  backupQueue = Promise.resolve(),
  backupTags = new Set();
async function gzipText(text) {
  let buf = new Uint8Array(
      await new Response(new Blob([text]).stream().pipeThrough(new CompressionStream("gzip"))).arrayBuffer()
    ),
    bin = "";
  for (let i = 0; i < buf.length; i += 32768) bin += String.fromCharCode.apply(null, buf.subarray(i, i + 32768));
  return "gz1:" + btoa(bin);
}
async function gunzipText(value) {
  let bin = atob(value.slice(4)),
    buf = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return await new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream("gzip"))).text();
}
function backupList() {
  try {
    let l = JSON.parse(localStorage.getItem(BACKUP_INDEX) || "[]");
    return Array.isArray(l) ? l.filter((b) => b && BACKUP_KEYS.includes(b.key)) : [];
  } catch {
    return [];
  }
}
function dropBackups() {
  try {
    (BACKUP_KEYS.forEach((k) => localStorage.removeItem(k)), localStorage.removeItem(BACKUP_INDEX));
  } catch {}
}
// Called after every save. Does nothing unless this save is the first one of a finished season.
function takeBackup(e, text) {
  try {
    let g = e.game;
    if (!g || !g.school || typeof CompressionStream > "u") return;
    // an end-of-season copy, and a start-of-season copy (the first save of a new year's regular season, before a game is played)
    let start = g.phase === "Regular season" && !(g.schedule || []).some((o) => o.played);
    if (g.phase !== "Season review" && !start) return;
    let tag = g.school.id + "-" + g.year + (start ? "-start" : "");
    if (backupTags.has(tag) || backupList().some((b) => b.tag === tag)) return;
    backupTags.add(tag);
    let h = (g.history || [])[(g.history || []).length - 1] || {},
      info = {
        tag,
        start,
        school: g.school.name,
        year: g.year,
        wins: start ? undefined : h.wins,
        losses: start ? undefined : h.losses,
        result: start ? undefined : h.result,
        savedAt: new Date().toISOString(),
      };
    // one at a time, so two quick saves cannot write the index over each other
    backupQueue = backupQueue
      .then(async () => {
        let z = await gzipText(text),
          write = (list) => {
            let key = list.length >= BACKUP_KEEP ? list.pop().key : BACKUP_KEYS.find((k) => !list.some((b) => b.key === k));
            localStorage.setItem(key, z);
            list.unshift({ ...info, key, kb: Math.round(z.length / 1024) });
            localStorage.setItem(BACKUP_INDEX, JSON.stringify(list));
          };
        try {
          write(backupList());
        } catch {
          // out of room: keep only this newest backup and try once more
          (dropBackups(), write([]));
        }
      })
      .catch(() => {
        // storage really is full (or compression failed): skip this backup, the real save is already stored
      });
  } catch {}
}
// The game inside a backup, repaired like any loaded save (null if it cannot be read)
async function readBackup(key) {
  try {
    let v = localStorage.getItem(key);
    return repairCareer(JSON.parse(v.startsWith("gz1:") ? await gunzipText(v) : v).game, []);
  } catch {
    return null;
  }
}
// Export reminder: remember the last Export career and tell how many finished seasons have passed since
function noteExport(e) {
  try {
    localStorage.setItem(
      EXPORT_KEY,
      JSON.stringify({ at: new Date().toISOString(), year: e.year, seasons: (e.history || []).length })
    );
  } catch {}
  window.dispatchEvent(new Event("cd-export"));
}
function exportStatus(e) {
  let last = null;
  try {
    last = JSON.parse(localStorage.getItem(EXPORT_KEY) || "null");
  } catch {}
  let seasons = e ? (e.history || []).length : 0,
    since = last && last.seasons <= seasons ? last.seasons : 0,
    behind = seasons - since;
  return { last, behind, due: !!e && behind >= 2 };
}
function Oy() {
  return du ? "Saved on this computer" : "Session only \xB7 export your save";
}
function By() {
  return du;
}
