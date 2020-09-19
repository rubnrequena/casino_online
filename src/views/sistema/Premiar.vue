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
        <v-autocomplete
          :items="numerosSearch"
          :item-text="numeroText"
          item-value="numero"
          v-model="numeroSorteos[item._id]"
          @change="confirmarPremio($event,item)"
        ></v-autocomplete>
        <!-- <p class="text-center" v-else>SORTEO ABIERTO</p> -->
      </template>
    </v-data-table>
    <sino
      v-model="premioDialog"
      :text="`Confirma desea premiar ${premio.sorteo.descripcion} con ${premio.numero}`"
      @submit="premiarSorteo"
      @cancel="cancelaPremiacion"
    ></sino>
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
        sorteo: {}
      },
      sorteos: [],
      operadora: {},
      fecha: new Date().toISOString().substring(0, 10),
      hoy: new Date().toISOString(),
      headers: [
        { text: "FECHA", value: "fecha" },
        { text: "DESCRIPCION", value: "descripcion" },
        { text: "NUMERO", value: "numero" }
      ]
    };
  },
  computed: {
    ...mapState("operadora", ["numeros", "operadoras"]),
    numerosSearch() {
      let operadora = this.operadoras.find(op => op._id == this.operadora);
      if (!operadora) return [];
      let numero = this.numeros.find(num => num._id == operadora.numeros);
      if (!numero) return [];
      else return numero.numeros;
    }
  },
  methods: {
    ...mapActions("operadora", [
      "sorteo_sinGanador",
      "sorteo_premiar",
      "numero_todos"
    ]),
    async confirmarPremio(numero, sorteo) {
      this.premio = { numero, sorteo };
      this.premioDialog = true;
      /* this.$toasted.show(
        `Confirme premiacion para: ${sorteo.descripcion}, GANADOR: ${numero}`,
        {
          duration: 5000,
          action: [
            {
              text: "SI",
              onClick: (e, toast) => {
                toast.text("Premiando sorteo, espere...").goAway(9999);
                this.sorteo_premiar({
                  numero: numero,
                  sorteo: sorteo._id
                })
                  .then(() => {
                    toast.goAway(1);
                    this.$toasted.success("Sorteo premiado exitosamente", {
                      duration: 2000
                    });
                  })
                  .catch(error => {
                    toast.goAway(1);
                    this.$toasted.error(error, { duration: 2000 });
                  });
              }
            },
            {
              text: "NO",
              onClick: (e, toast) => {
                this.cancelaPremiacion();
                toast.text("Premiacion cancelada").goAway(1000);
              }
            }
          ]
        }
      ); */
    },
    premiarSorteo() {
      this.sorteo_premiar({
        numero: this.premio.numero,
        sorteo: this.premio.sorteo._id
      })
        .then(() => {
          this.$toasted.success("Sorteo premiado exitosamente", {
            duration: 2000
          });
        })
        .catch(error => {
          this.$toasted.error(error, { duration: 2000 });
        });
    },
    cancelaPremiacion() {
      this.numeroSorteos[this.premio.sorteo._id] = null;
      this.premio = { sorteo: {} };
    },
    buscar() {
      this.sorteos = [];
      this.sorteo_sinGanador({
        operadora: this.operadora,
        fecha: this.fecha
      }).then(sorteos => (this.sorteos = sorteos));
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
</style>