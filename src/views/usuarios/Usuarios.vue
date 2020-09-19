<template>
  <div>
    <v-toolbar dark color="cyan">
      <btn-atras label="Usuarios"></btn-atras>
      <v-spacer></v-spacer>
      <usuario-buscar v-model="usuarioBusqueda" @change="usuarioBuscar"></usuario-buscar>
    </v-toolbar>
    <v-breadcrumbs :items="breads"></v-breadcrumbs>
    <v-data-table mobile-breakpoint="300" :items="usuarios" :headers="header">
      <template v-slot:item.codigo="{item}">{{ultimoCodigo(item.codigo)}}</template>
      <template v-slot:item.activo="{item}">
        <v-icon color="green" v-if="item.activo">mdi-account-check-outline</v-icon>
        <v-icon color="pink" v-else>mdi-account-remove</v-icon>
      </template>
      <template v-slot:item.usuario="{item}">
        <v-btn icon color="blue lighten-2" :to="`/usuarios/u/${item._id}`">
          <v-icon>mdi-account</v-icon>
        </v-btn>
        <v-btn text :to="`/usuarios/lista/${item._id}`">
          <v-icon>mdi-cursor-default-click-outline</v-icon>
          {{item.usuario}}
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      usuariosMap: {},
      breads: [],
      usuarios: [],
      header: [
        { text: "CODIGO", value: "codigo" },
        { text: "USUARIO", value: "usuario" },
        { text: "NOMBRE", value: "nombre" },
        { text: "CORREO", value: "correo" },
        { text: "ACTIVO", value: "activo" }
      ],
      usuarioBusqueda: {}
    };
  },
  computed: {
    ...mapState("auth", ["usuario"])
  },
  methods: {
    ...mapActions("usuario", ["buscarHijos_cercanos", "usuarioNivel"]),
    ultimoCodigo(codigo) {
      return codigo.split("-").pop();
    },
    breadUpdate(bread) {
      let i;
      let found = false;
      for (i = 0; i < this.breads.length; i++) {
        const _bread = this.breads[i];
        if (_bread.to == bread.to) {
          found = true;
          break;
        }
      }
      if (!found) {
        this.breads.push(bread);
        if (this.breads.length > 6) this.breads.splice(1, 1);
      } else {
        if (i > 0) this.breads.push(this.breads.splice(i, 1)[0]);
      }
    },
    usuarioBuscar(usuario) {
      this.usuarios = [usuario];
    }
  },
  watch: {
    async $route(to) {
      this.usuarioBusqueda = {};
      const usuario = this.usuariosMap[to.params.usuario] || this.usuario;
      this.breadUpdate({
        text: usuario.nombre,
        to: `/usuarios/lista/${usuario._id}`
      });
      this.buscarHijos_cercanos(usuario._id).then(usuarios => {
        this.usuarios = usuarios;
        this.usuarios.forEach(
          usuario => (this.usuariosMap[usuario._id] = usuario)
        );
      });
    }
  },
  created() {
    this.breads.push({
      text: this.usuario.nombre,
      to: `/usuarios/lista/${this.usuario._id}`
    });
    this.usuariosMap[this.usuario._id] = this.usuario;
    this.buscarHijos_cercanos(this.usuario._id).then(usuarios => {
      this.usuarios = usuarios;
      this.usuarios.forEach(
        usuario => (this.usuariosMap[usuario._id] = usuario)
      );
    });
  }
};
</script>

<style>
</style>