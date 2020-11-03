<template>
  <div>
    <v-toolbar dark dense src="https://picsum.photos/1000/100">
      <btn-atras label="Reporte Operadoras"></btn-atras>
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
    <reporte :items="reporteData" :headers="headers"></reporte>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { hoy } from "../../utils/date-util";
import Reporte from "./Reporte";
export default {
  components: {
    reporte: Reporte
  },
  data() {
    return {
      operadoraReporte: null,
      moneda: {},
      relacion: false,
      desde: hoy,
      hasta: hoy,
      reporteData: [],
      headers: [
        { text: "OPERADORA", value: "operadora", total: 0 },
        { text: "VENTAS", value: "venta" },
        { text: "PREMIOS", value: "premio" },
        { text: "TICKETS", value: "tickets" },
        { text: "COMISION", value: "comision" },
        { text: "SUBTOTAL", value: "subtotal" },
        { text: "PARTICIPACION", value: "participacion" },
        { text: "TOTAL", value: "total" }
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
      get_reporte: "operadoras"
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
        this.reporteData = reportes;
      });
    },
    superaNumero(valor, porcentaje, color = "green", color2 = "red") {
      return valor > porcentaje ? `${color} lighten-1` : `${color2} lighten-1`;
    }
  },
  mounted() {
    this.buscarReporte(this.$route.params.id || this.usuario._id);
  },
  watch: {
    $route(to) {
      const id = to.path.split("/").pop();
      this.buscarReporte(id);
    }
  }
};
</script>

<style>
.rpt-porcentaje {
  font-size: 80%;
}
</style>