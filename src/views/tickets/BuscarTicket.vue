<template>
  <div>
    <v-toolbar color="#6A76AB" dark>
      <template v-slot:img="{ props }">
        <v-img v-bind="props" gradient="to top right, rgba(0,0,0,.7), rgba(25,32,72,.7)"></v-img>
      </template>
      <v-toolbar-title class="text-uppercase">
        <btn-atras label="Ticket" />
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-email-send-outline</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon color="warning">mdi-alert-outline</v-icon>
      </v-btn>|
      <v-btn @click="anularDialog=true" icon>
        <v-icon color="error">mdi-trash-can</v-icon>
      </v-btn>
    </v-toolbar>
    <v-form @submit.prevent="onBuscar">
      <v-row>
        <v-col cols="8">
          <v-text-field v-model="serial" label="Serial del Ticket"></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-btn type="submit" block color="primary" x-large>
            <v-icon>mdi-magnify</v-icon>Buscar
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-row>
      <v-col cols="6">
        <ticket v-if="ticket" v-model="ticket"></ticket>
      </v-col>
      <v-col cols="6">
        <v-simple-table v-if="ticket">
          <tbody>
            <tr>
              <td colspan="2">
                <b>JUGADA POR OPERADORA</b>
              </td>
            </tr>
            <tr v-for="(monto, operadora) in operadoras" :key="operadora">
              <td>{{buscarOperadora(operadora).nombre}}</td>
              <td>{{monto|formatNumber}}</td>
            </tr>
            <tr>
              <td colspan="2">
                <b>JUGADA POR SORTEO</b>
              </td>
            </tr>
            <tr v-for="(monto, sorteo) in sorteos" :key="sorteo">
              <td>{{buscarSorteo(sorteo).descripcion}}</td>
              <td>{{monto|formatNumber}}</td>
            </tr>
            <tr>
              <td>
                <b>TOTAL PREMIOS</b>
              </td>
              <td>{{premios|formatNumber}}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </v-row>
    <sino
      v-if="ticket"
      v-model="anularDialog"
      title="Anular ticket"
      :text="`<p class='text-center'>Confirmar anulación del ticket</br>#${this.ticket.serial}</p>`"
      @submit="onAnular"
    ></sino>
  </div>
</template>

<script>
import buscarTicket from "./Buscar_Ticket";
export default {
  mixins: [buscarTicket]
};
</script>