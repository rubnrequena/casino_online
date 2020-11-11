<template>
  <div>
    <v-app-bar color="#6A76AB" dark src="https://picsum.photos/1920/1080?random">
      <template v-slot:img="{ props }">
        <v-img v-bind="props" gradient="to top right, rgba(0,0,0,.7), rgba(25,32,72,.7)"></v-img>
      </template>
      <v-toolbar-title>
        <btn-atras label="Adm. de Permisos" />
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-container>
      <v-row>
        <v-col cols="12" md="8">
          <v-form @submit.prevent="nuevoPermiso">
            <v-text-field label="Nombre del permiso" v-model="nombre"></v-text-field>
            <v-select :items="predeterminados" v-model="marcarPredeterminado" label="Predefinido" />
            <v-btn type="submit" block color="primary">Registrar</v-btn>
          </v-form>
          <v-data-table :items="permisosUsuario" :headers="headers">
            <template v-slot:item.predeterminado="{item}">
              <v-btn icon @click="predefinirPermiso(item._id)">
                <v-icon v-if="item.predeterminado" color="green">mdi-toggle-switch</v-icon>
                <v-icon v-else color="grey">mdi-toggle-switch-off-outline</v-icon>
              </v-btn>
            </template>
            <template v-slot:item.contador="{item}">{{item.permisos.length}}</template>
          </v-data-table>
        </v-col>
        <v-col cols="12" md="4">
          <v-btn block color="primary" dark @click="marcarTodos">Marcar todos</v-btn>
          <v-treeview
            selectable
            selected-color="blue"
            :open-on-click="true"
            :items="permisosLista"
            return-object
            item-key="_id"
            item-text="descripcion"
            v-model="permisosMarcados"
          ></v-treeview>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { agruparArrayObj } from "../../utils/array-util";
export default {
  data() {
    return {
      nombre: "",
      permisosLista: [],
      permisosMarcados: [],
      predeterminados: [
        { text: "SI", value: true },
        { text: "NO", value: false }
      ],
      marcarPredeterminado: false,
      headers: [
        { text: "NOMBRE", value: "nombre" },
        { text: "NUM PERMISOS", value: "contador" },
        { text: "PREDETERMINADO", value: "predeterminado" }
      ]
    };
  },
  computed: {
    ...mapState("auth", ["usuario", "permisosDescripcion", "permisosUsuario"])
  },
  methods: {
    ...mapActions("auth", [
      "permiso_nuevo",
      "permisos_lista",
      "permiso_predefinir"
    ]),
    ...mapActions("sistema", ["permisos"]),
    nuevoPermiso() {
      const codigos = this.permisosMarcados
        .map(permiso => parseInt(permiso.codigo))
        .sort();
      let permiso = {
        permisos: codigos,
        nombre: this.nombre,
        predeterminado: this.marcarPredeterminado
      };
      this.permiso_nuevo(permiso)
        .then(() => {
          this.buscar();
          this.$toasted.success("Permiso registrado con exito", {
            duration: 3000
          });
        })
        .catch(error => {
          this.$toasted.error(error, {
            duration: 3000
          });
        });
    },
    buscar() {
      Promise.all([this.permisos(), this.permisos_lista()]).then(data => {
        const sistema = data[0];
        this.permisosLista = this.usuario.permisos
          .map(codigoPermiso => {
            return sistema.find(permiso => {
              return permiso.codigo == codigoPermiso;
            });
          })
          .filter(permiso => (permiso ? true : false));

        this.permisosLista = agruparArrayObj(
          this.permisosLista,
          "grupo",
          "descripcion",
          "children"
        );
      });
    },
    predefinirPermiso(permisoId) {
      this.permiso_predefinir(permisoId).then(() => {
        this.buscar();
      });
    },
    marcarTodos() {
      this.permisosMarcados = this.permisosLista;
    }
  },
  mounted() {
    this.buscar();
  }
};
</script>

<style>
</style>