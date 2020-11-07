<template>
  <div>
    <page-header label="Crear menu">
      <v-btn text outlined @click="guardar">
        <v-icon>mdi-plus</v-icon>Guardar
      </v-btn>
    </page-header>
    <v-container>
      <v-row>
        <v-col sm="6">
          <label>Seleccione los items a guardar.</label>
          <v-treeview
            return-object
            multiple-active
            v-model="usuarioData"
            :items="menuData"
            activatable
            selectable
            item-key="_id"
            open-on-click
          >
            <template v-slot:prepend="{ item, open }">
              <v-icon v-if="!item.url">{{ open ? 'mdi-folder-open' : 'mdi-folder' }}</v-icon>
            </template>
          </v-treeview>
        </v-col>
        <v-col sm="6">
          <label>Items seleccionados.</label>
          <v-treeview :items="menuUsuario" activatable item-key="name" open-on-click>
            <template v-slot:prepend="{ item, open }">
              <v-icon v-if="!item.url">{{ open ? 'mdi-folder-open' : 'mdi-folder' }}</v-icon>
            </template>
          </v-treeview>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      menuData: [],
      usuarioData: []
    };
  },
  computed: {
    menuUsuario() {
      return this.usuarioData.reduce(this.agruparMenu, []);
    }
  },
  methods: {
    ...mapActions("sistema", ["menus"]),
    agruparMenu(acc, item) {
      const existe = acc.find(i => i.name == item.grupo);
      if (existe) existe.children.push(item);
      else
        acc.push({
          _id: item.grupo,
          name: item.grupo,
          children: [item]
        });
      return acc;
    },
    guardar() {
      console.log(JSON.stringify(this.menuUsuario, null, 2));
    }
  },
  mounted() {
    this.menus().then(menus => {
      menus = menus.map(i => {
        i.name = i.text;
        return i;
      });
      this.menuData = menus.reduce(this.agruparMenu, []);
    });
  }
};
</script>