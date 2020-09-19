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
      <usuario-buscar v-model="padre"></usuario-buscar>
      <form id="nuevo-form" v-if="padre._id" @submit.prevent="onSubmit">
        <v-select v-model="rolHijo" v-if="padre.rol=='master'" label="Rol" :items="usuariosMaster"></v-select>
        <v-subheader>Cuenta</v-subheader>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field label="Usuario" v-model="usuario.usuario" required></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field :type="typeClave" label="Contraseña" v-model="usuario.clave" required></v-text-field>
          </v-col>
        </v-row>
        <v-subheader>Datos Personales</v-subheader>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field label="Nombre" v-model="usuario.nombre" required></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="Correo" v-model="usuario.correo"></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="Telefono" v-model="usuario.telefono"></v-text-field>
          </v-col>
          <v-col v-if="padre.rol=='agente'">
            <v-text-field label="Cedula" v-model="usuario.cedula"></v-text-field>
          </v-col>
        </v-row>
        <v-subheader v-if="padre.rol!='agente'">Comisiones</v-subheader>
        <v-row v-if="padre.rol!='agente'">
          <v-col cols="12" md="4">
            <v-text-field type="number" label="Comision" v-model="usuario.comision"></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field type="number" label="Participacion" v-model="usuario.participacion"></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field type="number" label="Utilidad" v-model="usuario.utilidad"></v-text-field>
          </v-col>
        </v-row>
        <v-subheader>Geografía</v-subheader>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field label="Estado" v-model="usuario.estado"></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field label="Ciudad" v-model="usuario.ciudad"></v-text-field>
          </v-col>
        </v-row>
        <v-subheader v-if="padre.rol!='agente'">{{padre.rol}}</v-subheader>
        <v-autocomplete
          class="colorHint"
          hint="El permiso predeterminado heredará todos los privilegios del padre"
          persistent-hint
          v-if="padre.rol!='agente'"
          label="Permisos"
          :items="listaPermisos"
          item-text="nombre"
          item-value="_id"
          v-model="usuario.permisos"
        ></v-autocomplete>
        <v-subheader>Otros</v-subheader>
        <v-select
          v-model="usuario.moneda"
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
export default {
  data() {
    return {
      buscarDialog: false,
      rolHijo: false,
      padre: {
        nombre: "Seleccione usuario padre",
        usuario: ""
      },
      typeClave: "password",
      usuario: {
        comision: 0,
        participacion: 0,
        utilidad: 0
      },
      listaPermisos: [],
      usuariosMaster: [
        { text: "Agente", value: "agente" },
        { text: "Comercial", value: "multi" },
        { text: "Master", value: "master" },
        { text: "Auditor", value: "auditor" }
      ]
    };
  },
  computed: {
    ...mapGetters("auth", ["permisos"]),
    ...mapState("saldo", ["monedas"]),
    ...mapState("auth", {
      rol: state => state.usuario.rol,
      permisosUsuario: state => state.permisosUsuario
    })
  },
  methods: {
    ...mapActions("usuario", ["nuevo", "permisos_todos"]),
    ...mapActions("auth", ["tienePermiso", "permisos_lista"]),
    ...mapActions("saldo", ["getMonedas"]),
    onSubmit() {
      this.nuevo({
        ...this.usuario,
        padre: this.padre._id,
        rol: this.rolHijo
      })
        .then(usuario => {
          this.usuario = {
            comision: 0,
            participacion: 0,
            utilidad: 0,
            moneda: this.monedas.find(m => m.principal == true).siglas,
            permisos: this.listaPermisos[0]._id
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
    }
  },
  mounted() {
    this.getMonedas().then(() => {
      let m = this.monedas.find(m => m.principal == true);
      this.usuario.moneda = m.siglas;
    });
    this.permisos_lista().then(() => {
      this.listaPermisos = [this.permisos, ...this.permisosUsuario];
      this.usuario.permisos = this.listaPermisos[0]._id;
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