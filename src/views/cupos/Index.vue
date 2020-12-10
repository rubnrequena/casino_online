<template>
  <div>
    <v-toolbar dark dense>
      Cupos
      <v-spacer />
      <v-btn type="submit" @click="nuevoCupo=true">
        <v-icon left>mdi-plus</v-icon>Registrar
      </v-btn>
    </v-toolbar>
    <v-row>
      <v-col cols="12">
        <usuario-buscar v-model="hijo" @input="buscar" @close="buscarDialog=false"></usuario-buscar>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6">
        <v-autocomplete
          label="Operadora"
          :items="operadoras"
          item-text="nombre"
          item-value="_id"
          clearable
          v-model="tope.operadora"
          @change="onOperadoraChange"
        ></v-autocomplete>
      </v-col>
      <v-col cols="6">
        <sorteo-picker :disabled="sinOperadora" v-model="sorteo" :operadora="tope.operadora"></sorteo-picker>
      </v-col>
    </v-row>
    <v-data-table mobile-breakpoint="0" dense :items="topes" :headers="headers">
      <template v-slot:item.monto="{ item }">{{ item.monto | formatNumber }}</template>
      <template v-slot:item.operadora="{ item }">
        <span v-if="item.sorteo">
          <small>{{item.sorteo.fecha}}</small>
          {{item.sorteo.descripcion}}
        </span>
        <span v-else>{{item.operadora.nombre}}</span>
        {{item.numero?` - #${item.numero}`:''}}
      </template>
      <template v-slot:item._id="{ item }">
        <v-btn @click="removerCupo(item._id)" icon>
          <v-icon color="red">mdi-trash-can</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.responsable="{item}">
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-information-outline</v-icon>
            </v-btn>
          </template>
          {{item.responsable.nombre}}
          <br />
          {{item.registrado|formatDate("DD/MM/YY H:mm a")}}
        </v-tooltip>
      </template>
    </v-data-table>
    <v-dialog v-model="nuevoCupo" max-width="600">
      <v-card>
        <v-toolbar dark color="cyan">
          <v-toolbar-title>Nuevo Cupo</v-toolbar-title>
        </v-toolbar>
        <v-container>
          <v-form id="tope-form" @submit.prevent="registrar_submit">
            <v-row>
              <v-col cols="12">
                <usuario-buscar v-model="hijo" @input="buscar" @close="buscarDialog=false"></usuario-buscar>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field autofocus label="Monto" type="number" v-model="tope.monto"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-autocomplete
                  label="Operadora"
                  :items="operadoras"
                  item-text="nombre"
                  item-value="_id"
                  clearable
                  v-model="tope.operadora"
                  @change="onOperadoraChange"
                ></v-autocomplete>
              </v-col>
              <v-col cols="6">
                <sorteo-picker
                  :disabled="sinOperadora"
                  v-model="sorteo"
                  :operadora="tope.operadora"
                ></sorteo-picker>
              </v-col>
            </v-row>
            <v-col cols="12">
              <v-text-field label="Numero" v-model="tope.numero"></v-text-field>
            </v-col>
            <v-btn :disabled="sinOperadora" type="submit" block color="success">
              <v-icon left>mdi-check</v-icon>Confirmar
            </v-btn>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snack" :color="snackColor" :timeout="2000" top center>{{snackMensaje}}</v-snackbar>
    <sino
      v-model="removerDialog"
      @submit="onRemoverCupo"
      title="Remover Cupo"
      text="¿Confirma desea remover el cupo?"
    ></sino>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      buscarDialog: false,
      nuevoCupo: false,
      tope: {
        sorteo: null,
        monto: "",
        operadora: "",
        numero: null,
        usuario: null
      },
      hijo: {},
      sorteo: {},
      banca: null,
      grupo: null,
      agencia: null,
      fecha: new Date().toISOString().substring(0, 10),
      topes: [],
      headers: [
        { text: "", value: "_id" },
        { text: "OPERADORA", value: "operadora" },
        { text: "MONTO", value: "monto" },
        { text: "", value: "responsable" }
      ],
      snack: false,
      snackColor: "",
      snackMensaje: "",
      removerDialog: false,
      removerCupoId: null
    };
  },
  computed: {
    ...mapState("operadora", ["operadoras"]),
    sorteoNombre() {
      return this.sorteo ? this.sorteo.descripcion : "";
    },
    sinOperadora() {
      const existe = this.tope.operadora == "" || this.tope.operadora == null;
      return existe;
    }
  },
  methods: {
    ...mapActions("operadora", ["sorteos_buscarFecha"]),
    ...mapActions("tope", ["registrar", "buscarTopes", "remover"]),
    registrar_submit() {
      this.tope.usuario = this.hijo._id;
      this.tope.sorteo = this.sorteo ? this.sorteo._id : null;
      this.registrar(this.tope)
        .then(() => {
          this.nuevoCupo = false;
          this.buscar();
        })
        .catch(error => {
          this.snackShow(error, "red");
        });
    },
    removerCupo(cupoId) {
      this.removerDialog = true;
      this.removerCupoId = cupoId;
    },
    onRemoverCupo() {
      this.remover({ usuario: this.hijo._id, tope: this.removerCupoId })
        .then(() => this.buscar())
        .catch(error => this.snackShow(error, "red"));
    },
    onOperadoraChange() {
      this.sorteo = null;
      this.buscar();
    },
    operadoraNombre(id) {
      const operadora = this.operadoras.find(o => o._id == id);
      return operadora ? operadora.nombre : "";
    },
    buscar() {
      const { operadora, sorteo } = this.tope;
      if (this.hijo._id)
        this.buscarTopes({ operadora, sorteo, usuario: this.hijo._id }).then(
          topes => {
            this.topes = topes;
          }
        );
    },
    snackShow(mensaje, color = "green") {
      this.snack = true;
      this.snackColor = color;
      this.snackMensaje = mensaje;
    }
  }
};
</script>

<style>
</style>