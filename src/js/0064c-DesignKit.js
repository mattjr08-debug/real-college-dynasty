// Design kit (item 1 of the look-and-feel overhaul). The tokens live in src/css/ui-polish.css (section "design system").
// Shared components: Panel = qe, Stat tile = ca, Badge = he, Button = X, Empty state = yl (0064-group-Hy.js, 0093-group-ca.js);
// new here: Tabs, Modal, Sparkline, RatingBar and onTeam (a text colour that is readable on a school colour).
function onTeam(hex) {
  const h = String(hex || "#f27935").replace("#", ""),
    lin = (i) => {
      const v = parseInt(h.substr(i, 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    },
    lum = 0.2126 * lin(0) + 0.7152 * lin(2) + 0.0722 * lin(4);
  // dark text gives (lum + .05) / (.0066 + .05); white gives 1.05 / (lum + .05)
  return (lum + 0.05) / 0.0566 >= 1.05 / (lum + 0.05) ? "#10131a" : "#ffffff";
}
// Tabs: a row of buttons that wraps onto a second line (never scrolls sideways). tabs = [label] or [{id, label, count}]
function Tabs({ tabs: e, value: a, onChange: t, label: l }) {
  return (0, s.jsx)("div", {
    className: "chips ds-tabs",
    role: "tablist",
    "aria-label": l,
    children: e.map((u) => {
      const o = typeof u === "string" ? { id: u, label: u } : u;
      return (0, s.jsxs)(
        "button",
        {
          role: "tab",
          "aria-selected": o.id === a,
          className: o.id === a ? "active" : "",
          onClick: () => t(o.id),
          children: [o.label, o.count != null && (0, s.jsx)("span", { className: "ds-count", children: o.count })],
        },
        o.id
      );
    }),
  });
}
// Modal: every pop-up in the game is already built on Ao (0065-Ao.js): Esc and a click on the backdrop close it, Tab stays inside, focus returns to the button that opened it,
// the page behind does not scroll, and the dialog has role="dialog" and a label. New pop-ups must use Ao, not their own markup.
function Modal(props) {
  return Ao(props);
}
// Sparkline: a tiny SVG line of recent values (no library). values = [number], tone = "" | "good" | "bad"
function Sparkline({ values: e, tone: a = "", label: l }) {
  const t = (e || []).filter((o) => typeof o === "number" && isFinite(o));
  if (t.length < 2) return null;
  const u = Math.min(...t),
    o = Math.max(...t) - u || 1,
    r = t.map((n, i) => `${((i / (t.length - 1)) * 100).toFixed(1)},${(22 - ((n - u) / o) * 18).toFixed(1)}`),
    d = r[r.length - 1].split(",");
  return (0, s.jsxs)("svg", {
    className: `ds-spark ${a}`,
    viewBox: "0 0 100 26",
    preserveAspectRatio: "none",
    role: "img",
    "aria-label": l || "trend",
    children: [
      (0, s.jsx)("polyline", { points: r.join(" "), fill: "none", vectorEffect: "non-scaling-stroke" }),
      (0, s.jsx)("circle", { cx: d[0], cy: d[1], r: 2.6, vectorEffect: "non-scaling-stroke" }),
    ],
  });
}
// GrowthChart: scoring by season for one of your players (points a game, one bar per season) plus his rating now and last offseason's growth.
// The game keeps no rating history per player, so the bars show production, not rating.
function GrowthChart({ p: e }) {
  const yr = (y) => `${String(y).slice(2)}–${String(y + 1).slice(2)}`,
    pts = [
      ...(e.history || []).filter((h) => h.stats && h.stats.gp > 0).map((h) => ({ l: yr(h.year), v: h.stats.pts / h.stats.gp })),
      ...(e.stats && e.stats.gp > 0 ? [{ l: "Now", v: e.stats.pts / e.stats.gp }] : []),
    ].slice(-5),
    top = Math.max(1, ...pts.map((z) => z.v)),
    w = 100 / Math.max(pts.length, 3);
  return (0, s.jsxs)("div", {
    className: "growth-chart",
    children: [
      (0, s.jsxs)("div", {
        className: "growth-head",
        children: [
          (0, s.jsx)("h3", { children: "Growth by season" }),
          (0, s.jsxs)("span", {
            className: "muted",
            children: [e.ovr, " OVR now", e.growth > 0 ? ` \xB7 +${e.growth} last offseason` : e.growth < 0 ? ` \xB7 ${e.growth} last offseason` : ""],
          }),
        ],
      }),
      pts.length
        ? (0, s.jsxs)("svg", {
            viewBox: "0 0 100 44",
            preserveAspectRatio: "none",
            role: "img",
            "aria-label": "Points a game by season",
            className: "growth-svg",
            children: pts.map((z, i) =>
              (0, s.jsx)("rect", { x: i * w + w * 0.15, width: w * 0.7, y: 40 - (z.v / top) * 36, height: (z.v / top) * 36 + 0.5, rx: 1.5, className: i === pts.length - 1 ? "now" : "" }, i)
            ),
          })
        : (0, s.jsx)("p", { className: "muted", children: "The chart fills in once he has played games." }),
      pts.length > 0 &&
        (0, s.jsx)("div", {
          className: "growth-labels",
          children: pts.map((z, i) => (0, s.jsxs)("span", { children: [z.l, (0, s.jsx)("b", { children: z.v.toFixed(1) })] }, i)),
        }),
    ],
  });
}
// RotationBar (item 6): the 200 team minutes as one bar with a segment per player, starters in the school color. Hover or tap a segment for the name.
function RotationBar({ roster: e, lineup: a, total: t }) {
  const l = [...e].filter((u) => u.minutes > 0).sort((u, o) => o.minutes - u.minutes),
    st = l.filter((u) => a.includes(u.id)).reduce((u, o) => u + o.minutes, 0);
  return (0, s.jsxs)("div", {
    className: "rot-bar-wrap",
    children: [
      (0, s.jsx)("div", {
        className: "rot-bar",
        role: "img",
        "aria-label": `Rotation minutes: ${t} of 200`,
        children: l.map((u) =>
          (0, s.jsx)(
            "i",
            {
              className: a.includes(u.id) ? "starter" : "",
              title: `${u.name}: ${u.minutes} min`,
              style: { width: `${(u.minutes / 200) * 100}%` },
              children: a.includes(u.id) && u.minutes >= 12 ?u.name.split(" ").at(-1).slice(0, 5) : "",
            },
            u.id
          )
        ),
      }),
      (0, s.jsxs)("div", {
        className: "rot-legend",
        children: [
          (0, s.jsxs)("span", { children: [(0, s.jsx)("b", { className: "dot starter" }), `Starters ${st} min`] }),
          (0, s.jsxs)("span", { children: [(0, s.jsx)("b", { className: "dot" }), `Bench ${t - st} min`] }),
          t < 200 && (0, s.jsx)("span", { className: "orange-text", children: `${200 - t} min unassigned` }),
        ],
      }),
    ],
  });
}
// Charts (item 8), plain SVG, no library. Colors are a fixed set that reads on the dark surfaces; series 0 is the school color.
var DS_COLORS = ["var(--team,var(--orange))", "#7fb2ff", "#6bd1a5", "#f5c542", "#c58aff", "#f48087"];
// ShareBar: one horizontal bar split into parts (value > 0), with a legend that names every part and its share.
function ShareBar({ parts: e, fmt: a = (t) => t, label: t }) {
  const l = e.reduce((u, o) => u + Math.max(0, o.value), 0) || 1;
  return (0, s.jsxs)("div", {
    className: "ds-chart",
    children: [
      (0, s.jsx)("div", {
        className: "ds-share",
        role: "img",
        "aria-label": t,
        children: e.map((u, o) =>
          u.value > 0 ? (0, s.jsx)("i", { title: `${u.label}: ${a(u.value)}`, style: { width: `${(100 * u.value) / l}%`, background: DS_COLORS[o % DS_COLORS.length] } }, u.label) : null
        ),
      }),
      (0, s.jsx)("div", {
        className: "ds-legend",
        children: e.map((u, o) =>
          (0, s.jsxs)(
            "span",
            {
              children: [
                (0, s.jsx)("b", { className: "dot", style: { background: DS_COLORS[o % DS_COLORS.length] } }),
                u.label,
                " ",
                (0, s.jsxs)("em", { children: [a(u.value), " \xB7 ", Math.round((100 * Math.max(0, u.value)) / l), "%"] }),
              ],
            },
            u.label
          )
        ),
      }),
    ],
  });
}
// LineChart: series = [{ name, pts: [[x, y], ...] }]; x and y labels are formatted by fx / fy. Scales to its box width.
function LineChart({ series: e, fx: a = (t) => t, fy: t = (l) => l, label: l, height: u = 170 }) {
  const o = e.flatMap((c) => c.pts);
  if (o.length < 2) return null;
  const W = 600,
    H = u,
    L = 64,
    R = 34,
    T = 10,
    B = 26,
    x0 = Math.min(...o.map((c) => c[0])),
    x1 = Math.max(...o.map((c) => c[0])),
    y0 = Math.min(0, ...o.map((c) => c[1])),
    y1 = Math.max(...o.map((c) => c[1])) || 1,
    X = (c) => L + ((c - x0) / (x1 - x0 || 1)) * (W - L - R),
    Y = (c) => T + (1 - (c - y0) / (y1 - y0 || 1)) * (H - T - B),
    ticks = [0, 0.5, 1].map((c) => y0 + c * (y1 - y0)),
    xs = [...new Set(o.map((c) => c[0]))].sort((c, d) => c - d);
  return (0, s.jsxs)("div", {
    className: "ds-chart",
    children: [
      (0, s.jsxs)("svg", {
        className: "ds-line",
        viewBox: `0 0 ${W} ${H}`,
        role: "img",
        "aria-label": l,
        children: [
          ticks.map((c, d) =>
            (0, s.jsxs)(
              "g",
              {
                children: [
                  (0, s.jsx)("line", { x1: L, x2: W - R, y1: Y(c), y2: Y(c), className: "grid" }),
                  (0, s.jsx)("text", { x: L - 6, y: Y(c) + 4, textAnchor: "end", children: t(c) }),
                ],
              },
              d
            )
          ),
          xs.map((c) => (0, s.jsx)("text", { x: X(c), y: H - 8, textAnchor: "middle", children: a(c) }, c)),
          e.map((c, d) =>
            (0, s.jsxs)(
              "g",
              {
                style: { color: DS_COLORS[d % DS_COLORS.length] },
                children: [
                  (0, s.jsx)("polyline", { points: c.pts.map((z) => `${X(z[0])},${Y(z[1])}`).join(" "), fill: "none", stroke: "currentColor", strokeWidth: 2.5, strokeLinejoin: "round" }),
                  c.pts.map((z, k) => (0, s.jsx)("circle", { cx: X(z[0]), cy: Y(z[1]), r: 3.5, fill: "currentColor", children: (0, s.jsx)("title", { children: `${c.name}: ${a(z[0])} → ${t(z[1])}` }) }, k)),
                ],
              },
              c.name
            )
          ),
        ],
      }),
      e.length > 1 &&
        (0, s.jsx)("div", {
          className: "ds-legend",
          children: e.map((c, d) =>
            (0, s.jsxs)("span", { children: [(0, s.jsx)("b", { className: "dot", style: { background: DS_COLORS[d % DS_COLORS.length] } }), c.name] }, c.name)
          ),
        }),
    ],
  });
}
// RatingBar: a labelled bar from 0 to max (default 99). Colour steps with the value so a weak area stands out.
function RatingBar({ value: e, max: a = 99, label: t, tone: l }) {
  const u = Math.max(0, Math.min(100, (e / a) * 100)),
    o = l || (e >= 80 ? "great" : e >= 65 ? "good" : e >= 50 ? "ok" : "low");
  return (0, s.jsxs)("div", {
    className: "ds-bar",
    children: [
      t && (0, s.jsx)("span", { className: "ds-bar-label", children: t }),
      (0, s.jsx)("span", {
        className: `ds-bar-track ${o}`,
        role: "progressbar",
        "aria-valuenow": e,
        "aria-valuemin": 0,
        "aria-valuemax": a,
        children: (0, s.jsx)("i", { style: { width: `${u}%` } }),
      }),
      (0, s.jsx)("b", { className: "ds-bar-num", children: e }),
    ],
  });
}
// RatingRing (look-and-feel item 4): a circular rating gauge for player cards and the profile. value = a number or a text range such as "62-74"
// (an unscouted player: the ring is dashed and filled to the middle of the range, the same information the text already shows).
function RatingRing({ value: e, label: a = "OVR", size: t = "" }) {
  const nums = String(e).match(/\d+/g) || ["0"],
    v = nums.reduce((z, k) => z + Number(k), 0) / nums.length,
    range = nums.length > 1,
    tone = v >= 80 ? "great" : v >= 65 ? "good" : v >= 50 ? "ok" : "low",
    c = 2 * Math.PI * 42;
  return (0, s.jsxs)("span", {
    className: `ds-ring ${tone} ${t} ${range ? "range" : ""}`,
    role: "img",
    "aria-label": `${a} ${e}`,
    children: [
      (0, s.jsxs)("svg", {
        viewBox: "0 0 100 100",
        "aria-hidden": "true",
        children: [
          (0, s.jsx)("circle", { className: "ds-ring-track", cx: 50, cy: 50, r: 42 }),
          (0, s.jsx)("circle", {
            className: "ds-ring-fill",
            cx: 50,
            cy: 50,
            r: 42,
            strokeDasharray: `${((Math.min(99, v) / 99) * c).toFixed(1)} ${c.toFixed(1)}`,
            transform: "rotate(-90 50 50)",
          }),
        ],
      }),
      (0, s.jsxs)("b", { children: [e, (0, s.jsx)("small", { children: a })] }),
    ],
  });
}
