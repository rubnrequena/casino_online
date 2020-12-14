import reporteApi from "../api/reporte-api";

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    usuario(store, { usuario, desde, hasta, moneda }) {
      return reporteApi.usuarios(usuario, desde, hasta, moneda);
    },
    operadoras(store, { usuario, desde, hasta, moneda }) {
      return reporteApi.operadoras(usuario, desde, hasta, moneda);
    },
    usuario_negativo(store, { usuario, desde, hasta, moneda }) {
      return reporteApi.negativos.usuarios(usuario, desde, hasta, moneda);
    },
    loterias(store, { desde, hasta, moneda }) {
      return reporteApi.loterias(desde, hasta, moneda);
    },
    sorteos(store, { fecha, moneda, operadora }) {
      return reporteApi.sorteos(operadora, fecha, moneda);
    },
  },
};
