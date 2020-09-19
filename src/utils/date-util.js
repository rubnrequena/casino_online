module.exports = {
  hoy: new Date().toISOString().slice(0, 10),
  isoDate(date = new Date()) {
    return date.toISOString().slice(0, 10);
  },
};
