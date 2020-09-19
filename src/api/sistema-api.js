const { getRequest } = require("./repositorio");

module.exports = {
  sys_stats() {
    return getRequest("/sistema/sys_stats");
  },
};
