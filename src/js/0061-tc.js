async function tc(e, a) {
  let t = () => {
    try {
      let l = My();
      if (a?.method !== "POST")
        return Response.json(
          l
            ? { game: l.game, revision: l.revision, savedAt: l.savedAt }
            : { game: null, revision: 0, savedAt: "" }
        );
      let u = JSON.parse(a.body || "{}");
      if (l?.lastAction === u.requestId) return Response.json(l);
      if ((l?.revision || 0) !== u.revision)
        return Response.json(
          { error: "This career changed in another window. Reload before continuing." },
          { status: 409 }
        );
      let o;
      try {
        if (u.action.type === "create") {
          if (!W_schoolById(u.action.schoolId) || !Us.includes(String(u.action.specialty)))
            throw new Error("Choose a school and coaching specialty.");
          if (((o = sy(String(u.action.schoolId), String(u.action.coach), String(u.action.specialty))), l))
            try {
              localStorage.setItem(Ty, JSON.stringify(l));
            } catch {}
        } else {
          if (!l) throw new Error("Start a career first.");
          o = fy(l.game, u.action);
        }
      } catch (n) {
        return Response.json(
          { error: n instanceof Error ? n.message : "That action is not available." },
          { status: 400 }
        );
      }
      let r = {
        game: o,
        revision: u.revision + 1,
        savedAt: new Date().toISOString(),
        lastAction: u.requestId,
      };
      return (Ry(r), Response.json(r));
    } catch (l) {
      return Response.json(
        { error: l instanceof Error ? l.message : "Could not read your saved career." },
        { status: 503 }
      );
    }
  };
  let t0 = performance.now(),
    name = "load";
  if (a?.method === "POST")
    try {
      name = String(JSON.parse(a.body || "{}").action?.type || "action");
    } catch {
      name = "action";
    }
  let done = (res) => (perfRecord(name, performance.now() - t0), res);
  return (typeof navigator < "u" && navigator.locks?.request ? navigator.locks.request(Gn, t) : Promise.resolve(t())).then(done, (err) => {
    throw (perfRecord(name, performance.now() - t0), err);
  });
}
