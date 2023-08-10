import { boot } from "quasar/wrappers";
import axios from "axios";
import loadStore from "stores/loader";
import { Notify } from "quasar";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
// const api = axios.create({ baseURL: process.env.baseURL })
// axios.defaults.baseURL = process.env.baseURL;
// axios.defaults.headers.common["Content-Type"] =
//   "application/json; charset=utf-8";
// axios.defaults.headers.common["Accept"] = "application/json";
// axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
const api = axios.create({
  baseURL: "https://attendance-management-7fex.onrender.com/",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Credentials": "true",
    // Authorization:
    //   "Bearer " + "sk_test_b97ba5a4246f3b366403c6751cc4cd97b57c7b7a",
  },
});

export default boot(({ app, store, router }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  app.config.globalProperties.$store = loadStore;

  let auth = store.state.value.bsc;
  console.log(auth);
  // let auth = JSON.parse(localStorage.getItem("pinia_leegoluauth"));

  api.interceptors.response.use(
    function (response) {
      // if (response.data && response.data.token) {
      //   token = response.data.token;
      // }
      // console.log(response);

      return response;
    },
    (e) => {
      console.log(e);
      let status_code = !e.response || e.response.status;
      console.log(status_code);
      if (status_code === 401) {
        // store.auth.setToken(null);
        // console.log("first");
        // console.log(store.state.value.mylmsauth);
        Notify.create({
          message: "You need to log in to view this page",
          color: "red",
        });
        store.state.value.bsc.previousRoute =
          router.currentRoute.value.fullPath;
        return router.replace({ name: "login" });
      } else if (e.message === "Network Error") {
        Notify.create({
          message: e.message + "check your internet connection",
          color: "red",
        });
      } else if (status_code === 500) {
        Notify.create({
          message:
            "This is not your fault, we have been notified and is currently fixing any issues.",
          color: "red",
        });
      } else {
        return Promise.reject(e);
      }
    }
  );

  api.interceptors.request.use(function (config) {
    // console.log(auth);
    if (auth.token) {
      config.headers.Authorization = "Bearer " + auth.token;
    }
    return config;
  });

  router.beforeEach((to, from, next) => {
    // const store = app.config.globalProperties.$store;

    if (to.name === "logout") {
      console.log(store);
      // store.bsc.logOut(store.bsc.userdetails);
      store.state.value.bsc.token = "";
      store.state.value.bsc.userdetails = {};
      localStorage.setItem("token", "");
      localStorage.setItem("userdet", "");
      router.replace({ name: "login" });
    }

    // Continue with the navigation as is
    next();
  });

  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { axios, api };
