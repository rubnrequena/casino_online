import authApi from "../api/auth-api";
import { auth } from "../api/index";
import router from "../router/index";
export default {
  namespaced: true,
  state: {
    usuario: null,
    token: "",
    redireccionPendiente: null,
    permisosDescripcion: {
      vnt: "Ventas",
      vnt1: "Leer",
      vnt2: "Crear",
    },
    permisosCache: false,
    permisosUsuario: [],
  },
  getters: {
    permisos(state) {
      return state.usuario.permisos;
    },
  },
  mutations: {
    USUARIO(state, usuario) {
      state.usuario = usuario;
      state.usuario.permisos.nombre = "predeterminado";
      state.token = usuario.token;
    },
    CIERRA_SESSION(state) {
      state.usuario = null;
      state.token = null;
    },
    REDIRECCION(state, url) {
      state.redireccionPendiente = url;
    },
    PERMISOS_LISTA(state, permisos) {
      state.permisosCache = true;
      state.permisosUsuario = permisos;
    },
  },
  actions: {
    login(store, { usuario, clave }) {
      return auth.login(usuario, clave).then((usuario) => {
        store.commit("USUARIO", usuario);
        store.dispatch("operadora/init", true, { root: true });
        store.dispatch("usuario/init", null, { root: true });
        store.commit("MENU_DATA", usuario.menu, { root: true });
        return usuario;
      });
    },
    tienePermiso({ state }, permiso) {
      return new Promise((resolve) => {
        const permisoExiste = state.usuario.permisos.permisos.indexOf(permiso);
        resolve(permisoExiste > -1);
      });
    },
    cerrarSesion(store) {
      store.commit("CIERRA_SESSION");
      localStorage.removeItem("rmuser");
      router.push("/login");
    },
    permiso_nuevo({ state }, { nombre, rol, predeterminado, permisos }) {
      return authApi.permisos
        .nuevo(nombre, rol, predeterminado, permisos, state.usuario._id)
        .then((permiso) => {
          state.permisosUsuario.push(permiso);
          return permiso;
        });
    },
    permisos_lista({ state, commit }) {
      if (state.permisosCache) return state.permisosLista;
      return authApi.permisos.usuario().then((permisos) => {
        commit("PERMISOS_LISTA", permisos);
        return permisos;
      });
    },
    recuperar(store, correo) {
      return authApi.recuperar(correo);
    },
    recuperarClave(store, { llave, clave }) {
      return authApi.recuperarClave(llave, clave);
    },
  },
};
