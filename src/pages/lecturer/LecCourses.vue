<template>
  <q-layout class="layout">
    <div class="container q-pt-lg">
      <div class="top_area">
        <div class="row items-center no-wrap justify-between">
          <div class="left">
            <div class="all_main">Courses you teach</div>
            <div class="text2">
              List of all courses you are listed on as a teacher.
            </div>
            <div class="text2">change to a different department</div>
          </div>
          <div class="right auth">
            <div style="gap: 0.4rem" class="row items-center no-wrap">
              <div class="input full-width">
                <div class="input_wrap">
                  <img
                    style="width: 20px; height: 20px"
                    src="../../assets/search.svg"
                    alt=""
                  />
                  <input
                    v-model="search"
                    placeholder="Search for a course or lecturer"
                    type="text"
                  />
                </div>
              </div>

              <q-btn
                @click="createCourse = true"
                class="offer minimize add"
                style="width: fit-content; padding: 0 10px"
                flat
                no-caps
                no-wrap
              >
                <img
                  style="width: 16px; height: 16px"
                  src="../../assets/plus.svg"
                  alt=""
                />Create course
              </q-btn>
            </div>
          </div>
        </div>
      </div>

      <div v-if="courses.length" class="q-mt-lg level">
        <div style="gap: 0.5rem" class="row items-center no-wrap">
          <div class="section_sub">500 level courses</div>
          <q-separator class="hr" />
          <q-btn flat no-caps>
            <img
              style="width: 20px; height: 20px"
              src="../../assets/chev.svg"
              alt=""
            />
            Minimize
          </q-btn>
        </div>

        <div class="grid_area">
          <div class="grid_wrapper">
            <div class="">
              <div class="main_course_text">School courses</div>
            </div>
            <div v-for="item in 3" :key="item.id">
              <CourseCompVue
                title="Computer information and geomatics"
                lecturers="Dr. I.A Ayogu"
                location="CSC Software lab"
                :saved="false"
                nextClass="Tuesday, 14:00 to 16:00"
              />
            </div>
          </div>
          <div class="grid_wrapper">
            <div class="">
              <div class="main_course_text">Departmental courses</div>
            </div>
            <div v-for="item in 3" :key="item.id">
              <CourseCompVue
                title="Computer information and geomatics"
                lecturers="Dr. I.A Ayogu"
                :saved="false"
                location="CSC Software lab"
                nextClass="Tuesday, 14:00 to 16:00"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="text-center q-ma-lg">
        <div class="main_course_text">No courses yet</div>
      </div>
    </div>

    <q-dialog v-model="createCourse">
      <q-card class="billing q-pa-md">
        <form @submit.prevent="createCourseFCN">
          <div class="auth">
            <div class="row q-pb-sm justify-between items-center">
              <div class="text5">Create course</div>

              <q-btn @click="createCourse = false" flat no-caps>
                <img src="../../assets/circle.svg" alt="" />
              </q-btn>
            </div>
            <div class="grid">
              <div class="input">
                <label for="">Course code* </label>

                <div class="input_wrap">
                  <input
                    v-model="data.courseCode"
                    placeholder="Course code "
                    type="text"
                  />
                </div>
              </div>
              <div class="input">
                <label for=""> Course title* </label>

                <div class="input_wrap">
                  <input
                    v-model="data.title"
                    placeholder="Course title"
                    type="text"
                  />
                </div>
              </div>
            </div>
            <div class="input">
              <label for=""> Venue* </label>

              <div class="input_wrap">
                <input v-model="data.venue" placeholder="Venue" type="text" />
              </div>
            </div>
            <div class="input">
              <label for=""> Description </label>

              <div class="input_wrap">
                <textarea
                  v-model="data.description"
                  placeholder="Enter a description"
                  rows="5"
                  cols="10"
                />
              </div>
            </div>
            <div class="input">
              <label for=""> Level </label>

              <div class="input_wrap">
                <select v-model="data.level" name="">
                  <option value="Year1">Year one</option>
                  <option value="Year2">Year two</option>
                  <option value="Year3">Year three</option>
                  <option value="Year4">Year four</option>
                </select>
              </div>
            </div>
            <div class="input">
              <label for=""> Type </label>

              <div class="input_wrap">
                <select v-model="data.courseType" name="">
                  <option value="easy">Easy</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div style="gap: 0.5rem" class="">
              <div class="section_sub text-left">Class times</div>
            </div>
            <div style="gap: 0.5rem" class="row items-center no-wrap">
              <div class="text2 grey">Class times</div>
              <q-separator class="hr" />
            </div>
            {{ data }}
            <div
              v-for="(schedule, index) in data.schedules"
              :key="index"
              class="grid three"
            >
              <q-btn
                style="width: fit-content"
                class="text-red trash"
                no-caps
                flat
                v-if="data.schedules.length > 1"
                icon="fa-solid fa-trash"
                @click="removeSchedule(index)"
              >
              </q-btn>
              <div class="input">
                <label for=""> Day of the week </label>

                <div class="input_wrap">
                  <select v-model="schedule.day" name="">
                    <option value="Sunday">Sunday</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>
              </div>

              <div class="input">
                <label for=""> Start time</label>
                <div class="copy">
                  <div class="copy_">
                    {{ schedule.startTime }}
                    {{
                      parseInt(schedule.startTime.split(":")[0]) < 12
                        ? "AM"
                        : "PM"
                    }}
                    <!-- {{ schedule.startHour }}:{{ schedule.startMinute }} -->
                    <!-- <span>{{ `${startIsAM ? "Am" : "Pm"}` }}</span> -->
                  </div>
                  <q-btn no-wrap class="offer minimize" flat no-caps>
                    <img
                      style="width: 16px; height: 16px"
                      src="../../assets/clock.svg"
                      alt=""
                    />
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time v-model="schedule.startTime">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-btn>
                </div>
              </div>
              <div class="input">
                <label for=""> End time </label>
                <div class="copy">
                  <div class="copy_">
                    {{ schedule.endTime }}
                    {{
                      parseInt(schedule.endTime.split(":")[0]) < 12
                        ? "AM"
                        : "PM"
                    }}
                    <!-- {{ schedule.start }}:{{ schedule.endMinute }} -->
                    <!-- <span>{{ `${endIsAM ? "Am" : "Pm"}` }}</span> -->
                  </div>
                  <q-btn no-wrap class="offer minimize" flat no-caps>
                    <img
                      style="width: 16px; height: 16px"
                      src="../../assets/clock.svg"
                      alt=""
                    />
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time v-model="schedule.endTime">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-btn>
                </div>
              </div>
            </div>
            <div>
              <q-btn
                style="width: fit-content"
                class="offer minimize"
                flat
                no-caps
                @click="addSchedule"
              >
                <img
                  style="width: 16px; height: 16px"
                  src="../../assets/carl.svg"
                  alt=""
                />Add another class time
              </q-btn>
            </div>
            <div
              style="gap: 0.5rem"
              class="total no-wrap row justify-end q-mt-lg items-center"
            >
              <q-btn
                type="submit"
                style="width: 100%"
                class="apply bg-primary"
                no-caps
                flat
                :loading="loading"
              >
                Save
              </q-btn>
            </div>
          </div>
        </form>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import CourseCompVue from "src/components/CourseComp.vue";
