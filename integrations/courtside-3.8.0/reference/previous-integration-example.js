var ARCADE_HTML = "@@ARCADE_HTML@@";
// The build replaces this marker with the self-contained court, preserving offline play.
function W_arcadeMatch(e, g) {
  let active = e.roster.filter((p) => !p.redshirt && !p.injury),
    mine = e.lineup
      .map((id) => active.find((p) => p.id === id))
      .filter(Boolean);
  for (let p of [...active].sort(
    (a, b) => b.minutes - a.minutes || b.ovr - a.ovr,
  ))
    if (mine.length < 5 && !mine.includes(p)) mine.push(p);
  if (mine.length !== 5)
    throw new Error("Five healthy players are needed to play.");
  let roster = e.rosters?.[g.oppId];
  if (!roster || roster.length < 5)
    throw new Error("The opponent needs a full roster to play.");
  let chosen = [];
  for (let pos of Le) {
    let p = [...roster]
      .filter((p) => !chosen.includes(p))
      .sort((a, b) => (b.p === pos) - (a.p === pos) || b.o - a.o)[0];
    chosen.push(p);
  }
  let opponent = chosen.map((p) => ({
    id: p.i,
    name: p.n,
    pos: p.p,
    ovr: p.o,
    attrs: W_at(p),
    tend: {
      three: le(
        // Same shooting/position curve as career players; compact opponents use a stable ID hash for variation.
        0.36 +
          (W_at(p)[2] - 60) * 0.006 +
          (Le.indexOf(p.p) < 2 ? 0.1 : Le.indexOf(p.p) > 2 ? -0.16 : 0) +
          ((TS(String(p.i) + "-three") % 13) - 6) / 100,
        0.04,
        0.72,
      ),
    },
  }));
  let profile = (p) => ({
    id: p.id,
    name: p.name,
    pos: p.pos,
    ovr: p.ovr,
    attrs: [...p.attrs],
    tendencies: W_tend(p),
  });
  return {
    gid: g.id,
    year: e.year,
    seed: e.rng,
    teams: [
      {
        name: e.school.name,
        short: e.school.short || e.school.name,
        players: mine.map(profile),
      },
      {
        name: g.opponent,
        short: e.opponents.find((p) => p.id === g.oppId)?.short || g.opponent,
        players: opponent.map(profile),
      },
    ],
  };
}
function W_saveArcade(e, r) {
  let game = e.schedule.find((g) => !g.played);
  if (
    e.phase !== "Regular season" ||
    e.live ||
    !game ||
    r?.gid !== game.id ||
    r.year !== e.year
  )
    throw new Error("This game is no longer available.");
  let config = W_arcadeMatch(e, game),
    integer = (n, max) => Number.isInteger(n) && n >= 0 && n <= max;
  if (
    !Array.isArray(r.score) ||
    r.score.length !== 2 ||
    !r.score.every((n) => integer(n, 1000)) ||
    r.score[0] === r.score[1] ||
    !integer(r.ot, 20) ||
    !integer(r.seed, 4294967295) ||
    !integer(r.poss, 3000) ||
    !Array.isArray(r.box) ||
    r.box.length !== 5
  )
    throw new Error("Invalid final result.");
  let expected = config.teams[0].players.map((p) => p.id),
    seen = new Set(),
    minutes = 40 + r.ot * 5;
  let u = r.box.map((row) => {
    if (!expected.includes(row.id) || seen.has(row.id))
      throw new Error("The final lineup does not match this game.");
    seen.add(row.id);
    let p = e.roster.find((p) => p.id === row.id),
      box = { ...zs(), id: p.id, name: p.name, pos: p.pos, gp: 1 };
    for (let key of Object.keys(zs()).filter((k) => k !== "gp")) {
      if (!integer(row[key], key === "min" ? minutes : 3000))
        throw new Error("Invalid player statistics.");
      box[key] = row[key];
    }
    if (
      box.min !== minutes ||
      box.fgm > box.fga ||
      box.tpm > box.tpa ||
      box.tpm > box.fgm ||
      box.tpa > box.fga ||
      box.ftm > box.fta ||
      box.pts !== box.fgm * 2 + box.tpm + box.ftm
    )
      throw new Error("Inconsistent player statistics.");
    return box;
  });
  if (u.reduce((n, p) => n + p.pts, 0) !== r.score[0])
    throw new Error("Player points do not match the final score.");
  e.rng = r.seed;
  W_finishPlayed(e, game, {
    l: e.roster.filter((p) => expected.includes(p.id)),
    t: new Map(u.map((p) => [p.id, p.min])),
    u,
    us: r.score[0],
    them: r.score[1],
    ot: r.ot,
    poss: r.poss,
    tmo: [0, 0],
  });
}
// Keep the srcDoc untouched when the final result reaches the parent.
var ArcadeCourt = (0, N.memo)(function ArcadeCourt({ html, frame }) {
  return (0, s.jsx)("iframe", {
    ref: frame,
    title: "Play College Dynasty basketball",
    sandbox: "allow-scripts",
    srcDoc: html,
    style: {
      flex: 1,
      minHeight: 0,
      width: "100%",
      border: 0,
      background: "#07131e",
    },
  });
});
function ArcadeGame({ g, game, run, onClose, onSaved }) {
  let [config] = (0, N.useState)(() => W_arcadeMatch(g, game)),
    [result, setResult] = (0, N.useState)(null),
    [error, setError] = (0, N.useState)(""),
    frame = (0, N.useRef)(null);
  let [html] = (0, N.useState)(() =>
    ARCADE_HTML.replace(
      "<script>",
      () =>
        "<script>window.COLLEGE_DYNASTY_MATCH=" +
        JSON.stringify(config).replace(/</g, "\\u003c") +
        ";<\/script><script>",
    ),
  );
  (0, N.useEffect)(() => {
    let receive = (event) => {
      if (
        event.source === frame.current?.contentWindow &&
        event.data?.type === "college-dynasty-final" &&
        event.data.gid === config.gid &&
        event.data.year === config.year
      )
        setResult(event.data);
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [config]);
  return (0, s.jsxs)("div", {
    className: "ceremony arcade-game",
    style: {
      width: "100%",
      maxWidth: "100%",
      height: "94vh",
      display: "flex",
      flexDirection: "column",
    },
    children: [
      (0, s.jsxs)("div", {
        className: "ceremony-head",
        style: { flexDirection: "column", alignItems: "stretch", gap: 4 },
        children: [
          (0, s.jsx)("h2", {
            children: g.school.name + " vs " + game.opponent,
          }),
          (0, s.jsx)("p", {
            className: "muted",
            children:
              "Your starting five · two 20-minute halves · final score and stats count in your season",
          }),
        ],
      }),
      (0, s.jsx)(ArcadeCourt, { html, frame }),
      (0, s.jsxs)("div", {
        className: "ceremony-foot row gap",
        children: [
          (0, s.jsx)(X, {
            onClick: onClose,
            children: result ? "Discard game" : "Leave without saving",
          }),
          result &&
            (0, s.jsx)(X, {
              primary: true,
              onClick: async () => {
                try {
                  if ((await run({ type: "arcadeFinish", result })) !== false)
                    onSaved();
                } catch (e) {
                  setError(e.message);
                }
              },
              children: "Save result to season · " + result.score.join("–"),
            }),
          error && (0, s.jsx)("span", { children: error }),
        ],
      }),
    ],
  });
}
