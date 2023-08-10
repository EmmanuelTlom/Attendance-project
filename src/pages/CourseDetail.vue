<template>
  <q-layout class="layout">
    <div class="">
      <div class="hero">
        <div class="card text-center">
          <div class="top">
            <div class="all_main">CSC 510</div>
          </div>

          <div class="q-pa-sm">
            <div class="title maindesc">
              Introduction to computer schematics
            </div>
            <q-btn no-wrap class="offer minimize" flat no-caps>
              <img
                style="width: 16px; height: 16px"
                src="../assets/plus.svg"
                alt=""
              />Add to courses you offer
            </q-btn>
          </div>
        </div>
      </div>

      <div class="main_area container">
        <div class="main_wrap">
          <div class="left">
            <div class="q-my-lg">
              <div class="row items-center justify-between">
                <div class="maindesc">Title</div>
                <q-btn flat style="min-height: auto" icon="more_vert"> </q-btn>
              </div>

              <div class="text2 grey">Introduction to computer schematics</div>
            </div>
            <div class="q-my-lg">
              <div class="maindesc desc">Description</div>
              <div class="text2 grey">
                I'm a Product Designer based in Melbourne, Australia. I
                specialise in UX/UI design, brand strategy, and Webflow
                development. I'm always striving to grow and learn something new
                and I don't take myself too seriously. <br />
                <br />
                I'm passionate about helping startups grow, improve their
                customer experience, and to raise venture capital through good
                design.
              </div>

              <div class="q-mt-md">
                <q-btn flat no-caps style="padding: 0" class="text2 read">
                  Read more
                </q-btn>
              </div>
            </div>

            <div class="table_area">
              <div class="row q-pa-sm items-center justify-between">
                <div>
                  <div class="row text5 items-center">
                    Attendance tracker
                    <div class="f_crumb q-ml-sm">40 / 50</div>
                  </div>
                  <div class="text2 grey">
                    Your personal record of your attendances
                  </div>
                </div>
                <div>
                  <q-btn
                    style="width: fit-content"
                    class="offer minimize"
                    flat
                    no-caps
                  >
                    <img
                      style="width: 16px; height: 16px"
                      src="../assets/downloa.svg"
                      alt=""
                    />Export
                  </q-btn>
                </div>
              </div>

              <q-separator />

              <div class="row row q-pa-sm btns items-center justify-center">
                <div class="">
                  <div class="three_btns">
                    <q-btn flat no-wrap no-caps> View all </q-btn>
                    <q-btn flat no-caps no-wrap> Attended </q-btn>
                    <q-btn flat no-wrap no-caps> Missed </q-btn>
                  </div>
                </div>

                <div>
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

              <div class="auth">
                <div class="">
                  <q-table
                    :rows="rows"
                    :hide-header="mode === 'grid'"
                    :columns="columns"
                    row-key="investor"
                    :filter="filter"
                    class="sort_tables"
                    :loading="loading"
                    v-model:pagination="pagination"
                    @request="onRequest"
                  >
                    <template v-slot:body-cell-date="props">
                      <q-td class="text2 grey" :props="props">
                        <div style="gap: 1rem" class="row items-center">
                          <div>
                            {{ props.row.date }}
                          </div>
                        </div>
                      </q-td>
                    </template>
                    <template v-slot:body-cell-time="props">
                      <q-td class="text2 grey" :props="props">
                        <div style="gap: 1rem" class="row items-center">
                          <div>
                            {{ props.row.date }}
                          </div>
                        </div>
                      </q-td>
                    </template>
                    <template v-slot:body-cell-status="props">
                      <q-td :props="props">
                        <!-- {{ props.row }} -->
                        <div
                          v-if="props.row.status === 'Present'"
                          class="status present"
                        >
                          <img
                            style="width: 8px; height: 8px"
                            src="../assets/dotsuccess.svg"
                            alt=""
                            class="q-mr-sm"
                          />{{ props.row.status }}
                        </div>
                        <div
                          v-if="props.row.status === 'Absent'"
                          class="status absent"
                        >
                          <img
                            class="q-mr-sm"
                            style="width: 8px; height: 8px"
                            src="../assets/dotabsent.svg"
                            alt=""
                          />{{ props.row.status }}
                        </div>
                      </q-td>
                      <q-td v-if="admin" :props="props">
                        <!-- {{ props.row }} -->
                        <div class="text2 grey">
                          180 of 200 students present
                        </div>
                      </q-td>
                    </template>
                    <template v-if="admin" v-slot:body-cell-actions="props">
                      <q-td :props="props">
                        <div class="table_btn">
                          <q-btn
                            round
                            dense
                            flat
                            size="md"
                            :loading="loaders.save[props]"
                          >
                            <img
                              style="width: 24px; height: 24px"
                              src="../assets/view.svg"
                              alt=""
                            />
                            View
                            <q-tooltip> {{ props.row.name }}</q-tooltip>
                          </q-btn>
                          <q-btn
                            round
                            dense
                            flat
                            size="md"
                            :loading="loaders.save[props]"
                          >
                            <img
                              style="width: 24px; height: 24px"
                              src="../assets/plus.svg"
                              alt=""
                            />
                            Add
                            <q-tooltip> {{ props.row.name }}</q-tooltip>
                          </q-btn>
                        </div>
                      </q-td>
                    </template>

                    <template v-slot:no-data="{ message }">
                      <div
                        class="full-width row flex-center text-negative q-gutter-sm"
                      >
                        <span> {{ message }} </span>
                      </div>
                    </template>
                  </q-table>
                </div>
              </div>
            </div>
          </div>
          <div class="right_side">
            <div class="div">
              <div class="text2 grey">QR Code</div>
              <q-btn @click="scanQr = true" class="offer minimize" flat no-caps>
                <img
                  style="width: 16px; height: 16px"
                  src="../assets/qr.svg"
                  alt=""
                />Scan QR code
              </q-btn>
            </div>

            <q-separator />
            <div class="div">
              <div class="text2 grey">Location</div>
              <div class="tag_desc">Software Lab 1</div>
            </div>
            <q-separator />
            <div class="div">
              <div class="text2 grey">Schedule</div>
              <div class="tag_desc">Tuesdays by 14:00 to 16:00</div>
              <div class="tag_desc">Wednesdays by 15:00 to 16:00</div>
            </div>

            <q-separator />

            <div class="div">
              <div v-for="n in 4" :key="n" class="div_">
                <div class="img">
                  <img
                    style="width: 56px; height: 56px; border-radius: 100%"
                    src="../assets/avatar.svg"
                    alt=""
                  />
                  <img
                    style="width: 18px; height: 18px; border-radius: 100%"
                    class="verify"
                    src="../assets/verify.svg"
                    alt=""
                  />
                </div>
                <div class="details">
                  <div class="text4">Jenny Wilson</div>

                  <div class="text2 grey comments">olivia@untitledui.com</div>
                </div>
              </div>
            </div>

            <q-separator />

            <div class="div">
              <div class="text2 grey">Course URL</div>
              <div class="copy">
                <div class="copy_">attendie.com/csc504</div>
                <q-btn no-wrap class="offer minimize" flat no-caps>
                  <img
                    style="width: 16px; height: 16px"
                    src="../assets/copy.svg"
                    alt=""
                  />Copy
                </q-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <q-dialog class="dialog" v-model="scanQr">
      <div class="auth">
        <q-card class="billing">
          <div class="row q-mb-md justify-center">
            <div class="checkcircle">
              <img src="../assets/message.svg" alt="" />
            </div>
          </div>

          <div class="text-center q-mb-lg">
            <div class="text3 q-mb-lg">Please check your email.</div>
            <div class="text2 text-center grey scanQr">
              Sorry you need to be on your phone to scan the QR code for this
              class. <br />
              We've sent a link to your account’s email: olivia@untitledui.com
            </div>
          </div>

          <div
            style="gap: 0.5rem"
            class="total no-wrap row justify-center q-mt-md items-center"
          >
            <q-btn
              @click="scanQr = false"
              class="apply bg-primary"
              no-caps
              flat
            >
              OK
            </q-btn>
          </div>

          <q-btn class="close" @click="scanQr = false" flat no-caps>
            <img src="../assets/circle.svg" alt="" />
          </q-btn>
        </q-card>
      </div>
    </q-dialog>
    <q-dialog class="dialog" v-model="Attendeeslist">
      <q-card class="q-pa-sm list_card">
        <div class="auth">
          <div class="row q-pb-sm justify-between items-center">
            <div class="text5">Attendees list</div>

            <q-btn @click="Attendeeslist = false" flat no-caps>
              <img src="../assets/circle.svg" alt="" />
            </q-btn>
          </div>
          <div class="row q-pa-sm items-center justify-between">
            <div class="">
              Record for class that occured on
              <span class="text5">Tuesday, Jan 25 2022</span>
              between
              <div class="text5">14:00 to 16:00</div>
            </div>
            <div>
              <q-btn
                style="width: fit-content"
                class="offer minimize"
                flat
                no-caps
              >
                <img
                  style="width: 16px; height: 16px"
                  src="../assets/downloa.svg"
                  alt=""
                />Export
              </q-btn>
            </div>
          </div>
          <div class="row row q-pa-sm btns items-center justify-center">
            <div class="">
              <div class="three_btns">
                <q-btn style="padding: 5px" flat no-wrap no-caps>
                  View all
                </q-btn>
                <q-btn style="padding: 5px" flat no-caps no-wrap>
                  Attended
                </q-btn>
                <q-btn style="padding: 5px" flat no-wrap no-caps>
                  Missed
                </q-btn>
              </div>
            </div>

            <div>
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
          <div class="">
            <q-table
              :rows="rows"
              :hide-header="mode === 'grid'"
              :columns="columns"
              row-key="investor"
              :filter="filter"
              class="sort_tables"
              :loading="loading"
              v-model:pagination="pagination"
              @request="onRequest"
            >
              <template v-slot:body-cell-date="props">
                <q-td class="text2 grey" :props="props">
                  <div style="gap: 1rem" class="row items-center">
                    <div>
                      {{ props.row.date }}
                    </div>
                  </div>
                </q-td>
              </template>
              <template v-slot:body-cell-time="props">
                <q-td class="text2 grey" :props="props">
                  <div style="gap: 1rem" class="row items-center">
                    <div>
                      {{ props.row.date }}
                    </div>
                  </div>
                </q-td>
              </template>
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <!-- {{ props.row }} -->
                  <div
                    v-if="props.row.status === 'Present'"
                    class="status present"
                  >
                    <img
                      style="width: 8px; height: 8px"
                      src="../assets/dotsuccess.svg"
                      alt=""
                      class="q-mr-sm"
                    />{{ props.row.status }}
                  </div>
                  <div
                    v-if="props.row.status === 'Absent'"
                    class="status absent"
                  >
                    <img
                      class="q-mr-sm"
                      style="width: 8px; height: 8px"
                      src="../assets/dotabsent.svg"
                      alt=""
                    />{{ props.row.status }}
                  </div>
                </q-td>
              </template>

              <template v-slot:no-data="{ message }">
                <div
                  class="full-width row flex-center text-negative q-gutter-sm"
                >
                  <span> {{ message }} </span>
                </div>
              </template>
            </q-table>
          </div>
        </div>
      </q-card>
    </q-dialog>
    <q-dialog class="dialog" v-model="addClass">
      <q-card class="q-pa-sm list_card">
        <div class="auth">
          <div class="row q-pb-sm justify-between items-center">
            <div class="text5">Attendees list</div>

            <q-btn @click="addClass = false" flat no-caps>
              <img src="../assets/circle.svg" alt="" />
            </q-btn>
          </div>
          <div class="text2">
            Create a row for a fixed class occurring outside the regular
            schedule
          </div>
          <div class="q-gutter-md q-mt-sm time_date row no-wrap items-center">
            <q-date v-model="model" mask="YYYY-MM-DD HH:mm" color="primary" />
            <q-time v-model="model" mask="YYYY-MM-DD HH:mm" color="primary" />
          </div>
          <div class="grid three">
            <div class="input">
              <label for=""> Day of the week </label>

              <div class="input_wrap">
                <select v-model="data.department" name="">
                  <option value="1">Sunday</option>
                </select>
              </div>
            </div>
            <div class="input">
              <label for=""> Day of the week </label>
              <div class="copy">
                <div class="copy_">09 : 30 AM</div>
                <q-btn no-wrap class="offer minimize" flat no-caps>
                  <img
                    style="width: 16px; height: 16px"
                    src="../assets/clock.svg"
                    alt=""
                  />
                </q-btn>
              </div>
            </div>
            <div class="input">
              <label for=""> Day of the week </label>
              <div class="copy">
                <div class="copy_">09 : 30 AM</div>
                <q-btn no-wrap class="offer minimize" flat no-caps>
                  <img
                    style="width: 16px; height: 16px"
                    src="../assets/clock.svg"
                    alt=""
                  />
                </q-btn>
              </div>
            </div>
          </div>

          <div
            style="gap: 0.5rem"
            class="total no-wrap row justify-end q-mt-lg items-center"
          >
            <q-btn style="width: 100%" class="apply bg-primary" no-caps flat>
              Save
            </q-btn>
          </div>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog class="dialog" v-model="getQr">
      <q-card class="q-pa-sm list_card">
        <div class="auth">
          <div class="row q-pb-sm justify-between items-center">
            <div class="text5">QR code generator</div>

            <q-btn @click="getQr = false" flat no-caps>
              <img src="../assets/circle.svg" alt="" />
            </q-btn>
          </div>

          <div class="row q-pa-sm items-center justify-between">
            <div class="">
              Record for class that occured on
              <span class="text5">Tuesday, Jan 25 2022</span>
              between
              <div class="text5">14:00 to 16:00</div>
            </div>
          </div>
          <div class="or q-my-lg">Or</div>
          <div class="q-gutter-md q-mt-sm time_date row no-wrap items-center">
            <q-date v-model="model" mask="YYYY-MM-DD HH:mm" color="primary" />
            <q-time v-model="model" mask="YYYY-MM-DD HH:mm" color="primary" />
          </div>
          <div class="grid three">
            <div class="input">
              <label for=""> Day of the week </label>

              <div class="input_wrap">
                <select v-model="data.department" name="">
                  <option value="1">Sunday</option>
                </select>
              </div>
            </div>
            <div class="input">
              <label for=""> Day of the week </label>
              <div class="copy">
                <div class="copy_">09 : 30 AM</div>
                <q-btn no-wrap class="offer minimize" flat no-caps>
                  <img
                    style="width: 16px; height: 16px"
                    src="../assets/clock.svg"
                    alt=""
                  />
                </q-btn>
              </div>
            </div>
            <div class="input">
              <label for=""> Day of the week </label>
              <div class="copy">
                <div class="copy_">09 : 30 AM</div>
                <q-btn no-wrap class="offer minimize" flat no-caps>
                  <img
                    style="width: 16px; height: 16px"
                    src="../assets/clock.svg"
                    alt=""
                  />
                </q-btn>
              </div>
            </div>
          </div>

          <div
            style="gap: 0.5rem"
            class="total no-wrap row justify-end q-mt-lg items-center"
          >
            <q-btn style="width: 100%" class="apply bg-primary" no-caps flat>
              Next
            </q-btn>
          </div>
        </div>
      </q-card>
    </q-dialog>
    <q-dialog class="dialog" v-model="downloadQR">
      <q-card class="q-pa-sm downloadqr list_card">
        <div class="auth">
          <div class="row q-mb-md justify-start">
            <div class="checkcircle">
              <img src="../assets/qrgreen.svg" alt="" />
            </div>
          </div>
          <div class="text5">QR code for today’s class</div>
          <div class="text2 grey">
            To authorise transactions, please scan this QR code with your Google
            Authenticator App and enter the verification code below.
          </div>
          <q-btn @click="getQr = false" class="close" flat no-caps>
            <img src="../assets/circle.svg" alt="" />
          </q-btn>

          <div class="qr text-white">
            <img src="../assets/qrcode.svg" alt="" />
          </div>

          <div
            style="gap: 0.5rem"
            class="total no-wrap row justify-end q-mt-lg items-center"
          >
            <q-btn style="width: 100%" class="apply bg-primary" no-caps flat>
              <img
                src="../assets/downwhite.svg"
                style="width: 20px; height: 20px"
                alt=""
                class="q-mr-sm"
              />
              Download
            </q-btn>
          </div>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog class="dialog" v-model="selectStudent">
      <q-card style="max-width: 600px" class="q-pa-sm list_card">
        <div class="auth">
          <div class="row q-pb-sm justify-between items-center">
            <div class="text5">Add attendee</div>

            <q-btn @click="selectStudent = false" flat no-caps>
              <img src="../assets/circle.svg" alt="" />
            </q-btn>
          </div>

          <q-separator />
          <div class="input">
            <div class="text2 grey q-mt-md">Student name(s)</div>

            <div class="q-mt-sm">
              <q-select
                filled
                v-model="multiple"
                multiple
                :options="options"
                label="Select students"
                ><template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-select>
            </div>
          </div>
          <div
            style="gap: 0.5rem"
            class="total no-wrap row justify-end q-mt-lg items-center"
          >
            <q-btn style="width: 100%" class="apply bg-primary" no-caps flat>
              Add
            </q-btn>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
