<template>
  <v-container>
    <v-card>
      <v-toolbar color="teal lighten-2">
        <v-toolbar-title>Cambiar Contraseña</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card-text>
        <v-form @submit.prevent="cambiarClave_submit">
          <v-text-field
            v-model="clave"
            label="Introducir contraseña"
            type="password"
            required
            persistent-hint
            hint="Contraseña debe tener al menos 4 caracteres."
          ></v-text-field>
          <v-text-field v-model="rclave" label="Una vez mas..." type="password" required></v-text-field>
          <v-btn :disabled="!validarClave" type="submit" color="primary" block>Cambiar Contraseña</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
    <v-card>
      <v-toolbar color="teal lighten-3">
        <v-toolbar-title>Autenticacion de 2 Factores</v-toolbar-title>
      </v-toolbar>
      <v-divider></v-divider>
      <v-card-text>
        <h3>Proximamente..</h3>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      clave: "",
      rclave: ""
    };
  },
  computed: {
    ...mapState("usuario", ["usuario"]),
    validarClave() {
      return (
        this.clave.length >= 4 &&
        this.rclave.length >= 4 &&
        this.clave == this.rclave
      );
    }
  },
  methods: {
    ...mapActions("usuario", ["cambiar_clave"]),
    cambiarClave_submit() {
      if (this.clave == this.rclave)
        this.cambiar_clave({
          usuario: this.usuario._id,
          clave: this.clave
        }).then(() => {
          alert("clave cambio");
        });
    }
  }
};
</script>

<style>
</style>