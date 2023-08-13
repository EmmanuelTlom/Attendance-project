<template>
  <q-layout class="layout">
    <div v-if="spin" class="spinner">
      <q-spinner color="primary" size="3em" />
    </div>
    <div v-if="!spin" class="container q-py-lg">
      <div class="top_area">
        <div class="row hold items-center no-wrap justify-between">
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

      <div v-if="filteredCourses.length" class="q-mt-lg level">
        <div v-for="(course, index) in filteredCourses" :key="index">
          <div style="gap: 0.5rem" class="row items-center no-wrap">
            <div class="section_sub">{{ course.level }} Courses</div>
            <q-separator class="hr" />
            <q-btn @click="minimize = !minimize" flat no-caps>
              <img
                v-if="minimize"
                style="width: 20px; height: 20px"
                src="../../assets/chev.svg"
                alt=""
              />
              <img
                v-else
                style="width: 20px; height: 20px"
                src="../../assets/chevd.svg"
                alt=""
              />
              Minimize
            </q-btn>
          </div>

          <div v-if="!minimize" class="grid_area">
            <div
              v-for="(coursetype, index) in course.coursetypes"
              :key="index"
              class="grid_wrapper"
            >
              <div class="">
                <div class="main_course_text">
                  {{ coursetype.name }}
                </div>
              </div>
              <div
                v-for="eachcourse in coursetype.courses"
                :key="eachcourse.id"
              >
                <CourseCompVue
                  @courseAdded="refreshPage"
                  :course="eachcourse"
                />
              </div>
            </div>
            <!-- <div class="grid_wrapper">
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
          </div> -->
          </div>
        </div>
      </div>

      <div v-else class="text-center q-ma-lg">
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
            <div class="input">
              <label for=""> Level </label>

              <div class="input_wrap">
                <select v-model="data.level" name="" class="text2 grey">
                  <option value="" disabled selected>Select a level</option>
                  <option value="100l">100L</option>
                  <option value="200l">200L</option>
                  <option value="300l">300L</option>
                  <option value="400l">400L</option>
                  <option value="500l">500L</option>
                </select>
              </div>
            </div>
            <div class="input">
              <label for=""> Type </label>

              <div class="input_wrap">
                <select v-model="data.courseType" class="text2 grey" name="">
                  <option value="" disabled selected>Select a type</option>
                  <option value="departmental">Departmental Course</option>
                  <option value="school">School Course</option>
                </select>
              </div>
            </div>

            <div class="q-mt-lg">
              <div class="section_sub_ text-left">Class Schedule</div>
            </div>
            <div style="gap: 0.5rem" class="row items-center no-wrap">
              <div class="text2 grey">Class times</div>
              <q-separator class="hr" />
            </div>
            <!-- {{ data }} -->
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
import { Notify } from "quasar";
import { useMyAuthStore } from "src/stores/auth";
let store = useMyAuthStore();
let search = ref("");
let curl = ref("");
let createCourse = ref(false);
let loading = ref(false);
let spin = ref(true);
let minimize = ref(false);
let data = ref({
  schedules: [
    {
      day: "Monday",
      startTime: "0:00",
      endTime: "0:00",
    },
  ],

  level: "",
  department: "",
  courseType: "",
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

let courses = ref([]);

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

// const filteredCourses = computed(() => {
//   return courses.value.map((course) => {
//     course.coursetypes[0].courses.filter((course) => {
//       const query = search.value.toLowerCase();
//       const matchesLecturer = course.lecturers.some(
//         (user) => user.firstName.toLowerCase() === query
//       );
//       const matchesName = course.title.toLowerCase().includes(query);
//       // const matchesLecturer = course.lecturer.name.toLowerCase().includes(query);

//       return matchesName || matchesLecturer;
//     });
//   });
// });
// Compute distinct levels and coursetypes
const levels = computed(() => [
  ...new Set(courses.value.map((course) => course.level)),
]);
const coursetypes = computed(() => {
  const coursetypeSet = new Set();
  courses.value.forEach((levelObj) => {
    levelObj.coursetypes.forEach((coursetypeObj) => {
      coursetypeSet.add(coursetypeObj.name);
    });
  });
  return [...coursetypeSet];
});

// Selected filter values
const searchLecturer = ref("");
const searchCourse = ref("");

// Compute filtered courses
const filteredCourses = computed(() => {
  return courses.value
    .map((levelObj) => {
      const filteredCoursetypes = levelObj.coursetypes
        .map((coursetypeObj) => {
          const filteredCourses = coursetypeObj.courses.filter(
            (course) =>
              // console.log(course)
              search.value === "" ||
              course.lecturers.some((lecturer) =>
                lecturer.firstName
                  .toLowerCase()
                  .includes(search.value.toLowerCase())
              ) ||
              search.value === "" ||
              course.title.toLowerCase().includes(search.value.toLowerCase())
          );
          return { ...coursetypeObj, courses: filteredCourses };
        })
        .filter((coursetypeObj) => coursetypeObj.courses.length > 0);
      return { ...levelObj, coursetypes: filteredCoursetypes };
    })
    .filter((levelObj) => levelObj.coursetypes.length > 0);
});
const createCourseFCN = () => {
  let clonedObj = JSON.parse(JSON.stringify(data.value));
  loading.value = true;

  clonedObj.schedules.forEach((obj) => {
    const [startHour, startMinute] = obj.startTime.split(":");
    const [endHour, endMinute] = obj.endTime.split(":");
    obj.startHour = startHour;
    obj.startMinute = startMinute;
    obj.endHour = endHour;
    obj.endMinute = endMinute;

    delete obj.startTime;
    delete obj.endTime;
  }),
    api
      .post("courses", clonedObj)
      .then((response) => {
        // console.log(response);
        loading.value = false;
        data.value = {
          schedules: [
            {
              day: "Monday",
              startTime: "0:00",
              endTime: "0:00",
            },
          ],
        };

        createCourse.value = false;
        Notify.create({
          message: response.data.message,
          color: "green",
          position: "top",
        });

        refreshPage();
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
    const response = await api.get(`courses`);
    // console.log(response);
    if (response.data.data) {
      // courses.value = response.data.data;
      const organizedCourses = [];

      response.data.data.forEach((course) => {
        const { level, courseType } = course;

        let levelObj = organizedCourses.find((obj) => obj.level === level);
        if (!levelObj) {
          levelObj = { level, coursetypes: [] };
          organizedCourses.push(levelObj);
        }

        // Find the coursetype object in the levelObj
        let coursetypeObj = levelObj.coursetypes.find(
          (obj) => obj.name === courseType
        );
        if (!coursetypeObj) {
          coursetypeObj = { name: courseType, courses: [] };
          levelObj.coursetypes.push(coursetypeObj);
        }

        // Add the course to the coursetypeObj
        coursetypeObj.courses.push(course);
      });

      // organizedCourses now holds the structured data
      console.log(organizedCourses);
      courses.value = organizedCourses;

      // coursesByLevel is now organized by level and then by coursetype
      // console.log([coursesByLevel]);
    } else {
      courses.value = [];
    }

    spin.value = false;
  } catch (error) {
    console.error(error);
  }
});

const refreshPage = () => {
  loading.value = true;
  api
    .get("courses")
    .then((response) => {
      loading.value = false;
      if (response.data.data) {
        // courses.value = response.data.data;
        const organizedCourses = [];

        response.data.data.forEach((course) => {
          const { level, courseType } = course;

          let levelObj = organizedCourses.find((obj) => obj.level === level);
          if (!levelObj) {
            levelObj = { level, coursetypes: [] };
            organizedCourses.push(levelObj);
          }

          // Find the coursetype object in the levelObj
          let coursetypeObj = levelObj.coursetypes.find(
            (obj) => obj.name === courseType
          );
          if (!coursetypeObj) {
            coursetypeObj = { name: courseType, courses: [] };
            levelObj.coursetypes.push(coursetypeObj);
          }

          // Add the course to the coursetypeObj
          coursetypeObj.courses.push(course);
        });

        // organizedCourses now holds the structured data
        // console.log(organizedCourses);
        courses.value = organizedCourses;

        // coursesByLevel is now organized by level and then by coursetype
        // console.log([coursesByLevel]);
      } else {
        courses.value = [];
      }
    })
    .catch(({ response }) => {
      // console.log(response);
      loading.value = false;
    });
};
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
.q-card {
  width: 100%;
}
@media (max-width: 800px) {
  .container {
    padding: 2rem 0.5rem;
  }

  .offer {
    margin: 0rem 0;
  }
}
</style>
