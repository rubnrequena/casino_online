<template>
  <div>
    <v-app-bar color="#6A76AB" dark>
      <template v-slot:img="{ props }">
        <v-img v-bind="props" gradient="to top right, rgba(0,0,0,.7), rgba(25,32,72,.7)"></v-img>
      </template>
      <btn-atras label="Operadora Paga"></btn-atras>
    </v-app-bar>
    <v-container>
      <usuario-buscar v-model="usuario" class="pd-5" @change="buscarPagos"></usuario-buscar>
      <simple-list
        class="pd-5"
        text="Seleccione..."
        title="Seleccione una operadora"
        :items="operadoras"
        item-text="nombre"
        item-value="_id"
        v-model="operadora"
      >
        <template v-slot:default="{ value, text, click }">
          <v-btn block outlined text @click="click">
            <span>OPERADORA:</span>
            {{text}}
          </v-btn>
        </template>
      </simple-list>
      <v-text-field label="Paga" v-model="paga"></v-text-field>
    </v-container>
    <v-data-table :items="pagos" :headers="tabla.headers"></v-data-table>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      usuario: null,
      operadora: null,
      paga: "",
      pagos: [],

      tabla: {
        headers: [
          {
            text: "OPERADORA",
            value: "nombre"
          },
          {
            text: "PAGO USUARIO",
            value: "usuarioPaga"
          },
          {
            text: "PAGO OPERADORA",
            value: "paga"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState("operadora", ["operadoras"])
  },
  methods: {
    ...mapActions("operadora", ["usuario_paga"]),
    buscarPagos() {
      if (this.usuario) {
        this.usuario_paga(this.usuario._id).then(pagos => (this.pagos = pagos));
      }
    }
  }
};
</script>

<style>
.pd-5 {
  padding: 5px;
}
</style>