<template>
  <q-layout class="layout">
    <div v-if="spin" class="spinner">
      <q-spinner color="primary" size="3em" />
    </div>
    <div v-if="!spin" class="container q-pt-lg">
      <div class="top_area">
        <div class="row items-center no-wrap justify-between">
          <div class="left">
            <div class="all_main">All courses</div>
            <div class="text2">
              List of all departmental and school courses for computer science.
            </div>
            <div class="text2">change to a different department</div>
          </div>
          <div class="right auth">
            <div class="input">
              <div class="input_wrap">
                <img
                  style="width: 20px; height: 20px"
                  src="../assets/search.svg"
                  alt=""
                />
                <input
                  v-model="search"
                  placeholder="Search for a course or lecturer"
                  type="text"
                />
              </div>
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
                src="../assets/chev.svg"
                alt=""
              />
              <img
                v-else
                style="width: 20px; height: 20px"
                src="../assets/chevd.svg"
                alt=""
              />
              Minimize
            </q-btn>
          </div>

          <div v-if="!minimize" class="grid_area">
            <div class="grid_wrapper">
              <div class="">
                <div class="main_course_text">
                  {{ course.coursetypes[0].name }}
                </div>
              </div>
              <div
                v-for="eachcourse in course.coursetypes[0].courses"
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
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { api } from "src/boot/axios";
import CourseCompVue from "src/components/CourseComp.vue";
let search = ref("");
let minimize = ref(false);
let spin = ref(true);
let courses = ref([]);
import { useMyAuthStore } from "src/stores/auth";
let store = useMyAuthStore();
// const courseIsAdded = computed(() => {
//   const specificUser = store.userdetails._id;
//   if (store.userdetails.role === "lecturer") {
//     return courses.value.some((course) =>
//       course.lecturers.some((student) => student._id === specificUser)
//     );
//   } else {
//     return courses.value.some((course) =>
//       course.students.some((student) => student._id === specificUser)
//     );
//   }
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

// console.log(filteredCourses);
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
      // console.log(organizedCourses);
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

.level .q-btn {
  padding: 0;
}

.grid_wrapper > div:nth-child(1) {
  width: 257px;
}

.right.auth {
  width: 100%;
}

.top_area .left,
.top_area .right {
  flex: 1;
}

@media (max-width: 800px) {
  .container {
    padding: 2rem 0.5rem;
  }
}
</style>
