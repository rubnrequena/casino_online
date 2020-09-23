import operadoraApi from "../api/operadora-api";
import sorteoApi from "../api/sorteo-api";

export default {
  namespaced: true,
  state: {
    init: false,
    operadoras: [],
    sorteos: [],
    numeros: [],
  },
  mutations: {
    OPERADORAS(state, operadoras) {
      state.operadoras = operadoras;
    },
    NUEVA_OPERADORA(state, operadora) {
      if (!state.operadoras) state.operadoras = [operadora];
      else state.operadoras.push(operadora);
    },
    NUMEROS(state, numeros) {
      state.numeros = numeros;
    },
    NUMERO_NUEVO(state, numero) {
      state.numeros.push(numero);
    },
  },
  actions: {
    leer() {},
    nueva(store, { nombre, paga, tipo, sorteos, numeros }) {
      return operadoraApi
        .nueva(nombre, paga, tipo, sorteos, numeros)
        .then((operadora) => {
          store.commit("NUEVA_OPERADORA", operadora);
          return operadora;
        });
    },
    enlace(store, { usuario, operadora, mostrar }) {
      return operadoraApi.enlace(usuario, operadora, mostrar);
    },
    enlace_remover(store, { usuario, enlace }) {
      return operadoraApi.enlaceRemover(usuario, enlace);
    },
    activar_enlace(store, { usuario, enlace, activo }) {
      return operadoraApi.activar_enlace(usuario, enlace, activo);
    },

    init({ commit }) {
      operadoraApi.buscar.todas().then((operadoras) => {
        commit("OPERADORAS", operadoras);
      });
    },

    buscarId({ state }, operadoraId) {
      return state.operadoras.find((operadora) => operadora._id == operadoraId);
    },

    registrarSorteo(store, { desde, hasta, operadora }) {
      return sorteoApi.registrar(desde, hasta, operadora);
    },

    sorteos_buscarFecha(store, { desde, hasta, operadora }) {
      return sorteoApi.buscar.fecha(
        desde,
        hasta,
        operadora,
        "fecha descripcion operadora cierra"
      );
    },
    sorteo_sinGanador(store, { operadora, fecha }) {
      return sorteoApi.buscar.sinGanador(operadora, fecha);
    },
    sorteo_premiar(store, { sorteo, numero }) {
      return sorteoApi.premiar(sorteo, numero);
    },
    sorteo_reiniciar(store, { sorteo, numero }) {
      return sorteoApi.reiniciar(sorteo, numero);
    },
    abrirSorteo(store, sorteoId) {
      return sorteoApi.abrir(sorteoId);
    },
    cerrarSorteo(store, sorteoId) {
      return sorteoApi.cerrar(sorteoId);
    },
    numero_todos({ commit }) {
      return operadoraApi.numero.buscar.todos().then((numeros) => {
        commit("NUMEROS", numeros);
        return numeros;
      });
    },
    numero_nuevo({ commit }, { nombre, numeros }) {
      return operadoraApi.numero.nuevo(nombre, numeros).then((numero) => {
        commit("NUMERO_NUEVO", numero);
        return numero;
      });
    },
  },
};