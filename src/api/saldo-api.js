const { getHandler, postHandler } = require("./repositorio");

module.exports = {
  recargas(procesada, limite) {
    return getHandler("/saldo/recarga/historia/padre", { procesada, limite });
  },
  procesarTransaccion(transaccion, usuario) {
    return postHandler("/saldo/procesar", { transaccion, usuario });
  },
  cancelarTransaccion(transaccion, usuario) {
    return postHandler("/saldo/cancelar", { transaccion, usuario });
  },
  retiros(procesada, limite) {
    return getHandler("/saldo/retiro/historia/padre", { procesada, limite });
  },
  balance(usuario, moneda) {
    return getHandler("/saldo/balance", { usuario, moneda });
  },
  monedas() {
    return getHandler("/sistema/monedas");
  },
  metodos_pago: {
    buscar: {
      usuario(usuario) {
        return getHandler(
          "/saldo/metodopago/buscar",
          usuario ? { usuario } : null
        );
      },
    },
    nuevo(entidad, direccion, moneda, meta) {
      return postHandler("/saldo/metodopago/nuevo", {
        entidad,
        direccion,
        moneda,
        meta,
      });
    },
    remover(usuario, metodo) {
      return postHandler("/saldo/metodopago/remover", { usuario, metodo });
    },
    editar(metodo) {
      return postHandler("/saldo/metodopago/editar", metodo);
    },
  },
};
