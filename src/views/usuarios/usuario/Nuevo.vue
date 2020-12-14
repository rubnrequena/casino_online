<template>
  <div>
    <v-app-bar color="#6A76AB" dark src="https://picsum.photos/1920/1080?random">
      <template v-slot:img="{ props }">
        <v-img v-bind="props" gradient="to top right, rgba(0,0,0,.7), rgba(25,32,72,.7)"></v-img>
      </template>
      <v-toolbar-title class="text-uppercase">Nuevo Usuario</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="typeClave=typeClave=='text'?'password':'text'">
        <v-icon v-show="typeClave=='text'">mdi-eye-outline</v-icon>
        <v-icon v-show="typeClave!='text'">mdi-eye-off-outline</v-icon>
      </v-btn>
      <v-btn type="submit" form="nuevo-form" text outlined>
        <v-icon>mdi-check</v-icon>Registrar
      </v-btn>
    </v-app-bar>
    <v-container>
      Usuario Padre:
      <usuario-buscar v-model="padre" @change="usuario_change"></usuario-buscar>
      <form id="nuevo-form" v-if="padre._id" @submit.prevent="onSubmit">
        <v-select v-model="rolHijo" v-if="padre.rol=='master'" label="Rol" :items="usuariosMaster"></v-select>
        <v-subheader>Cuenta</v-subheader>
        <v-row dense>
          <v-col cols="12" md="6">
            <v-text-field
              dense
              label="Usuario"
              v-model="usuario.usuario"
              required
              :error-messages="mensajesError"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              dense
              :type="typeClave"
              label="Contraseña"
              v-model="usuario.clave"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-subheader>Datos Personales</v-subheader>
        <v-row dense>
          <v-col cols="12" md="6">
            <v-text-field dense label="Nombre" v-model="usuario.nombre" required></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field dense label="Cedula" v-model="usuario.cedula"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field dense label="Correo" v-model="usuario.correo"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field dense label="Telefono" v-model="usuario.telefono"></v-text-field>
          </v-col>
        </v-row>
        <div v-if="tieneGrupoDePago">
          <v-subheader>Grupo de Pago</v-subheader>
          <v-select
            v-model="usuario.grupoPago"
            :items="gruposPago"
            item-text="nombre"
            item-value="_id"
            label="Seleccione..."
          ></v-select>
        </div>
        <v-subheader>Geografía</v-subheader>
        <v-row dense>
          <v-col cols="12" md="6">
            <v-text-field dense label="Estado" v-model="usuario.estado"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field dense label="Ciudad" v-model="usuario.ciudad"></v-text-field>
          </v-col>
        </v-row>
        <v-subheader>Otros</v-subheader>
        <v-autocomplete
          persistent-hint
          label="Permisos"
          :items="this.permisosUsuario"
          item-text="nombre"
          item-value="_id"
          v-model="usuario.permisos"
        ></v-autocomplete>
        <v-select
          v-model="usuario.moneda"
          :multiple="soportaMultimonedas"
          label="Moneda"
          :items="monedas"
          item-text="nombre"
          item-value="siglas"
        ></v-select>
      </form>
    </v-container>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { regexec } from "../../../utils/regx-util";
export default {
  data() {
    return {
      patronUsuario: /^\w{4,16}$/gm,
      buscarDialog: false,
      rolHijo: false,
      padre: {
        nombre: "Seleccione usuario padre",
        usuario: ""
      },
      typeClave: "password",
      usuario: {
        usuario: "",
        comision: 0,
        participacion: 0,
        utilidad: 0,
        moneda: []
      },
      usuariosMaster: [
        { text: "Agente", value: "agente" },
        { text: "Comercial", value: "multi" },
        { text: "Master", value: "master" },
        { text: "Auditor", value: "auditor" }
      ],
      gruposPago: [],
      mensajesError: ""
    };
  },
  computed: {
    ...mapGetters("auth", ["permisos"]),
    ...mapState("saldo", ["monedas"]),
    ...mapState("auth", {
      rol: state => state.usuario.rol,
      permisosUsuario: state => state.permisosUsuario
    }),
    soportaMultimonedas() {
      return ["agente", "agencia"].indexOf(this.padre.rol) > -1 ? false : true;
    },
    tieneGrupoDePago() {
      return ["agente", "grupo"].indexOf(this.padre.rol) > -1;
    }
  },
  methods: {
    ...mapActions("usuario", ["nuevo", "permisos_todos"]),
    ...mapActions("auth", ["tienePermiso", "permisos_lista"]),
    ...mapActions("saldo", ["getMonedas"]),
    ...mapActions("operadora", ["grupo_usuario"]),
    onSubmit() {
      const patron = regexec(this.usuario.usuario, this.patronUsuario, true);
      if (!patron) {
        this.mensajesError =
          "Minimo 4 caracteres, debes usar solo letras y numeros, sin espacios";
        return;
      }
      this.nuevo({
        ...this.usuario,
        padre: this.padre._id,
        rol: this.rolHijo
      })
        .then(usuario => {
          this.mensajesError = null;
          this.usuario = {
            comision: 0,
            participacion: 0,
            utilidad: 0,
            moneda: this.monedas.find(m => m.principal == true).siglas,
            permisos: this.permisosUsuario.find(this.permisoPredeterminado)
          };
          this.$toasted.success("Usuario creado exitosamente", {
            duration: 3000,
            action: {
              text: "VER",
              onClick: (e, toast) => {
                toast.goAway();
                this.$router.push({ path: `/usuarios/u/${usuario._id}` });
              }
            }
          });
        })
        .catch(error => {
          let msg = "No se pudo registrar usuario, razon desconocida.";
          if (error.indexOf("is required") > -1)
            msg = "No se pudo registrar usuario: faltan campos obligatorios";
          else if (error.indexOf("duplicate key error") > -1)
            msg = "No se pudo registrar usuario: usuario ya existe";
          this.$toasted.error(msg, {
            duration: 3000
          });
        });
    },
    async tengoPermiso() {
      return true;
    },
    seleccionarMonedaPredeterminada() {
      let m = this.monedas.find(m => m.principal == true);
      if (this.soportaMultimonedas) {
        this.usuario.moneda = [m.siglas];
      } else {
        this.usuario.moneda = m.siglas;
      }
    },
    usuario_change(usuario) {
      this.seleccionarMonedaPredeterminada();
      if (this.tieneGrupoDePago) {
        this.grupo_usuario(usuario._id)
          .then(grupos => {
            this.gruposPago = grupos;
          })
          .catch(error => alert(error));
      }
    },
    permisoPredeterminado(p) {
      return p.predeterminado === true;
    }
  },
  mounted() {
    this.getMonedas().then(this.seleccionarMonedaPredeterminada);
    this.permisos_lista().then(permisos => {
      const permiso = permisos.find(this.permisoPredeterminado);
      this.usuario.permisos = permiso ? permiso._id : null;
    });
  }
};
</script>

<style>
#padre-boton .v-btn__content {
  justify-content: left;
}
.colorHint .v-messages__message {
  color: red;
}
</style>