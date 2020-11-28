<template>
  <div>
    <v-toolbar dark color="blue darken-4">
      <v-toolbar-title>
        <btn-atras label="Balance de Saldos"></btn-atras>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <moneda-picker v-model="moneda"></moneda-picker>
    </v-toolbar>
    <v-data-table :items="balance" :headers="header">
      <template v-slot:item.usuarios="{item}">
        <v-btn text>
          <v-icon left>mdi-account</v-icon>
          {{nombrePOS(item.usuarios)}}
        </v-btn>
      </template>
      <template v-slot:item.tiempo="{item}">{{item.tiempo | formatDate}}</template>
      <template v-slot:item.balance="{item}">
        {{item.balance | formatNumber}}
        <span class="text-uppercase">{{item.moneda}}</span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      moneda: {},
      header: [
        { text: "NOMBRE", value: "usuarios" },
        { text: "ULT. MOVIMIENTO", value: "tiempo" },
        { text: "BALANCE", value: "balance" }
      ]
    };
  },
  computed: {
    ...mapState("auth", ["usuario"]),
    ...mapState("saldo", ["balance"])
  },
  methods: {
    ...mapActions("saldo", ["leerBalance"]),
    nombrePOS(usuarios) {
      const last = usuarios[usuarios.length - 1];
      console.log(last);
      if (last) return last.nombre;
      else "[Error]";
    }
  },
  mounted() {
    this.leerBalance({
      usuario: this.usuario._id,
      moneda: this.moneda.siglas
    });
  }
};
</script>

<style>
</style>