<template>
  <div>
    <slot :value="value" :click="abrir">
      <v-btn text block outlined @click="abrir">
        <span>{{value}}</span>
      </v-btn>
    </slot>
    <v-dialog :max-width="maxWidth" v-model="dialog">
      <v-card>
        <v-card-title>{{title}}</v-card-title>
        <v-list>
          <template v-for="(item, index) in items">
            <v-divider :key="index"></v-divider>
            <v-list-item :key="item[itemText]" link @click="select(item)">
              <v-list-item-content>
                <v-list-item-title>{{itemText_handler(item)}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    maxWidth: {
      type: Number,
      default: 400
    },
    title: String,
    value: Object,
    items: Array,
    "item-text": {
      type: String,
      default: "label"
    },
    "item-value": {
      type: String,
      default: null
    }
  },
  data() {
    return {
      dialog: false
    };
  },
  methods: {
    abrir() {
      this.dialog = true;
    },
    itemText_handler(item) {
      return item[this.itemText];
    },
    select(item) {
      let value = this.itemValue ? item[this.itemValue] : item;
      this.$emit("input", value);
      this.$emit("change", value);
      this.dialog = false;
    }
  }
};
</script>

<style>
</style>