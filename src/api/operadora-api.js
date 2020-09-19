const { postRequest, getRequest } = require("./repositorio");

function nueva(nombre, paga, tipo, sorteos, numeros) {
  return postRequest("/operadora/nueva", {
    nombre,
    tipo,
    paga,
    sorteos,
    numeros,
  });
}
function todas() {
  return getRequest("/operadora/buscar/todas");
}
function enlace(usuario, operadora, mostrar) {
  return postRequest("/operadora/enlace/nuevo", {
    usuario,
    operadora,
    mostrar,
  });
}
function enlaceRemover(usuario, enlace) {
  return postRequest("/operadora/enlace/remover", { usuario, enlace });
}
function activar_enlace(usuario, enlace, activo) {
  return postRequest("/operadora/enlace/activar", { usuario, enlace, activo });
}

function buscar_id() {}

export default {
  nueva,
  enlace,
  enlaceRemover,
  activar_enlace,
  buscar: {
    todas,
    id: buscar_id,
  },
  numero: {
    buscar: {
      todos() {
        return getRequest("/operadora/numero/todos");
      },
    },
    nuevo(nombre, numeros) {
      return postRequest("/operadora/numero/nuevo", { nombre, numeros });
    },
  },
};
