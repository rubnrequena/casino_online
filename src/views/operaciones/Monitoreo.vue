<template>
  <div>
    <v-app-bar color="#6A76AB" dark>
      <template v-slot:img="{ props }">
        <v-img v-bind="props" gradient="to top right, rgba(0,0,0,.7), rgba(25,32,72,.7)"></v-img>
      </template>
      <v-toolbar-title class="text-uppercase">
        <btn-atras label="Monitoreo" />
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn outlined @click="cambiarTiempoActualizacion">
        <v-icon>{{iconoRefresco}}</v-icon>
        {{tiemposLabel[tiempoActualizacion]}}
      </v-btn>
    </v-app-bar>
    <v-container>
      <v-row>
        <v-col>
          <sorteo-picker v-model="sorteo" @close="sorteoDialog=false" @submit="buscarVentas">
            <template v-slot:default="{sorteo,click}">
              <v-btn block outlined text @click="click">
                <v-icon left>mdi-calendar-search</v-icon>
                Sorteo: {{sorteo.descripcion}}
              </v-btn>
            </template>
          </sorteo-picker>
        </v-col>
        <v-col>
          <moneda-picker v-model="moneda" @change="buscarVentas"></moneda-picker>
        </v-col>
      </v-row>
      <v-btn
        block
        dark
        @click="cambiarStatus"
        :color="estatusSorteo?'green':'#990000'"
        title="Click parar cerrar/abrir sorteo"
      >
        <v-icon>{{estatusSorteo?"mdi-lock-open":"mdi-lock"}}</v-icon>
        {{estatusSorteo?"ABIERTO":"CERRADO"}}
      </v-btn>
    </v-container>
    <v-tabs v-model="tab" background-color="deep-purple accent-4" class="elevation-2" dark>
      <v-tabs-slider></v-tabs-slider>

      <v-tab>Usuarios</v-tab>
      <v-tab>Numeros</v-tab>

      <v-tab-item>
        <v-card flat tile>
          <v-container>
            <v-select
              label="Rol"
              v-model="rol"
              text
              :items="roles"
              item-text="text"
              item-value="value"
              @change="rol_change"
            ></v-select>
            <v-data-table :dense="ventas.length>20" :items="ventas" :headers="header">
              <template v-slot:item.nombre="{item}">
                <v-btn text @click="verTickets(item)">{{item.nombre}}</v-btn>
              </template>
              <template v-slot:item.jugado="{item}">
                {{item.jugado | formatNumber}}
                <strong
                  style="color:grey;"
                >{{item.pr_jugado | formatNumber(porcentaje)}}%</strong>
              </template>
              <template v-slot:item.jugadas="{item}">{{item.jugadas | formatNumber}}</template>
            </v-data-table>
          </v-container>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat tile>
          <v-data-table :dense="numeros.length>20" :items="numeros" :headers="headerNumeros">
            <template v-slot:item._id="{item}">
              <v-btn x-small icon @click="premiar(item)">
                <v-icon>mdi-flag-checkered</v-icon>
              </v-btn>
              {{item._id}}
              <span
                style="color:grey; font-style:italic;"
                v-if="item.ultPremio"
              >- {{diferenciaDias(item.ultPremio.fecha)}}d</span>
            </template>
            <template v-slot:item.jugado="{item}">
              {{item.jugado | formatNumber}}
              <strong
                style="opacity:0.6"
              >{{item.pr_jugado | formatNumber(porcentaje)}}%</strong>
            </template>
            <template v-slot:item.premio="{item}">
              {{item.premio | formatNumber()}}
              <span v-if="item.pr_premio>100" style="color:red;">
                <strong>{{item.pr_premio | formatNumber(porcentaje)}}%</strong>
              </span>
              <span v-else style="color:green;">
                <strong>{{item.pr_premio | formatNumber(porcentaje)}}%</strong>
              </span>
            </template>
            <template v-slot:item.jugadas="{item}">
              <v-btn text>
                {{item.jugadas | formatNumber()}}
                <strong
                  style="color:grey;"
                >{{item.pr_jugadas | formatNumber(porcentaje)}}%</strong>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-tab-item>
    </v-tabs>
    <v-dialog v-model="ticketsDialog" scrollable max-width="800">
      <admin-tickets-usuario v-model="ticketsUsuario" @close="ticketsDialog=false"></admin-tickets-usuario>
    </v-dialog>
  </div>
</template>

