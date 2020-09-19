import { getHandler, getRequest, postRequest } from "./repositorio";

export default {
  registrar(desde, hasta, operadora) {
    return postRequest("/sorteo/nuevo", { desde, hasta, operadora });
  },
  abrir(sorteoId) {
    return getRequest(`/sorteo/abrir/${sorteoId}`);
  },
  cerrar(sorteoId) {
    return getRequest(`/sorteo/cerrar/${sorteoId}`);
  },
  premiar(sorteo, numero) {
    return postRequest("/sorteo/premiar", { sorteo, numero });
  },
  reiniciar(sorteo, numero) {
    return postRequest("/sorteo/reiniciar", { sorteo, numero });
  },
  buscar: {
    fecha(desde, hasta, operadora, campos) {
      let data = {
        desde,
        hasta,
        campos,
      };
      if (operadora) data.operadora = operadora;
      return getRequest("/sorteo/buscar/fecha", data);
    },
    sinGanador(operadora, fecha) {
      return getHandler("/sorteo/singanador", { operadora, fecha });
    },
  },
};
