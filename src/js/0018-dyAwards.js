function dyAwards(e, a, g) {
  let adj = Object.fromEntries(W_all(e).map((t) => [t.id, W_sosAdj(t)])),
    rb =
      (e.result === "National champions"
        ? 3
        : e.result === "National runner-up"
          ? 2.4
          : e.result === "Final Four"
            ? 1.8
            : e.result === "Elite Eight"
              ? 1.2
              : e.result === "Sweet 16"
                ? 0.8
                : String(e.berth || "").includes("berth")
                  ? 0.3
                  : 0) + (e.confChampion ? 0.8 : 0),
    pf = (p) => {
      let n = Math.max(1, p.stats.gp);
      return (
        (p.stats.pts +
          p.stats.reb * 0.5 +
          p.stats.ast * 0.7 +
          ((p.stats.stl || 0) + (p.stats.blk || 0)) * 0.6) /
        n
      );
    },
    mine = e.roster
      .filter((p) => p.stats.gp >= 10 && !p.redshirt)
      .map((p) => ({
        n: p.name,
        s: e.school.name,
        v: (pf(p) + rb) * (adj[e.school.id] || 1),
        pp: p.stats.pts / Math.max(1, p.stats.gp),
        you: !0,
        fr: p.year === 1,
        id: p.id,
      })),
    mk = (t) => {
      let b = 6 + (t.rating - 45) * 0.32 + j(e, -2, 2);
      return [
        { n: jl(e, SS) + " " + jl(e, CS), s: t.name, v: b * (adj[t.id] || 1) },
        { n: jl(e, SS) + " " + jl(e, CS), s: t.name, v: (b * 0.84 + j(e, -1, 1)) * (adj[t.id] || 1) },
      ];
    },
    cf = e.league.filter((t) => t.id !== e.school.id),
    rs = (t) =>
      ((e.rosters && e.rosters[t.id]) || [])
        .filter((p) => p.s.g >= 10)
        .map((p) => ({
          n: p.n,
          s: t.name,
          v: ((p.s.p + p.s.r * 0.5 + p.s.a * 0.7 + (p.s.s + p.s.b) * 0.6) / p.s.g) * (adj[t.id] || 1),
          pp: p.s.p / p.s.g,
          fr: p.y === 1,
        })),
    mq = (t) => {
      let r = rs(t);
      return r.length >= 2 ? r : mk(t);
    },
    cp = [...mine, ...cf.flatMap(mq)].sort((x, y) => y.v - x.v),
    np = [...mine, ...e.opponents.flatMap(mq)].sort((x, y) => y.v - x.v),
    pk = (l, n, m = 0) => l.slice(m, m + n).map((h) => ({ n: h.n, s: h.s, you: !!h.you, pid: h.id })),
    wk = Ps(e) < cf.reduce((h, t) => h + t.rating, 0) / Math.max(1, cf.length) - 4 && rb < 1.2,
    ok = (h, t, pm) =>
      !h.you ||
      (h.v >= t * (wk ? 1.2 : 1) * (rb >= 1.2 ? 0.85 : 1) &&
        h.pp >= pm * (wk ? 1.15 : 1) * (rb >= 1.2 ? 0.85 : 1)),
    fa = np.filter((h) => ok(h, 22, 17)).slice(0, 5),
    sa = np.filter((h) => ok(h, 19, 15) && !fa.includes(h)).slice(0, 5),
    fc = cp.filter((h) => ok(h, 18, 14)).slice(0, 5),
    o = [
      {
        k: "National Player of the Year",
        list: pk(
          np.filter((h) => ok(h, 27, 20)),
          1
        ),
      },
      { k: "All-American First Team", list: pk(fa, 5) },
      { k: "All-American Second Team", list: pk(sa, 5) },
      {
        k: "All-American Third Team",
        list: pk(
          np.filter((h) => ok(h, 16, 12.5) && !fa.includes(h) && !sa.includes(h)),
          5
        ),
      },
      {
        k: "Conference Player of the Year",
        list: pk(
          cp.filter((h) => ok(h, 20, 16) && (!h.you || a.wins >= g * 0.6)),
          1
        ),
      },
      { k: "All-Conference First Team", list: pk(fc, 5) },
      {
        k: "All-Conference Second Team",
        list: pk(
          cp.filter((h) => ok(h, 15, 11.5) && !fc.includes(h)),
          5
        ),
      },
    ],
    avg = cf.reduce((h, t) => h + t.rating, 0) / Math.max(1, cf.length),
    fb = 6 + (avg - 50) * 0.22 + j(e, -2, 2),
    bf = mine.filter((h) => h.fr).sort((x, y) => y.v - x.v)[0];
  o.push({
    k: "Freshman of the Year",
    list:
      bf && bf.v > fb
        ? [{ n: bf.n, s: bf.s, you: !0, pid: bf.id }]
        : [{ n: jl(e, SS) + " " + jl(e, CS), s: jl(e, cf.length ? cf : e.opponents).name, you: !1 }],
  });
  let cy = e.confChampion || a.wins >= g + 4;
  o.push({
    k: "Conference Coach of the Year",
    list: cy
      ? [{ n: e.coach, s: e.school.name, you: !0 }]
      : [{ n: "Coach " + jl(e, CS), s: jl(e, cf.length ? cf : e.opponents).name, you: !1 }],
  });
  let top =
    e.result === "National champions" || e.result === "National runner-up" || e.result === "Final Four";
  o.push({
    k: "National Coach of the Year",
    list:
      top && e.result !== "Final Four"
        ? [{ n: e.coach, s: e.school.name, you: !0 }]
        : [{ n: "Coach " + jl(e, CS), s: jl(e, e.opponents).name, you: !1 }],
  });
  let y = o.flatMap((h) => h.list.filter((l) => l.you).map((l) => `${l.n}: ${h.k}`));
  y.length &&
    Be(
      e,
      "Season awards",
      y.slice(0, 8).join(" \u00B7 ") + (y.length > 8 ? ` and ${y.length - 8} more` : "")
    );
  return o;
}
