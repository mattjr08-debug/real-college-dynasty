function W_dv(z) {
  let ih = z.ih || { n: 0, major: 0 };
  return (
    z.o +
    (z.pot - z.o) * 0.55 +
    ({ 1: 7, 2: 3.5, 3: 0, 4: -4 }[z.y] || 0) +
    (z.ppg || 0) * 0.2 -
    (ih.n || 0) * 1.2 -
    (ih.major || 0) * 3
  );
}
