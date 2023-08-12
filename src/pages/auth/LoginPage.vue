<template>
  <q-layout>
    <div class="pricing overflow-hidden">
      <div class="left">
        <div class="header">
          <div class="logo">
            <q-btn class="" flat no-wrap no-caps>
              <div class="row items-center no-wrap">
                <div class="logo_img">
                  <img src="../../assets/dot.svg" alt="" />
                </div>
              </div>
            </q-btn>
          </div>
        </div>
        <div class="sectionMain_text">Login</div>

        <div class="q-mt-sm">
          <div class="auth">
            <form @submit.prevent="login" class="q-mt-lg">
              <div class="form_hold">
                <div class="input">
                  <label for=""> Email* </label>

                  <div class="input_wrap">
                    <input
                      v-model="data.email"
                      placeholder="Enter your email"
                      type="text"
                      name="email"
                    />
                  </div>
                </div>
                <div class="input">
                  <label for=""> Password* </label>

                  <div
                    class="input_wrap no-wrap row justify-between items-center"
                  >
                    <input
                      v-model="data.password"
                      placeholder="Enter your password"
                      :type="!togglePass ? 'password' : 'text'"
                    />
                    <q-btn
                      @click="togglePass = !togglePass"
                      flat
                      icon="visibility"
                    >
                    </q-btn>
                  </div>
                </div>

                <div class="login_btn">
                  <q-btn :loading="loading" type="submit" no-caps flat>
                    Log in
                  </q-btn>
                </div>

                <div class="no_acc text-center q-mt-lg">
                  Don't have an account?
                  <router-link to="/register"> Sign Up </router-link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="right auth">
        <q-carousel animated v-model="slide" arrows navigation infinite>
          <q-carousel-slide :name="1" img-src="../../assets/lec1.jpg" />
          <q-carousel-slide :name="2" img-src="../../assets/stud.jpg" />
          <q-carousel-slide :name="3" img-src="../../assets/lec2.jpg" />
        </q-carousel>
      </div>
    </div>
  </q-layout>
</template>

<script setup>
import { Notify } from "quasar";
import { api } from "src/boot/axios";
import { useMyAuthStore } from "src/stores/auth";
import { ref, onMounted } from "vue";
let slide = ref(1);
import { useRouter } from "vue-router";
let store = useMyAuthStore();
let router = useRouter();
let data = ref({});
let togglePass = ref(false);
let loading = ref(false);

const login = () => {
  loading.value = true;
  api
    .post("login", data.value)
    .then((response) => {
      // console.log(response);
      store.setUserDetails(response.data);
      loading.value = false;
      data.value = {};
      Notify.create({
        message: response.data.message,
        color: "green",
        position: "top",
      });
      if (response.data.data.role === "lecturer") {
        router.replace({
          name: "lecturer-courses",
        });
      } else {
        router.replace({
          name: "courses",
        });
      }

      // if(response.data.data.role ==='')
    })
    .catch(({ response }) => {
      // console.log(response);
      loading.value = false;

      // errors.value = response.data.errors;
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
    // loadingDelete.value = true;
    // const response = await api.get(`states`);
    // const responseOrg = await api.get(`organizations`);
    // const reponseUsers = await api.get(`members/all`);
    // console.log(response);
    // console.log(responseOrg);
    // states.value = response.data.data;
    // organizations.value = responseOrg.data.data;
    // allMembers.value = reponseUsers.data.data;
    // loadingDelete.value = false;
  } catch (error) {
    console.error(error);
  }
});
</script>

<style scoped>
.sectionMain_text {
  text-align: left;
}

.pricing {
  display: grid;
  height: 100vh;
  margin: 0 auto;
  align-items: center;
  /* max-width: 1200px; */
  grid-template-columns: 1fr 1fr;
}
.pricing::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.example {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.left {
  padding: 1rem 3rem 2rem;
  height: 100vh;
  display: flex;
  max-width: 600px;

  flex-direction: column;
  justify-content: center;
  overflow: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.left::-webkit-scrollbar {
  display: none;
}

.right img {
  height: 100%;
  object-fit: cover;
}

.header {
  all: unset;
}

.q-card {
  border-radius: 12px;
  background: #fff;
  padding: 24px;
  position: relative;
  /* Shadow/xl */
  box-shadow: 0px 8px 8px -4px rgba(16, 24, 40, 0.03),
    0px 20px 24px -4px rgba(16, 24, 40, 0.08);
}

.q-card .close {
  position: absolute;
  top: 2%;
  right: 2%;
}

@media (min-width: 1000px) {
  .q-card {
    min-width: 402px;
  }
}
.checkcircle {
  border-radius: 28px;
  border: 8px solid #f9f5ff;
  background: #f4ebff;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
}
.downloadqr .checkcircle {
  border-radius: 28px;
  border: 8px solid #ecfdf3;
  background: #d1fadf;
}
.checkcircle img {
  width: 24px;
  height: 24px;
}
@media (min-width: 1000px) {
  .list_card {
    min-width: 600px;
  }
}

@media (max-width: 800px) {
  .right {
    display: none;
  }

  .pricing {
    grid-template-columns: 1fr;
  }
  .left {
    padding: 1rem 1rem 2rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
    max-width: 500px;
    margin: 0 auto;
    width: 100%;
  }
  .grid {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .btn_toggle .q-btn,
  .btns_switch .q-btn {
    font-size: 14px;
  }
}
</style>
