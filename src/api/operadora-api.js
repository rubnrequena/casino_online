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
function editar(operadora) {
  return postRequest("/operadora/editar", operadora)
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
function remover(id) {
  return getRequest('/operadora/remover', { id })
}

function buscar_id(id) {
  return getRequest("/operadora/buscar/id", { operadora: id })
}

export default {
  nueva,
  editar,
  remover,
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
  paga: {
    buscar() {
      alert("obsoleto");
      //return getRequest("/operadora/usuario/paga", { usuario });
    },
    nuevo(usuario, operadora, monto) {
      alert("obsoleto");
      return postRequest("/operadora/usuario/paga/nuevo", {
        usuario,
        operadora,
        monto,
      });
    },
  },
  grupos: {
    buscar: {
      id(grupoId) {
        return getRequest("/operadora/grupopago/id", { grupoId });
      },
      usuario(usuario) {
        return getRequest("/operadora/grupopago/todos", { usuario });
      },
    },
    nuevo(nombre, descripcion, usuario) {
      return postRequest("/operadora/grupopago/nuevo", {
        nombre,
        descripcion,
        usuario,
      });
    },
    remover(grupoId, usuario) {
      return postRequest("/operadora/grupopago/remover", { grupoId, usuario });
    },
  },
};
