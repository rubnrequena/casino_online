<template>
  <div>
    <slot :usuario="value" @click="abrir">
      <v-btn text outlined block @click="abrir">
        <v-icon left>mdi-magnify</v-icon>
        {{searchText}}
      </v-btn>
    </slot>
    <v-dialog v-model="dialog" max-width="500" :scrollable="true">
      <v-card>
        <v-app-bar color="#6A76AB" dark src="https://picsum.photos/1920/1080?random">
          <template v-slot:img="{ props }">
            <v-img v-bind="props" gradient="to top right, rgba(0,0,0,.7), rgba(25,32,72,.7)"></v-img>
          </template>
          <v-toolbar-title class="text-uppercase">Buscar Usuario</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-app-bar>
        <v-container>
          <v-bottom-navigation absolute>
            <v-btn text @click="tipoBusq='texto'">BUSCAR</v-btn>
            <v-btn text @click="tipoBusq='rol'">ROLES</v-btn>
          </v-bottom-navigation>
          <v-text-field
            v-if="tipoBusq=='texto'"
            clearable
            autofocus
            label="Buscar"
            v-model="busqueda"
            @click:clear="busqueda=''"
          ></v-text-field>
          <v-row v-else>
            <v-col v-for="rol in roles" :key="rol">
              <v-btn block small>{{rol }}</v-btn>
            </v-col>
          </v-row>
        </v-container>
        <v-card-text>
          <v-data-table
            :items="usuarios"
            :headers="headers"
            @click:row="onClick"
            mobile-breakpoint="0"
          >
            <template v-slot:item.rol="{item}">
              <span class="text-uppercase">{{item.rol}}</span>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  props: {
    value: {
      type: Object,
      default: () => ({ nombre: "Seleccione Usuario" })
    }
  },
  data() {
    return {
      dialog: false,
      tipoBusq: "texto",
      padre: { nombre: "Seleccione Usuario" },
      patronCodigo: /[\d{1,}-]+/g,
      busqueda: "",
      headers: [
        { text: "CODIGO", value: "codigo" },
        { text: "NOMBRE", value: "nombre" },
        { text: "USUARIO", value: "usuario" },
        { text: "ROL", value: "rol" }
      ],
      roles: [
        "master",
        "agente",
        "online",
        "comercial",
        "banca",
        "grupo",
        "agencia",
        "pos"
      ]
    };
  },
  computed: {
    ...mapState("auth", ["usuario"]),
    ...mapState("usuario", ["hijos"]),
    usuarios() {
      const busqueda = new RegExp(this.busqueda, "iu");
      if (!this.busqueda || this.busqueda.length < 3) return [this.usuario];
      else {
        return this.hijos.filter(hijo => {
          return (
            busqueda.test(hijo.nombre) ||
            busqueda.test(hijo.usuario) ||
            busqueda.test(hijo.codigo)
          );
        });
      }
    },
    searchText() {
      if (this.value && this.value.nombre) return this.value.nombre;
      else return "Buscar usuario";
    }
  },
  methods: {
    ...mapActions("usuario", ["buscarHijos"]),
    abrir() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.$emit("close");
    },
    onClick(value) {
      this.padre = value;
      this.$emit("input", value);
      this.$emit("change", value);
      this.close();
    }
  },
  created() {
    this.buscarHijos();
  }
};
</script>

<style>
</style>