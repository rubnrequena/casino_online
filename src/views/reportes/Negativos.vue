<template>
  <div>
    <v-toolbar dark dense src="/img/chart-header.png">
      <btn-atras label="Reporte Negativos"></btn-atras>
      <v-spacer></v-spacer>
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
    <v-row>
      <v-col cols="12" md="4">
        <v-toolbar rounded dark dense color="green">
          <v-toolbar-title>Ventas</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn outlined text>{{this.totales.venta | formatNumber}}</v-btn>
        </v-toolbar>
      </v-col>
      <v-col cols="12" md="4">
        <v-toolbar rounded dark dense :color="superaNumero(totales.ppremio,100,'red','green')">
          <v-toolbar-title>Premios</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn text>{{totales.premio | formatNumber}}</v-btn>
          <v-btn text x-small>{{totales.ppremio | formatNumber("0.00")}}%</v-btn>
        </v-toolbar>
      </v-col>
      <v-col cols="12" md="4">
        <v-toolbar rounded dark dense :color="superaNumero(totales.comision,0)">
          <v-toolbar-title>Comisiones</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn text>{{totales.comision | formatNumber}}</v-btn>
          <v-btn text x-small>{{totales.pcomision | formatNumber("0.00")}}%</v-btn>
        </v-toolbar>
      </v-col>
      <v-col cols="12" md="4">
        <v-toolbar rounded dark dense :color="superaNumero(totales.subtotal,0)">
          <v-toolbar-title>Sub Total</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn text>{{totales.subtotal | formatNumber}}</v-btn>
        </v-toolbar>
      </v-col>
      <v-col cols="12" md="4">
        <v-toolbar rounded dark dense :color="superaNumero(totales.participacion,0)">
          <v-toolbar-title>Participación</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn text>{{totales.participacion | formatNumber}}</v-btn>
          <v-btn text x-small>{{totales.pparticipacion | formatNumber('0.00')}}%</v-btn>
        </v-toolbar>
      </v-col>
      <v-col cols="12" md="4">
        <v-toolbar rounded dark dense :color="superaNumero(totales.total,0)">
          <v-toolbar-title>Total</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn text>{{totales.total | formatNumber}}</v-btn>
        </v-toolbar>
      </v-col>
    </v-row>
    <v-data-table :items="reporte" :headers="headerTabla">
      <template v-slot:item.usuario="{item}">
        <v-btn text>{{item.usuario.codigo.split("-").pop()}} - {{item.usuario.nombre}}</v-btn>
      </template>
      <template v-slot:item.venta="{item}">{{item.venta |formatNumber}}</template>
      <template v-slot:item.premio="{item}">
        {{item.premio|formatNumber}}
        <span
          class="rpt-porcentaje"
        >{{(item.premio*100/item.venta)|formatNumber("0.00")}}</span>
      </template>
      <template v-slot:item.comision="{item}">
        {{item.comision|formatNumber}}
        <span
          class="rpt-porcentaje"
        >{{(item.comision*100/item.venta)|formatNumber("0.00")}}</span>
      </template>
      <template v-slot:item.subtotal="{item}">{{item.subtotal|formatNumber}}</template>
      <template v-slot:item.participacion="{item}">
        {{item.participacion|formatNumber}}
        <v-btn x-small text>
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
      return this.usuario.rol == "conalot" ? this.headersConalot : this.headers;
    }
  },
  methods: {
    ...mapActions("reporte", {
      reporte_usuario: "usuario_negativo"
    }),
    onBuscar() {
      this.buscarReporte();
    },
    buscarReporte(usuarioId) {
      if (!usuarioId) usuarioId = this.usuario._id;
      this.reporte_usuario({
        usuario: usuarioId,
        desde: this.desde,
        hasta: this.hasta
      }).then(reportes => {
        this.reporte = reportes.sort((a, b) => a - b);

        this.totales = this.reporte.reduce(
          (totales, reporte) => {
            totales.venta += reporte.venta;
            totales.premio += reporte.premio;
            totales.comision += reporte.comision;
            totales.subtotal += reporte.subtotal;
            totales.participacion += reporte.participacion;
            totales.total += reporte.total;
            return totales;
          },
          {
            venta: 0,
            premio: 0,
            comision: 0,
            subtotal: 0,
            participacion: 0,
            total: 0
          }
        );
        this.totales.ppremio = (this.totales.premio * 100) / this.totales.venta;
        this.totales.pcomision =
          (this.totales.comision * 100) / this.totales.venta;
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
  color: grey;
  font-size: 80%;
}
</style>