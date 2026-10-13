function Fy({ p: e, onClick: a, prospect: t = !1 }) {
  return (0, s.jsxs)("button", {
    className: `player-card ${e.status === "Signed" ? "signed" : ""} ${!t && e.injury > 0 ? "injured" : ""}`,
    onClick: a,
    children: [
      (0, s.jsxs)("div", {
        className: "card-image",
        children: [
          (0, s.jsx)(Ja, { p: e }),
          (0, s.jsxs)("span", { className: "jersey", children: ["#", e.number] }),
          (0, s.jsx)(FavStar, { p: e, prospect: t, className: "card-star" + (t ? " prospect" : "") }),
          // recruit cards keep the ring on the photo; roster and core cards put it on the empty right side of the card (below)
          t && (0, s.jsx)("span", {
            className: "overall ring-holder",
            children: (0, s.jsx)(RatingRing, { value: Tt(e) }),
          }),
          (0, s.jsxs)("div", {
            className: "card-image-bottom",
            children: [
              (0, s.jsx)("span", { children: e.pos2 ? e.pos + "/" + e.pos2 : e.pos }),
              e.injury > 0
                ? (0, s.jsx)(he, { tone: "red", children: e.susp ? (e.susp === 2 ? "INELIGIBLE" : "SUSPENDED") : "INJURED" })
                : e.newSigning
                  ? (0, s.jsx)(he, { tone: "green", children: "NEW SIGNING" })
                  : e.year === 4
                    ? (0, s.jsx)(he, { children: "SENIOR" })
                    : e.redshirt
                      ? (0, s.jsx)(he, { children: "REDSHIRT" })
                      : null,
            ],
          }),
        ],
      }),
      (0, s.jsxs)("div", {
        className: "card-body",
        children: [
          (0, s.jsx)("h3", { children: e.name }),
          (0, s.jsxs)("p", { children: [Zl(e), " \xB7 ", qs(e.height)] }),
          // an injured or suspended player shows that (and the games he is out) where the style label goes, so his box is the same height as the rest
          !t &&
            (e.injury > 0
              ? (0, s.jsx)("span", { className: "arch-tag injury-line", children: `${e.susp ? (e.susp === 2 ? "Ineligible" : "Suspended") : "Injured"} \xB7 out ${e.injury} game${e.injury === 1 ? "" : "s"}` })
              : (0, s.jsx)("span", { className: "arch-tag", children: W_arch(e) })),
          t
            ? (0, s.jsxs)(s.Fragment, {
                children: [
                  (0, s.jsx)(Xn, { n: e.stars }),
                  (0, s.jsxs)("div", {
                    className: "card-detail",
                    children: [
                      (0, s.jsx)("span", {
                        children: e.offer ? "Offer pending" : `${Math.round(e.interest)}% interest`,
                      }),
                      (0, s.jsx)("strong", { children: q(e.ask) }),
                    ],
                  }),
                  (0, s.jsx)(Wa, { value: e.interest }),
                ],
              })
            : (0, s.jsxs)(s.Fragment, {
                children: [
                  (0, s.jsx)(RatingBar, { value: e.ovr }),
                  (0, s.jsx)(Ys, { p: e }),
                  (0, s.jsxs)("div", {
                    className: "card-detail",
                    children: [
                      (0, s.jsx)("span", { children: `${e.role} \xB7 ${e.minutes} min` }),
                      (0, s.jsxs)("strong", {
                        children: [q(e.nil), (0, s.jsx)("small", { children: "/yr" })],
                      }),
                    ],
                  }),
                ],
              }),
        ],
      }),
      !t && (0, s.jsx)("span", { className: "overall ring-holder", children: (0, s.jsx)(RatingRing, { value: e.ovr }) }),
    ],
  });
}
