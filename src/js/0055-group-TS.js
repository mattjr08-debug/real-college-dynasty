function TS(e) {
  let a = 2166136261;
  for (let t of e) a = Math.imul(a ^ t.charCodeAt(0), 16777619);
  return a >>> 0;
}
