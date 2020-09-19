<template>
  <v-container class="align-center justify-center">
    <v-data-table :items="hijos" :headers="header">
      <template v-slot:item.codigo="{item}">{{item.codigo}}</template>
      <template v-slot:item.activo="{item}">
        <v-icon color="green" v-if="item.activo">mdi-account-check-outline</v-icon>
        <v-icon color="pink" v-else>mdi-account-remove</v-icon>
      </template>
      <template v-slot:item.usuario="{item}">
        <v-btn text :to="`/usuarios/u/${item._id}`">
          <v-icon>mdi-account</v-icon>
          {{item.usuario}}
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      hijos: [],
      header: [
        { text: "CODIGO", value: "codigo" },
        { text: "USUARIO", value: "usuario" },
        { text: "NOMBRE", value: "nombre" },
        { text: "CORREO", value: "correo" },
        { text: "ACTIVO", value: "activo" }
      ]
    };
  },
  computed: {
    ...mapState("usuario", ["usuario"])
  },
  methods: {
    ...mapActions("usuario", ["buscarHijos_cercanos"])
  },
  mounted() {
    setTimeout(() => {
      this.buscarHijos_cercanos(this.usuario._id).then(hijos => {
        this.hijos = hijos;
      });
    }, 100);
  }
};
</script>

<style>
</style>