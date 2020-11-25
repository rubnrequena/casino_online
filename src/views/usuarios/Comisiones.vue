<template>
  <div>
    <v-toolbar color="#6A76AB" dark>
      <template v-slot:img="{ props }">
        <v-img v-bind="props" gradient="to top right, rgba(0,0,0,.7), rgba(25,32,72,.7)"></v-img>
      </template>
      <v-toolbar-title class="text-uppercase">
        <btn-atras label="Comisiones" />
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-container>
      <label>Usuario:</label>
      <usuario-buscar v-model="usuario" @change="onUsuario_change"></usuario-buscar>
      <v-row v-for="comision in comisiones" :key="comision._id">
        <v-col cols="6">
          <v-row dense>
            <v-col cols="2">
              <v-btn justify="center" @click="actualizar(comision)">
                <v-icon>mdi-check</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="10">
              <v-text-field
                hide-details
                solo
                readonly
                label="Operadora"
                :value="comision.operadora"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="2">
          <v-text-field label="Comision" v-model="comision.comision"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field label="Participacion" v-model="comision.participacion"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field label="Utilidad" v-model="comision.utilidad"></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import mixin from "./comisiones";
export default {
  mixins: [mixin]
};
</script>

<style>
</style>