import usuarioApi from "../api/usuario-api";

export default {
  namespaced: true,
  state: {
    comerciales: [],
    bancas: [],
    grupos: [],
    agencias: [],
    niveles: {
      master: {
        nivel: 0,
        hijos: ["multi"],
      },
      multi: {
        nivel: 1,
        hijos: ["banca"],
      },
      banca: {
        nivel: 2,
        hijos: ["grupo"],
      },
      grupo: {
        nivel: 3,
        hijos: ["agencia"],
      },
      agencia: {
        nivel: 4,
        hijos: ["taquilla", "online"],
      },
      taquilla: {
        nivel: 5,
      },
      online: {
        nivel: 5,
      },
    },
    usuario: {},
    hijos: [],
  },
  mutations: {
    USUARIO(state, usuario) {
      state.usuario = usuario;
    },
    NUEVO_USUARIO(state, hijo) {
      state.hijos.push(hijo);
    },
    HIJOS(state, hijos) {
      state.hijos = hijos;
    },
  },
  actions: {
    init(store) {
      store.dispatch("buscarRol", { rol: "multi" }).then((comerciales) => {
        store.state.comerciales = comerciales;
      });
    },
    nuevo({ commit }, usuario) {
      return usuarioApi.nuevo(usuario).then((usuario) => {
        commit("NUEVO_USUARIO", usuario);
        return usuario;
      });
    },
    buscarHijos({ commit }) {
      return usuarioApi.buscar.hijos().then((hijos) => {
        commit("HIJOS", hijos);
        return hijos;
      });
    },
    buscarHijos_cercanos(store, padreId) {
      return usuarioApi.buscar.hijos_cercanos(padreId);
    },
    buscarRol(store, rol) {
      return usuarioApi.buscar.rol(rol);
    },
    buscarId(store, usuarioId) {
      return usuarioApi.buscar.id(usuarioId);
    },
    buscarEnlace(store, usuarioId) {
      return usuarioApi.buscar.enlaces(usuarioId);
    },
    buscarTermino(store, termino) {
      return usuarioApi.buscar.termino(termino)
    },
    usuarioNivel({ state }, rol) {
      return state.niveles[rol].hijos;
    },
    usuario_activo({ state, commit }, usuarioId) {
      return usuarioApi.activo(usuarioId).then(() => {
        if (state.usuario) {
          commit("USUARIO", {
            ...state.usuario,
            activo: !state.usuario.activo,
          });
        }
      });
    },
    usuario_papelera({ state, commit }, usuarioId) {
      return usuarioApi.papelera(usuarioId).then(() => {
        if (state.usuario)
          commit("USUARIO", {
            ...state.usuario,
            papelera: !state.usuario.papelera,
          });
      });
    },
    usuario_stat(store, usuarioId) {
      return usuarioApi.buscar.stat(usuarioId);
    },
    permisos_todos(store, modo) {
      return usuarioApi.permisos.buscar.todos(modo);
    },
    cambiar_clave(store, { usuario, clave }) {
      return usuarioApi.cambiar_clave(usuario, clave);
    },
    comision_usuario(store, usuario) {
      return usuarioApi.comision.buscar.usuario(usuario)
    },
    comision_editar(store, { usuario, comision }) {
      return usuarioApi.comision.editar(usuario, comision)
    },
    comision_nueva(store, { usuario, operadora, comision, participacion, utilidad }) {
      return usuarioApi.comision.nueva(usuario, operadora, comision, participacion, utilidad)
    }
  },
};
