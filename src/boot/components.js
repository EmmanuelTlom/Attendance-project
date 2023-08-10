import { boot } from "quasar/wrappers";
import VOtpInput from "vue3-otp-input";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ app, router }) => {
  app.component("v-otp-input", VOtpInput);

  // Watch for clicks outside the component or element
  app.directive("click-outside-app", {
    beforeMount: function (el, binding) {
      // Define ourClickEventHandler
      const ourClickEventHandler = (event) => {
        if (!el.contains(event.target) && el !== event.target) {
          // as we are attaching an click event listern to the document (below)
          // ensure the events target is outside the element or a child of it
          binding.value(event); // before binding it
        }
      };
      // attached the handler to the element so we can remove it later easily
      el.__vueClickEventHandler__ = ourClickEventHandler;

      // attaching ourClickEventHandler to a listener on the document here
      document.addEventListener("click", ourClickEventHandler);
    },
    unmounted: function (el) {
      // Remove Event Listener
      document.removeEventListener("click", el.__vueClickEventHandler__);
    },
  });
});
