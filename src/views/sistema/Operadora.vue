<template>
  <div>
    <v-app-bar dark dense>
      <v-btn dark @click="back">
        <v-icon left>mdi-arrow-left</v-icon>
        Operadora: {{operadora.nombre}}
      </v-btn>
    </v-app-bar>
    <v-form @submit.prevent="submit">
      <v-text-field v-model="editar.nombre" label="Nombre"></v-text-field>
      <v-text-field v-model="editar.paga" label="Paga"></v-text-field>
      <v-select v-model="editar.tipo" label="Tipo" :items="tipoNumeros"></v-select>
      <v-row>
        <v-col lg="8">
          <v-text-field v-model="sorteo" label="Horario" ref="sorteo"></v-text-field>
        </v-col>
        <v-col lg="4">
          <v-btn block color="primary" type="button" @click="addSorteo" :disabled="!sorteoValido">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2" v-for="(item, index) in editar.sorteos" :key="index">
          <v-btn @click="removerSorteo(index)">
            <v-icon color="red">mdi-trash-can</v-icon>
            {{item}}
          </v-btn>
        </v-col>
      </v-row>
      <v-btn type="submit" color="success" block>Guardar</v-btn>
    </v-form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      operadora: {
        nombre: "",
        tipo: "",
        paga: 0,
        sorteos: []
      },
      editar: {
        nombre: "",
        tipo: "",
        paga: 0,
        sorteos: []
      },
      sorteo: "",
      tipoNumeros: [
        { text: "Animal", value: "animal" },
        { text: "Terminal", value: "terminal" },
        { text: "Triples", value: "triples" }
      ]
    };
  },
  computed: {
    sorteoValido() {
      //TODO validar formato
      return /^\d{1,2}:\d{1,2} AM|PM$/giu.test(this.sorteo);
    }
  },
  methods: {
    ...mapActions("operadora", ["buscarId"]),
    submit() {
      this.nueva(this.operadora).then(() => {
        this.operadora.nombre = "";
        this.operadora.tipo = "";
        this.operadora.paga = 0;
        this.operadora.sorteos = [];
      });
    },
    addSorteo() {
      this.operadora.sorteos.push(this.sorteo);
      this.sorteo = "";
      this.$refs.sorteo.focus();
    },
    removerSorteo(index) {
      console.log("index :>> ", index);
      this.editar.sorteos.splice(index, 1);
    },
    back() {
      this.$router.back();
    }
  },
  mounted() {
    this.buscarId(this.$route.params.operadora).then(operadora => {
      this.operadora = operadora;
      this.editar = { ...operadora };
    });
  }
};
</script>

<style>
</style>
