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
        <v-icon>mdi-refresh</v-icon>
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
        <!-- <v-col>
          <v-spacer></v-spacer>
          <v-btn text block outlined>
            Moneda:
            <span class="text-uppercase">{{moneda.nombre}} ({{moneda.siglas}})</span>
          </v-btn>
        </v-col>-->
      </v-row>
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
              {{item.jugadas | formatNumber()}}
              <strong
                style="color:grey;"
              >{{item.pr_jugadas | formatNumber(porcentaje)}}%</strong>
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
export default {
  components: {
    "admin-tickets-usuario": AdminTicketsUsuario
  },
  data() {
    return {
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
        { text: "JUGADAS", value: "jugadas" }
      ],
      usuarioMonitoreado: null,
      ticketsUsuario: [],
      totalJugado: 0,
      totalJugadas: 0,

      tiempoActualizacion: 1,
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
    })
  },
  methods: {
    ...mapActions("ticket", [
      "monitor_admin",
      "monitor_numero",
      "admin_tickets"
    ]),
    buscarVentas() {
      clearTimeout(this.tiemposInterval);
      this.monitor_admin({
        sorteo: this.sorteo._id,
        rol: this.rol,
        moneda: this.moneda.siglas
      }).then(monitor => {
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
        this.numeros = numeros;
      });

      let interval = this.tiemposNum[this.tiempoActualizacion];
      if (interval > 0)
      this.tiemposInterval = setTimeout(() => {
        this.buscarVentas();
      }, interval);
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
    cambiarTiempoActualizacion() {
      let t = this.tiempoActualizacion + 1;
      if (t < this.tiemposNum.length) {
        this.tiempoActualizacion = t;
      } else {
        this.tiempoActualizacion = 0;
        clearTimeout(this.tiemposInterval);
      }
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