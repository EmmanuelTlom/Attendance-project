import { defineStore } from "pinia";
import { Notify } from "quasar";

export const useMyAuthStore = defineStore("bsc", {
  state: () => ({
    token: "",
    userdetails: {},
    previousRoute: "",
  }),
  getters: {
    registrationForm: (state) => state.userdetails,
  },
  actions: {
    setUserDetails(data) {
      const token = data.data.userToken;
      const user = data.data;
      console.log(data);
      localStorage.setItem("token", token);
      localStorage.setItem("userdet", JSON.stringify(user));
      this.userdetails = data.data;
      this.token = data.data.userToken;
    },

    logOut() {
      // console.log(response);
      this.token = null;
      this.userDetails = null;
      localStorage.setItem("token", "");
      localStorage.setItem("userdet", "");
    },
  },
});
