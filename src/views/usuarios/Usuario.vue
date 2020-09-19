<template>
  <div>
    <v-app-bar :color="usuarioColor" dark>
      <template v-slot:img="{ props }">
        <v-img v-bind="props" gradient="to top right, rgba(100,115,201,.4), rgba(25,32,72,.6)"></v-img>
      </template>
      <v-toolbar-title class="text-uppercase">{{usuario.nombre}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="usuario_activo(usuario._id)">
        <v-icon v-if="usuario.activo">mdi-account-check</v-icon>
        <v-icon color="red darken-2" v-else>mdi-account-cancel</v-icon>
      </v-btn>
      <v-btn icon @click="usuario_papelera(usuario._id)">
        <v-icon v-if="!usuario.papelera">mdi-trash-can-outline</v-icon>
        <v-icon color="red darken-2" v-else>mdi-delete-restore</v-icon>
      </v-btn>
      <v-btn icon :disabled="true">
        <v-icon>mdi-heart-outline</v-icon>
      </v-btn>
      <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="150" offset-x>
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="d-md-none" icon dark v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-card>
          <v-list dense>
            <v-list-item link>
              <v-list-item-icon>
                <v-icon left>mdi-information-variant</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Info</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link>
              <v-list-item-icon>
                <v-icon left>mdi-download-lock-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Cupos</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link>
              <v-list-item-icon>
                <v-icon left>mdi-account-group-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Usuarios</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link>
              <v-list-item-icon>
                <v-icon left>mdi-account-lock-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Permisos</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link>
              <v-list-item-icon>
                <v-icon left>mdi-account-cash-outline</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Balance</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
      <template v-slot:extension v-if="$vuetify.breakpoint.mdAndUp">
        <v-btn
          v-for="(item, index) in menuData"
          :key="index"
          :to="parseUrl(item.url)"
          small
          outlined
          text
        >
          <v-icon left>{{item.icon}}</v-icon>
          {{item.text}}
        </v-btn>
      </template>
    </v-app-bar>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
export default {
  data() {
    return {
      menu: false,
      menuData: [
        {
          icon: "mdi-information-variant",
          text: "Info",
          url: "/usuarios/u/:usuario/info"
        },
        {
          icon: "mdi-account-group-outline",
          text: "Usuarios",
          url: "/usuarios/u/:usuario/usuarios"
        },
        {
          icon: "mdi-download-lock-outline",
          text: "Cupos",
          url: "/usuarios/u/:usuario/cupos"
        },
        {
          icon: "mdi-account-lock-outline",
          text: "Permisos",
          url: "/usuarios/u/:usuario/permisos"
        },
        {
          icon: "mdi-key",
          text: "Seguridad",
          url: "/usuarios/u/:usuario/seguridad"
        }
      ]
    };
  },
  computed: {
    ...mapState("usuario", ["usuario"]),
    usuarioColor() {
      if (this.usuario.activo == false) {
        return "red";
      } else if (this.usuario.papelera == true) {
        return "darkgrey";
      } else return "#6A76AB";
    }
  },
  methods: {
    ...mapActions("usuario", [
      "buscarId",
      "usuario_activo",
      "usuario_papelera"
    ]),
    ...mapMutations("usuario", ["USUARIO"]),
    parseUrl(url) {
      return url.replace(":usuario", this.usuario._id);
    }
  },
  created() {
    this.buscarId(this.$route.params.usuario)
      .then(async usuario => this.USUARIO(usuario))
      .catch(error => {
        this.$toasted.error(error, { duration: 3000 });
        this.$router.back();
      });
  },
  beforeRouteUpdate(to, from, next) {
    this.buscarId(to.params.usuario)
      .then(async usuario => this.USUARIO(usuario))
      .catch(error => {
        this.$toasted.error(error, { duration: 3000 });
        this.$router.back();
      });
    next();
  }
};
</script>

<style>
</style>