let scanQr = ref(false);
let Attendeeslist = ref(false);
let admin = ref(false);
let addClass = ref(false);
let getQr = ref(false);
let downloadQR = ref(false);
let selectStudent = ref(true);
let data = ref({});
let model = ref("");
let multiple = ref([]);
let search = ref("");
let options = [
  {
    label: "Google",
    value: 1,
  },
  {
    label: "Facebook",
    value: 2,
  },
  {
    label: "Twitter",
    value: 3,
  },
  {
    label: "Apple",
    value: 4,
  },
  {
    label: "Oracle",
    value: 5,
  },
];
const columns = [
  {
    name: "date",
    required: true,
    label: "Date",
    align: "left",
    field: "date",
    // field: (row, index) => console.log(row, index),
    sortable: true,
  },

  {
    name: "time",
    required: true,
    label: "Time",
    align: "left",
    field: "time",
    sortable: true,
  },
  {
    name: "status",
    required: true,
    label: "Presence",
    align: "left",
    field: "status",
    sortable: true,
  },

  {
    name: "actions",
    required: true,
    label: "",
    align: "left",
    field: "actions",
    sortable: false,
  },
];

let pagination = ref({
  sortBy: "id",
  descending: false,
  page: 1,
  rowsPerPage: 10,
});
let filter = ref("");
let curl = ref("");
let separator = ref("");
let mode = ref("list");
let loaders = ref({
  delete: false,
  category: false,
  deleteBtn: [],
  save: [],
});
let rows = ref([
  {
    date: "22 Jan 2022",
    status: "Present",
    time: "29:46",
  },
  {
    date: "22 Jan 2022",
    status: "Absent",
    time: "29:46",
  },
  {
    date: "22 Jan 2022",
    status: "Absent",
    time: "29:46",
  },
  {
    date: "22 Jan 2022",
    status: "Absent",
    time: "29:46",
  },
  {
    date: "22 Jan 2022",
    status: "Absent",
    time: "29:46",
  },
  {
    date: "22 Jan 2022",
    status: "Absent",
    time: "29:46",
  },
  {
    date: "22 Jan 2022",
    status: "Absent",
    time: "29:46",
  },
  {
    date: "22 Jan 2022",
    status: "Absent",
    time: "29:46",
  },
  {
    date: "22 Jan 2022",
    status: "Absent",
    time: "29:46",
  },
  {
    date: "22 Jan 2022",
    status: "Absent",
    time: "29:46",
  },
  {
    date: "22 Jan 2022",
    status: "Absent",
    time: "29:46",
  },
]);
let selected = ref([]);
let loading = ref(false);
const onRequest = (props) => {
  loading.value = true;
  const url = ``;
  curl.value = url;
  api
    .get(url)
    .then(({ data }) => {
      // console.log(data);
      loading.value = false;
    })
    .catch(({ response }) => {
      // console.log(response);
      loading.value = false;
      // rows.value = [];
    });
};
</script>

