<template>
  <div>
    <slot :sorteo="sorteo" :click="abrir">
      <v-btn text block outlined @click="abrir">
        <span>{{sorteo.descripcion}}</span>
      </v-btn>
    </slot>
    <v-dialog max-width="500" v-model="dialog">
      <v-card>
        <v-app-bar color="#6A76AB" dark>
          <template v-slot:img="{ props }">
            <v-img v-bind="props" gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"></v-img>
          </template>
          <v-toolbar-title class="text-uppercase">
            <v-toolbar-title>Elegir Sorteo</v-toolbar-title>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn outlined text @click="cerrar">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-app-bar>
        <v-container>
          <v-text-field :disabled="true" v-if="this.operadora" :value="operadoraNombre"></v-text-field>
          <v-select
            v-else
            clearable
            :multiple="multiple"
            v-model="operadoraId"
            :items="operadoras"
            item-text="nombre"
            item-value="_id"
            label="Operadora"
            @change="buscar"
          />
          <date-picker2 v-model="fecha" label="Fecha" @change="buscar"></date-picker2>
          <v-select
            label="Sorteos"
            :items="sorteos"
            item-text="descripcion"
            :item-value="sorteoValue"
            v-model="sorteo"
          />
        </v-container>
        <v-card-actions>
          <v-btn block color="success" @click="onConfirmar">
            <v-icon>mdi-check</v-icon>Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      dialog: false,
      fecha: new Date().toISOString().substring(0, 10),
      operadoraId: "",
      sorteos: [],
      sorteo: {
        descripcion: "Elija un sorteo"
      }
    };
  },
  computed: {
    ...mapState("operadora", ["operadoras"]),
    operadoraNombre() {
      let operadora = this.operadoras.find(op => op._id == this.operadora);
      return operadora ? operadora.nombre : "ERROR: OPERADORA NO EXISTE";
    }
  },
  watch: {
    operadora(value) {
      console.log("operadora cambio", this.operadoraNombre);
      this.operadoraId = value;
      this.buscar();
    },
    value(value) {
      if (!value) {
        this.sorteo = {
          descripcion: "Elija un sorteo"
        };
      }
    }
  },
  methods: {
    ...mapActions("operadora", ["sorteos_buscarFecha"]),
    buscar() {
      const fecha = this.fecha;
      this.sorteos_buscarFecha({
        fecha,
        operadora: this.operadoraId
      }).then(sorteos => {
        this.sorteos = sorteos;
      });
    },
    cerrar() {
      this.dialog = false;
    },
    abrir() {
      this.dialog = true;
    },
    onConfirmar() {
      this.$emit("input", this.sorteo);
      this.$emit("submit", this.sorteo);
      this.cerrar();
    },
    sorteoValue(value) {
      return value;
    }
  },
  props: {
    value: Object,
    operadora: String,
    multiple: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style>
</style>