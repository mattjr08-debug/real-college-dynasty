var Hy = Fe(Dt());
function VC(e) {
  let a = e >>> 0;
  ((a = Math.imul(a ^ (a >>> 16), 2146121005)),
    (a = Math.imul(a ^ (a >>> 15), 2221713035)),
    (a = (a ^ (a >>> 16)) >>> 0));
  let t = a % 180;
  return { preset: t, sheet: t < 16 ? 0 : 1, tile: t < 16 ? t : t - 16 };
}
function jC(e) {
  return { sheet: 0, x: ((e % 14) * 100) / 13, y: (Math.floor(e / 14) * 100) / 13, scale: 1400 };
}
function qy({ p: e, size: a = "" }) {
  let ph = typeof REAL_PHOTO_PATH === "function" ? REAL_PHOTO_PATH(e.faceSeed) : null;
  if (ph)
    return (0, Hy.jsx)("div", {
      role: "img",
      "aria-label": `${e.name} photo`,
      className: `portrait realistic-face photo ${a}`,
      style: typeof ph === "string" ? { backgroundImage: `url("${ph}")`, backgroundPosition: "center top", backgroundSize: "cover", backgroundRepeat: "no-repeat" } : { backgroundImage: `url("${ph.url}")`, backgroundPosition: `${ph.x}% ${ph.y}%`, backgroundSize: `${ph.w}% ${ph.h}%`, backgroundRepeat: "no-repeat" },
    });
  let t = jC(VC(e.faceSeed ?? e.portrait + 1).preset);
  return (0, Hy.jsx)("div", {
    role: "img",
    "aria-label": `${e.name} portrait`,
    className: `portrait realistic-face atlas-${t.sheet} ${a}`,
    style: {
      backgroundPosition: `${t.x}% ${t.y}%`,
      backgroundSize: `${t.scale}% ${t.scale}%`,
      backgroundRepeat: "no-repeat",
    },
  });
}
var s = Fe(Dt()),
  uc = (0, N.createContext)(!1);
