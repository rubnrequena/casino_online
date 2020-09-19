<template>
  <date-picker v-model="fecha" value-type="format"></date-picker>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: new Date().toISOString().substring(0, 10)
    }
  },
  data() {
    return {
      open: false
    };
  },
  computed: {
    fecha: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
        this.$emit("change", value);
      }
    }
  }
};
</script>

<style>
.mx-datepicker {
  width: 100%;
}
</style>