const { getRequest } = require("./repositorio");

module.exports = {
  sys_stats() {
    return getRequest("/sistema/sys_stats");
  },
  menus() {
    return getRequest("/sistema/menus");
  },
  permisos() {
    return getRequest("/sistema/permisos");
  },
};
