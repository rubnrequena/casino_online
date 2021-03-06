const { getRequest } = require("./repositorio");

module.exports = {
  usuarios(usuario, desde, hasta, moneda) {
    return getRequest("/reporte/usuario", { usuario, desde, hasta, moneda });
  },
  operadoras(usuario, desde, hasta, moneda) {
    return getRequest("/reporte/operadoras", { usuario, desde, hasta, moneda });
  },
  loterias(desde, hasta, moneda) {
    return getRequest("/reporte/loterias", { desde, hasta, moneda });
  },
  sorteos(operadora, fecha, moneda) {
    return getRequest("/reporte/sorteos", { operadora, fecha, moneda });
  },
  negativos: {
    usuarios(usuario, desde, hasta, moneda) {
      return getRequest("/reporte/usuario/negativos", {
        usuario,
        desde,
        hasta,
        moneda,
      });
    },
  },
};
