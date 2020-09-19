import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import auth from "./auth-store";
import operadora from "./operadora-store";
import tope from "./tope-store";
import usuario from "./usuario-store";
import saldo from "./saldo-store";
import ticket from "./ticket-store";
import reporte from "./reporte-store";

import { regexec } from "../utils/regx-util";
import sistemaApi from "../api/sistema-api";

export default new Vuex.Store({
  modules: {
    auth,
    operadora,
    tope,
    usuario,
    saldo,
    ticket,
    reporte,
  },
  state: {
    menu: true,
    menuData: [],
    validURLs: [],
    stats: {},
  },
  getters: {
    menuVisible(state) {
      return state.menuData.filter((menu) => {
        if (menu.visbile == false) return false;
        return true;
      });
    },
  },
  mutations: {
    MENU(state, value) {
      state.menu = value;
    },
    MENU_DATA(state, value) {
      state.menuData = value;
      state.validURLs = regexec(
        JSON.stringify(value),
        /"url":"(?<url>\/.*?)"/gm
      ).map((url) => new RegExp(`${url.url}`));
    },
    STATS(state, stat) {
      state.stats = stat;
    },
  },
  actions: {
    menu_toggle({ commit, state }) {
      commit("MENU", !state.menu);
    },
    getStatus({ commit }) {
      return sistemaApi.sys_stats().then((stat) => {
        commit("STATS", stat);
        return stat;
      });
    },
  },
});
