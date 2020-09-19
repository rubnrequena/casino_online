<template>
  <div>
    <v-btn @click="dialog=true" text>
      <v-icon>mdi-magnify</v-icon>Filtrar
    </v-btn>
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-toolbar dark>
          <v-toolbar-title>Busqueda</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn text color="success" @click="confirmar">
              <v-icon size="40">mdi-check</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container>
          Fecha:
          <date-picker2></date-picker2>
          <v-autocomplete label="Usuario"></v-autocomplete>
          <v-select label="Metodo de Pago"></v-select>
          <v-row dense>
            <v-col cols="6">
              <v-text-field type="number" label="Monto minimo"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field type="number" label="Monto maximo"></v-text-field>
            </v-col>
          </v-row>
          <v-text-field label="Recibo"></v-text-field>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    transacciones: Array
  },
  data() {
    return {
      dialog: false
    };
  },
  methods: {
    confirmar() {
      this.dialog = false;
    }
  }
};
</script>
<style>
</style>