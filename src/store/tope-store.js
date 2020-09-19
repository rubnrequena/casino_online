import topeApi from "../api/tope-api";

export default {
  namespaced: true,
  state: {
    topes: [],
  },
  mutations: {},
  actions: {
    buscarTopes(store, { operadora, usuario, sorteo }) {
      return topeApi.buscar.por(operadora, usuario, sorteo);
    },
    buscarOperadora(store, operadoraId) {
      return topeApi.buscar.operadora(operadoraId);
    },
    buscarSorteo(store, sorteoId) {
      return topeApi.buscar.sorteo(sorteoId);
    },
    buscarUsuario(store, usuarioId) {
      return topeApi.buscar.usuario(usuarioId);
    },
    registrar(store, topeId) {
      return topeApi.registrar(topeId);
    },
    remover(store, { usuario, tope }) {
      return topeApi.remover(usuario, tope);
    },
  },
};
