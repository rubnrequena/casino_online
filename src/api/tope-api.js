const { postRequest, getRequest } = require("./repositorio");

module.exports = {
  registrar(tope) {
    return postRequest("/sorteo/tope/nuevo", tope);
  },
  remover(usuario, tope) {
    return postRequest("/sorteo/tope/remover", { usuario, tope });
  },
  buscar: {
    operadora(operadoraId) {
      return getRequest(`/sorteo/tope/buscar/operadora/${operadoraId}`);
    },
    sorteo(sorteoId) {
      return getRequest(`/sorteo/tope/buscar/sorteo/${sorteoId}`);
    },
    usuario(usuarioId) {
      return getRequest(`/sorteo/tope/buscar/usuario/${usuarioId}`);
    },
    por(operadora, usuario, sorteo) {
      return getRequest("/sorteo/tope/buscar", { operadora, usuario, sorteo });
    },
  },
};
