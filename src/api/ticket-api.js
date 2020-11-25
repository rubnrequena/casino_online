const { getRequest, postRequest } = require("./repositorio");

module.exports = {
  monitor: {
    admin(sorteo, rol, moneda) {
      return getRequest("/ticket/monitor/admin", { sorteo, rol, moneda });
    },
    numero(sorteo, moneda) {
      return getRequest("/ticket/monitor/numero", { sorteo, moneda }).then(
        (data) =>
          data.sort((a, b) => {
            return parseInt(a._id) - parseInt(b._id);
          })
      );
    },
    admin_tickets(sorteo, usuario) {
      return getRequest("/ticket/administrador", { sorteo, usuario });
    }
  },
  buscar: {
    serial(serial) {
      return getRequest("/ticket/buscar/serial", { serial });
    },
  },
  anular(serial) {
    return postRequest('/ticket/anular', { serial })
  }
};
