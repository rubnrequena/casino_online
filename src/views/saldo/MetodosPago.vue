<template>
  <div>
    <v-app-bar color="#6A76AB" dark>
      <template v-slot:img="{ props }">
        <v-img v-bind="props" gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"></v-img>
      </template>
      <v-toolbar-title class="text-uppercase">
        <btn-atras label="Metodos de Pago"></btn-atras>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text outlined @click="nuevoDialog=true">
        <v-icon left>mdi-plus</v-icon>Nuevo
      </v-btn>
    </v-app-bar>
    <v-data-table :items="metodosPago" :headers="header">
      <template v-slot:item.entidad="{item}">
        <v-btn text @click="editar(item)">
          <v-icon left>mdi-pen</v-icon>
          {{item.entidad}}
        </v-btn>
      </template>
      <template v-slot:item.remover="{item}">
        <v-btn small color="red" icon outlined @click="remover(item)">
          <v-icon>mdi-trash-can</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="nuevoDialog" width="500" scrollable>
      <MetodoPagoDialog v-model="metodo" @close="nuevoDialog=false" @submit="nuevo" />
    </v-dialog>
    <v-dialog v-model="editarDialog" width="500" scrollable>
      <MetodoPagoDialog v-model="metodo" @close="editarDialog=false" @submit="editar_submit" />
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import MetodoPagoDialog from "@/components/saldo/MetodoPagoDialog";
export default {
  components: {
    MetodoPagoDialog
  },
  data() {
    return {
      nuevoDialog: false,
      editarDialog: false,
      metodo: {},
      header: [
        { text: "ENTIDAD", value: "entidad" },
        { text: "DIRECCION", value: "direccion" },
        { text: "MONEDA", value: "moneda" },
        { text: "", value: "remover" }
      ]
    };
  },
  computed: {
    ...mapState("saldo", ["metodosPago", "monedas"]),
    ...mapState("auth", ["usuario"])
  },
  methods: {
    ...mapActions("saldo", [
      "metodosPago_usuario",
      "metodosPago_nuevo",
      "metodosPago_editar",
      "metodosPago_remover",
      "getMonedas"
    ]),
    nuevo() {
      this.metodosPago_nuevo(this.metodo)
        .then(() => {
          this.metodo = {};
          this.nuevoDialog = false;
        })
        .catch(error => alert(error.error));
    },
    editar(metodo) {
      this.metodo = { ...metodo };
      this.editarDialog = true;
    },
    editar_submit() {
      this.metodosPago_editar(this.metodo)
        .then(() => {
          this.metodo = {};
          this.editarDialog = false;
        })
        .catch(error => alert(error.error));
    },
    remover(metodo) {
      this.metodosPago_remover({
        usuario: this.usuario._id,
        metodo: metodo._id
      }).then(() => this.buscar());
    },
    buscar() {
      this.metodosPago_usuario(this.usuario._id);
    }
  },
  mounted() {
    this.buscar();
  }
};
</script>

<style>
</style>