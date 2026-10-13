function W_t(e, id) {
  return e.league.find((x) => x.id === id) || e.opponents.find((x) => x.id === id);
}
