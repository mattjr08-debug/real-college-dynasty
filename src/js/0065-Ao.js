// Open windows, top-most last: Escape and the Tab focus trap belong to the top window only (a card opened over a team view must not close the team view too).
var W_modalStack = [];
function Ao({ children: e, title: a, onClose: t, wide: l = !1, drawer: u = !1 }) {
  let o = (0, N.useRef)(null),
    r = (0, N.useRef)(t);
  return (
    (r.current = t),
    (0, N.useEffect)(() => {
      let n = document.activeElement,
        i = document.body.style.overflow,
        token = {};
      (W_modalStack.push(token), (document.body.style.overflow = "hidden"), o.current?.focus());
      let d = (f) => {
        if (W_modalStack[W_modalStack.length - 1] !== token) return;
        if ((f.key === "Escape" && r.current(), f.key === "Tab")) {
          let y = o.current?.querySelectorAll(
            'button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),summary,a[href],[tabindex="0"]'
          );
          if (!y?.length) return;
          let h = y[0],
            p = y[y.length - 1];
          f.shiftKey && (document.activeElement === h || document.activeElement === o.current)
            ? (f.preventDefault(), p.focus())
            : !f.shiftKey && document.activeElement === p && (f.preventDefault(), h.focus());
        }
      };
      return (
        document.addEventListener("keydown", d),
        () => {
          (W_modalStack.splice(W_modalStack.indexOf(token), 1), (document.body.style.overflow = W_modalStack.length ? "hidden" : i), document.removeEventListener("keydown", d), n?.focus());
        }
      );
    }, []),
    (0, s.jsx)("div", {
      className: `modal-backdrop ${u ? "drawer-backdrop" : ""}`,
      onClick: (n) => {
        n.target === n.currentTarget && t();
      },
      children: (0, s.jsxs)("div", {
        className: `modal ${l ? "wide" : ""}`,
        role: "dialog",
        "aria-modal": "true",
        "aria-label": a,
        ref: o,
        tabIndex: -1,
        children: [
          (0, s.jsx)("button", {
            className: "icon-btn close",
            onClick: t,
            "aria-label": "Close dialog",
            children: (0, s.jsx)(mo, { size: 22 }),
          }),
          e,
        ],
      }),
    })
  );
}
