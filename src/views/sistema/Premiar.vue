<template>
  <div>
    <v-app-bar color="#6A76AB" dark>
      <template v-slot:img="{ props }">
        <v-img v-bind="props" gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"></v-img>
      </template>
      <v-toolbar-title class="text-uppercase">
        <btn-atras label="Premiar Sorteo"></btn-atras>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-row>
      <v-col>
        <v-select
          @change="buscar"
          v-model="operadora"
          :items="operadoras"
          item-value="_id"
          item-text="nombre"
        ></v-select>
      </v-col>
      <v-col>
        <date-picker2 @change="buscar" v-model="fecha" style="padding-top:10px;"></date-picker2>
      </v-col>
    </v-row>

    <v-data-table :items="sorteos" :headers="headers">
      <template v-slot:item.numero="{item}">
        <v-text-field v-model="numeroSorteos[item._id]"></v-text-field>
      </template>
      <template v-slot:item.reiniciar="{item}">
        <v-btn v-if="item.ganador==''" color="green" icon @click="premiar(item)">
          <v-icon>mdi-check</v-icon>
        </v-btn>
        <v-btn v-else color="red" icon @click="reiniciar(item)">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <sino
      v-model="premioDialog"
      title="Confirmar premio"
      :text="`Sorteo:<br/><b>${premio.descripcion}</b> <br/>Número: <b>${premio.ganador}</b>`"
      @submit="premiarSorteo"
      @cancel="cancelaPremiacion"
    ></sino>
    <sino
      v-model="reinicioDialog"
      title="Reiniciar premio"
      :text="`Confirma desea reiniciar premio`"
      @submit="reiniciar"
      @cancel="cancelaPremiacion"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { disponible } from "../../utils/data-util";
export default {
  data() {
    return {
      numeroSorteos: {},
      premioDialog: false,
      premio: {
        descripcion: ""
      },
      sorteos: [],
      operadora: {},
      fecha: new Date().toISOString().substring(0, 10),
      hoy: new Date().toISOString(),
      headers: [
        { text: "DESCRIPCION", value: "descripcion" },
        { text: "NUMERO", value: "numero" },
        { text: "", value: "reiniciar" }
      ],

      reinicioDialog: false
    };
  },
  computed: {
    ...mapState("operadora", ["numeros", "operadoras"])
  },
  methods: {
    ...mapActions("operadora", [
      "sorteos_buscarFecha",
      "sorteo_premiar",
      "numero_todos",
      "sorteo_reiniciar"
    ]),
    premiarSorteo() {
      const payload = {
        numero: this.premio.ganador,
        sorteo: this.premio._id
      };
      this.sorteo_premiar(payload)
        .then(() => {
          this.$toasted.success("Sorteo premiado exitosamente", {
            duration: 2000
          });
        })
        .catch(error => {
          this.$toasted.error(error, { duration: 2000 });
        });
    },
    premiar(sorteo) {
      const ganador = this.numeroSorteos[sorteo._id];
      this.premio = sorteo;
      sorteo.ganador = ganador;
      this.premioDialog = true;
    },
    cancelaPremiacion() {
      this.numeroSorteos[this.premio._id] = "";
      this.premio.ganador = "";
    },
    buscar() {
      this.sorteos = [];
      this.sorteos_buscarFecha({
        operadora: this.operadora,
        fecha: this.fecha
      }).then(sorteos => {
        sorteos.forEach(sorteo => {
          this.numeroSorteos[sorteo._id] = sorteo.ganador;
        });
        this.sorteos = sorteos;
      });
    },
    reiniciar(sorteo) {
      const n = this.numeroSorteos;

      this.sorteo_reiniciar(sorteo._id)
        .then(() => {
          let numeros = { ...n };
          numeros[sorteo._id] = "";
          sorteo.ganador = "";
          this.numeroSorteos = numeros;
          this.$toasted.success("Sorteo reiniciado exitosamente", {
            duration: 3000
          });
        })
        .catch(error => {
          this.$toasted.error(error);
        });
    },
    numeroText(numero) {
      return `${numero.numero} ${numero.nombre.toUpperCase()}`;
    }
  },
  async mounted() {
    disponible(() => this.operadoras.length > 0, 10).then(() => {
      this.operadora = this.operadoras[0]._id;
      this.buscar();
      this.numero_todos();
    });
  }
};
</script>

<style>
.alinear-centro {
  padding-top: 50px;
}
</style>