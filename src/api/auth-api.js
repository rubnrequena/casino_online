const { postRequest, getRequest } = require("./repositorio");

module.exports = {
  /**
   * @param {String} usuario
   * @param {String} clave
   * @returns {Promise<Usuario>}
   */
  login(usuario, clave) {
    usuario = usuario.toLowerCase();
    return postRequest("/auth", {
      usuario,
      clave,
    });
  },
  recuperar(correo) {
    return getRequest("/auth/recuperar", { correo });
  },
  recuperarClave(llave, clave) {
    return postRequest("/auth/recuperar", { llave, clave });
  },
  permisos: {
    nuevo(nombre, rol, predeterminado, permisos, usuario) {
      return postRequest("/auth/permiso/nuevo", {
        nombre,
        rol,
        predeterminado,
        permisos,
        usuario,
      });
    },
    usuario() {
      return getRequest("/usuario/permiso/todos");
    },
    prefefinir(permisoId) {
      return postRequest("/usuario/permiso/predefinir", { permisoId });
    },
  },
};
