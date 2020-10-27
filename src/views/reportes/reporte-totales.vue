<template>
  <v-simple-table dark>
    <thead>
      <tr>
        <th class="text-uppercase" v-for="(columna,index) in columnas" :key="index">{{columna.text}}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td
          v-for="columna in columnas"
          :key="columna.value"
        >{{totales[columna.value] | formatNumber}}</td>
      </tr>
    </tbody>
  </v-simple-table>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    relacion: {
      type: Boolean,
      default: false
    },
    columnas: Array
  },
  computed: {
    totales() {
      let total = this.value.reduce((totales, reporte) => {
        for (const campo in reporte) {
          if (campo in reporte) {
            const valor = reporte[campo];
            if (typeof valor == "number") {
              if (totales[campo]) totales[campo] += valor;
              else totales[campo] = valor;
            }
          }
        }
        return totales;
      }, {});
      return total;
    }
  }
};
</script>

<style>
</style>