function X({
  children: e,
  onClick: a,
  primary: t = !1,
  small: l = !1,
  disabled: u = !1,
  className: o = "",
  title: r,
  type: n = "button",
}) {
  let i = (0, N.useContext)(uc);
  return (0, s.jsx)("button", {
    type: n,
    title: r,
    className: `btn ${t ? "primary" : ""} ${l ? "small" : ""} ${o}`,
    disabled: i || u,
    onClick: a,
    children: e,
  });
}
var LOGO_SHAPES = {
  "delta":
    '<path d="M50 3 L89 15 V49 C89 74 71 90 50 98 C29 90 11 74 11 49 V15 Z" fill="#11151d" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M50 20 L79 74 H21 Z" fill="none" stroke="currentColor" stroke-width="8" stroke-linejoin="round"/><path d="M55 33 L40 57 H50 L44 73 L62 48 H51 Z" fill="#fff" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>',
  "mesa":
    '<path d="M50 3 L89 15 V49 C89 74 71 90 50 98 C29 90 11 74 11 49 V15 Z" fill="#11151d" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M14 80 V70 H28 V62 H72 V70 H86 V80 Z" fill="currentColor" opacity=".3"/><path d="M30 70 C16 62 24 46 40 50 C54 54 60 44 56 34" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round"/><path d="M46 20 L66 30 L62 46 L50 48 L42 36 Z" fill="currentColor"/><path d="M50 30 L58 33 L51 37 Z" fill="#fff"/><path d="M65 33 L77 28 M65 33 L76 38" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><path d="M30 70 L20 76 M30 70 L22 66" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>',
  "coastal":
    '<path d="M50 3 L89 15 V49 C89 74 71 90 50 98 C29 90 11 74 11 49 V15 Z" fill="#11151d" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M50 40 C42 30 28 28 10 38 C24 38 33 42 40 52 L46 60 H54 L60 52 C67 42 76 38 90 38 C72 28 58 30 50 40 Z" fill="currentColor"/><path d="M44 60 L50 82 L56 60 Z" fill="currentColor"/><path d="M42 80 L50 72 L58 80 L50 86 Z" fill="currentColor"/><circle cx="50" cy="34" r="9" fill="#fff"/><path d="M45 38 L50 50 L55 38 Z" fill="currentColor"/><path d="M42 31 H58" stroke="#11151d" stroke-width="3.5" stroke-linecap="round"/><circle cx="46" cy="31" r="1.6" fill="#fff"/><circle cx="54" cy="31" r="1.6" fill="#fff"/>',
  "lake":
    '<path d="M50 3 L89 15 V49 C89 74 71 90 50 98 C29 90 11 74 11 49 V15 Z" fill="#11151d" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M22 14 L38 34 H62 L78 14 L82 48 L64 70 L50 84 L36 70 L18 48 Z" fill="currentColor"/><path d="M30 46 L44 50 L34 56 Z M70 46 L56 50 L66 56 Z" fill="#fff"/><path d="M38 60 L50 52 L62 60 L56 82 H44 Z" fill="#fff"/><path d="M44 62 H56 L50 70 Z" fill="#11151d"/><path d="M50 70 V76" stroke="#11151d" stroke-width="3" stroke-linecap="round"/>',
  "cascadia":
    '<path d="M50 3 L89 15 V49 C89 74 71 90 50 98 C29 90 11 74 11 49 V15 Z" fill="#11151d" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M14 80 L38 46 L52 66 L62 54 L86 80 Z" fill="currentColor" opacity=".35"/><path d="M50 14 L64 36 H57 L69 54 H58 L72 74 H28 L42 54 H31 L43 36 H36 Z" fill="currentColor"/><rect x="46" y="74" width="8" height="10" fill="#fff"/>',
  "mission":
    '<path d="M50 3 L89 15 V49 C89 74 71 90 50 98 C29 90 11 74 11 49 V15 Z" fill="#11151d" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M50 38 L38 32 L8 42 L24 46 L10 56 L28 56 L22 68 L42 60 L50 76 L58 60 L78 68 L72 56 L90 56 L76 46 L92 42 L62 32 Z" fill="currentColor"/><circle cx="50" cy="32" r="9" fill="#fff"/><path d="M44 36 L50 46 L56 36 Z" fill="currentColor"/><circle cx="46.5" cy="30" r="1.8" fill="#11151d"/><circle cx="53.5" cy="30" r="1.8" fill="#11151d"/>',
  "peachtree":
    '<path d="M50 3 L89 15 V49 C89 74 71 90 50 98 C29 90 11 74 11 49 V15 Z" fill="#11151d" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M22 24 L40 36 H60 L78 24 L82 50 C82 68 68 82 50 84 C32 82 18 68 18 50 Z" fill="currentColor"/><path d="M30 50 Q38 42 47 52 Q38 56 30 50 Z M70 50 Q62 42 53 52 Q62 56 70 50 Z" fill="#fff"/><path d="M44 66 H56 L50 73 Z" fill="#11151d"/><path d="M50 58 V66 M36 70 L26 72 M64 70 L74 72" stroke="#11151d" stroke-width="2.5" stroke-linecap="round"/>',
  "capital":
    '<path d="M50 3 L89 15 V49 C89 74 71 90 50 98 C29 90 11 74 11 49 V15 Z" fill="#11151d" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M20 68 L15 32 L35 48 L50 24 L65 48 L85 32 L80 68 Z" fill="currentColor"/><rect x="20" y="70" width="60" height="9" rx="2" fill="#fff"/><circle cx="15" cy="30" r="4.5" fill="#fff"/><circle cx="50" cy="21" r="4.5" fill="#fff"/><circle cx="85" cy="30" r="4.5" fill="#fff"/>',
  "metro":
    '<path d="M50 3 L89 15 V49 C89 74 71 90 50 98 C29 90 11 74 11 49 V15 Z" fill="#11151d" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M30 82 V42 C30 28 40 22 50 22 C60 22 70 28 70 42 V82 Z" fill="currentColor"/><rect x="33" y="44" width="34" height="6" rx="2" fill="#11151d"/><rect x="47" y="44" width="6" height="28" fill="#11151d"/><path d="M50 22 C54 8 70 6 78 14 C66 14 60 18 58 24 Z" fill="#fff"/>',
  "lone":
    '<path d="M50 3 L89 15 V49 C89 74 71 90 50 98 C29 90 11 74 11 49 V15 Z" fill="#11151d" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M58 26 L44 36 C36 44 28 54 26 62 C25 69 30 73 36 72 L44 69 L50 67 C52 73 54 79 54 84 L72 84 C74 70 72 50 66 34 Z" fill="currentColor"/><path d="M56 28 L55 14 L64 26 Z" fill="currentColor"/><circle cx="49" cy="43" r="3" fill="#11151d"/><circle cx="31" cy="65" r="2" fill="#11151d"/><path d="M64 32 C80 36 82 56 74 78 C73 64 69 52 62 44 Z" fill="#fff"/><path d="M24 24 L27 32 L35 32 L29 37 L31 45 L24 40 L17 45 L19 37 L13 32 L21 32 Z" fill="#fff"/>',
};
var GLY = {
    star: '<path d="M50 24 L57 42 L77 43 L61 55 L67 74 L50 63 L33 74 L39 55 L23 43 L43 42 Z" fill="currentColor"/>',
    bolt: '<path d="M58 20 L36 54 H49 L42 82 L67 44 H52 Z" fill="currentColor"/>',
    wave: '<path d="M18 54 C28 40 40 40 50 54 S72 68 82 54 V72 H18 Z" fill="currentColor"/><path d="M18 40 C28 26 40 26 50 40 S72 54 82 40" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>',
    peak: '<path d="M16 74 L40 36 L52 56 L62 44 L84 74 Z" fill="currentColor"/><path d="M40 36 L47 48 L37 48 Z" fill="#fff"/>',
    flame:
      '<path d="M50 18 C59 34 72 40 70 58 C68 72 58 80 50 80 C40 80 30 72 32 56 C34 48 40 44 42 36 C47 41 48 30 50 18 Z" fill="currentColor"/><path d="M50 50 C56 58 59 63 55 71 C50 74 43 71 43 64 C43 58 48 56 50 50 Z" fill="#fff"/>',
    wing: '<path d="M18 64 C24 36 52 20 82 24 C68 28 60 34 56 46 C64 42 72 42 78 44 C64 46 58 52 54 62 C60 60 66 60 70 62 C58 66 46 72 36 78 C28 74 22 70 18 64 Z" fill="currentColor"/>',
    crown:
      '<path d="M20 68 L16 32 L36 50 L50 26 L64 50 L84 32 L80 68 Z" fill="currentColor"/><rect x="20" y="70" width="60" height="8" rx="2" fill="#fff"/>',
    anchor:
      '<circle cx="50" cy="26" r="7" fill="none" stroke="currentColor" stroke-width="6"/><path d="M50 33 V78 M33 46 H67 M24 62 C27 76 38 80 50 80 C62 80 73 76 76 62" stroke="currentColor" stroke-width="7" fill="none" stroke-linecap="round"/>',
    paw: '<ellipse cx="50" cy="64" rx="18" ry="14" fill="currentColor"/><circle cx="30" cy="46" r="8" fill="currentColor"/><circle cx="45" cy="34" r="8" fill="currentColor"/><circle cx="60" cy="34" r="8" fill="currentColor"/><circle cx="74" cy="46" r="8" fill="currentColor"/>',
    claw: '<path d="M28 26 L44 78 M46 22 L58 78 M64 26 L74 76" stroke="currentColor" stroke-width="9" stroke-linecap="round"/>',
    arrow:
      '<path d="M22 78 L72 28 M72 28 H52 M72 28 V48" stroke="currentColor" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    sun: '<circle cx="50" cy="50" r="15" fill="currentColor"/><path d="M50 20 V30 M50 70 V80 M20 50 H30 M70 50 H80 M29 29 L36 36 M64 64 L71 71 M71 29 L64 36 M29 71 L36 64" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>',
    tree: '<path d="M50 18 L68 44 H59 L74 64 H59 V80 H41 V64 H26 L41 44 H32 Z" fill="currentColor"/>',
  },
  MAS = {
    Blues: "bolt",
    Rattlers: "claw",
    Ospreys: "wing",
    Wolves: "paw",
    Evergreens: "tree",
    Hornets: "bolt",
    Scorpions: "claw",
    Bison: "peak",
    Gators: "wave",
    Elk: "peak",
    Herons: "wing",
    Raiders: "arrow",
    Jackrabbits: "bolt",
    Admirals: "anchor",
    Condors: "wing",
    Bears: "paw",
    Otters: "wave",
    Pelicans: "wing",
    Cardinals: "wing",
    Matadors: "crown",
    Sharks: "wave",
    Titans: "crown",
    Argonauts: "anchor",
    Blizzard: "star",
    Firebirds: "flame",
    Mustangs: "bolt",
    Panthers: "paw",
    Hawks: "wing",
    Lions: "crown",
    Tigers: "claw",
  },
  SHP = [
    '<path d="M50 3 L89 15 V49 C89 74 71 90 50 98 C29 90 11 74 11 49 V15 Z"',
    '<circle cx="50" cy="50" r="46"',
    '<path d="M50 4 L90 27 V73 L50 96 L10 73 V27 Z"',
    '<path d="M14 8 H86 V60 L50 94 L14 60 Z"',
    '<path d="M50 3 L96 50 L50 97 L4 50 Z"',
  ];
