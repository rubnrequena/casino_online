<template>
  <div>
    <v-app-bar dark dense>
      <v-btn dark @click="back">
        <v-icon left>mdi-arrow-left</v-icon>
        Operadora: {{operadora.nombre}}
      </v-btn>
      <v-spacer />
      <v-btn @click="onRemover" v-show="confirmarEliminar" outlined color="red">¿Estas seguro?</v-btn>
      <v-btn @click="confirmarEliminar=true" v-show="!confirmarEliminar" outlined color="red">
        <v-icon>mdi-trash-can</v-icon>Remover
      </v-btn>
    </v-app-bar>
    <v-form @submit.prevent="submit">
      <v-text-field v-model="operadora.nombre" label="Nombre"></v-text-field>
      <v-text-field v-model="operadora.paga" label="Paga"></v-text-field>
      <v-select v-model="operadora.tipo" label="Tipo" :items="tipoNumeros"></v-select>
      <v-row>
        <v-col lg="3">
          <v-select
            label="Hora"
            multiple
            :items="horas"
            v-model="hora"
            item-text="text"
            item-value="value"
          ></v-select>
        </v-col>
        <v-col lg="3">
          <v-select label="Minutos" :items="minutos" v-model="minutero"></v-select>
        </v-col>
        <v-col lg="2">
          <v-select label="AM/PM" :items="meridianos" v-model="meridiano"></v-select>
        </v-col>
        <v-col lg="4">
          <v-btn block color="primary" type="button" @click="addSorteo">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2" v-for="(item, index) in operadora.sorteos" :key="index">
          <v-btn @click="removerSorteo(index)">
            <v-icon color="red">mdi-trash-can</v-icon>
            {{item}}
          </v-btn>
        </v-col>
      </v-row>
      <v-select
        label="Numeros"
        v-model="operadora.numeros"
        :items="numeros"
        :item-text="numeroText"
        item-value="_id"
      >
        <template v-slot:default="{item}">
          <span class="text-uppercase">{{item.nombre}}</span>
        </template>
      </v-select>
      <v-btn type="submit" color="success" block>Guardar</v-btn>
    </v-form>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      confirmarEliminar: false,
      operadora: {
        nombre: "",
        tipo: "",
        paga: 0,
        sorteos: [],
        numeros: ""
      },
      sorteo: "",
      tipoNumeros: [
        { text: "Animal", value: "animal" },
        { text: "Terminal", value: "terminal" },
        { text: "Triples", value: "triples" }
      ],
      minutero: "00",
      minutos: [
        { text: "00", value: "00" },
        { text: "15", value: "15" },
        { text: "30", value: "30" },
        { text: "45", value: "45" }
      ],
      hora: [],
      horas: [
        { text: "01", value: "01" },
        { text: "02", value: "02" },
        { text: "03", value: "03" },
        { text: "04", value: "04" },
        { text: "05", value: "05" },
        { text: "06", value: "06" },
        { text: "07", value: "07" },
        { text: "08", value: "08" },
        { text: "09", value: "09" },
        { text: "10", value: "10" },
        { text: "11", value: "11" },
        { text: "12", value: "12" }
      ],
      meridiano: "AM",
      meridianos: ["AM", "PM"]
    };
  },
  computed: {
    ...mapState("operadora", ["numeros"]),
    sorteoValido() {
      return /^\d{1,2}:\d{1,2} AM|PM$/giu.test(this.sorteo);
    }
  },
  methods: {
    ...mapActions("operadora", [
      "buscarId",
      "editar",
      "numero_todos",
      "remover"
    ]),
    submit() {
      this.editar(this.operadora).then(() => {
        this.$toasted.success("Datos actualizados exitosamente", {
          duration: 3000
        });
      });
    },
    addSorteo() {
      this.operadora.sorteos = this.operadora.sorteos.concat(
        this.hora.map(hora => {
          return `${hora}:${this.minutero} ${this.meridiano}`;
        })
      );
    },
    removerSorteo(index) {
      this.operadora.sorteos.splice(index, 1);
    },
    back() {
      this.$router.back();
    },
    numeroText(item) {
      return item.nombre.toUpperCase();
    },
    onRemover() {
      this.remover(this.operadora._id).then(() => {
        this.$router.push("/operadora/operadoras");
      });
    }
  },
  mounted() {
    this.buscarId(this.$route.params.operadora).then(operadora => {
      this.operadora = operadora;
    });
    this.numero_todos();
  }
};
</script>

<style>
</style>
