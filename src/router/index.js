import Vue from "vue";
import VueRouter from "vue-router";
import App from "../views/Principal.vue";
import Inicio from "../views/Inicio.vue";
import Login from "../views/core/Login.vue";
import Recuperar from "../views/core/Recuperar.vue";
import RecuperarClave from "../views/core/RecuperarClave.vue";

import Operadoras from "../views/sistema/Operadoras.vue";
import Operadora from "../views/sistema/Operadora.vue";
//import Operadora_Paga from "../views/sistema/Operadora_Paga.vue";
import GruposPago from "../views/sistema/GruposPago.vue";
import GruposPago_info from "../views/sistema/GrupoPago_info.vue";
import Sorteos from "../views/sistema/Sorteos.vue";
import Operadora_Nueva from "../views/sistema/Operadora_Nueva.vue";
import Operadora_Numeros from "../views/sistema/Numeros.vue";
import Enlaces from "../views/sistema/Enlaces.vue";
import Premiar from "../views/sistema/Premiar.vue";
import Monitoreo from "../views/operaciones/Monitoreo.vue";

import Saldo from "../views/saldo/Saldo.vue";
import Recargas from "../views/saldo/recargas/Recargas.vue";
import RecargasHistoria from "../views/saldo/recargas/Historia.vue";
import Retiros from "../views/saldo/retiros/Retiros.vue";
import RetirosHistoria from "../views/saldo/retiros/Historia.vue";
import MetodosPago from "../views/saldo/MetodosPago.vue";

import Usuarios from "../views/usuarios/Usuarios.vue";
import Usuario from "../views/usuarios/Usuario.vue";
import Usuario_Nuevo from "../views/usuarios/usuario/Nuevo.vue";
import Usuario_Info from "../views/usuarios/usuario/Info.vue";
import Usuario_Cupos from "../views/usuarios/usuario/Cupos.vue";
import Usuario_Permisos from "../views/usuarios/usuario/Permisos.vue";
import Usuario_Hijos from "../views/usuarios/usuario/Hijos.vue";
import Usuario_Seguridad from "../views/usuarios/usuario/Seguridad.vue";
import Menu from "../views/interfaz/menus/MenuIndex.vue";
import MenuNuevo from "../views/interfaz/menus/Nuevo.vue";

import Permiso_Index from "../views/permisos/Index.vue";
import NoAutorizado from "../views/NoAutorizado.vue";
import Cupos from "../views/cupos/Index.vue";

//#region Reportes
import Reporte_Usuario from "../views/reportes/Usuarios.vue";
import Reporte_Operadoras from "../views/reportes/Operadoras.vue";
import Reporte_Negativos from "../views/reportes/Negativos.vue";
import Reporte_Loterias from "../views/reportes/Loterias.vue";
import Reporte_Sorteos from "../views/reportes/Sorteos.vue";

