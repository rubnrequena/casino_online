<template>
  <div>
    <v-app-bar dark dense>
      Operadoras
      <v-spacer></v-spacer>
      <v-btn to="/operadora/operadoras/nueva">
        <v-icon left>mdi-plus</v-icon>Nueva
      </v-btn>
    </v-app-bar>
    <v-data-table :items="operadorasActivas" :headers="headers">
      <template v-slot:item.nombre="{ item }">
        <v-btn text :to="link(item)">
          <v-icon left>mdi-pencil</v-icon>
          {{item.nombre}}
        </v-btn>
      </template>
      <template v-slot:item.sorteos="{ item }">{{item.sorteos.length}}</template>
      <template v-slot:item.tipo="{ item }">{{ item.tipo.toUpperCase() }}</template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      headers: [
        {
          text: "NOMBRE",
          value: "nombre"
        },
        {
          text: "TIPO",
          value: "tipo"
        },
        {
          text: "PAGA",
          value: "paga"
        },
        {
          text: "SORTEOS",
          value: "sorteos"
        }
      ]
    };
  },
  computed: {
    ...mapState("operadora", ["operadoras"]),
    operadorasActivas() {
      return this.operadoras;
    }
  },
  methods: {
    link(item) {
      return `/operadora/${item._id}`;
    }
  }
};
</script>
<style>
</style>