module.exports = {
  /**
   *
   * @param {Function} condicion
   * @param {Number} time
   */
  disponible(condicion, time = 100) {
    return new Promise((resolve) => {
      let int;
      int = setInterval(() => {
        if (condicion()) {
          clearInterval(int);
          resolve(condicion);
        }
      }, time);
    });
  },
};
