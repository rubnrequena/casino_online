<template>
  <div>
    <v-toolbar dark dense>
      <btn-atras label="Reporte Loterias"></btn-atras>
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
    <reporte-totales :columnas="headerTotal" v-model="reporteData"></reporte-totales>
    <reporte :items="reporteData" :headers="headers"></reporte>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { hoy } from "../../utils/date-util";
import reporte_totales from "./reporte-totales";
import Reporte from "./Reporte";
export default {
  components: {
    "reporte-totales": reporte_totales,
    reporte: Reporte
  },
  data() {
    return {
      desde: hoy,
      hasta: hoy,
      reporteData: [],
      headers: [
        { text: "OPERADORA", value: "operadora", total: false },
        { text: "VENTAS", value: "venta" },
        { text: "PREMIOS", value: "premio" },
        { text: "COMISION", value: "cm_banca" },
        { text: "SUBTOTAL", value: "subtotal" },
        { text: "BANCAS", value: "pt_banca" },
        { text: "OPERADORA", value: "pt_loteria" },
        { text: "MASTER", value: "pt_master" },
        { text: "COM. MASTER", value: "cm_master" },
        { text: "TOTAL", value: "total" }
      ]
    };
  },
  computed: {
    ...mapState("auth", ["usuario"])
  },
  methods: {
    ...mapActions("reporte", {
      get_reporte: "loterias"
    }),
    onBuscar() {
      this.get_reporte({
        desde: this.desde,
        hasta: this.hasta,
        moneda: "ves"
      }).then(reportes => {
        this.reporteData = reportes;
      });
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