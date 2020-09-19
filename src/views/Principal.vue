<template>
  <v-app id="inspire">
    <Menu :drawer="drawer"></Menu>
    <AppBar @drawer="drawer = !drawer"></AppBar>
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Menu from "./core/Menu";
import AppBar from "./core/AppBar";
export default {
  components: {
    Menu,
    AppBar
  },
  data: () => ({
    drawer: null
  })
};
</script>