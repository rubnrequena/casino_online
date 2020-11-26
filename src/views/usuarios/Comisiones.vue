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
      <v-btn :disabled="this.usuario==null" text outlined @click="onNuevaComision">
        <v-icon>mdi-plus</v-icon>Nueva
      </v-btn>
    </v-toolbar>
    <v-container>
      <label>Usuario:</label>
      <usuario-buscar v-model="usuario" @change="onUsuario_change"></usuario-buscar>
      <v-simple-table v-if="usuario">
        <tbody>
          <tr>
            <td>
              <b>CODIGO:</b>
              {{usuario.codigo}}
            </td>
            <td>
              <b>USUARIO:</b>
              {{usuario.usuario}}
            </td>
            <td>
              <b>NOMBRE:</b>
              {{usuario.nombre}}
            </td>
            <td>
              <b>ROL:</b>
              <span class="text-uppercase">{{usuario.rol}}</span>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
      <v-row v-if="usuario">
        <v-col cols="6">
          <v-row dense>
            <v-col cols="2">
              <v-btn color="green" dark block large @click="actualizar()">
                <v-icon>mdi-check</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="10">
              <v-text-field hide-details solo readonly label="GENERAL"></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="2">
          <v-text-field type="number" label="Comision" v-model="usuario.comision"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            type="number"
            label="Participacion"
            v-model="usuario.participacion"
            :disabled="esPOS"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field type="number" label="Utilidad" v-model="usuario.utilidad" :disabled="esPOS"></v-text-field>
        </v-col>
      </v-row>
      <v-row v-for="(comision,indice) in comisiones" :key="comision._id">
        <v-col cols="6">
          <v-row dense>
            <v-col cols="2">
              <v-btn
                small
                block
                :loading="cargando[indice]"
                color="green"
                dark
                @click="actualizar(comision,indice)"
              >
                <v-icon>mdi-check</v-icon>
              </v-btn>
              <v-btn small block color="red" dark @click="actualizar(comision,indice)">
                <v-icon>mdi-trash-can</v-icon>
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
          <v-text-field type="number" label="Comision" v-model="comision.comision"></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            type="number"
            label="Participacion"
            v-model="comision.participacion"
            :disabled="esPOS"
          ></v-text-field>
        </v-col>
        <v-col cols="2">
          <v-text-field
            type="number"
            label="Utilidad"
            v-model="comision.utilidad"
            :disabled="esPOS"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
    <v-bottom-sheet v-model="nuevaComision">
      <v-card min-height="300">
        <v-toolbar color="#6A76AB" dark>
          <template v-slot:img="{ props }">
            <v-img v-bind="props" gradient="to top right, rgba(0,0,0,.7), rgba(25,32,72,.7)"></v-img>
          </template>
          <v-toolbar-title class="text-uppercase">
            <v-btn text>Registrar nueva comision</v-btn>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn text outlined @click="onRegistrar">
            <v-icon>mdi-plus</v-icon>Confirmar
          </v-btn>
        </v-toolbar>
        <v-container>
          <label>Operadora</label>
          <operadoras v-model="comision.operadora"></operadoras>
          <v-row>
            <v-col cols="4">
              <v-text-field type="number" label="Comision" v-model="comision.comision"></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                type="number"
                label="Participacion"
                v-model="comision.participacion"
                :disabled="esPOS"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                type="number"
                label="Utilidad"
                v-model="comision.utilidad"
                :disabled="esPOS"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-bottom-sheet>
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