<template>
  <div>
    <v-toolbar dark dense src="https://picsum.photos/1000/100">
      <btn-atras label="Reporte Usuarios"></btn-atras>
      <v-spacer></v-spacer>
      <v-btn @click="relacion=!relacion" outlined>
        <v-icon>mdi-percent</v-icon>Relacion
      </v-btn>
      <moneda-picker v-model="moneda" @change="onBuscar"></moneda-picker>
    </v-toolbar>
    <v-row>
      <v-col>
        Desde:
        <date-picker2 v-model="desde"></date-picker2>
      </v-col>
      <v-col>
        Hasta:
        <date-picker2 v-model="hasta"></date-picker2>
      </v-col>
      <v-col>
        <v-btn style="margin-top:15px;" @click="onBuscar" large dark block color="teal">
          <v-icon>mdi-magnify</v-icon>Buscar
        </v-btn>
      </v-col>
    </v-row>
    <v-simple-table dark>
      <thead>
        <tr v-if="esConalot">
          <th>Ventas</th>
          <th>Premios</th>
          <th>Tickets</th>
          <th>Comision</th>
          <th>Total</th>
        </tr>
        <tr v-else>
          <th>Ventas</th>
          <th>Premios</th>
          <th>Tickets</th>
          <th>Comision</th>
          <th>Subtotal</th>
          <th>Participacion</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{this.totales.venta | formatNumber}}</td>
          <td>
            {{totales.premio | formatNumber}}
            <small
              v-show="relacion"
            >{{totales.ppremio | formatNumber("0.00")}}%</small>
          </td>
          <td>{{totales.tickets | formatNumber}}</td>
          <td v-if="!esConalot">
            {{totales.comision | formatNumber}}
            <small
              v-show="relacion"
            >{{totales.pcomision | formatNumber("0.00")}}%</small>
          </td>
          <td v-if="!esConalot">{{totales.subtotal | formatNumber}}</td>
          <td v-if="!esConalot">
            {{totales.participacion | formatNumber}}
            <small
              v-show="relacion"
            >{{totales.pparticipacion | formatNumber("0.00")}}%</small>
          </td>
          <td v-if="!esConalot">{{totales.total | formatNumber}}</td>
          <td v-if="esConalot">
            {{totales.venta*0.04 | formatNumber}}
            <small
              v-show="relacion"
            >{{((totales.venta*0.04)*100)/totales.venta | formatNumber("0.00")}}%</small>
          </td>
          <td
            v-if="esConalot"
          >{{(totales.venta-totales.premio-(totales.venta*0.04)) | formatNumber}}</td>
        </tr>
      </tbody>
    </v-simple-table>
    <v-data-table :items="reporte" :headers="headerTabla">
      <template v-slot:item.usuario="{item}">
        <v-btn text>{{item.usuario.codigo.split("-").pop()}} - {{item.usuario.nombre}}</v-btn>
      </template>
      <template v-slot:item.venta="{item}">{{item.venta |formatNumber}}</template>
      <template v-slot:item.premio="{item}">
        {{item.premio|formatNumber}}
        <span
          v-show="relacion"
          class="rpt-porcentaje"
        >{{(item.premio*100/item.venta)|formatNumber("0.00")}}</span>
      </template>
      <template v-slot:item.comision="{item}">
        {{item.comision|formatNumber}}
        <span
          v-show="relacion"
          class="rpt-porcentaje"
        >{{(item.comision*100/item.venta)|formatNumber("0.00")}}</span>
      </template>
      <template v-slot:item.subtotal="{item}">{{item.subtotal|formatNumber}}</template>
      <template v-slot:item.participacion="{item}">
        {{item.participacion|formatNumber}}
        <v-btn x-small text v-show="relacion">
          {{(item.participacion*100/item.subtotal)|formatNumber("0.00")}}
          <v-icon style="font-size:150%">mdi-information-variant</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.total="{item}">{{item.total|formatNumber}}</template>

      <template v-slot:item.ccomision="{item}">{{(item.venta*0.04)|formatNumber}}</template>
      <template
        v-slot:item.ctotal="{item}"
      >{{(item.venta-item.premio-(item.venta*0.04))|formatNumber}}</template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { hoy } from "../../utils/date-util";
export default {
  data() {
    return {
      moneda: {},
      relacion: false,
      desde: hoy,
      hasta: hoy,
      reporte: [],
      headers: [
        { text: "USUARIO", value: "usuario" },
        { text: "VENTAS", value: "venta" },
        { text: "PREMIOS", value: "premio" },
        { text: "TICKETS", value: "tickets" },
        { text: "COMISION", value: "comision" },
        { text: "SUBTOTAL", value: "subtotal" },
        { text: "PARTICIPACION", value: "participacion" },
        { text: "TOTAL", value: "total" }
      ],
      headersConalot: [
        { text: "USUARIO", value: "usuario" },
        { text: "VENTAS", value: "venta" },
        { text: "PREMIOS", value: "premio" },
        { text: "TICKETS", value: "tickets" },
        { text: "COMISION", value: "ccomision" },
        { text: "TOTAL", value: "ctotal" }
      ],
      totales: {}
    };
  },
  computed: {
    ...mapState("auth", ["usuario"]),
    headerTabla() {
      return this.usuario.usuario == "conalot"
        ? this.headersConalot
        : this.headers;
    },
    esConalot() {
      return this.usuario.usuario == "conalot";
    }
  },
  methods: {
    ...mapActions("reporte", {
      get_reporte: "usuario"
    }),
    onBuscar() {
      this.buscarReporte();
    },
    buscarReporte(usuarioId) {
      if (!usuarioId) usuarioId = this.usuario._id;
      this.get_reporte({
        usuario: usuarioId,
        desde: this.desde,
        hasta: this.hasta,
        moneda: this.moneda.siglas
      }).then(reportes => {
        this.reporte = reportes;

        this.totales = this.reporte.reduce(
          (totales, reporte) => {
            totales.venta += reporte.venta;
            totales.premio += reporte.premio;
            totales.comision += reporte.comision;
            totales.subtotal += reporte.subtotal;
            totales.participacion += reporte.participacion;
            totales.total += reporte.total;
            totales.tickets += reporte.tickets;
            return totales;
          },
          {
            venta: 0,
            premio: 0,
            comision: 0,
            subtotal: 0,
            participacion: 0,
            tickets: 0,
            total: 0
          }
        );
        this.totales.ppremio = (this.totales.premio * 100) / this.totales.venta;
        this.totales.pcomision =
          (this.totales.comision * 100) / this.totales.venta;
        this.totales.pparticipacion = Math.abs(
          (this.totales.participacion * 100) / this.totales.subtotal
        );
      });
    },
    superaNumero(valor, porcentaje, color = "green", color2 = "red") {
      return valor > porcentaje ? `${color} lighten-1` : `${color2} lighten-1`;
    }
  }
};
</script>

<style>
.rpt-porcentaje {
  font-size: 80%;
}
</style>