<template>
  <v-app id="inspire">
    <v-main class="login">
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card v-if="enviado" class="elevation-12">
              <v-card-text>
                <p class="text-center">
                  <v-icon size="50" color="success">mdi-email</v-icon>
                </p>
                <p class="text-center">
                  Hemos enviado un correo a
                  <b>{{this.correo}}</b> con las instrucciones para recuperar tu contraseña.
                </p>
                <v-btn outlined block to="/login">Volver</v-btn>
              </v-card-text>
            </v-card>
            <v-card v-else class="elevation-12">
              <v-toolbar dark flat>
                <v-toolbar-title>Recuperar Contraseña</v-toolbar-title>
                <v-spacer></v-spacer>
                <btn-atras label="Volver"></btn-atras>
              </v-toolbar>
              <v-card-text>
                <p
                  class="text-center"
                >Por favor ingresa tu correo electronico para recuperar la contraseña</p>
                <v-form id="recuperar-form" @submit.prevent="onRecuperar">
                  <v-text-field v-model="correo" label="Correo" :error-messages="errores"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  :disabled="!formularioValido"
                  block
                  type="submit"
                  form="recuperar-form"
                  outlined
                  color="primary"
                >Recuperar</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      reg: /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/,
      correo: "",
      enviado: false,
      errores: []
    };
  },
  computed: {
    formularioValido() {
      const valido = this.reg.test(this.correo);
      return valido;
    }
  },
  methods: {
    ...mapActions("auth", { recuperar: "recuperar" }),
    onRecuperar() {
      this.recuperar(this.correo)
        .then(() => (this.enviado = true))
        .catch(error => {
          this.errores = [error];
        });
    }
  }
};
</script>
<style>
.v-main.login {
  background-image: url("/img/admin-pattern-min.jpg");
  background-size: cover;
}
</style>