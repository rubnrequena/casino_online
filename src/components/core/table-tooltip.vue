<template>
  <v-tooltip bottom>
    <template v-slot:activator="{on, attrs}">
      <span v-on="on" v-bind="attrs">
        <slot>{{valor|formatNumber}}</slot>
      </span>
    </template>
    <span>{{valor*100/referencia|formatNumber("0.00")}}%</span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    valor: {
      type: Number,
      default: 0
    },
    referencia: {
      type: Number,
      default: 0
    }
  }
};
</script>

<style>
.negativo {
  color: darkred;
}
</style>