<template>
  <simple-list title="Monedas" item-text="nombre" :items="monedas" v-model="valorMoneda">
    <template v-slot:default="{click}">
      <v-btn block outlined text @click="click">
        <v-icon left>mdi-home-currency-usd</v-icon>
        {{value.nombre}} ({{value.siglas}})
      </v-btn>
    </template>
  </simple-list>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  props: {
    value: {
      type: [Array, Object]
    }
  },
  computed: {
    ...mapState("auth", {
      monedas: state => state.usuario.moneda
    }),
    ...mapState(["moneda"]),
    valorMoneda: {
      get: function() {
        return this.value;
      },
      set: function(moneda) {
        this.SET_MONEDA(moneda);
        this.$emit("input", moneda);
        this.$emit("change", moneda);
      }
    }
  },
  methods: {
    ...mapMutations(["SET_MONEDA"])
  },
  mounted() {
    let sel_moneda = this.moneda;
    if (sel_moneda) this.$emit("input", this.moneda);
    else {
      let moneda = this.monedas.find(moneda => moneda.principal);
      if (moneda) {
        this.$emit("input", moneda);
      }
    }
  }
};
</script>

<style>
</style>