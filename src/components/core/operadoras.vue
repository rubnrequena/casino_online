<template>
  <simple-list
    title="Operadoras"
    item-text="nombre"
    item-value="_id"
    :items="operadoras"
    v-model="value"
    @change="onChange"
  ></simple-list>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    value: {
      type: Object
    }
  },
  computed: {
    ...mapState("operadora", {
      operadoras: "operadoras"
    })
  },
  methods: {
    onChange(operadora) {
      this.$emit("input", operadora);
      this.$emit("change", operadora);
    }
  }
};
</script>

<style>
</style>