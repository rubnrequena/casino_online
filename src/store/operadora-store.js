import operadoraApi from "../api/operadora-api";
import sorteoApi from "../api/sorteo-api";

export default {
  namespaced: true,
  state: {
    init: false,
    operadoras: [],
    sorteos: [],
    numeros: [],
    pagos: [],
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
    OPERADORA_PAGA(state, pagos) {
      state.pagos = pagos;
    },
  },
  actions: {
    leer() { },
    nueva(store, { nombre, paga, tipo, sorteos, numeros }) {
      return operadoraApi
        .nueva(nombre, paga, tipo, sorteos, numeros)
        .then((operadora) => {
          store.commit("NUEVA_OPERADORA", operadora);
          return operadora;
        });
    },
    remover(store, operadoraId) {
      return operadoraApi.remover(operadoraId)
    },
    editar(store, operadora) {
      return operadoraApi.editar(operadora)
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
      return new Promise((resolve, reject) => {
        let operadora = state.operadoras.find((operadora) => operadora._id == operadoraId);
        if (operadora) resolve(operadora)
        else operadoraApi.buscar.id(operadoraId).then(operadora => {
          resolve(operadora)
        }).catch(error => reject(error))
      });
    },

    registrarSorteo(store, { desde, hasta, operadora }) {
      return sorteoApi.registrar(desde, hasta, operadora);
    },

    sorteos_buscarFecha(store, { fecha, operadora }) {
      return sorteoApi.buscar.fecha(
        fecha,
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
    sorteo_reiniciar(store, sorteo) {
      return sorteoApi.reiniciar(sorteo);
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
    numeros_historia(store, operadora) {
      return operadoraApi.numero.historia(operadora)
    },

    usuario_paga({ commit }, usuario) {
      return operadoraApi.paga.buscar(usuario).then((pagos) => {
        commit("OPERADORA_PAGA", pagos);
        return pagos;
      });
    },

    grupo_id(store, grupoId) {
      return operadoraApi.grupos.buscar.id(grupoId);
    },
    grupo_usuario(store, usuario) {
      return operadoraApi.grupos.buscar.usuario(usuario);
    },
    grupo_nuevo(store, { nombre, descripcion, usuario }) {
      return operadoraApi.grupos.nuevo(nombre, descripcion, usuario);
    },
    grupo_remover(store, { grupoId, usuario }) {
      return operadoraApi.grupos.remover(grupoId, usuario);
    },
  },
};
