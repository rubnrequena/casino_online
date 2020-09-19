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
      <v-col cols="12" md="6">
        <v-simple-table>
          <tbody>
            <tr>
              <td>Comerciales:</td>
              <td>{{stats.comerciales}}</td>
            </tr>
            <tr>
              <td>Bancas:</td>
              <td>{{stats.bancas}}</td>
            </tr>
            <tr>
              <td>Grupos:</td>
              <td>{{stats.grupos}}</td>
            </tr>
            <tr>
              <td>Taquillas:</td>
              <td>{{stats.taquillas}}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
      <v-col cols="12" md="6">
        <v-simple-table>
          <tbody>
            <tr>
              <td>Agentes:</td>
              <td>{{stats.agentes}}</td>
            </tr>
            <tr>
              <td>Online:</td>
              <td>{{stats.online}}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </v-row>
    <v-toolbar dark src="/img/header-chart.jpg">
      <h2>Estadistica Saldos</h2>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-simple-table>
      <tbody>
        <tr v-for="(saldo, index) in stats.balance" :key="index">
          <td class="text-uppercase">{{index}}</td>
          <td>{{saldo | formatNumber}}</td>
        </tr>
      </tbody>
    </v-simple-table>
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
    ...mapState(["stats"])
  },
  methods: {
    ...mapActions(["getStatus"])
  },
  mounted() {
    this.getStatus();
  }
};
</script>

<style>
</style>