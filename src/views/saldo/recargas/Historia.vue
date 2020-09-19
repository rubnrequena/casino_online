<template>
  <div>
    <v-toolbar dark color="cyan">
      <v-toolbar-title>
        <btn-atras label="Historia de Recargas" />
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <filtrar-transaccion :transacciones="recargas"></filtrar-transaccion>
    </v-toolbar>
    <v-data-table :items="recargas" :headers="header">
      <template v-slot:item._id="{item}">
        <v-btn icon>
          <v-icon color="green" @click="procesarRecarga(item)">mdi-check</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.metodo="{item}">{{item.metodo.entidad}}</template>
      <template v-slot:item.usuario="{item}">{{item.usuario.nombre}}</template>
      <template v-slot:item.fecha="{item}">{{item.fecha | formatDate}}</template>
      <template v-slot:item.monto="{item}">
        {{item.monto | formatNumber}}
        <span class="text-uppercase">{{item.moneda}}</span>
      </template>
    </v-data-table>
    <!-- DIALOG -->
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      header: [
        {
          text: "USUARIO",
          value: "usuario"
        },
        {
          text: "MONTO",
          value: "monto"
        },
        {
          text: "M. PAGO",
          value: "metodo"
        },
        {
          text: "RECIBO",
          value: "recibo"
        },
        {
          text: "FECHA",
          value: "fecha"
        }
      ]
    };
  },
  computed: {
    ...mapState("saldo", ["recargas"])
  },
  methods: {
    ...mapActions("saldo", ["on_recargas"])
  },
  mounted() {
    this.on_recargas();
  }
};
</script>

<style>
</style>