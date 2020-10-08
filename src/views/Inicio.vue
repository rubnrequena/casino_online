<template>
  <div>
    <v-toolbar dark src="/img/chart-header.png">
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
      <v-toolbar dark src="/img/header-chart.jpg">
        <h2>Balance Saldos</h2>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-simple-table>
        <tbody>
          <tr v-for="(saldo, index) in stats.balance" :key="index">
            <td class="text-uppercase">{{saldo.nombre}}</td>
            <td class="text-uppercase">{{saldo.tiempo | formatDate}}</td>
            <td>
              {{saldo.saldo | formatNumber}}
              <span class="text-uppercase">{{saldo.moneda}}</span>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      status: {}
    };
  },
  computed: {
    ...mapState(["stats"]),
    ...mapState("auth", ["usuario"])
  },
  methods: {
    ...mapActions(["getStatus"]),
    manejaBalance() {
      return this.usuario.rol == "master" || this.usuario.rol == "agente";
    }
  },
  mounted() {
    this.getStatus();
  }
};
</script>

<style>
</style>