<template>
  <v-app id="inspire">
    <v-main class="login">
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12" v-if="llave">
              <v-toolbar dark flat>
                <v-toolbar-title>Recuperar Contraseña</v-toolbar-title>
                <v-spacer></v-spacer>
                <btn-atras label="Volver"></btn-atras>
              </v-toolbar>
              <v-card-text>
                <v-form id="recuperar-form" @submit.prevent="onRecuperar">
                  <v-text-field v-model="clave" label="Nueva contraseña"></v-text-field>
                  <v-text-field v-model="clave2" label="Repitra la contraseña"></v-text-field>
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
            <v-card v-else class="elevation-12">
              <v-card-text>
                <p class="text-center">
                  <v-icon size="50">mdi-bullhorn-outline</v-icon>
                </p>
                <h3 class="text-center">{{mensaje}}</h3>
              </v-card-text>
              <v-card-actions>
                <v-btn to="/login" outlined block>Volver</v-btn>
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
      clave: "",
      clave2: "",
      llave: null,
      mensaje: ""
    };
  },
  computed: {
    formularioValido() {
      return this.clave.length > 0 && this.clave == this.clave2;
    },
    errores() {
      if (this.formularioValido || this.correo.length == 0) return [];
      else return ["Correo inválido"];
    }
  },
  methods: {
    ...mapActions("auth", {
      recuperar: "recuperar",
      recuperarClave: "recuperarClave"
    }),
    onRecuperar() {
      this.recuperarClave({
        llave: this.llave,
        clave: this.clave
      })
        .then(result => {
          this.llave = null;
          this.mensaje = result.result;
        })
        .catch(error => {
          this.llave = null;
          this.mensaje = error;
        });
    }
  },
  mounted() {
    this.llave = this.$route.query.llave;
    if (!this.llave) {
      this.mensaje = "Llave invalida, redireccionando al inicio de sesión.";
      setTimeout(() => this.$router.replace("/login"), 3000);
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