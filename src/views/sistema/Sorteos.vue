<template>
  <div>
    <v-app-bar dark dense>
      Sorteos
      <v-spacer></v-spacer>
      <v-btn type="submit" form="sorteo-form" color="success">
        <v-icon left>mdi-plus</v-icon>Registrar
      </v-btn>
    </v-app-bar>
    <v-form id="sorteo-form" @submit.prevent="registrar">
      <v-row>
        <v-col cols="6">
          <date-picker2 @change="fechaCambio" label="Desde" v-model="desde" />
        </v-col>
        <v-col cols="6">
          <date-picker2 @change="fechaCambio" label="Hasta" v-model="hasta" />
        </v-col>
      </v-row>
      <v-select
        :items="operadoras"
        item-text="nombre"
        item-value="_id"
        v-model="operadoraRegistrar"
      ></v-select>
    </v-form>
    <v-data-table :items="sorteosFiltro" :headers="header">
      <template v-slot:item.operadora="{ item }">{{ item.operadora.nombre.toUpperCase() }}</template>
      <template v-slot:item.cierra="{ item }">
        <template v-if="item.puedeAbrirse">
          <v-btn @click="cerrarSorteo_click(item._id)" icon v-if="!item.cerrado">
            <v-icon color="green">mdi-lock-open-check</v-icon>
          </v-btn>
          <v-btn @click="abrirSorteo_click(item._id)" icon v-else>
            <v-icon>mdi-lock-check</v-icon>
          </v-btn>
        </template>
        <v-btn v-else icon>
          <v-icon color="red">mdi-lock-check</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.ganador="{ item }">
        <v-btn text v-if="item.ganador" @click="reiniciarSorteo_click(item)">
          <v-icon left>mdi-refresh</v-icon>
          {{item.ganador}}
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      desde: new Date().toISOString().substring(0, 10),
      hasta: new Date().toISOString().substring(0, 10),
      operadoraRegistrar: "",
      sorteos: [],
      header: [
        { text: "FECHA", value: "fecha" },
        { text: "DESCRIPCION", value: "descripcion" },
        { text: "OPERADORA", value: "operadora" },
        { text: "GANADOR", value: "ganador" },
        { text: "ABIERTO", value: "cierra" }
      ]
    };
  },
  computed: {
    ...mapState("operadora", ["operadoras"]),
    sorteosFiltro() {
      if (this.operadoraRegistrar == "") return this.sorteos;
      else
        return this.sorteos.filter(sorteo => {
          return sorteo.operadora._id == this.operadoraRegistrar;
        });
    }
  },
  methods: {
    ...mapActions("operadora", [
      "registrarSorteo",
      "sorteos_buscarFecha",
      "abrirSorteo",
      "cerrarSorteo",
      "sorteo_reiniciar"
    ]),
    registrar() {
      this.registrarSorteo({
        desde: this.desde,
        hasta: this.hasta,
        operadora: this.operadoraRegistrar
      }).then(() => this.buscarSorteos());
    },
    buscarSorteos() {
      let ahora = new Date().toISOString();
      this.sorteos_buscarFecha({
        desde: this.desde,
        hasta: this.hasta
      }).then(sorteos => {
        this.sorteos = sorteos.map(sorteo => {
          sorteo.puedeAbrirse = ahora < sorteo.cierra;
          if (sorteo.abierta == false) sorteo.cerrado = true;
          else sorteo.cerrado = ahora > sorteo.cierra;
          return sorteo;
        });
      });
    },
    fechaCambio() {
      this.buscarSorteos();
    },
    abrirSorteo_click(sorteoId) {
      this.abrirSorteo(sorteoId).then(() => {
        this.buscarSorteos();
      });
    },
    cerrarSorteo_click(sorteoId) {
      this.cerrarSorteo(sorteoId).then(() => {
        this.buscarSorteos();
      });
    },
    reiniciarSorteo_click(sorteo) {
      this.$toasted.show(`Confirme reinicio de: ${sorteo.descripcion}`, {
        duration: 5000,
        action: {
          text: "OK",
          onClick: (e, toast) => {
            this.sorteo_reiniciar({ sorteo: sorteo._id }).then(() => {
              toast.text("Sorteo Reiniciado").goAway(1000);
              this.buscarSorteos();
            });
          }
        }
      });
    }
  },
  mounted() {
    this.buscarSorteos();
  }
};
</script>

<style>
</style>