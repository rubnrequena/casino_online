<template>
  <v-app id="inspire">
    <v-main class="login">
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar dark flat>
                <v-toolbar-title>Iniciar Sesión</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn small text to="/olvidoclave">Recuperar Contraseña</v-btn>
              </v-toolbar>
              <v-card-text>
                <v-form id="login-form" @submit.prevent="iniciarSesion">
                  <v-text-field
                    dense
                    v-model="usuario"
                    label="Usuario"
                    name="usuario"
                    prepend-icon="mdi-account"
                    type="text"
                    @input="error=false"
                  ></v-text-field>
                  <v-text-field
                    dense
                    v-model="clave"
                    label="Contraseña"
                    name="clave"
                    prepend-icon="mdi-form-textbox-password"
                    type="password"
                    @input="error=false"
                  ></v-text-field>
                </v-form>
                <h3
                  v-show="error"
                  class="text-center red--text"
                >Los datos introducidos son incorrectos</h3>
              </v-card-text>
              <v-card-actions>
                <v-checkbox v-model="recordar" label="Recuerdame"></v-checkbox>
                <v-spacer></v-spacer>
                <v-btn type="submit" form="login-form" outlined color="primary">
                  <v-icon left>mdi-key</v-icon>Iniciar Sesión
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      usuario: "",
      clave: "",
      recordar: false,
      error: false
    };
  },
  computed: {
    ...mapState("auth", ["redireccionPendiente"])
  },
  methods: {
    ...mapActions("auth", ["login"]),
    iniciarSesion() {
      this.login({ usuario: this.usuario, clave: this.clave })
        .then(() => {
          if (this.recordar) {
            localStorage.setItem(
              "rmuser",
              btoa(JSON.stringify({ u: this.usuario, c: this.clave }))
            );
          }
          const path = this.redireccionPendiente || "/";
          this.$router.replace({ path });
        })
        .catch(error => {
          console.log(error);
          this.error = true;
        });
    }
  },
  mounted() {
    let recordar = localStorage.getItem("rmuser");
    if (recordar) {
      recordar = JSON.parse(atob(recordar));
      this.usuario = recordar.u;
      this.clave = recordar.c;
      this.iniciarSesion();
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