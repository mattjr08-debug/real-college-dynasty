// CountUp (look-and-feel item 9): when a stat tile's number CHANGES (not when the screen first opens) it counts from the old value to the new one in about 0.45 s.
// Only plain numbers such as 80, 66%, $2.18M or 14.5K are animated; anything else (records like 22-10) just changes. Skipped when the system asks for reduced motion.
function CountUp({ value: v }) {
  const prev = (0, N.useRef)(v),
    [txt, setTxt] = (0, N.useState)(v);
  (0, N.useEffect)(() => {
    const from = prev.current;
    prev.current = v;
    const re = /^([^\d-]*)(-?\d[\d,]*\.?\d*)([^\d]*)$/,
      a = re.exec(String(from)),
      b = re.exec(String(v));
    if (!a || !b || from === v || a[1] !== b[1] || a[3] !== b[3] || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) {
      setTxt(v);
      return;
    }
    const x0 = parseFloat(a[2].replace(/,/g, "")),
      x1 = parseFloat(b[2].replace(/,/g, "")),
      dec = (b[2].split(".")[1] || "").length,
      comma = b[2].includes(","),
      t0 = performance.now();
    let id;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 450),
        n = x0 + (x1 - x0) * (1 - Math.pow(1 - k, 3)),
        f = n.toFixed(dec);
      setTxt(b[1] + (comma ? Number(f).toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }) : f) + b[3]);
      k < 1 ? (id = requestAnimationFrame(step)) : setTxt(v);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [v]);
  return typeof v === "string" || typeof v === "number" ? txt : v;
}
function ca({ label: e, value: a, note: t, icon: l, onClick: u, spark: sp, sparkNote: sn }) {
  return (0, s.jsxs)(u ? "button" : "div", {
    type: u ? "button" : void 0,
    onClick: u,
    className: u ? "metric clickable" : "metric",
    children: [
      (0, s.jsxs)("div", { children: [(0, s.jsx)("span", { children: e }), l] }),
      (0, s.jsx)("strong", { children: (0, s.jsx)(CountUp, { value: a }) }),
      (0, s.jsx)("p", { children: t }),
      sp && sp.length >= 2 && (0, s.jsx)(Sparkline, { values: sp, label: sn }),
      u &&
        (0, s.jsx)("small", {
          className: "metric-link",
          children: "View every game and both tournaments \u203A",
        }),
    ],
  });
}
