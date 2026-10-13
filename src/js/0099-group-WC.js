function WC({ p: e, run: a }) {
  let [t, l] = (0, N.useState)(e.minutes);
  return (0, s.jsxs)("form", {
    className: "minute-control",
    onSubmit: (u) => {
      (u.preventDefault(), (window.__minDirty = !0), a({ type: "minutes", id: e.id, minutes: t }));
    },
    children: [
      (0, s.jsx)("input", {
        type: "number",
        min: "0",
        max: "40",
        value: t,
        disabled: e.redshirt,
        "aria-label": `${e.name} minutes`,
        onChange: (u) => l(Number(u.target.value)),
      }),
      t !== e.minutes && (0, s.jsx)(X, { small: !0, type: "submit", children: "Set" }),
    ],
  });
}