<style lang="scss" scoped>
.hero {
  background: url("/frame.png") no-repeat;
  background-size: cover;
  height: 40vh;
  background-position: center;
  position: relative;
}

.hero .card {
  position: absolute;
  bottom: -50%;
  left: 50%;
  transform: translate(-50%, -20%);
}
.right_side .text2.grey {
  margin-bottom: 0.5rem;
}

.right_side .offer {
  margin: 0;
}

.table_area {
  border-radius: 8px;
  background: #fff;
}

.qr {
  border-radius: 8px;
  background: #f9fafb;
  padding: 16px 0px;
  display: flex;
  justify-content: center;
}

.qr img {
  width: 128px;
  height: 128px;
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
    min-width: 512px;
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
.status {
  text-align: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px; /* 150% */
}
.status.present {
  color: #027a48;

  background: #eaecf0;
  padding: 2px 8px 2px 6px;
  width: fit-content;
  border-radius: 16px;
}
.status.absent {
  border-radius: 16px;
  background: #fef3f2;
  padding: 2px 8px 2px 6px;
  width: fit-content;
  color: #b42318;
}

@media (min-width: 1000px) {
  .list_card {
    min-width: 600px;
  }
}
@media (max-width: 1050px) {
  .hero .card {
    bottom: -70%;
  }
}
@media (max-width: 1000px) {
  .hero .card {
    bottom: -40%;
  }
}
@media (max-width: 950px) {
  .hero .card {
    bottom: -30%;
  }
}
@media (max-width: 600px) {
  .hero .card {
    bottom: -45%;
  }
}
@media (max-width: 400px) {
  .hero .card {
    bottom: -50%;
  }
}
</style>
