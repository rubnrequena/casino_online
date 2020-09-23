const { postRequest, getRequest } = require("./repositorio");

module.exports = {
  nuevo(usuario) {
    return postRequest("/auth/registro", usuario);
  },
  activo(usuario) {
    return postRequest("/usuario/activo", { usuario });
  },
  papelera(usuario) {
    return postRequest("/usuario/papelera", { usuario });
  },
  cambiar_clave(usuario, clave) {
    return postRequest("/usuario/cambiar_clave", { usuario, clave });
  },
  buscar: {
    id(usuarioId) {
      return getRequest(`/usuario/buscar/usuario/${usuarioId}?project=stats`);
    },
    rol(rol, usuario) {
      usuario = usuario ? { usuario } : null;
      return getRequest(`/usuario/buscar/rol/${rol}`, usuario);
    },
    hijos() {
      return getRequest(`/usuario/buscar/hijos`);
    },
    hijos_cercanos(padreId) {
      return getRequest(`/usuario/buscar/hijos_cercanos`, { usuario: padreId });
    },
    stat(usuario) {
      return getRequest("/usuario/stat", { usuario });
    },
    enlaces(usuario) {
      return getRequest("/usuario/enlaces", { usuario });
    },
  },
  permisos: {
    buscar: {
      todos(modo) {
        return getRequest("/usuario/permisos/todos", { modo });
      },
    },
  },
};