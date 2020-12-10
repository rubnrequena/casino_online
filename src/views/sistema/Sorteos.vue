<template>
  <div>
    <v-app-bar dark dense>
      Sorteos
      <v-spacer></v-spacer>
      <v-btn type="submit" color="success" @click="registroDialog=true">Registrar</v-btn>
    </v-app-bar>
    <v-form id="sorteo-form" @submit.prevent="registrar">
      <v-row>
        <v-col cols="12">
          <label>Fecha</label>
          <date-picker2 @change="fechaCambio" label="Fecha" v-model="fecha" />
        </v-col>
      </v-row>
      <v-select
        :items="operadoras"
        item-text="nombre"
        item-value="_id"
        v-model="operadoraRegistrar"
        @change="fechaCambio"
      ></v-select>
    </v-form>
    <v-data-table :items="sorteos" :headers="header">
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
    <v-dialog max-width="400" v-model="registroDialog">
      <v-card>
        <v-card-title>Dias a registrar</v-card-title>
        <v-card-text>
          <v-col cols="12">
            <label>Desde</label>
            <date-picker2 label="Desde" v-model="desde" />
          </v-col>
          <v-col cols="12">
            <label>Hasta</label>
            <date-picker2 label="Hasta" v-model="hasta" />
          </v-col>
        </v-card-text>
        <v-card-actions>
          <v-btn type="submit" form="sorteo-form" color="success" block>Registrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <sino
      v-model="reiniciarDialog"
      title="Reiniciar premio"
      :text="`Confirma desea reiniciar premio`"
      @submit="reiniciarSorteo_ok"
      @cancel="reiniciarSorteo_cancelar"
    />
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      registroDialog: false,
      reiniciarDialog: false,
      reiniciarSorteo: {},
      fecha: new Date().toISOString().substring(0, 10),
      desde: new Date().toISOString().substring(0, 10),
      hasta: new Date().toISOString().substring(0, 10),
      operadoraRegistrar: "",
      sorteos: [],
      header: [
        { text: "DESCRIPCION", value: "descripcion" },
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
      }).then(() => {
        this.$toasted.success("Sorteos registrados...", { duration: 3000 });
        this.buscarSorteos();
      });
    },
    buscarSorteos() {
      if (!this.operadoraRegistrar) return;
      let ahora = new Date().toISOString();
      this.sorteos_buscarFecha({
        fecha: this.fecha,
        operadora: this.operadoraRegistrar
      })
        .then(sorteos => {
          this.sorteos = sorteos.map(sorteo => {
            sorteo.puedeAbrirse = ahora < sorteo.cierra;
            if (sorteo.abierta == false) sorteo.cerrado = true;
            else sorteo.cerrado = ahora > sorteo.cierra;
            return sorteo;
          });
        })
        .catch(error => {
          alert(error);
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
      this.reiniciarSorteo = sorteo;
      this.reiniciarDialog = true;
    },
    reiniciarSorteo_cancelar() {
      this.reiniciarSorteo = null;
    },
    reiniciarSorteo_ok() {
      console.log("sorteo >>", this.reiniciarSorteo);
      this.sorteo_reiniciar(this.reiniciarSorteo._id).then(() => {
        this.buscarSorteos();
      });
    }
  }
};
</script>

<style>
</style>