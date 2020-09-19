<template>
  <v-menu
    v-model="open"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field v-model="computedDateFormatted" :label="label" readonly v-on="on"></v-text-field>
    </template>
    <v-date-picker v-model="fecha" no-title @input="open = false"></v-date-picker>
  </v-menu>
</template>

<script>
export default {
  props: {
    value: {
      type: String
    },
    label: {
      type: String,
      default: "Fecha"
    }
  },
  data() {
    return {
      open: false,
      fecha: this.value
    };
  },
  watch: {
    fecha(newValue) {
      this.$emit("input", newValue);
      this.$emit("change", newValue);
    }
  },
  computed: {
    computedDateFormatted() {
      if (!this.fecha) return null;
      const [year, month, day] = this.fecha.split("-");
      return `${day}/${month}/${year}`;
    }
  },
  mounted() {
    if (!this.value || this.value == "") {
      this.fecha = new Date().toISOString().substr(0, 10);
    }
  }
};
</script>

<style>
</style>