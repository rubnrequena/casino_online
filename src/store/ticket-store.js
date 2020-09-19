import ticketApi from "../api/ticket-api";

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    monitor_admin(store, { sorteo, rol }) {
      return ticketApi.monitor.admin(sorteo, rol);
    },
    monitor_numero(store, sorteo) {
      return ticketApi.monitor.numero(sorteo);
    },
    admin_tickets(store, { sorteo, usuario }) {
      return ticketApi.monitor.admin_tickets(sorteo, usuario);
    },
    buscar_serial(store, serial) {
      return ticketApi.buscar.serial(serial);
    },
  },
};
