<template>
  <div>
    <v-app-bar color="#6A76AB" dark>
      <template v-slot:img="{ props }">
        <v-img v-bind="props" gradient="to top right, rgba(0,0,0,.7), rgba(25,32,72,.7)"></v-img>
      </template>
      <btn-atras label="Grupos de Pago"></btn-atras>
      <v-spacer></v-spacer>
      <v-btn outlined text @click="nuevo.show=true">Nuevo</v-btn>
    </v-app-bar>
    <v-container>
      <usuario-buscar v-model="usuario" @change="onUsuario_change"></usuario-buscar>
    </v-container>
    <v-data-table :items="grupos" :headers="headers">
      <template v-slot:item.nombre="{item}">
        <v-btn outlined text :to="`grupospago/${item._id}`">{{item.nombre}}</v-btn>
      </template>
    </v-data-table>
    <v-bottom-sheet v-model="nuevo.show">
      <v-card>
        <v-toolbar elevation="2" color="#6A76AB" dark>
          NUEVO GRUPO DE PAGO
          <v-spacer></v-spacer>
          <v-btn outlined text type="submit" form="grupopago-form">Registrar</v-btn>
        </v-toolbar>
        <v-container>
          <v-form @submit.prevent="onUsuario_nuevo" id="grupopago-form">
            <v-text-field v-model="nuevo.nombre" label="Nombre"></v-text-field>
            <v-text-field v-model="nuevo.descripcion" label="Descripcion"></v-text-field>
            <usuario-buscar v-model="usuario"></usuario-buscar>
          </v-form>
        </v-container>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      nuevo: {
        show: false,
        nombre: "",
        descripcon: ""
      },
      headers: [
        {
          text: "NOMBRE",
          value: "nombre"
        },
        {
          text: "DESCRIPCION",
          value: "descripcion"
        }
      ],
      usuario: null,
      grupos: []
    };
  },
  computed: {},
  methods: {
    ...mapActions("operadora", [
      "grupo_nuevo",
      "grupo_usuario",
      "grupo_remover"
    ]),
    onUsuario_change() {
      this.grupo_usuario(this.usuario._id).then(grupos => {
        this.grupos = grupos || [];
        console.log("this.grupos :>> ", this.grupos);
      });
    },
    onUsuario_nuevo() {
      const grupo = {
        usuario: this.usuario._id,
        nombre: this.nuevo.nombre,
        descripcion: this.nuevo.descripcion
      };
      this.grupo_nuevo(grupo).then(grupo => {
        this.grupos.push(grupo);
      });
    }
  }
};
</script>

<style>
</style>