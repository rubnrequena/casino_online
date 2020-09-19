<template>
  <div>
    <v-toolbar dark color="cyan">
      <v-toolbar-title>Retiros Pendientes</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text to="/saldo/retiros/historia">
        <v-icon left>mdi-history</v-icon>Historial
      </v-btn>
    </v-toolbar>
    <v-row>
      <v-col cols="6">
        <v-select
          label="Metodo de Pago"
          :items="metodosDisponibles"
          v-model="filtroMetodo"
          clearable
        ></v-select>
      </v-col>
      <v-col cols="6">
        <v-autocomplete
          label="Usuario"
          :items="usuariosDisponibles"
          item-text="nombre"
          item-value="_id"
          v-model="filtroUsuario"
          clearable
        ></v-autocomplete>
      </v-col>
    </v-row>
    <v-data-table :items="transaccionesFiltradas" :headers="header">
      <template v-slot:item._id="{item}">
        <v-btn icon elevation="3">
          <v-icon color="green" @click="procesarretiro(item)">mdi-progress-check</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.metodo="{item}">{{metodoEntidad(item.metodo)}}</template>
      <template v-slot:item.usuario="{item}">{{item.usuario.nombre}}</template>
      <template v-slot:item.fecha="{item}">{{item.tiempo | formatDate("DD/MM/YYYY HH:mm a")}}</template>
      <template v-slot:item.monto="{item}">{{item.monto | formatNumber}}</template>
    </v-data-table>
    <v-dialog v-model="retiroDialog" max-width="500">
      <v-card>
        <v-toolbar color="cyan" dark>
          <v-toolbar-title>Confirmar retiro</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="retiroDialog=false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-list>
          <v-list-item link>
            <v-list-item-content>
              <v-list-item-subtitle>Usuario</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-title>
                <v-btn text :to="`/usuarios/u/${retiro.usuario._id}`">
                  <v-icon left>mdi-account</v-icon>
                  {{retiro.usuario.nombre}}
                </v-btn>
              </v-list-item-title>
            </v-list-item-action>
          </v-list-item>
          <v-list-item link>
            <v-list-item-content>
              <v-list-item-subtitle>Monto</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-title>
                {{retiro.monto | formatNumber}}
                <span class="text-uppercase">{{retiro.moneda}}</span>
              </v-list-item-title>
            </v-list-item-action>
          </v-list-item>
          <v-list-item link>
            <v-list-item-content>
              <v-list-item-subtitle>Fecha</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-title>{{retiro.tiempo | formatDate('DD/MM/YY HH:mm a')}}</v-list-item-title>
            </v-list-item-action>
          </v-list-item>
          <v-list-item link>
            <v-list-item-content>
              <v-list-item-subtitle>Entidad</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-title>{{retiro.metodo.entidad}}</v-list-item-title>
            </v-list-item-action>
          </v-list-item>
          <v-list-item link>
            <v-list-item-content>
              <v-list-item-subtitle>Cuenta</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-title>{{retiro.metodo.direccion}}</v-list-item-title>
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>Extra</v-list-item-subtitle>
              <v-list-item-title>{{retiro.metodo.meta}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-show="retiro.mensaje">
            <v-list-item-content>
              <v-list-item-subtitle>Mensaje</v-list-item-subtitle>
              <v-list-item-title>{{retiro.mensaje}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-card-actions>
          <v-btn color="red" dark @click="cancelarRetiro">
            <v-icon left>mdi-cancel</v-icon>Rechazar
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="retiro.metodo.entidad=='NO EXISTE'"
            color="success"
            @click="esperaConfirmarretiro=true"
          >
            <v-icon left>mdi-check</v-icon>Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
      <sino
        v-model="esperaConfirmarretiro"
        text="Confirma desea procesar la retiro"
        @submit="retiroConfirmada"
      ></sino>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      esperaConfirmarretiro: false,
      retiroDialog: false,
      retiro: {
        usuario: {},
        metodo: {}
      },
      filtroMetodo: undefined,
      filtroUsuario: undefined,
      confirmaretiro_snack: true,
      header: [
        {
          text: "",
          value: "_id"
        },
        {
          text: "USUARIO",
          value: "usuario"
        },
        {
          text: "MONTO",
          value: "monto"
        },
        {
          text: "M. PAGO",
          value: "metodo"
        },
        {
          text: "FECHA",
          value: "fecha"
        }
      ]
    };
  },
  computed: {
    ...mapState("saldo", ["retirosPendientes"]),
    metodosDisponibles() {
      return this.retirosPendientes.reduce((metodos, retiro) => {
        if (metodos.indexOf(String(retiro.metodo.entidad)) == -1)
          metodos.push(retiro.metodo.entidad);
        return metodos;
      }, []);
    },
    usuariosDisponibles() {
      let usuarioMap = [];
      let id;
      return this.retirosPendientes.reduce((usuarios, retiro) => {
        id = String(retiro.usuario._id);
        if (usuarios.indexOf(id) == -1) {
          usuarioMap.push(id);
          usuarios.push(retiro.usuario);
        }
        return usuarios;
      }, []);
    },
    transaccionesFiltradas() {
      let retiros = this.retirosPendientes.slice();
      if (this.filtroMetodo)
        retiros = retiros.filter(
          retiro => retiro.metodo.entidad == this.filtroMetodo
        );
      if (this.filtroUsuario)
        retiros = retiros.filter(
          retiro => retiro.usuario._id == this.filtroUsuario
        );
      return retiros;
    }
  },
  methods: {
    ...mapActions("saldo", [
      "on_retirosPendientes",
      "procesarTransaccion",
      "cancelarTransaccion"
    ]),
    procesarretiro(retiro) {
      this.retiroDialog = true;
      this.retiro = retiro;
    },
    retiroConfirmada() {
      this.retiroDialog = false;
      this.procesarTransaccion(this.retiro).then(() => {
        this.retiro = { usuario: {}, metodo: {} };
        this.on_retirosPendientes();
      }); //TODO: capturar error al registrar retiro
    },
    cancelarRetiro() {
      this.retiroDialog = false;
      this.cancelarTransaccion(this.retiro);
      this.retiro = { usuario: {}, metodo: {} };
    },
    metodoEntidad(metodo) {
      return metodo ? metodo.entidad : "NO EXISTE";
    }
  },
  mounted() {
    this.on_retirosPendientes();
  }
};
</script>

<style>
</style>