<template>
  <v-dialog v-model="value" max-width="300">
    <v-card>
      <v-card-title>{{title}}</v-card-title>
      <v-card-text class="content">{{text}}</v-card-text>
      <v-card-actions>
        <v-btn text color="red" @click="cancelar">
          <v-icon left>mdi-cancel</v-icon>Cancelar
        </v-btn>
        <v-btn text color="green" @click="confirmar">
          <v-icon left>mdi-check</v-icon>Confirmar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: true
    };
  },
  methods: {
    confirmar() {
      this.$emit("input", false);
      setTimeout(() => this.$emit("submit"), 200);
    },
    cancelar() {
      this.$emit("input", false);
      setTimeout(() => this.$emit("cancel"), 200);
    }
  }
};
</script>

<style scoped>
.content {
  font-size: 16px;
}
</style>