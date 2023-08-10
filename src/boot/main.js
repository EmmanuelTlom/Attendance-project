import { boot } from "quasar/wrappers";
import loadStore from "stores/loader";
import helpers from "../plugins/helpers";
import loader from "../plugins/loader";
require("../plugins/icons.js");
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app, router, store }) => {
  app.config.globalProperties.$store = loadStore;
  app.config.globalProperties.$helper = helpers;
  app.config.globalProperties.$loader = loader;
});
