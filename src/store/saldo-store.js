import saldoApi from "../api/saldo-api";

export default {
  namespaced: true,
  state: {
    recargas: [],
    retiros: [],
    balance: [],
    recargasPendientes: [],
    retirosPendientes: [],
    ultimosMovimientos: [],
    metodosPago: [],
    monedas: [],
  },
  mutations: {
    RECARGAS(state, recargas) {
      state.recargas = recargas;
    },
    RETIROS(state, retiros) {
      state.retiros = retiros;
    },
    RECARGAS_PENDIENTES(state, recargas) {
      state.recargasPendientes = recargas;
    },
    RETIROS_PENDIENTES(state, retiros) {
      state.retirosPendientes = retiros;
    },
    BALANCE(state, balance) {
      state.balance = balance;
    },
    METODOS_PAGO(state, metodos) {
      state.metodosPago = metodos;
    },
    METODO_PAGO_NUEVO(state, metodo) {
      state.metodosPago.push(metodo);
    },
    METODO_PAGO_EDITAR(state, metodo) {
      state.metodosPago = state.metodosPago.map((_metodo) => {
        return _metodo._id == metodo._id ? metodo : _metodo;
      });
    },
    MONEDAS(state, monedas) {
      state.monedas = monedas;
    },
  },
  actions: {
    on_recargasPendientes({ commit }) {
      saldoApi
        .recargas(0, 99999)
        .then((recargas) => commit("RECARGAS_PENDIENTES", recargas));
    },
    on_recargas({ commit }) {
      saldoApi
        .recargas(1, 100)
        .then((recargas) => commit("RECARGAS", recargas));
    },
    procesarTransaccion({ dispatch, rootState }, transaccion) {
      saldoApi
        .procesarTransaccion(transaccion, rootState.auth.usuario._id)
        .then(() => {
          if (transaccion.tipo == "recarga") dispatch("on_recargasPendientes");
          else dispatch("on_retirosPendientes");
        });
    },
    cancelarTransaccion({ dispatch, rootState }, transaccion) {
      saldoApi
        .cancelarTransaccion(transaccion, rootState.auth.usuario._id)
        .then(() => {
          if (transaccion.tipo == "recarga") dispatch("on_recargasPendientes");
          else dispatch("on_retirosPendientes");
        });
    },
    on_retirosPendientes({ commit }) {
      saldoApi
        .retiros(0, 99999)
        .then((retiros) => commit("RETIROS_PENDIENTES", retiros));
    },
    on_retiros({ commit }) {
      saldoApi.retiros(1, 100).then((retiros) => commit("RETIROS", retiros));
    },
    leerBalance({ commit }, { usuario, moneda }) {
      saldoApi.balance(usuario, moneda).then((balance) => commit("BALANCE", balance));
    },
    metodosPago_usuario({ commit }, usuarioId) {
      return saldoApi.metodos_pago.buscar.usuario(usuarioId).then((metodos) => {
        commit("METODOS_PAGO", metodos);
        return metodos;
      });
    },
    metodosPago_nuevo({ commit }, { entidad, direccion, moneda, meta }) {
      return new Promise((resolve, reject) => {
        return saldoApi.metodos_pago
          .nuevo(entidad, direccion, moneda, meta)
          .then((metodo) => {
            commit("METODO_PAGO_NUEVO", metodo);
            resolve(metodo);
          })
          .catch((error) => reject(error));
      });
    },
    metodosPago_editar(store, metodo) {
      return saldoApi.metodos_pago.editar(metodo);
    },
    metodosPago_remover(store, { usuario, metodo }) {
      return saldoApi.metodos_pago.remover(usuario, metodo);
    },
    getMonedas({ commit }) {
      return saldoApi.monedas().then((monedas) => {
        commit("MONEDAS", monedas);
        return monedas;
      });
    },
  },
};