//#endregion

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "app",
    component: App,
    children: [
      {
        path: "/",
        component: Inicio,
      },
      {
        path: "operadora",
        component: { render },
        children: [
          {
            path: "operadoras",
            component: { render },
            children: [
              { path: "/", component: Operadoras },
              {
                path: "nueva",
                component: Operadora_Nueva,
                meta: { permiso: "operadora2" },
              },
              { path: "numeros", component: Operadora_Numeros },
              { path: "operadora/:operadora", component: Operadora },
            ],
            meta: {
              title: "Operadoras",
              permiso: "operadora1",
            },
          },
          {
            path: "grupospago",
            component: { render },
            children: [
              {
                path: "/",
                component: GruposPago,
              },
              {
                path: ":id",
                component: GruposPago_info,
              },
            ],
          },
          {
            path: "sorteos",
            component: Sorteos,
            meta: { permiso: "sorteos1" },
          },
          {
            path: "premiar",
            component: Premiar,
            meta: { permiso: "sorteos_prm" },
          },
          {
            path: "enlaces/:usuario?",
            component: Enlaces,
          },
        ],
      },
      {
        path: "/saldo",
        component: { render },
        children: [
          {
            path: "historial",
            component: Saldo,
          },
          {
            path: "recargas",
            component: { render },
            children: [
              { path: "/", component: Recargas },
              { path: "historia", component: RecargasHistoria },
            ],
          },
          {
            path: "retiros",
            component: { render },
            children: [
              { path: "/", component: Retiros },
              { path: "historia", component: RetirosHistoria },
            ],
          },
          { path: "metodospago", component: MetodosPago },
        ],
      },
      {
        path: "/operaciones",
        component: { render },
        children: [{ path: "monitoreo", component: Monitoreo }],
      },
      {
        path: "/usuarios",
        component: { render },
        children: [
          {
            path: "lista",
            component: Usuarios,
          },
          {
            path: "lista/:usuario?",
            component: Usuarios,
          },
          {
            path: "nuevo",
            component: Usuario_Nuevo,
            meta: { permiso: "usuario2" },
          },
          {
            path: "menu",
            component: { render },
            meta: { permiso: "usuario2" },
            children: [
              {
                path: "/",
                component: Menu,
              },
              {
                path: "nuevo",
                component: MenuNuevo,
              },
            ],
          },
          {
            path: "u/:usuario",
            redirect: "u/:usuario/info",
            component: Usuario,
            children: [
              { path: "info", component: Usuario_Info },
              {
                path: "cupos",
                component: Usuario_Cupos,
              },
              {
                path: "permisos",
                component: Usuario_Permisos,
              },
              {
                path: "usuarios",
                component: Usuario_Hijos,
                meta: { permiso: "usuario1" },
              },
              {
                path: "seguridad",
                component: Usuario_Seguridad,
              },
            ],
          },
          {
            path: "permisos",
            component: Permiso_Index,
            meta: { permiso: "permisos1" },
          },
        ],
        meta: {
          permiso: "usuario1",
        },
      },
      {
        path: "/cupos",
        component: { render },
        children: [{ path: "/", component: Cupos }],
      },
      {
        path: "/reportes",
        component: { render },
        children: [
          { path: "usuarios", component: Reporte_Usuario },
          { path: "usuarios/:id", component: Reporte_Usuario },
          { path: "operadoras", component: Reporte_Operadoras },
          { path: "operadoras/:id", component: Reporte_Operadoras },
          { path: "negativos", component: Reporte_Negativos },
          { path: "negativos/:id", component: Reporte_Negativos },
          { path: "loterias", component: Reporte_Loterias },
          { path: "sorteos", component: Reporte_Sorteos },
          { path: "sorteos/:id", component: Reporte_Sorteos },
        ],
      },
      {
        path: "/no-autorizado",
        component: NoAutorizado,
      },
    ],
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/olvidoclave",
    component: Recuperar,
  },
  {
    path: "/recuperar",
    component: RecuperarClave,
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

function render(h) {
  return h("router-view");
}

import store from "../store/index";
router.beforeEach(async (to, from, next) => {
  const metaAuth = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.permiso);
  //const routeMeta = to.matched.slice().reverse().find((r) => r.meta && r.meta.auth);
  const publicPages = [
    "/login",
    "/olvidoclave",
    "/recuperar",
    "/401",
    "/registro",
    "/verificar",
    "/no-autorizado",
  ]; //TODO extraer "publicPages" de un config.json
  if (publicPages.find((page) => to.fullPath.split("?").shift() == page)) {
    return next();
  }
  const usuario = store.state.auth.usuario;
  if (!usuario) {
    store.state.auth.redireccionPendiente = to.fullPath;
    return next({
      path: "/login", //TODO extraer pagina redireccion de un config.json
      replace: true,
    });
  } else {
    if (metaAuth) {
      const permiso = await store.dispatch(
        "auth/tienePermiso",
        metaAuth.meta.permiso,
        { root: true }
      );
      if (permiso == false) {
        return next({
          path: "/no-autorizado", //TODO extraer pagina acceso no autorizado de un config.json
          replace: true,
        });
      }
    }
  }
  return next();
});

export default router;
