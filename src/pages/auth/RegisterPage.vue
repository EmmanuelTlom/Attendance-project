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
        <div class="sectionMain_text">Sign up</div>
        <div class="btn_toggle">
          <div>
            <q-btn
              @click="setVal('student')"
              no-caps
              :class="setrole === 'student' ? 'active' : ''"
              flat
            >
              I’m a student
            </q-btn>
            <q-btn
              @click="setVal('lecturer')"
              no-caps
              :class="setrole !== 'student' ? 'active' : ''"
              flat
            >
              I’m a lecturer
            </q-btn>
          </div>
        </div>

        <div class="q-mt-sm">
          <div class="auth">
            <form @submit.prevent="register" class="q-mt-lg">
              <div class="form_hold">
                <div class="grid">
                  <div class="input">
                    <label for=""> First name* </label>

                    <div class="input_wrap">
                      <input
                        v-model="data.firstName"
                        placeholder="Enter your first name"
                        type="text"
                        required
                        name="firstName"
                      />
                    </div>
                  </div>
                  <div class="input">
                    <label for="">Last name* </label>

                    <div class="input_wrap">
                      <input
                        v-model="data.lastName"
                        placeholder="Enter your last name"
                        type="text"
                        required
                        name="lastName"
                      />
                    </div>
                  </div>
                </div>
                <div class="input">
                  <label for=""> Department </label>

                  <div class="input_wrap">
                    <select
                      class="text2 grey"
                      required
                      v-model="data.department"
                      name="department"
                    >
                      <option value="" disabled selected>
                        Select your department
                      </option>
                      <option
                        v-for="(department, index) in departments
                          .slice()
                          .sort((a, b) => a.name.localeCompare(b.name))"
                        :key="index"
                        :value="department.name"
                      >
                        {{ department.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <!-- <div class="input">
                  <label for=""> Are you a </label>

                  <div class="input_wrap">
                    <select required v-model="data.role" name="">
                      <option value="student">Student</option>
                      <option value="lecturer">Lecturer</option>
                    </select>
                  </div>
                </div> -->

                <div class="input">
                  <label v-if="setrole === 'student'" for="">
                    Registration number*
                  </label>
                  <label v-else for=""> Registration Code* </label>

                  <div class="input_wrap">
                    <input
                      v-model="data.regNoOrCode"
                      :placeholder="
                        setrole === 'student'
                          ? 'Enter your registration number'
                          : 'Enter your secret lecturer code'
                      "
                      type="text"
                      required
                      name="registrationNo"
                    />
                  </div>
                </div>
                <div class="input">
                  <label for=""> Email* </label>

                  <div class="input_wrap">
                    <input
                      v-model="data.email"
                      placeholder="Enter your email"
                      type="text"
                      required
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
                      placeholder="Create a password"
                      :type="!togglePass ? 'password' : 'text'"
                      required
                    />
                    <q-btn
                      @click="togglePass = !togglePass"
                      flat
                      icon="visibility"
                    >
                    </q-btn>
                  </div>
                </div>

                <div class="input">
                  <label for=""> Profile photo (optional) </label>
                  <q-file
                    class="column profile_field justify-center items-center"
                    v-model="data.avatar"
                  >
                    <div class="img q-mb-sm">
                      <img src="../../assets/down.svg" alt="" />
                    </div>
                    <div class="text3">
                      <span>Click to upload</span> or drag and drop
                    </div>

                    <div class="text2 text-center">
                      SVG, PNG, JPG or GIF (max. 800x400px)
                    </div>
                  </q-file>
                </div>

                <div class="login_btn">
                  <q-btn :loading="loading" type="submit" no-caps flat>
                    Sign up
                  </q-btn>
                </div>

                <div class="no_acc text-center q-mt-lg">
                  Already have an account?
                  <router-link :to="{ name: 'login' }"> Login </router-link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="right auth">
        <img v-if="setrole === 'student'" src="../../assets/stud.jpg" alt="" />
        <q-carousel
          v-if="setrole === 'lecturer'"
          animated
          v-model="slide"
          arrows
          :autoplay="10000"
          navigation
          infinite
        >
          <q-carousel-slide :name="1" img-src="../../assets/lec1.jpg" />
          <q-carousel-slide :name="2" img-src="../../assets/lec2.jpg" />
        </q-carousel>
      </div>
    </div>

    <q-dialog class="dialog" v-model="verify">
      <div class="auth">
        <q-card class="billing">
          <div class="row q-mb-md justify-center">
            <div class="checkcircle">
              <img src="../../assets/message.svg" alt="" />
            </div>
          </div>

          <div class="text-center q-mb-lg">
            <div class="text3">Please check your email.</div>
            <div class="text2 text-center grey scanQr">
              We've sent a code to
              <span class="text5"> {{ user.email }} </span>
            </div>
          </div>

          <div
            class="justify-center otp_wrap"
            style="display: flex; flex-direction: row; gap: 0.5rem"
          >
            <v-otp-input
              ref="otpInput"
              v-model:value="bindModal"
              input-classes="otp-input"
              separator=" "
              :num-inputs="4"
              :should-auto-focus="true"
              input-type="letter-numeric"
              :conditionalClass="['one', 'two', 'three', 'four']"
              :placeholder="['', '', '', '']"
              @on-change="handleOnChange"
              @on-complete="handleOnComplete"
            />
          </div>

          <div class="text2 grey">
            Didn’t get a code?
            <q-btn
              @click="resend"
              flat
              no-caps
              style="padding: 0; text-decoration: underline"
            >
              Click to resend.
            </q-btn>
          </div>

          <div
            style="gap: 0.5rem"
            class="total no-wrap row justify-between q-mt-md items-center"
          >
            <q-btn
              @click="verify = false"
              class="act_btn cancel full-width"
              no-caps
              flat
            >
              Cancel
            </q-btn>
            <q-btn
              @click="Verify"
              class="apply bg-primary full-width"
              no-caps
              :loading="loading"
              flat
            >
              Verify
            </q-btn>
          </div>
        </q-card>
      </div>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { api } from "src/boot/axios";
import { Notify } from "quasar";
import { ref } from "vue";
import { useRouter } from "vue-router";
let router = useRouter();
let setrole = ref("student");
let togglePass = ref(false);
let data = ref({
  department: "",
});
let user = ref({});
let model = ref(null);
let verify = ref(false);
let slide = ref(1);
let code = ref("");
let loading = ref(false);

let departments = ref([
  {
    name: "Agricultural Economics",
  },
  {
    name: "Architecture",
  },
  {
    name: "Agricultural Extension",
  },
  {
    name: "Animal Science and Technology",
  },
  {
    name: "Crop Science and Technology",
  },
  {
    name: "Fisheries and Aquaculture Technology",
  },
  {
    name: "Forestry and Wildlife Technology",
  },
  {
    name: "Soil Science and Technology",
  },
  {
    name: "Biochemistry",
  },
  {
    name: "Biology",
  },
  {
    name: "Biotechnology",
  },
  {
    name: "Microbiology",
  },
  {
    name: "Forensic Science",
  },
  {
    name: "Agricultural and Bioresources Engineering",
  },
  {
    name: "Civil Engineering",
  },
  {
    name: "Chemical Engineering",
  },
  {
    name: "Electrical and Electronics Engineering",
  },
  {
    name: "Food Science and technology",
  },
  {
    name: "Material and Metallurgical Engineering",
  },
  {
    name: "Mechanical Engineering",
  },
  {
    name: "Mechatronic Engineering",
  },
  {
    name: "Petroleum Engineering",
  },
  {
    name: "Polymer and Textile Engineering",
  },

  {
    name: "Building Technology",
  },
  {
    name: "Environmental Technology",
  },
  {
    name: "Quantity Surveying",
  },
  {
    name: "Surveying and Geoinformatics",
  },
  {
    name: "Urban and Regional Planning",
  },
  {
    name: "Biomedical Technology",
  },
  {
    name: "Dental Technology",
  },
  {
    name: "Environmental Health Science",
  },
  {
    name: "Optometry",
  },
  {
    name: "Prosthetics and Orthotics",
  },
  {
    name: "Public Health Technology",
  },
  {
    name: "Computer Science",
  },
  {
    name: "Cyber Security",
  },
  {
    name: "Information Technology",
  },
  {
    name: "Software Engineering",
  },
  {
    name: "Financial Management Technology",
  },
  {
    name: "Management Technology",
  },
  {
    name: "Maritime Management Technology",
  },
  {
    name: "Project Management Technology",
  },
  {
    name: "Transport Management Technology",
  },
  {
    name: "Chemistry",
  },
  {
    name: "Geology",
  },
  {
    name: "Mathematics",
  },
  {
    name: "Physics",
  },
  {
    name: "Science Laboratory Technology",
  },
  {
    name: "Statistics",
  },
]);
// import VOtpInput from "vue3-otp-input";

const bindModal = ref("");

const setVal = (value) => {
  setrole.value = value;
};

const handleOnComplete = (value) => {
  // console.log("OTP completed: ", value);
  code.value = value;
};

const handleOnChange = (value) => {
  // console.log("OTP changed: ", value);
};
const register = () => {
  let newData = {
    ...data.value,
    role: setrole.value,
  };
  // console.log("register");
  loading.value = true;
  const formData = new FormData();
  for (var key in newData) {
    formData.append(key, newData[key]);
  }

  loading.value = true;
  api
    .post("register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      // console.log(response);
      user.value = response.data.data;
      Notify.create({
        message: response.data.message,
        color: "green",
        position: "top",
      });
      loading.value = false;
      verify.value = true;
      data.value = {};
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
const Verify = () => {
  let data = {
    code: code.value,
    email: user.value.email,
  };
  loading.value = true;
  api
    .post("register-verify", data)
    .then((response) => {
      // console.log(response);
      loading.value = false;
      verify.value = false;
      Notify.create({
        message: response.data.message,
        color: "green",
        position: "top",
      });
      router.replace({
        name: "login",
      });
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
const resend = () => {
  let data = {
    email: user.value.email,
  };
  loading.value = true;
  api
    .post("register-verify-email", data)
    .then((response) => {
      // console.log(response);
      Notify.create({
        message: "Code Resent",
        color: "green",
        position: "top",
      });
      loading.value = false;
      verify.value = false;
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
</script>

<style scoped>
.sectionMain_text {
  text-align: left;
}

.pricing {
  display: grid;
  height: 100vh;
  margin: 0 auto;
  /* max-width: 1200px; */
  grid-template-columns: 1fr 1fr;
}
.pricing::-webkit-scrollbar {
  display: none;
}

.left {
  padding: 1rem 3rem 2rem;
  height: 100vh;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
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
