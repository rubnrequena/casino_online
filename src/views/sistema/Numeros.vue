<template>
  <div>
    <v-app-bar dark dense>
      <btn-atras label="Nueva Operadora"></btn-atras>
      <v-spacer></v-spacer>
      <v-btn text to="/operadora/operadoras/numeros">Numeros</v-btn>
    </v-app-bar>
    <v-data-table :items="numeros" :headers="header">
      <template v-slot:item.nombre="{item}">
        <v-btn text @click="confirmaRemover(item)">
          <v-icon color="red lighten-2">mdi-trash-can-outline</v-icon>
          {{item.nombre}}
        </v-btn>
      </template>
      <template v-slot:item.numeros="{item}">
        <v-btn @click="verNumeros(item)" text>{{item.numeros.length}}</v-btn>
      </template>
    </v-data-table>
    <v-card-text class="text-right">Click en el numero para ver listado</v-card-text>
    <v-form @submit.prevent="onSubmit">
      <v-text-field label="Nombre" v-model="numeroNuevo.nombre"></v-text-field>
      <v-row dense>
        <v-col cols="12" md="4">
          <v-text-field ref="numero" label="Numero" v-model="proximoNumero" @keypress="onInput"></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field id="nombre" label="Nombre" v-model="proximoNombre" @keypress="onInput"></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-btn @click="agregarNumero" block color="teal lighten-2">
            <v-icon>mdi-plus</v-icon>Agregar
          </v-btn>
        </v-col>
      </v-row>
      <v-data-table :items="numeroNuevo.numeros" :headers="headerNumeros">
        <template v-slot:item.numero="{item}">
          <v-btn text>
            <v-icon left color="red lighten-2">mdi-pencil-remove</v-icon>
            {{item.numero}}
          </v-btn>
        </template>
      </v-data-table>
      <v-btn type="submit" color="success" block>Registrar Numeros</v-btn>
    </v-form>
    <v-dialog v-model="numerosDialog" scrollable max-width="400">
      <v-card>
        <v-toolbar dark>
          <btn-atras :navBack="false" @click="numerosDialog=false" label="Numeros" />
        </v-toolbar>
        <v-card-text>
          <v-data-table dense :items="numero.numeros" :headers="headerNumeros"></v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
    <sino
      v-model="confirmarRemover"
      @submit="removerNumero_confirmado"
      text="Confirma desea remover numero?"
    ></sino>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      numerosDialog: false,
      numero: { numeros: [] },
      header: [
        { text: "NOMBRE", value: "nombre" },
        { text: "NUMEROS", value: "numeros" }
      ],
      headerNumeros: [
        { text: "NUMERO", value: "numero" },
        { text: "NOMBRE", value: "nombre" }
      ],
      confirmarRemover: false,
      numeroNuevo: { nombre: "", numeros: [] },
      proximoNumero: "",
      proximoNombre: ""
    };
  },
  computed: {
    ...mapState("operadora", ["numeros"])
  },
  methods: {
    ...mapActions("operadora", {
      nuevo: "numero_nuevo",
      buscar: "numero_todos"
    }),
    verNumeros(numero) {
      this.numero = numero;
      this.numerosDialog = true;
    },
    confirmaRemover(numero) {
      this.numero = numero;
      this.confirmarRemover = true;
    },
    removerNumero_confirmado() {
      alert("✋ en construccion");
      //TODO remover numero
    },
    onInput(event) {
      if (event.charCode == 13) {
        event.preventDefault();
        if (event.target.id == "nombre") {
          if (this.proximoNumero.length > 0) this.agregarNumero();
        }
      }
    },
    agregarNumero() {
      this.numeroNuevo.numeros.push({
        numero: this.proximoNumero,
        nombre: this.proximoNombre
      });
      this.proximoNumero = this.proximoNombre = "";
      this.$refs.numero.focus();
    },
    onSubmit() {
      //TODO guardar numero
    }
  },
  mounted() {
    this.buscar();
  }
};
</script>

<style>
</style>
