import sistemaApi from "../api/sistema-api";

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    menus() {
      return sistemaApi.menus();
    },
  },
};