function logoFor(e) {
  // hand-drawn logo for the 30 playable schools (LOGO_SHAPES here and in 0064b-LogoArt.js); the generated one is for any other school
  if (typeof REAL_LOGOS !== "undefined" && REAL_LOGOS[e.name]) return '<image href="' + REAL_LOGOS[e.name] + '" x="2" y="2" width="96" height="96" preserveAspectRatio="xMidYMid meet"/>';
  if (LOGO_SHAPES[e.id]) return LOGO_SHAPES[e.id];
  let h = TS(String(e.id)),
    k = MAS[e.mascot] || Object.keys(GLY)[h % Object.keys(GLY).length],
    sh = SHP[h % SHP.length],
    d = GLY[k];
  return (
    sh +
    ' fill="#11151d" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><g transform="translate(15 4) scale(.7)">' +
    d +
    '</g><rect x="28" y="66" width="44" height="17" rx="3" fill="currentColor"/><text x="50" y="79" text-anchor="middle" font-size="13" font-weight="800" fill="#11151d" font-family="Arial,Helvetica,sans-serif" letter-spacing=".5">' +
    String(e.short || "").slice(0, 3) +
    "</text>"
  );
}
function SchoolLogo({ school: e }) {
  return (0, s.jsx)("svg", {
    viewBox: "0 0 100 100",
    role: "img",
    "aria-label": `${e.name} logo`,
    style: { color: e.color, width: "100%", height: "100%", display: "block" },
    dangerouslySetInnerHTML: { __html: logoFor(e) },
  });
}
function Ja({ p: e, size: a = "" }) {
  return (0, s.jsx)(qy, { p: e, size: a });
}
function he({ children: e, tone: a = "" }) {
  return (0, s.jsx)("span", { className: `badge ${a}`, children: e });
}
function Ys({ p: e }) {
  return (0, s.jsxs)("span", {
    className: `mood ${e.morale >= 70 ? "good" : e.morale >= 50 ? "neutral" : e.morale >= 30 ? "warning" : "bad"}`,
    children: [(0, s.jsx)(fo, { size: 12 }), Hf(e.morale)],
  });
}
function Wa({ value: e, tone: a = "" }) {
  return (0, s.jsx)("div", {
    className: `meter ${a}`,
    children: (0, s.jsx)("span", { style: { width: `${Math.min(100, Math.max(0, e))}%` } }),
  });
}
function Xn({ n: e }) {
  return (0, s.jsx)("span", {
    className: `stars star-${e || 0}`,
    "aria-label": `${e} stars`,
    children: e
      ? Array.from({ length: 5 }, (a, t) =>
          (0, s.jsx)(
            Ds,
            { size: 12, fill: t < e ? "currentColor" : "none", className: t < e ? "" : "dim" },
            t
          )
        )
      : (0, s.jsx)("span", { children: "UNRANKED" }),
  });
}
function yl({ title: e, body: a }) {
  return (0, s.jsxs)("div", {
    className: "empty",
    children: [
      (0, s.jsx)(It, { size: 28 }),
      (0, s.jsx)("h3", { children: e }),
      (0, s.jsx)("p", { children: a }),
    ],
  });
}
function qe({ title: e, meta: a, children: t, action: l }) {
  return (0, s.jsxs)("section", {
    className: "panel",
    children: [
      (0, s.jsxs)("div", {
        className: "section-head",
        children: [
          (0, s.jsxs)("div", {
            children: [(0, s.jsx)("h2", { children: e }), a && (0, s.jsx)("p", { children: a })],
          }),
          l,
        ],
      }),
      t,
    ],
  });
}
