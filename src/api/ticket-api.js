const { getHandler } = require("./repositorio");

module.exports = {
  monitor: {
    admin(sorteo, rol, moneda) {
      return getHandler("/ticket/monitor/admin", { sorteo, rol, moneda });
    },
    numero(sorteo, moneda) {
      return getHandler("/ticket/monitor/numero", { sorteo, moneda }).then(
        (data) =>
          data.sort((a, b) => {
            return parseInt(a._id) - parseInt(b._id);
          })
      );
    },
    admin_tickets(sorteo, usuario) {
      return getHandler("/ticket/administrador", { sorteo, usuario });
    },
  },
  buscar: {
    serial(serial) {
      return getHandler("/ticket/buscar/serial", { serial });
    },
  },
};
