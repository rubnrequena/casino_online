<template>
  <simple-list
    title="Monedas"
    item-text="nombre"
    :items="monedas"
    v-model="value"
    @change="listChange"
  >
    <template v-slot:default="{click}">
      <v-btn block outlined text @click="click">
        <v-icon left>mdi-home-currency-usd</v-icon>
        {{value.nombre}} ({{value.siglas}})
      </v-btn>
    </template>
  </simple-list>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    value: {
      type: [Array, Object]
    }
  },
  computed: {
    ...mapState("auth", {
      monedas: state => state.usuario.moneda
    })
  },
  methods: {
    listChange(moneda) {
      this.$emit("input", moneda);
      this.$emit("change", moneda);
    }
  },
  mounted() {
    let moneda = this.monedas.find(moneda => moneda.principal);
    if (moneda) this.$emit("input", moneda);
  }
};
</script>

<style>
</style>