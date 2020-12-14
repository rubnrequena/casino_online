<template>
  <div>
    <v-app-bar color="#6A76AB" dense dark src="https://picsum.photos/1920/1080?random">
      <template v-slot:img="{ props }">
        <v-img v-bind="props" gradient="to top right, rgba(0,0,0,.7), rgba(25,32,72,.7)"></v-img>
      </template>
      <btn-atras label="Reporte Sorteo"></btn-atras>
      <v-spacer></v-spacer>
      <moneda-picker v-model="moneda" @change="onBuscar"></moneda-picker>
    </v-app-bar>
    <v-row>
      <v-col>
        Fecha:
        <date-picker2 v-model="fecha"></date-picker2>
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
          :maxWidth="400"
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
      fecha: hoy,
      reporteData: [],
      operadora: "",
      moneda: {},
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
        fecha: this.fecha,
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