<template>
  <div>
    <v-app-bar color="#6A76AB" dark src="https://picsum.photos/1920/1080?random">
      <template v-slot:img="{ props }">
        <v-img v-bind="props" gradient="to top right, rgba(0,0,0,.7), rgba(25,32,72,.7)"></v-img>
      </template>
      <v-toolbar-title class="text-uppercase">
        <btn-atras label="Enlazar Operadora" />
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn outlined @click="registrarEnlace" :disabled="!formurlarioValido">Registrar</v-btn>
    </v-app-bar>
    <v-container>
      <usuario-buscar @change="buscarEnlaces" v-model="usuarioActivo"></usuario-buscar>
      <v-form>
        <v-autocomplete
          multiple
          label="Operadora"
          :items="operadoras"
          item-text="nombre"
          item-value="_id"
          v-model="operadora"
        ></v-autocomplete>
      </v-form>
    </v-container>
    <v-data-table :items="enlaces" :headers="headers">
      <template v-slot:item.operadora="{item}">
        <v-btn :disabled="item.usuario!=usuarioActivo._id" text @click="removerEnlace(item)">
          <v-icon color="red">mdi-delete-outline</v-icon>
        </v-btn>
        {{item.operadora}}
      </template>
      <template v-slot:item.creado="{item}">{{item.creado | formatDate}}</template>
      <template v-slot:item.mostrar="{item}">
        <v-btn
          :disabled="item.usuario!=usuarioActivo._id"
          icon
          v-if="item.mostrar"
          @click="desactivarEnlace(item)"
        >
          <v-icon color="success">mdi-checkbox-marked-circle-outline</v-icon>
        </v-btn>
        <v-btn :disabled="item.usuario!=usuarioActivo._id" icon v-else @click="activarEnlace(item)">
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <sino
      v-model="confirmandoRemover"
      text="Confirma desea remover enlace"
      @submit="removerConfirmado"
    ></sino>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      usuarioActivo: {},
      operadora: [],
      buscarDialog: false,
      headers: [
        { text: "OPERADORA", value: "operadora" },
        { text: "CREADO", value: "creado" },
        { text: "MOSTRAR", value: "mostrar" }
      ],
      enlaces: [],
      confirmandoRemover: false,
      enlaceRemover: null
    };
  },
  computed: {
    ...mapState("auth", ["usuario"]),
    ...mapState("operadora", ["operadoras"]),
    formurlarioValido() {
      return this.usuarioActivo._id && this.operadora.length > 0;
    }
  },
  methods: {
    ...mapActions("usuario", ["buscarEnlace"]),
    ...mapActions("operadora", ["enlace", "enlace_remover", "activar_enlace"]),
    buscarEnlaces(usuario) {
      this.buscarEnlace(usuario._id).then(enlaces => {
        this.enlaces = enlaces;
      });
    },
    registrarEnlace() {
      this.enlace({
        usuario: this.usuarioActivo._id,
        operadora: this.operadora,
        mostrar: true
      })
        .then(() => {
          this.buscarEnlaces(this.usuarioActivo);
          this.$toasted.success("Enlace registrado con exito", {
            duration: 3000
          });
        })
        .catch(error => {
          this.$toasted.error(error, {
            duration: 3000
          });
        });
    },
    removerEnlace(enlace) {
      this.enlaceRemover = enlace;
      this.confirmandoRemover = true;
    },
    removerConfirmado() {
      this.enlace_remover({
        usuario: this.usuarioActivo._id,
        enlace: this.enlaceRemover.enlace
      })
        .then(() => this.buscarEnlaces(this.usuarioActivo))
        .catch(error => {
          this.$toasted.error(error, {
            duration: 3000
          });
        });
    },

    activarEnlace(enlace) {
      this.activar_enlace({
        usuario: this.usuarioActivo._id,
        enlace: enlace.enlace,
        activo: true
      }).then(() => (enlace.mostrar = true));
    },
    desactivarEnlace(enlace) {
      this.activar_enlace({
        usuario: this.usuarioActivo._id,
        enlace: enlace.enlace,
        activo: false
      }).then(() => (enlace.mostrar = false));
    }
  }
};
</script>

<style>
</style>