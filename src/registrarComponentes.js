import Vue from "vue";
import numeral from "numeral";
import moment from "moment-mini";
import Toasted from "vue-toasted";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/es";

export function registrarFiltros() {
  Vue.filter("formatNumber", function(value, format = "0,0") {
    return numeral(value).format(format);
  });
  Vue.filter("formatDate", function(value, format) {
    return moment(value).format(format || "YYYY-MM-DD");
  });
  Vue.filter("isNumber", function(value) {
    return typeof value == "number";
  });
}
export function registrarComponentes() {
  Vue.use(Toasted);
  Vue.use(DatePicker);

  const files = require.context("./components/core/", true, /\.vue$/i);
  files.keys().map((key) => {
    const name = key
      .split("/")
      .pop()
      .split(".")[0];
    return Vue.component(name.toLowerCase(), files(key).default);
  });
}
