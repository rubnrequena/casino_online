<template>
  <v-data-table :items="items" :headers="headers" dense>
    <template v-slot:item.usuario="{item}">
      <v-btn text>{{item.usuario.codigo.split("-").pop()}} - {{item.usuario.nombre}}</v-btn>
    </template>
    <template v-slot:item.operadora="{item}">
      <v-btn text>{{item.operadora.nombre}}</v-btn>
    </template>
    <template v-slot:item.venta="{item}">{{item.venta |formatNumber}}</template>
    <template v-slot:item.premio="{item}">
      {{item.premio|formatNumber}}
      <b>({{(item.premio*100/item.venta)|formatNumber("0.00")}}%)</b>
    </template>
    <template v-slot:item.comision="{item}">
      {{item.comision|formatNumber}}
      <b>({{(item.comision*100/item.venta)|formatNumber("0.00")}}%)</b>
    </template>
    <template v-slot:item.subtotal="{item}">
      <span :class="esNegativo(item.subtotal)">{{item.subtotal|formatNumber}}</span>
    </template>
    <template v-slot:item.participacion="{item}">
      <span :class="esNegativo(item.participacion)">{{item.participacion|formatNumber}}</span>
    </template>
    <template v-slot:item.tickets="{item}">{{item.tickets|formatNumber}}</template>
    <template v-slot:item.total="{item}">
      <span :class="esNegativo(item.total)">{{item.total|formatNumber}}</span>
    </template>
    <template v-slot:item.bancas="{item}">
      <span :class="esNegativo(item.subtotal)">{{item.bancas|formatNumber}}</span>
    </template>
    <template v-slot:item.cm_banca="{item}">
      {{item.cm_banca|formatNumber}}
      <b>({{(item.cm_banca*100/item.venta)|formatNumber("0.00")}}%)</b>
    </template>
    <template v-slot:item.pt_banca="{item}">
      <v-tooltip bottom>
        <template v-slot:activator="{on, attrs}">
          <span
            v-on="on"
            v-bind="attrs"
            :class="esNegativo(item.pt_banca)"
          >{{item.pt_banca|formatNumber}}</span>
        </template>
        <span>{{item.pt_banca*100/item.subtotal|formatNumber("0.00")}}%</span>
      </v-tooltip>
    </template>

    <template v-slot:item.master="{item}">
      <span :class="esNegativo(item.master)">{{item.master|formatNumber}}</span>
    </template>
    <template v-slot:item.cm_master="{item}">
      <v-tooltip bottom>
        <template v-slot:activator="{on, attrs}">
          <span
            v-on="on"
            v-bind="attrs"
            :class="esNegativo(item.cm_master)"
          >{{item.cm_master|formatNumber}}</span>
        </template>
        <span>{{item.cm_master*100/item.venta|formatNumber("0.00")}}%</span>
      </v-tooltip>
    </template>
    <template v-slot:item.pt_master="{item}">
      <v-tooltip bottom>
        <template v-slot:activator="{on, attrs}">
          <span
            v-on="on"
            v-bind="attrs"
            :class="esNegativo(item.pt_master)"
          >{{item.pt_master|formatNumber}}</span>
        </template>
        <span>{{item.pt_master*100/item.subtotal|formatNumber("0.00")}}%</span>
      </v-tooltip>
    </template>
    <template v-slot:item.pt_loteria="{item}">
      <v-tooltip bottom>
        <template v-slot:activator="{on, attrs}">
          <span
            v-on="on"
            v-bind="attrs"
            :class="esNegativo(item.pt_loteria)"
          >{{item.pt_loteria|formatNumber}}</span>
        </template>
        <span>{{item.pt_loteria*100/item.subtotal|formatNumber("0.00")}}%</span>
      </v-tooltip>
    </template>

    <template v-slot:body.append="{ headers  }">
      <tr class="reporte-body-prepend">
        <template v-for="header in headers">
          <td class="font-weight-bold" v-if="totalizar(header)" :key="header.value">
            <span
              :class="esNegativo(totales[header.value])"
            >{{totales[header.value] | formatNumber}}</span>
          </td>
          <td v-else :key="header.value"></td>
        </template>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import { isNullOrUndefined } from "util";
export default {
  props: {
    items: {
      type: Array,
      default: () => []
    },
    headers: Array,
    relacion: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    totales() {
      let total = this.items.reduce((totales, reporte) => {
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
  },
  methods: {
    totalizar(header) {
      const mostrar = isNullOrUndefined(header.total) ? true : header.total;
      return mostrar;
    },
    esNegativo(value) {
      return value < 0 ? "negativo" : "positivo";
    }
  }
};
</script>

<style>
.reporte-body-prepend {
  background-color: #bababa;
}
.reporte-body-prepend:hover {
  background-color: #bababa !important;
}
.negativo {
  color: darkred;
}
</style>