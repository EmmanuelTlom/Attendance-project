<template>
  <div>
    <div class="card">
      <div @click="goto" class="cursor-pointer text-dark">
        <div class="top">
          <div class="text2">{{ course.courseCode }}</div>
        </div>

        <div class="q-pa-sm">
          <div class="title maindesc">{{ course.title }}</div>
          <div class="row each items-center">
            <div
              style="gap: 0.3rem"
              class="text2 row no-wrap items-center grey"
            >
              <img
                style="width: 16px; height: 16px"
                src="../assets/users.svg"
                alt=""
              />Lecturers:
            </div>
            <div v-if="course.lecturers.length" class="text2 black lec">
              {{ course.lecturers[0].firstName }}
              {{ course.lecturers[0].lastName }}
            </div>
            <div class="text2 black lec"></div>
          </div>
          <div class="row each items-center">
            <div
              style="gap: 0.3rem"
              class="text2 row items-center no-wrap grey"
            >
              <img
                style="width: 16px; height: 16px"
                src="../assets/loc.svg"
                alt=""
              />Location:
            </div>
            <div class="text2 black lec">{{ course.venue }}</div>
          </div>
          <div class="row each items-start">
            <div style=".3rem" class="text2 row no-wrap items-center grey">
              <img
                style="width: 16px; height: 16px"
                src="../assets/car.svg"
                alt=""
              />Next class:
            </div>
            <!-- <div class="text2 black lec">{{ nextClass }}</div> -->
            <div v-if="course.schedules">
              <div v-if="course.schedules.length">
                <div
                  v-for="(schedule, index) in course.schedules"
                  :key="index"
                  class="text2 black lec"
                >
                  {{ schedule.day }} by
                  {{
                    schedule.startHour < 10
                      ? `0${schedule.startHour}`
                      : `${schedule.startHour}`
                  }}:{{
                    schedule.startMinute < 10
                      ? `0${schedule.startMinute}`
                      : `${schedule.startMinute}`
                  }}
                  to
                  {{
                    schedule.endHour < 10
                      ? `0${schedule.endHour}`
                      : `${schedule.endHour}`
                  }}:{{
                    schedule.endMinute < 10
                      ? `0${schedule.endMinute}`
                      : `${schedule.endMinute}`
                  }}
                </div>
              </div>
              <div v-else class="text2 black lec">
                This course does not have any schedules
              </div>
            </div>
          </div>
        </div>
        <!-- {{ courseIsAdded }} -->
        <!-- :class="saved === true ? 'offer minimize active' : 'offer minimize'" -->
        <q-btn
          :class="courseIsAdded ? 'offer minimize active' : 'offer minimize'"
          flat
          :loading="loading"
          @click="
            store.userdetails.role === 'lecturer'
              ? updateLecturerCourse()
              : updateStudentCourse()
          "
          no-caps
        >
          <img
            v-if="!courseIsAdded"
            style="width: 16px; height: 16px"
            src="../assets/plus.svg"
            alt=""
          /><img
            v-if="courseIsAdded"
            style="width: 16px; height: 16px"
            src="../assets/pcheck.svg"
            alt=""
          />
          {{ courseIsAdded ? "Added" : "Add" }} to your list
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Notify } from "quasar";
import { api } from "src/boot/axios";
import { useMyAuthStore } from "src/stores/auth";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
let router = useRouter();
let store = useMyAuthStore();
let loading = ref(false);
const props = defineProps({
  course: Object,
});

const emit = defineEmits(["courseAdded"]);

const courseIsAdded = computed(() => {
  const specificUser = store.userdetails._id;
  if (store.userdetails.role === "lecturer") {
    return props.course.lecturers.some(
      (student) => student._id === specificUser
    );
  } else {
    return props.course.students.some(
      (student) => student._id === specificUser
    );
  }
});

const goto = () => {
  router.replace({
    name: "course-detail",
    params: {
      slug: props.course._id,
    },
  });
};
const updateStudentCourse = () => {
  loading.value = true;
  api
    .put(`courses/toggle/student/${props.course._id}`)
    .then((response) => {
      console.log(response);
      Notify.create({
        message: response.data.message,
        color: "green",
        position: "top",
      });
      emit("courseAdded");
      loading.value = false;
    })
    .catch(({ response }) => {
      console.log(response);
      loading.value = false;
      Notify.create({
        message: response.data.error,
        color: "red",
        position: "bottom",
        actions: [{ icon: "close", color: "white" }],
      });
    });
};
const updateLecturerCourse = () => {
  loading.value = true;
  console.log(props.course._id);
  api
    .put(`courses/toggle/lecturer/${props.course._id}`)
    .then((response) => {
      console.log(response);
      Notify.create({
        message: response.data.message,
        color: "green",
        position: "top",
      });
      emit("courseAdded");

      loading.value = false;
    })
    .catch(({ response }) => {
      console.log(response);
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

<style lang="scss" scoped>
.top {
  display: flex;
  height: 80px;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  background: #eaecf5;
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
}
.card {
  border-radius: 8px;
  border: 1px solid #eaecf0;
  background: #fff;
  max-width: 298px;
  min-height: 340px;
  position: relative;
}

.card .q-btn {
  position: absolute;
  bottom: 2%;
  width: 90%;
  left: 50%;
  transform: translateX(-50%);
}

.top {
  transition: all 0.5s ease-in-out;
}
.top:hover {
  background: #667085;
  color: #fff;
}
.row.each {
  margin: 0.7rem 0;
}
.text2.lec {
  font-weight: 700;
}
.lec {
  margin-left: 0.3rem;
}

.maindesc {
  color: #344054;
  font-weight: 400;
}
</style>
