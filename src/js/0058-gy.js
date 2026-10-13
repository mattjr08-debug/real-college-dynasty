function gy(e, a) {
  let t = (0, Fs.useRef)(e);
  t.current = e;
  let l = (0, Fs.useRef)(a);
  ((l.current = a),
    (0, Fs.useEffect)(() => {
      let u = document.modelContext;
      if (!u?.registerTool) return;
      let o = new AbortController(),
        r = (n) => {
          try {
            Promise.resolve(u.registerTool(n, { signal: o.signal })).catch(() => {});
          } catch {}
        };
      return (
        r({
          name: "read_basketball_career",
          title: "Read basketball career",
          description:
            "Read the current college basketball career, roster, recruiting offers, and budget without changing the game.",
          inputSchema: { type: "object", properties: {}, additionalProperties: !1 },
          annotations: { readOnlyHint: !0, untrustedContentHint: !1 },
          execute: () => {
            let n = t.current;
            return n
              ? {
                  school: n.school.name,
                  year: n.year,
                  phase: n.phase,
                  record: dl(n),
                  overall: Ps(n),
                  nilAvailable: Ce(n),
                  roster: n.roster.map((i) => ({
                    id: i.id,
                    name: i.name,
                    pos: i.pos,
                    ovr: i.ovr,
                    morale: Math.round(i.morale),
                    minutes: i.minutes,
                    nil: i.nil,
                  })),
                  offers: n.prospects
                    .filter((i) => i.offer)
                    .map((i) => ({ id: i.id, name: i.name, offer: i.offer })),
                }
              : { started: !1 };
          },
        }),
        r({
          name: "simulate_basketball_games",
          title: "Simulate basketball games",
          description:
            "Advance the active college basketball season by 1 to 7 games, or one tournament round. Results are saved to the same career shown on screen.",
          inputSchema: {
            type: "object",
            properties: { games: { type: "integer", minimum: 1, maximum: 7 } },
            required: ["games"],
            additionalProperties: !1,
          },
          annotations: { readOnlyHint: !1, untrustedContentHint: !1 },
          execute: async (n) => {
            let i = n?.games;
            if (typeof i != "number" || !Number.isInteger(i) || i < 1 || i > 7)
              throw new Error("games must be an integer from 1 to 7");
            let d = t.current;
            if (!d || !["Regular season", "Conference tournament", "National tournament"].includes(d.phase))
              throw new Error("Start the season before simulating games.");
            if (!(await l.current({ type: "sim", count: i })))
              throw new Error("Simulation did not complete. Check the message on screen.");
            return { saved: !0, gamesRequested: i };
          },
        }),
        () => o.abort()
      );
    }, []));
}
