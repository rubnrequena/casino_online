const { getHandler } = require("./repositorio");

module.exports = {
  monitor: {
    admin(sorteo, rol) {
      return getHandler("/ticket/monitor/admin", { sorteo, rol });
    },
    numero(sorteo) {
      return getHandler("/ticket/monitor/numero", { sorteo }).then((data) =>
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
