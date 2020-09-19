<template>
  <div>
    <v-toolbar dark color="blue darken-4">
      <v-toolbar-title>
        <btn-atras label="Balance de Saldos"></btn-atras>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text>
        <span v-if="moneda">{{total | formatNumber}} {{moneda}}</span>
        <span v-else>--</span>
      </v-btn>
    </v-toolbar>
    <v-select clearable v-model="moneda" :items="monedas">
      <template v-slot:selection="{item}">
        <span class="text-uppercase">{{item}}</span>
      </template>
      <template v-slot:item="{item}">
        <span class="text-uppercase">{{item}}</span>
      </template>
    </v-select>
    <v-data-table :dense="balanceFiltro.length>10" :items="balanceFiltro" :headers="header">
      <template v-slot:item.nombre="{item}">
        <v-btn text :to="`/usuarios/u/${item._id}`">
          <v-icon left>mdi-account</v-icon>
          {{item.nombre}}
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
      moneda: null,
      monedas: [],
      header: [
        { text: "NOMBRE", value: "nombre" },
        { text: "ULT. MOVIMIENTO", value: "tiempo" },
        { text: "BALANCE", value: "balance" }
      ]
    };
  },
  computed: {
    ...mapState("saldo", ["balance"]),
    total() {
      if (!this.moneda) return "0";
      return this.balanceFiltro.reduce((prev, saldo) => {
        return saldo.balance + prev;
      }, 0);
    },
    balanceFiltro() {
      if (!this.moneda) return this.balance;
      return this.balance
        .filter(saldo => saldo.moneda == this.moneda)
        .sort((a, b) => b.balance - a.balance);
    }
  },
  methods: {
    ...mapActions("saldo", ["leerBalance"])
  },
  mounted() {
    this.leerBalance().then(() => {
      console.log(this.balance);
      this.monedas = this.balance.reduce((prev, saldo) => {
        if (prev.indexOf(saldo.moneda) == -1) prev.push(saldo.moneda);
        return prev;
      }, []);
    });
  }
};
</script>

<style>
</style>