<template>
  <v-form>
    <v-row>
      <v-col cols="7" md="9">
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field label="Usuario" :value="usuario.usuario" disabled></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="Codigo" :value="usuario.codigo" disabled></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="Rol" :value="usuario.rol" disabled></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Nombre" v-model="usuario.nombre"></v-text-field>
          </v-col>
          <v-col v-if="usuario.rol=='online'" cols="12" md="6">
            <v-text-field label="Cedula" v-model="usuario.cedula"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Correo" v-model="usuario.correo"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Telefono" v-model="usuario.telefono"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Estado" v-model="usuario.estado"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Ciudad" v-model="usuario.ciudad"></v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="5" md="3">
        <v-list dense>
          <v-subheader>Usuarios Activos</v-subheader>
          <v-list-item link v-for="(stat,index) in fullStats" :key="index">
            <v-list-item-content>
              <v-list-item-title class="text-uppercase">{{stat._id}}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-title>{{stat.activo}} de {{stat.cuenta}}</v-list-item-title>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return { stats: [], ready: false };
  },
  computed: {
    ...mapState("usuario", ["usuario"]),
    fullStats() {
      if (!this.usuario.stats) return [];
      let total = 0,
        activos = 0;
      this.usuario.stats.forEach(stat => {
        total += stat.cuenta;
        activos += stat.activo;
      });
      return [
        ...this.usuario.stats,
        { _id: "total", cuenta: total, activo: activos }
      ];
    }
  },
  methods: {
    ...mapActions("usuario", ["usuario_stat"])
  }
};
</script>

<style>
</style>