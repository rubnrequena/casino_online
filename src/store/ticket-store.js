import ticketApi from "../api/ticket-api";

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    monitor_admin(store, { sorteo, rol, moneda }) {
      return ticketApi.monitor.admin(sorteo, rol, moneda);
    },
    monitor_numero(store, { sorteo, moneda }) {
      return ticketApi.monitor.numero(sorteo, moneda);
    },

    admin_tickets(store, { sorteo, usuario }) {
      return ticketApi.monitor.admin_tickets(sorteo, usuario);
    },
    buscar_serial(store, serial) {
      return ticketApi.buscar.serial(serial);
    },
  },
};