<script>
import AdminTicketsUsuario from "@/components/ticket/admin-tickets-usuario";
import { mapActions, mapState } from "vuex";
import moment from "moment-mini";
export default {
  components: {
    "admin-tickets-usuario": AdminTicketsUsuario
  },
  data() {
    return {
      iconoRefresco: "mdi-refresh",
      porcentaje: "0.0",
      ticketsDialog: false,
      tab: null,
      sorteoDialog: false,
      sorteo: {},
      header: [
        { text: "USUARIO", value: "nombre" },
        { text: "JUGADO", value: "jugado" },
        { text: "JUGADAS", value: "jugadas" }
      ],
      roles: [
        { text: "COMERCIAL", value: "multi" },
        { text: "BANCA", value: "banca" },
        { text: "GRUPO", value: "grupo" },
        { text: "AGENCIA", value: "agencia" }
      ],
      rol: "multi",
      ventas: [],
      numeros: [],
      headerNumeros: [
        { text: "NUMERO", value: "_id" },
        { text: "JUGADO", value: "jugado" },
        { text: "PREMIO", value: "premio" },
        { text: "JUGADAS", value: "jugadas" },
        { text: "SOLICITADO", value: "solicitado" }
      ],
      usuarioMonitoreado: null,
      ticketsUsuario: [],
      totalJugado: 0,
      totalJugadas: 0,
      historia: [],

      tiempoActualizacion: 0,
      tiemposLabel: ["M", "5S", "10S", "30S"],
      tiemposNum: [0, 5000, 10000, 30000],
      tiemposInterval: 0,

      moneda: {
        nombre: "",
        siglas: ""
      }
    };
  },
  computed: {
    ...mapState("auth", {
      monedas: state => state.usuario.moneda
    }),
    estatusSorteo() {
      const ahora = new Date();
      const cierre = new Date(this.sorteo.cierra);
      if (!this.sorteo) return false;
      if (ahora < cierre) {
        return this.sorteo.abierta;
      } else return false;
    }
  },
  methods: {
    ...mapActions("ticket", [
      "monitor_admin",
      "monitor_numero",
      "admin_tickets"
    ]),
    ...mapActions("operadora", [
      "abrirSorteo",
      "cerrarSorteo",
      "numeros_historia",
      "sorteo_premiar"
    ]),
    premiar(numero) {
      const payload = {
        numero: numero._id,
        sorteo: this.sorteo._id
      };
      this.sorteo_premiar(payload)
        .then(() => {
          this.$toasted.success("Sorteo premiado exitosamente", {
            duration: 2000
          });
          this.buscarVentas();
        })
        .catch(error => {
          this.$toasted.error(error, { duration: 2000 });
        });
    },
    cambiarStatus() {
      if (!this.sorteo) return;
      if (this.estatusSorteo)
        this.cerrarSorteo(this.sorteo._id)
          .then(() => {
            this.sorteo = { ...this.sorteo, abierta: false };
          })
          .catch(error => {
            this.$toasted.error(error, {
              duration: 3000
            });
          });
      else
        this.abrirSorteo(this.sorteo._id)
          .then(() => {
            this.sorteo = { ...this.sorteo, abierta: true };
          })
          .catch(error => {
            this.$toasted.error(error, {
              duration: 3000
            });
          });
    },
    buscarVentas() {
      this.buscarHistoria();
      clearTimeout(this.tiemposInterval);
      this.iconoRefresco = "mdi-update";
      this.monitor_admin({
        sorteo: this.sorteo._id,
        rol: this.rol,
        moneda: this.moneda.siglas
      }).then(monitor => {
        this.iconoRefresco = "mdi-refresh";
        this.totalJugado = monitor.reduce((prev, venta) => {
          return prev + venta.jugado;
        }, 0);
        this.totalJugadas = monitor.reduce((prev, venta) => {
          return prev + venta.jugadas;
        }, 0);
        monitor.forEach(venta => {
          venta.pr_jugado = (venta.jugado * 100) / this.totalJugado;
        });
        this.ventas = monitor;
      });

      this.monitor_numero({
        sorteo: this.sorteo._id,
        moneda: this.moneda.siglas
      }).then(numeros => {
        numeros.forEach(venta => {
          venta.pr_premio = (venta.premio * 100) / this.totalJugado;
          venta.pr_jugado = (venta.jugado * 100) / this.totalJugado;
          venta.pr_jugado = (venta.jugado * 100) / this.totalJugado;
          venta.pr_jugadas = (venta.jugadas * 100) / this.totalJugadas;
        });
        this.numeros = numeros.map(this.asignarUltimoPremio);
      });

      this.iniciarCronometro();
    },
    rol_change() {
      this.buscarVentas();
    },
    verTickets(usuario) {
      this.usuarioMonitoreado = usuario;
      this.ticketsUsuario = [];
      this.ticketsDialog = true;
      this.admin_tickets({
        sorteo: this.sorteo._id,
        usuario: usuario._id
      }).then(tickets => (this.ticketsUsuario = tickets));
    },
    iniciarCronometro() {
      if (!this.sorteo) return;
      let interval = this.tiemposNum[this.tiempoActualizacion];
      if (interval > 0) {
        this.tiemposInterval = setTimeout(() => {
          this.buscarVentas();
        }, interval);
      } else {
        this.tiempoActualizacion = 0;
        clearTimeout(this.tiemposInterval);
        this.tiemposInterval = 0;
      }
    },
    cambiarTiempoActualizacion() {
      this.tiempoActualizacion++;
      if (this.tiempoActualizacion > this.tiemposNum.length)
        this.tiempoActualizacion = 0;
      this.iniciarCronometro();
    },
    buscarHistoria() {
      this.numeros_historia(this.sorteo.operadora)
        .then(historia => {
          this.historia = historia;
          this.numeros = this.numeros.map(this.asignarUltimoPremio);
        })
        .catch(error => {
          this.$toasted.error(error, { duration: 5000 });
        });
    },
    asignarUltimoPremio(numero) {
      numero.ultPremio = this.historia.find(
        nhistoria => nhistoria.numero == numero._id
      );
      return numero;
    },
    diferenciaDias(fecha) {
      const premio = moment(fecha);
      const hoy = moment();
      const diff = hoy.diff(premio, "days");
      return diff;
    }
  },
  mounted() {
    let moneda = this.monedas.find(moneda => moneda.principal);
    if (moneda) this.moneda = moneda;
  }
};
</script>

<style>
</style>