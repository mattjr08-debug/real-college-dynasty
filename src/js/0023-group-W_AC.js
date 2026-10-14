var W_AC = new WeakMap();
// real players: per-skill offsets from their real stats (one base36 digit per attribute, 10 = no change)
function W_kOff(k, i) {
  const c = parseInt(String(k).charAt(i), 36);
  return isNaN(c) ? 0 : c - 10;
}
function W_at(p) {
  let c = W_AC.get(p);
  if (c) return c;
  let h = TS(String(p.i || p.n)),
    B =
      {
        PG: [0, 0, 3, 0, 10, 10, 4, -8, 3, -12, -12, -10, 5, -6, 0, 0],
        SG: [0, 3, 6, 0, 4, 3, 4, -6, 2, -10, -10, -8, 4, -4, 0, 0],
        SF: [],
        PF: [4, -2, -8, -2, -8, -6, -2, 6, -1, 6, 6, 6, -3, 5, 2, 0],
        C: [6, -6, -14, -4, -12, -10, -4, 10, -3, 12, 10, 10, -5, 8, 2, 0],
      }[p.p] || [],
    a = Array.from({ length: 16 }, (_, i) =>
      le(Math.round(p.o + (B[i] || 0) + (p.k ? W_kOff(p.k, i) + (((h >>> (i * 2)) % 9) - 4) * 0.4 : ((h >>> (i * 2)) % 9) - 4)), 25, 99)
    );
  W_AC.set(p, a);
  return a;
}
