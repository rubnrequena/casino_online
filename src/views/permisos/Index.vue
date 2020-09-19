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
            <v-select label="Rol" :items="roles" v-model="rol"></v-select>
            <v-select
              label="Predeterminado"
              v-model="predeterminado"
              :items="predeterminadoLista"
              item-text="label"
              item-value="value"
            ></v-select>
            <v-btn type="submit" block color="primary">Registrar</v-btn>
          </v-form>
          <v-data-table :items="permisosUsuario" :headers="headers">
            <template v-slot:item.predeterminado="{item}">
              <v-btn icon>
                <v-icon v-if="item.predeterminado" color="green">mdi-toggle-switch</v-icon>
                <v-icon v-else color="grey">mdi-toggle-switch-off-outline</v-icon>
              </v-btn>
            </template>
            <template v-slot:item.contador="{item}">{{item.permisos.length}}</template>
          </v-data-table>
        </v-col>
        <v-col cols="12" md="4">
          <v-treeview
            selectable
            selected-color="blue"
            :open-on-click="true"
            :items="permisoElejido"
            return-object
            v-model="permisosMarcados"
          ></v-treeview>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      nombre: "",
      rol: "",
      predeterminado: false,
      roles: ["multi", "agente", "banca", "grupo", "agencia"],
      predeterminadoLista: [
        { label: "SI", value: true },
        { label: "NO", value: false }
      ],
      permisoElejido: [],
      permisosLista: [],
      permisosMarcados: [],
      headers: [
        { text: "NOMBRE", value: "nombre" },
        { text: "ROL", value: "rol" },
        { text: "NUM PERMISOS", value: "contador" },
        { text: "", value: "predeterminado" }
      ]
    };
  },
  computed: {
    ...mapGetters("auth", ["permisos"]),
    ...mapState("auth", ["permisosDescripcion", "permisosUsuario"])
  },
  methods: {
    ...mapActions("auth", ["permiso_nuevo", "permisos_lista"]),
    nuevoPermiso() {
      let permiso = {
        permisos: this.permisosMarcados.map(permiso => permiso.permiso),
        nombre: this.nombre,
        rol: this.rol,
        predeterminado: this.predeterminado
      };
      this.permiso_nuevo(permiso).then(() => {
        this.$toasted.success("Permiso registrado con exito", {
          duration: 3000
        });
      });
    }
  },
  mounted() {
    let regex = /^[a-z]+/;
    let i = 0;
    this.permisosLista = this.permisos.permisos.reduce((prev, permiso) => {
      const name = regex.exec(permiso)[0];
      let _permiso = prev.find(item => item.permiso == name);
      let desc = this.permisosDescripcion[permiso];
      if (_permiso) {
        _permiso.children.push({
          id: i++,
          permiso,
          name: desc || permiso
        });
      } else {
        prev.push({
          id: i++,
          name: name.toUpperCase(),
          permiso: name,
          children: [{ id: i++, permiso, name: desc || permiso }]
        });
      }
      return prev;
    }, []);
    this.permisoElejido = this.permisosLista;
    this.permisos_lista();
  }
};
</script>

<style>
</style>