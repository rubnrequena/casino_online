<template>
  <v-btn text @click="onClick">
    <v-icon left size="25">mdi-arrow-left-circle-outline</v-icon>
    {{label}}
  </v-btn>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: ""
    },
    navBack: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    onClick() {
      if (this.navBack) this.$router.back();
      else this.$emit("click");
    }
  }
};
</script>

<style>
</style>