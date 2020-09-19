const { getRequest } = require("./repositorio");

module.exports = {
  usuarios(usuario, desde, hasta) {
    return getRequest("/reporte/usuario", { usuario, desde, hasta });
  },
  operadoras(usuario, desde, hasta) {
    return getRequest("/reporte/operadoras", { usuario, desde, hasta });
  },
  negativos: {
    usuarios(usuario, desde, hasta) {
      return getRequest("/reporte/usuario/negativos", {
        usuario,
        desde,
        hasta,
      });
    },
  },
};
