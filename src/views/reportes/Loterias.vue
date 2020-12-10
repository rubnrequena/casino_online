<template>
  <div>
    <v-toolbar color="#6A76AB" dense dark src="https://picsum.photos/1920/1080?random">
      <template v-slot:img="{ props }">
        <v-img v-bind="props" gradient="to top right, rgba(0,0,0,.7), rgba(25,32,72,.7)"></v-img>
      </template>
      <btn-atras label="Reporte Loterias"></btn-atras>
      <v-spacer></v-spacer>
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
      desde: hoy,
      hasta: hoy,
      reporteData: [],
      moneda: {},
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
        moneda: this.moneda.siglas
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