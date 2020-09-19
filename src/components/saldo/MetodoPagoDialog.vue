<template>
  <v-card>
    <v-app-bar color="#6A76AB" dark>
      <template v-slot:img="{ props }">
        <v-img v-bind="props" gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"></v-img>
      </template>
      <v-toolbar-title class="text-uppercase">
        <btn-atras :navBack="false" @click="close" label="Nuevo Metodo de Pago"></btn-atras>
      </v-toolbar-title>
    </v-app-bar>
    <v-card-text>
      <v-container>
        <v-form id="metodonuevo-form" @submit.prevent="submit">
          <v-text-field label="Entidad/Banco" v-model="value.entidad" dense></v-text-field>
          <v-text-field label="Cuenta" v-model="value.direccion"></v-text-field>
          <v-textarea label="Datos adicionales" v-model="value.meta" dense></v-textarea>
          <v-select
            dense
            label="Moneda"
            :items="monedas"
            item-text="nombre"
            item-value="siglas"
            v-model="value.moneda"
          ></v-select>
        </v-form>
      </v-container>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn outlined text @click="close">Cancelar</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary" form="metodonuevo-form" type="submit">Confirmar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  props: {
    value: Object
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("saldo", ["monedas"])
  },
  methods: {
    ...mapActions("saldo", ["getMonedas"]),
    submit() {
      this.$emit("submit", this.metodo);
    },
    close() {
      this.$emit("close");
    }
  },
  mounted() {
    this.getMonedas();
  }
};
</script>

<style>
</style>