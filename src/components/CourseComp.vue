<template>
  <div>
    <div class="card">
      <router-link
        :to="{
          name: 'course-detail',
          params: {
            slug: 'csc',
          },
        }"
        class="text-dark"
      >
        <div class="top">
          <div class="text2">CSC 510</div>
        </div>
      </router-link>

      <div class="q-pa-sm">
        <div class="title maindesc">{{ title }}</div>
        <div class="row each items-center">
          <div style="gap: 0.3rem" class="text2 row no-wrap items-center grey">
            <img
              style="width: 16px; height: 16px"
              src="../assets/users.svg"
              alt=""
            />Lecturers:
          </div>
          <div class="text2 black lec">{{ lecturers }}</div>
          <div class="text2 black lec">+6 others</div>
        </div>
        <div class="row each items-center">
          <div style="gap: 0.3rem" class="text2 row items-center no-wrap grey">
            <img
              style="width: 16px; height: 16px"
              src="../assets/loc.svg"
              alt=""
            />Location:
          </div>
          <div class="text2 black lec">CSC Software lab</div>
        </div>
        <div class="row each items-center">
          <div style=".3rem" class="text2 row no-wrap items-center grey">
            <img
              style="width: 16px; height: 16px"
              src="../assets/car.svg"
              alt=""
            />Next class:
          </div>
          <div class="text2 black lec">{{ nextClass }}</div>
        </div>

        <q-btn
          :class="saved === true ? 'offer minimize active' : 'offer minimize'"
          flat
          no-caps
        >
          <img
            v-if="!saved"
            style="width: 16px; height: 16px"
            src="../assets/plus.svg"
            alt=""
          /><img
            v-if="saved"
            style="width: 16px; height: 16px"
            src="../assets/pcheck.svg"
            alt=""
          />Add to courses you offer
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  lecturers: String,
  nextClass: String,
  saved: Boolean,
});

const updateStudentCourse = () => {
  loading.value = true;
  api
    .put(`courses/toggle/student/id`)
    .then((response) => {
      console.log(response);
      Notify.create({
        message: response.data.message,
        color: "green",
        position: "top",
      });
      loading.value = false;
      password.value = {};
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
  api
    .put(`courses/toggle/lecturer/id`)
    .then((response) => {
      console.log(response);
      Notify.create({
        message: response.data.message,
        color: "green",
        position: "top",
      });
      loading.value = false;
      password.value = {};
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
}
.card {
  border-radius: 8px;
  border: 1px solid #eaecf0;
  background: #fff;
  max-width: 298px;
}
.row.each {
  margin: 0.7rem 0;
}
.text2 {
  font-weight: 700;
}
.lec {
  margin-left: 0.3rem;
}

.maindesc {
  color: #344054;
}
</style>
