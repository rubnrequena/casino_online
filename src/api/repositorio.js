import Vue from "vue";
import axios from "axios";

const devURL = "http://127.0.0.1:3000";
const prodUrl = "https://api.caribeapuesta.com";
const baseURL = process.env.NODE_ENV == "development" ? devURL : prodUrl;

import store from "../store";

const ax = axios.create({
  baseURL,
});
Vue.prototype.$http = ax;

function formatQuery(params) {
  let query = [];
  for (const key in params) {
    if (key in params) {
      const param = params[key];
      query.push(`${key}=${encodeURI(param)}`);
    }
  }
  return `?${query.join("&")}`;
}

export const getHandler = (url, data) => {
  ax.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${store.state.auth.token}`;
  return new Promise((resolve, reject) => {
    ax.get(data ? url + formatQuery(data) : url)
      .then((result) => resolve(result.data))
      .catch((err) => {
        reject(err.response.data.error);
      });
  });
};

export const postHandler = (url, data) => {
  ax.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${store.state.auth.token}`;
  return new Promise((resolve, reject) => {
    ax.post(url, data)
      .then((result) => resolve(result.data))
      .catch((err) => {
        reject(err.response.data.error);
      });
  });
};

export const getRequest = (url, data) => {
  return new Promise((resolve, reject) => {
    getHandler(url, data)
      .then((result) => {
        if (result.error) return reject(result.error);
        else resolve(result);
      })
      .catch((error) => reject(error));
  });
};
export const postRequest = (url, data) => {
  return new Promise((resolve, reject) => {
    postHandler(url, data)
      .then((result) => {
        if (result.error) return reject(result.error);
        else resolve(result);
      })
      .catch((error) => reject(error));
  });
};

export default ax;
