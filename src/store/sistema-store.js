import sistemaApi from "../api/sistema-api";

export default {
  namespaced: true,
  state: {
    cache: { menu: false, permisos: false },
    permisos: null,
  },
  mutations: {
    PERMISOS(state, permisos) {
      state.permisos = permisos;
      state.cache.permisos = true;
    },
  },
  actions: {
    menus() {
      return sistemaApi.menus();
    },
    async permisos({ state, commit }) {
      if (state.cache.permisos) return state.permisos;
      else
        return sistemaApi.permisos().then((permisos) => {
          commit("PERMISOS", permisos);
          return permisos;
        });
    },
  },
};
