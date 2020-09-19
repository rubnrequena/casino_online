<template>
  <v-card>
    <v-app-bar color="#6A76AB" dark>
      <template v-slot:img="{ props }">
        <v-img v-bind="props" gradient="to top right, rgba(0,0,0,.7), rgba(25,32,72,.7)"></v-img>
      </template>
      <v-toolbar-title class="text-uppercase">
        <btn-atras :navBack="false" @click="close" label="Monitoreo" />
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-col cols="12" md="3">
        <v-text-field v-model="busqueda" style="margin-top:20px;" label="Buscar"></v-text-field>
      </v-col>
    </v-app-bar>
    <v-card-text style="max-height:500px;">
      <v-data-table :items="tickets" :headers="headers" dense>
        <template v-slot:item.agencia="{item}">
          <v-btn text>{{item.agencia.nombre}}</v-btn>
        </template>
        <template v-slot:item.serial="{item}">
          <v-btn @click="buscarTicket(item.serial)" text>{{item.serial}}</v-btn>
        </template>
        <template v-slot:item.monto="{item}">{{item.monto | formatNumber}}</template>
        <template v-slot:item.creado="{item}">{{item.creado | formatDate("h:mm:ss a")}}</template>
      </v-data-table>
    </v-card-text>
    <v-dialog v-model="ticketDialog" scrollable max-width="600">
      <ticket-ver v-model="ticket" @close="ticketDialog=false"></ticket-ver>
    </v-dialog>
  </v-card>
</template>
<script>
import { mapActions } from "vuex";
import ticketVerVue from "./ticket-ver.vue";
export default {
  components: {
    "ticket-ver": ticketVerVue
  },
  data() {
    return {
      ticketDialog: false,
      ticket: {},
      busqueda: "",
      headers: [
        { text: "AGENCIA", value: "agencia" },
        { text: "TICKET", value: "serial" },
        { text: "HORA", value: "creado" },
        { text: "APUESTAS", value: "apuestas" },
        { text: "MONTO", value: "monto" }
      ]
    };
  },
  computed: {
    tickets() {
      if (this.busqueda.length >= 3) {
        return this.value.filter(ticket => {
          return (
            ticket.agencia.nombre.indexOf(this.busqueda) > -1 ||
            ticket.serial.indexOf(this.busqueda) > -1
          );
        });
      }
      return this.value;
    }
  },
  methods: {
    ...mapActions("ticket", ["buscar_serial"]),
    close() {
      this.$emit("close");
    },
    buscarTicket(serial) {
      this.buscar_serial(serial).then(ticket => {
        this.ticket = ticket;
        this.ticketDialog = true;
      });
    }
  },
  props: {
    value: Array
  }
};
</script>

<style>
</style>