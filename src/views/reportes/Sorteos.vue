<template>
  <div>
    <v-toolbar dark dense>
      <btn-atras label="Sorteos"></btn-atras>
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
      <v-col cols="12">
        <simple-list
          text="Seleccione operadora"
          v-model="operadora"
          title="Operadoras"
          :items="operadoras"
          item-text="nombre"
          item-value="_id"
          maxWidth="400"
          @change="onBuscar"
        ></simple-list>
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
      operadora: null,
      headers: [
        { text: "SORTEO", value: "sorteo", total: false },
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
    ...mapState("auth", ["usuario"]),
    ...mapState("operadora", ["operadoras"])
  },
  methods: {
    ...mapActions("reporte", {
      get_reporte: "sorteos"
    }),
    onBuscar() {
      this.get_reporte({
        operadora: this.operadora,
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