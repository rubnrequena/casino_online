import { getRequest, postRequest } from "./repositorio";

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
  reiniciar(sorteo) {
    return postRequest("/sorteo/reiniciar", { sorteo });
  },
  buscar: {
    fecha(fecha, operadora) {
      let data = {
        fecha, operadora
      }
      return getRequest("/sorteo/buscar/fecha", data);
    },
    sinGanador(operadora, fecha) {
      return getRequest("/sorteo/singanador", { operadora, fecha });
    },
  },
};
