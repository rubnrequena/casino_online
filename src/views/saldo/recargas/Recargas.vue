<template>
  <div>
    <v-toolbar dark color="cyan">
      <v-toolbar-title>Recargas Pendientes</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text to="/saldo/recargas/historia">
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
    <v-data-table :items="recargasFiltradas" :headers="header">
      <template v-slot:item._id="{item}">
        <v-btn icon elevation="3">
          <v-icon color="green" @click="procesarRecarga(item)">mdi-progress-check</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.metodo="{item}">{{item.metodo.entidad}}</template>
      <template v-slot:item.usuario="{item}">{{item.usuario.nombre}}</template>
      <template v-slot:item.fecha="{item}">{{item.fecha | formatDate}}</template>
      <template v-slot:item.monto="{item}">
        {{item.monto | formatNumber}}
        <span class="text-uppercase">{{item.moneda}}</span>
      </template>
    </v-data-table>
    <v-dialog v-model="recargaDialog" max-width="500">
      <v-card>
        <v-toolbar color="cyan" dark>
          <v-toolbar-title>Confirmar recarga</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="red" @click="recargaDialog=false">
            <v-icon left>mdi-cancel</v-icon>Cancelar
          </v-btn>
        </v-toolbar>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>Usuario</v-list-item-subtitle>
              <v-list-item-title>{{recarga.usuario.nombre}}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-action-text>
                <v-btn text>
                  <v-icon left>mdi-account</v-icon>
                  {{recarga.usuario.usuario}}
                </v-btn>
              </v-list-item-action-text>
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>Monto</v-list-item-subtitle>
              <v-list-item-title>
                {{recarga.monto | formatNumber}}
                <span class="text-uppercase">{{recarga.moneda}}</span>
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-action-text>
                <v-btn text>
                  <v-icon left>mdi-history</v-icon>Saldo
                </v-btn>
              </v-list-item-action-text>
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>Entidad</v-list-item-subtitle>
              <v-list-item-title>{{recarga.metodo.entidad}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>Recibo</v-list-item-subtitle>
              <v-list-item-title>{{recarga.recibo}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-subtitle>Fecha</v-list-item-subtitle>
              <v-list-item-title>{{recarga.fecha |formatDate}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-show="recarga.mensaje">
            <v-list-item-content>
              <v-list-item-subtitle>Mensaje</v-list-item-subtitle>
              <v-list-item-title>{{recarga.mensaje}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-btn block color="success" @click="esperaConfirmarRecarga=true">Confirmar</v-btn>
          </v-list-item>
        </v-list>
      </v-card>
      <sino
        v-model="esperaConfirmarRecarga"
        text="Confirma desea procesar la recarga"
        @submit="recargaConfirmada"
      ></sino>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      esperaConfirmarRecarga: false,
      recargaDialog: false,
      recarga: {
        usuario: {},
        metodo: {}
      },
      filtroMetodo: undefined,
      filtroUsuario: undefined,
      confirmaRecarga_snack: true,
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
    ...mapState("saldo", ["recargasPendientes"]),
    metodosDisponibles() {
      return this.recargasPendientes.reduce((metodos, recarga) => {
        if (metodos.indexOf(String(recarga.metodo.entidad)) == -1)
          metodos.push(recarga.metodo.entidad);
        return metodos;
      }, []);
    },
    usuariosDisponibles() {
      let usuarioMap = [];
      let id;
      return this.recargasPendientes.reduce((usuarios, recarga) => {
        id = String(recarga.usuario._id);
        if (usuarios.indexOf(id) == -1) {
          usuarioMap.push(id);
          usuarios.push(recarga.usuario);
        }
        return usuarios;
      }, []);
    },
    recargasFiltradas() {
      let recargas = this.recargasPendientes.slice();
      if (this.filtroMetodo)
        recargas = recargas.filter(
          recarga => recarga.metodo.entidad == this.filtroMetodo
        );
      if (this.filtroUsuario)
        recargas = recargas.filter(
          recarga => recarga.usuario._id == this.filtroUsuario
        );
      return recargas;
    }
  },
  methods: {
    ...mapActions("saldo", ["on_recargasPendientes", "procesarTransaccion"]),
    procesarRecarga(recarga) {
      this.recargaDialog = true;
      this.recarga = recarga;
    },
    recargaConfirmada() {
      this.recargaDialog = false;
      this.procesarTransaccion(this.recarga._id).then(() => {
        this.recarga = { usuario: {}, metodo: {} };
        this.on_recargasPendientes();
      }); //TODO: capturar error al registrar recarga
    }
  },
  mounted() {
    this.on_recargasPendientes();
  }
};
</script>

<style>
</style>