import { ref, onMounted, computed } from "vue";
import { api } from "src/boot/axios";

let search = ref("");
// let startTime = ref("");
// let endTime = ref("");
let createCourse = ref(false);
// const startHour = computed(() => startTime.value.split(":")[0]);
// const startMinute = computed(() => startTime.value.split(":")[1]);
// const endHour = computed(() => endTime.value.split(":")[0]);
// const endMinute = computed(() => endTime.value.split(":")[1]);
// const startIsAM = computed(() => parseInt(startHour.value) < 12);
// const endIsAM = computed(() => parseInt(endHour.value) < 12);
let data = ref({
  schedules: [
    {
      day: "Monday",
      startTime: "",
      endTime: "",
    },
  ],
});

const addSchedule = () => {
  const newSchedule = {
    day: "",
    startTime: "",
    endTime: "",
  };
  data.value.schedules.push(newSchedule);
};
const removeSchedule = (index) => {
  data.value.schedules.splice(index, 1);
};
const getarr = () => {
  data.value.schedules.forEach((obj) => {
    const [startHour, startMinute] = obj.startTime.split(":");
    const [endHour, endMinute] = obj.endTime.split(":");
    obj.startHour = startHour;
    obj.startMinute = startMinute;
    obj.endHour = endHour;
    obj.endMinute = endMinute;

    delete obj.startTime;
    delete obj.endTime;
  });

  console.log(data.value.schedules);
};
let courses = ref([]);

const createCourseFCN = () => {
  loading.value = true;
  api
    .post("courses", data.value)
    .then((response) => {
      console.log(response);
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
      console.log(response);
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
    const response = await api.get(`courses`);
    console.log(response);
    if (response.data.data) {
      courses.value = response.data.data;
    } else {
      courses.value = [];
    }

    // loadingDelete.value = false;
  } catch (error) {
    console.error(error);
  }
});
</script>

<style lang="scss" scoped>
.hr {
  height: 1px;
  background: #e1dfda;
  width: 100%;
  flex: 2;
}

.section_sub {
  text-align: left;
}

.level .q-btn {
  padding: 0;
}

.grid_wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.grid_wrapper > div:nth-child(1) {
  width: 257px;
}

.grid.three {
  position: relative;
}

.grid.three .trash {
  position: absolute;
  top: 12%;
  right: 0;
  font-size: 9px;
}

.right.auth {
  width: 100%;
}

.top_area .left,
.top_area .right {
  flex: 1;
}

.billing .copy .offer {
  margin: 0rem 0 0;
}

.billing .offer {
  margin: 1rem 0 0;
}

@media (max-width: 800px) {
  .container {
    padding: 2rem 0.5rem;
  }
}
</style>
