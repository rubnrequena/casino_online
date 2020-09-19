<template>
  <div>
    <v-app-bar dark dense>
      <btn-atras label="Nueva Operadora"></btn-atras>
      <v-spacer></v-spacer>
      <v-btn text to="/operadora/operadoras/numeros">Numeros</v-btn>
    </v-app-bar>
    <v-form @submit.prevent="submit">
      <v-text-field v-model="operadora.nombre" label="Nombre"></v-text-field>
      <v-text-field v-model="operadora.paga" label="Paga"></v-text-field>
      <v-select v-model="operadora.tipo" label="Tipo" :items="tipoNumeros"></v-select>
      <v-row>
        <v-col lg="8">
          <v-text-field @keypress="onKeyPress" v-model="sorteo" label="Horario" ref="sorteo"></v-text-field>
        </v-col>
        <v-col lg="4">
          <v-btn block color="primary" type="button" @click="addSorteo" :disabled="!sorteoValido">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2" v-for="(item, index) in operadora.sorteos" :key="index">
          <v-btn @click="removerSorteo(index)">
            <v-icon color="red">mdi-trash-can</v-icon>
            {{item}}
          </v-btn>
        </v-col>
      </v-row>
      <v-select
        label="Numeros"
        v-model="operadora.numeros"
        :items="numeros"
        :item-text="numeroText"
        item-value="_id"
      >
        <template v-slot:default="{item}">
          <span class="text-uppercase">{{item.nombre}}</span>
        </template>
      </v-select>
      <v-btn type="submit" color="success" block>Registrar Operadora</v-btn>
    </v-form>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      operadora: {
        nombre: "",
        tipo: "",
        paga: 0,
        sorteos: [],
        numeros: ""
      },
      sorteo: "",
      tipoNumeros: [
        { text: "Animal", value: "animal" },
        { text: "Terminal", value: "terminal" },
        { text: "Triples", value: "triple" }
      ]
    };
  },
  computed: {
    ...mapState("operadora", ["numeros"]),
    sorteoValido() {
      //TODO validar formato
      return /^\d{1,2}:\d{1,2} AM|PM$/giu.test(this.sorteo);
    }
  },
  methods: {
    ...mapActions("operadora", ["nueva", "numero_todos"]),
    numeroText(item) {
      return item.nombre.toUpperCase();
    },
    submit() {
      this.operadora.nombre = this.operadora.nombre.toUpperCase();
      this.nueva(this.operadora)
        .then(() => {
          this.operadora.nombre = "";
          this.operadora.tipo = "";
          this.operadora.paga = 0;
          this.operadora.sorteos = [];
        })
        .catch(error => alert(error));
    },
    addSorteo() {
      this.operadora.sorteos.push(this.sorteo.toUpperCase());
      this.sorteo = "";
      this.$refs.sorteo.focus();
    },
    removerSorteo(indice) {
      this.operadora.sorteos.splice(indice, 1);
    },
    onKeyPress(event) {
      if (event.charCode == 13) {
        event.preventDefault();
        if (this.sorteoValido) this.addSorteo();
      }
    }
  },
  mounted() {
    this.numero_todos();
  }
};
</script>

<style>
</style>
