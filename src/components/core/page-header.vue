<template>
  <v-app-bar color="#6A76AB" dark>
    <template v-slot:img="{ props }">
      <v-img v-bind="props" gradient="to top right, rgba(0,0,0,.7), rgba(25,32,72,.7)"></v-img>
    </template>
    <v-toolbar-title class="text-uppercase">
      <btn-atras :label="label" />
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <slot></slot>
  </v-app-bar>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: ""
    }
  }
};
</script>

<style>
</style>