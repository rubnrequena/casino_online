<template>
  <v-card>
    <v-app-bar color="#6A76AB" dark>
      <template v-slot:img="{ props }">
        <v-img v-bind="props" gradient="to top right, rgba(0,0,0,.7), rgba(25,32,72,.7)"></v-img>
      </template>
      <v-toolbar-title class="text-uppercase">
        <btn-atras :navBack="false" @click="close" label="Ticket" />
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-email-send-outline</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon color="error">mdi-heart-outline</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon color="warning">mdi-alert-outline</v-icon>
      </v-btn>
    </v-app-bar>
    <v-card-text>
      <v-row>
        <v-col cols="6">SERIAL: {{value.serial}}</v-col>
        <v-col cols="6">CODIGO: {{value.codigo}}</v-col>
        <v-col cols="6">MONTO: {{value.monto | formatNumber}}</v-col>
        <v-col cols="6">ANULADO: {{value.anulado?"SI":"NO"}}</v-col>
      </v-row>
      <v-data-table :items="ventas" :headers="headers">
        <template v-slot:item.monto="{item}">{{item.monto | formatNumber}}</template>
        <template v-slot:item.premio="{item}">{{item.montoPremio | formatNumber}}</template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    value: Object
  },
  data() {
    return {
      headers: [
        { text: "SORTEO", value: "sorteoDesc" },
        { text: "NUMERO", value: "numero" },
        { text: "MONTO", value: "monto" },
        { text: "PREMIO", value: "premio" }
      ]
    };
  },
  computed: {
    items() {
      if (this.value) {
        return [
          { campo: "Serial", valor: this.value.serial },
          { campo: "Codigo", valor: this.value.codigo },
          { campo: "Monto", valor: this.value.monto },
          { campo: "Anulado", valor: this.value.anulado ? "SI" : "NO" }
        ];
      } else return [{}];
    },
    ventas() {
      if (this.value) {
        return this.value.ventas.map(venta => {
          const sorteo = this.buscarSorteo(venta.sorteo);
          venta.sorteoDesc = sorteo.descripcion;
          console.log(parseInt(venta.numero), parseInt(sorteo.ganador));
          if (venta.premio) {
            const operadora = this.buscarOperadora(sorteo.operadora);
            venta.montoPremio = venta.monto * operadora.paga;
          }
          return venta;
        });
      } else return [];
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    buscarSorteo(sorteo) {
      return this.value.sorteos.find(s => sorteo == s._id);
    },
    buscarOperadora(operadora) {
      return this.value.operadoras.find(op => operadora == op._id);
    }
  }
};
</script>

<style>
</style>