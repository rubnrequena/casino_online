<template>
  <div>
    <v-toolbar color="#6A76AB" dark>
      <template v-slot:img="{ props }">
        <v-img v-bind="props" gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"></v-img>
      </template>
      <h2>Estadisticas Usuarios</h2>
      <v-spacer></v-spacer>
      <v-btn text color="green lighten-2">
        {{stats.activos | formatNumber}} / {{stats.total | formatNumber}}
        <v-icon>mdi-account</v-icon>
      </v-btn>
      <v-btn text color="red lighten-2">
        {{stats.papelera}}
        <v-icon>mdi-trash-can-outline</v-icon>
      </v-btn>
    </v-toolbar>
    <v-row>
      <v-col cols="12" md="6" v-for="(item, index) in stats.grupos" :key="index">
        <v-toolbar>
          <v-toolbar-title class="text-uppercase">{{index}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn text>{{item}}</v-btn>
          </v-toolbar-items>
        </v-toolbar>
      </v-col>
    </v-row>
    <div v-if="manejaBalance">
      <v-toolbar color="#6A76AB" dark>
        <template v-slot:img="{ props }">
          <v-img v-bind="props" gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"></v-img>
        </template>
        <h2>Balance Saldos</h2>
        <v-spacer></v-spacer>
        <moneda-picker v-model="moneda" @change="moneda_change"></moneda-picker>
      </v-toolbar>
      <v-data-table :items="balance" :headers="balanceHeader">
        <template v-slot:item.usuarios="{item}">
          <span class="text-uppercase">{{nombrePOS(item.usuarios)}}</span>
        </template>
        <template v-slot:item.tiempo="{item}">{{item.tiempo|formatDate("DD/MM/YYYY hh:mm:ss a")}}</template>
        <template v-slot:item.balance="{item}">{{item.balance | formatNumber}}</template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      status: {},
      moneda: {},
      balanceHeader: [
        { text: "POS", value: "usuarios" },
        { text: "ULT.TRANSACCION", value: "tiempo" },
        { text: "SALDO", value: "balance" }
      ]
    };
  },
  computed: {
    ...mapState(["stats"]),
    ...mapState("auth", ["usuario"]),
    ...mapState("saldo", ["balance"])
  },
  methods: {
    ...mapActions(["getStatus"]),
    ...mapActions("saldo", {
      balances: "leerBalance"
    }),
    moneda_change() {
      this.balances({ usuario: this.usuario._id, moneda: this.moneda.siglas });
    },
    manejaBalance() {
      const permiso = this.usuario.rol.match(/master|agente/gi);
      return permiso;
    },
    nombrePOS(usuarios) {
      const last = usuarios[usuarios.length - 1];
      if (last) return last.nombre;
      else "[Error]";
    }
  },
  mounted() {
    this.getStatus();
    this.moneda_change();
  }
};
</script>

<style>
</style>