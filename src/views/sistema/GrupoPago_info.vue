<template>
  <div>
    <v-app-bar color="#6A76AB" dark>
      <template v-slot:img="{ props }">
        <v-img v-bind="props" gradient="to top right, rgba(0,0,0,.7), rgba(25,32,72,.7)"></v-img>
      </template>
      <btn-atras label="Grupo de Pago"></btn-atras>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-container>
      <v-text-field v-model="grupo.nombre" label="Nombre"></v-text-field>
      <v-text-field v-model="grupo.descripcion" label="Descripcion"></v-text-field>
    </v-container>
    <v-data-table :items="pagos" :headers="headers"></v-data-table>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      grupo: {},
      pagos: [],
      headers: [
        {
          text: "NOMBRE",
          value: "nombre"
        },
        {
          text: "OPERADORA",
          value: "paga"
        },
        {
          text: "USUARIO",
          value: "usuarioPaga"
        }
      ]
    };
  },
  computed: {},
  methods: {
    ...mapActions("operadora", ["grupo_id"])
  },
  mounted() {
    this.grupo_id(this.$route.params.id).then(result => {
      this.grupo = result.grupo;
      this.pagos = result.pagos;
    });
  }
};
</script>

<style>
</style>