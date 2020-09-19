import reporteApi from "../api/reporte-api";

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    usuario(store, { usuario, desde, hasta }) {
      return reporteApi.usuarios(usuario, desde, hasta);
    },
    operadoras(store, { usuario, desde, hasta }) {
      return reporteApi.operadoras(usuario, desde, hasta);
    },
    usuario_negativo(store, { usuario, desde, hasta }) {
      return reporteApi.negativos.usuarios(usuario, desde, hasta);
    },
  },
};
