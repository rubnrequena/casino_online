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
    rol(rol) {
      return getRequest(`/usuario/buscar/rol/${rol}`);
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
    termino(termino) {
      return getRequest('/usuario/buscar', { termino })
    },
  },
  permisos: {
    buscar: {
      todos(modo) {
        return getRequest("/usuario/permisos/todos", { modo });
      },
    },
  },
  comision: {
    nueva(usuario, operadora, comision, participacion, utilidad) {
      return postRequest('/usuario/comision/registro', {
        usuario, operadora, comision, participacion, utilidad
      })
    },
    editar(usuario, comision) {
      return postRequest('/usuario/comision/editar', {
        usuario, comision: comision._id, comisiones: {
          comision: comision.comision,
          participacion: comision.participacion,
          utilidad: comision.utilidad
        }
      })
    },
    buscar: {
      usuario(usuario) {
        return getRequest("/usuario/comision/usuario", { usuario })
      }
    }
  }
};
