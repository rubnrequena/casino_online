<template>
  <v-navigation-drawer v-model="menu_state" :clipped="$vuetify.breakpoint.lgAndUp" app>
    <v-list dense>
      <template v-for="item in menuVisible">
        <v-row v-if="item.heading" :key="item.heading" align="center">
          <v-col cols="6">
            <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
          </v-col>
          <v-col cols="6" class="text-center">
            <a href="#!" class="body-2 black--text">EDIT</a>
          </v-col>
        </v-row>
        <v-list-group
          v-else-if="item.children"
          :key="item.text"
          v-model="item.model"
          :prepend-icon="item.model ? item.icon : item['icon-alt']"
          append-icon
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item v-for="(child, i) in item.children" :key="i" link :to="child.url">
            <v-list-item-content>
              <v-list-item-title style="margin-left:20px;">{{ child.text }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action v-if="child.icon">
              <v-icon>{{ child.icon }}</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list-group>
        <v-list-item v-else :key="item.text" link :to="item.url">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  data: () => ({
    items: [
      {
        icon: "mdi-chevron-down",
        "icon-alt": "mdi-cog",
        text: "Sistema",
        model: false,
        children: [
          { text: "Operadora", url: "/sistema/operadoras" },
          { text: "Sorteos", url: "/sistema/sorteos" },
          { text: "Permisos", url: "/sistema/permisos" },
          { text: "Premiar", url: "/sistema/premiar" },
          { text: "Monitoreo", url: "/sistema/monitoreo" }
        ]
      },
      {
        icon: "mdi-chevron-down",
        "icon-alt": "mdi-account-group",
        text: "Usuarios",
        model: false,
        children: [{ icon: "mdi-contacts", text: "Lista", url: "/usuarios" }]
      },
      {
        icon: "mdi-download-lock-outline",
        text: "Cupos",
        url: "/cupos"
      },
      {
        icon: "mdi-chevron-down",
        "icon-alt": "mdi-newspaper-variant-outline",
        text: "Informes",
        model: false,
        children: [{ icon: "mdi-plus", text: "Create label" }]
      },
      {
        icon: "mdi-chevron-down",
        "icon-alt": "mdi-chart-bar",
        text: "Reportes",
        model: false,
        children: [{ icon: "mdi-plus", text: "Create label" }]
      },
      {
        icon: "mdi-chevron-down",
        "icon-alt": "mdi-home-currency-usd",
        text: "Saldos",
        model: false,
        children: [
          {
            icon: "mdi-bank-transfer",
            text: "Saldos",
            url: "/saldo/historial"
          },
          {
            icon: "mdi-bank-transfer-in",
            text: "Recargas",
            url: "/saldo/recargas"
          },
          {
            icon: "mdi-bank-transfer-out",
            text: "Retiros",
            url: "/saldo/retiros"
          },
          {
            icon: "mdi-wallet-outline",
            text: "Metodos de Pago",
            url: "/saldo/metodospago"
          }
        ]
      }
    ]
  }),
  computed: {
    ...mapState(["menu"]),
    ...mapGetters(["menuVisible"]),
    menu_state: {
      get() {
        return this.menu;
      },
      set(value) {
        this.MENU(value);
      }
    }
  },
  methods: {
    ...mapMutations(["MENU"])
  }
};
</script>

<style>
</style>