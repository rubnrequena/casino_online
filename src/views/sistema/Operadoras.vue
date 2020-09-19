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
      <template v-slot:item._id="{ item }">
        <v-btn icon :to="link(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon :to="link(item)">
          <v-icon color="red">mdi-trash-can</v-icon>
        </v-btn>
      </template>
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
          text: "",
          value: "_id",
          align: "end"
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
      return `/sistema/operadoras/${item._id}`;
    }
  }
};
</script>
<style>
</style>