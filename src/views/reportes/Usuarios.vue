<template>
  <div>
    <v-toolbar dark dense>
      <btn-atras label="Reporte Usuarios"></btn-atras>
      <v-spacer></v-spacer>
      <moneda-picker v-model="moneda" @change="onBuscar"></moneda-picker>
    </v-toolbar>
    <v-row>
      <v-col cols="12" md="4">
        Desde:
        <date-picker2 v-model="desde"></date-picker2>
      </v-col>
      <v-col cols="12" md="4">
        Hasta:
        <date-picker2 v-model="hasta"></date-picker2>
      </v-col>
      <v-col cols="12" md="4">
        <v-btn style="margin-top:15px;" @click="onBuscar" large dark block color="teal">
          <v-icon>mdi-magnify</v-icon>Buscar
        </v-btn>
      </v-col>
    </v-row>
    <reporte @select="reporte_select" :items="reporteData" :headers="headers"></reporte>
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
      usuarioReporte: null,
      moneda: {},
      desde: hoy,
      hasta: hoy,
      reporteData: [],
      headers: [
        { text: "USUARIO", value: "usuario", total: false },
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
      get_reporte: "usuario"
    }),
    onBuscar() {
      this.buscarReporte();
    },
    reporte_select(usuario) {
      this.$router.push("/reportes/usuarios/" + usuario._id);
    },
    buscarReporte() {
      this.get_reporte({
        usuario: this.usuarioReporte,
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
    this.usuarioReporte = this.$route.params.id || this.usuario._id;
    this.buscarReporte();
  },
  watch: {
    $route(to) {
      const id = to.path.split("/").pop();
      this.usuarioReporte = id;
      this.buscarReporte();
    }
  }
};
</script>

<style>
.rpt-porcentaje {
  font-size: 80%;
}
</style>