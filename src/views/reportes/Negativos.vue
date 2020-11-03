<template>
  <div>
    <v-toolbar dark dense>
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
        <v-btn style="margin-top:15px;" @click="buscarReporte" large dark block color="teal">
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
      usuarioID: null,
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
      ]
    };
  },
  computed: {
    ...mapState("auth", ["usuario"])
  },
  methods: {
    ...mapActions("reporte", {
      get_reporte: "usuario_negativo"
    }),
    buscarReporte() {
      this.get_reporte({
        usuario: this.usuarioID,
        desde: this.desde,
        hasta: this.hasta,
        moneda: "ves"
      }).then(reportes => {
        this.reporteData = reportes;
      });
    },
    reporte_select(usuario) {
      this.$router.push("/reportes/negativos/" + usuario._id);
    }
  },
  mounted() {
    this.usuarioID = this.usuario._id;
    this.buscarReporte();
  },
  watch: {
    $route(to) {
      const id = to.path.split("/").pop();
      this.usuarioID = id;
      this.buscarReporte();
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