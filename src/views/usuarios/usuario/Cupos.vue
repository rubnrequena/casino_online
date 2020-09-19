<template>
  <div>
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
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      intervalo: 0,
      topes: [],
      headers: [
        { text: "OPERADORA", value: "operadora" },
        { text: "MONTO", value: "monto" },
        { text: "", value: "responsable" }
      ]
    };
  },
  computed: {
    ...mapState("usuario", ["usuario"])
  },
  methods: { ...mapActions("tope", ["buscarTopes"]) },
  mounted() {
    this.intervalo = setInterval(() => {
      if (this.usuario) {
        this.buscarTopes({ usuario: this.usuario._id }).then(topes => {
          this.topes = topes;
          clearInterval(this.intervalo);
        });
      }
    }, 100);
  }
};
</script>

<style>
</style>