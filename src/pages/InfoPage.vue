<template>
  <q-layout class="layout">
    <div class="container q-py-lg">
      <div class="q-pb-lg auth_">
        <div class="text3">Personal info</div>
        <div class="text2">Update your photo and personal details here.</div>

        <div class="auth">
          <form @submit.prevent="updateUser" class="q-mt-lg">
            <div class="form_hold">
              <div class="grid">
                <div class="input">
                  <label for=""> First name </label>

                  <div class="input_wrap">
                    <input
                      v-model="data.firstName"
                      placeholder="First name"
                      type="text"
                    />
                  </div>
                </div>
                <div class="input">
                  <label for=""> Last name </label>

                  <div class="input_wrap">
                    <input
                      v-model="data.lastName"
                      placeholder="Last name"
                      type="text"
                    />
                  </div>
                </div>
              </div>
              <!-- <div class="input">
                <label for=""> Email </label>

                <div class="input_wrap">
                  <img
                    style="width: 20px; height: 20px"
                    src="../assets/messf.svg"
                    alt=""
                  />
                  <input
                    v-model="data.email"
                    placeholder="Email"
                    type="email"
                  />
                </div>
              </div> -->
              <div class="input">
                <div style="gap: 1rem" class="row no-wrap items-start">
                  <img
                    style="width: 64px; height: 64px; border-radius: 200px"
                    src="../assets/avatar.svg"
                    alt=""
                  />
                  <q-file
                    class="column profile_field justify-center items-center"
                    v-model="data.avatar"
                  >
                    <div class="img q-mb-sm">
                      <img src="../assets/down.svg" alt="" />
                    </div>
                    <div class="text3">
                      <span>Click to upload</span>
                      <span class="text2 grey"> or drag and drop </span>
                    </div>

                    <div class="text2 grey text-center">
                      SVG, PNG, JPG or GIF (max. 800x400px)
                    </div>
                  </q-file>
                </div>
              </div>
            </div>
            <div style="gap: 1rem" class="row q-mt-lg justify-end items-center">
              <q-btn flat no-caps class="act_btn cancel"> Cancel </q-btn>
              <q-btn
                :loading="loadingUser"
                type="submit"
                flat
                no-caps
                class="act_btn"
              >
                Save Changes</q-btn
              >
            </div>
          </form>
        </div>
        <q-separator />

        <div class="text3">Password</div>
        <div class="text2">
          Please enter your current password to change your password.
        </div>

        <div class="auth">
          <form @submit.prevent="updatePassword" class="q-mt-lg">
            <div class="form_hold">
              <div class="input">
                <label for=""> Password </label>

                <div class="input_wrap">
                  <input
                    v-model="password.password"
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
              </div>
              <div class="input">
                <label for=""> New password </label>

                <div class="input_wrap">
                  <input
                    v-model="password.newPassword"
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
                <div class="text2 grey">
                  Your new password must be more than 8 characters.
                </div>
              </div>
              <!-- <div class="input">
                <label for=""> Confirm new password </label>

                <div class="input_wrap">
                  <input
                    v-model="data.newpassword"
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
              </div> -->
            </div>

            <div style="gap: 1rem" class="row q-mt-lg justify-end items-center">
              <q-btn flat no-caps class="act_btn cancel"> Cancel </q-btn>
              <q-btn
                :loading="loading"
                type="submit"
                flat
                no-caps
                class="act_btn"
              >
                Update password
              </q-btn>
            </div>
          </form>
        </div>
      </div>
    </div>
  </q-layout>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
let showA = ref("my acc");
let order = ref(false);
let billing = ref(false);
let card_update = ref(false);
let thankYou = ref(true);
let model = ref(null);
import { useMyAuthStore } from "src/stores/auth";
let store = useMyAuthStore();
let plan = ref({ settings: "monthly", method: "visa" });
let data = ref({});
let password = ref({});
let tab = ref("account");
import { api } from "src/boot/axios";
import { Notify } from "quasar";

let loading = ref(false);
let loadingUser = ref(false);
const updateUser = () => {
  const keysToDelete = [
    "role",
    "department",
    "userToken",
    "_id",
    "regNoOrCode",
    "email",
  ];

  keysToDelete.forEach((key) => {
    if (data.value.hasOwnProperty(key)) {
      delete data.value[key];
    }
  });

  const formData = new FormData();
  for (var key in data.value) {
    formData.append(key, data.value[key]);
  }
  loadingUser.value = true;
  api
    .put("user", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      // console.log(response);
      Notify.create({
        message: response.data.message,
        color: "green",
        position: "top",
      });
      loadingUser.value = false;
      data.value = {};
    })
    .catch(({ response }) => {
      // console.log(response);
      loadingUser.value = false;

      // errors.value = response.data.errors;
      Notify.create({
        message: response.data.error,
        color: "red",
        position: "bottom",
        actions: [{ icon: "close", color: "white" }],
      });
    });
};
const updatePassword = () => {
  loading.value = true;
  api
    .put("user/change-password", password.value)
    .then((response) => {
      // console.log(response);
      Notify.create({
        message: response.data.message,
        color: "green",
        position: "top",
      });
      loading.value = false;
      password.value = {};
    })
    .catch(({ response }) => {
      // console.log(response);
      loading.value = false;
      Notify.create({
        message: response.data.error,
        color: "red",
        position: "bottom",
        actions: [{ icon: "close", color: "white" }],
      });
    });
};
onMounted(async () => {
  try {
    // this.data
    // console.log(store.userdetails);
    data.value = { ...store.userdetails };
  } catch (error) {
    console.error(error);
  }
});
</script>

<style lang="scss" scoped>
.maindesc {
  font-weight: 600;
  margin: 0;
}

.auth_ {
  margin: 0 auto;
  max-width: 500px;
}

hr {
  margin: 2rem 0;
}
.my_hr {
  margin: 1rem 0;
}
.section_sub {
  text-align: left;
  margin: 0;
}

.planimg {
  border-radius: 500px;
  background: #ecf9f2;
  width: 40px;
  height: 40px;
  padding: 8px;
}

.planimg.one {
  background: #f0f6ff;
}
.planimg.method {
  width: 58px;
  height: 40px;
  padding: 9.55px 20.762px 8.509px 19.246px;
  border-radius: 6px;
  border: 1px solid #e4e7ec;
  background: #fff;
}
.planimg.method.visa {
  width: 58px;
  height: 40px;
  padding: 0;
  border-radius: 6px;
  border: 1px solid #e4e7ec;
  // background: #fff;
}

.column {
  display: flex !important;
}

.add_investor {
  border-radius: 8px;
  background: #f2f4f7;
  padding: 10px 20px;
}

.text2 {
  font-weight: 500;
}

.text2.thankyou {
  color: #344051;
}
.checkcircle {
  display: flex;
  width: 48px;
  height: 48px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  border-radius: 500px;
  background: #40bf7f;
}
.checkcircle img {
  width: 28px;
  height: 28px;
}
.apply {
  width: 100%;
}

.grid .input {
  margin: 0;
}

form {
  border-radius: 8px;
  border: 1px solid #eaecf0;
  background: #fff;

  /* Shadow/sm */
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.06),
    0px 1px 3px 0px rgba(16, 24, 40, 0.1);
  padding: 24px;
}

@media (max-width: 500px) {
  .container {
    padding: 2rem 0.5rem;
  }

  .input .row {
    flex-wrap: wrap;
    justify-content: center;
  }
  form {
    padding: 12px;
  }
}
</style>
