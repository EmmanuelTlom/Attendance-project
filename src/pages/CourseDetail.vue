<template>
  <q-layout class="layout">
    <div v-if="spin" class="spinner">
      <q-spinner color="primary" size="3em" />
    </div>
    <div v-if="!spin" class="">
      <div class="hero">
        <div class="card text-center">
          <div class="top">
            <div class="all_main">{{ course.courseCode }}</div>
          </div>

          <div class="q-pa-sm">
            <div class="title maindesc">
              {{ course.title }}
            </div>
            <q-btn
              :loading="loadingAdd"
              @click="
                store.userdetails.role === 'lecturer'
                  ? updateLecturerCourse()
                  : updateStudentCourse()
              "
              no-wrap
              :class="
                courseIsAdded ? 'offer minimize active' : 'offer minimize'
              "
              flat
              style="width: fit-content"
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
              {{ courseIsAdded ? "Added" : "Add" }} to courses you
              {{ store.userdetails.role === "lecturer" ? "teach" : "offer" }}
            </q-btn>
            <!-- <q-separator v-if="store.userdetails.role === 'lecturer'" /> -->
            <div
              v-if="store.userdetails.role === 'lecturer'"
              style="gap: 1rem"
              class="row items-center no-wrap"
            >
              <q-btn
                :loading="loadingEdit"
                @click="handleEdit"
                no-wrap
                class="offer q-ma-none minimize edit"
                flat
                no-caps
              >
                <img
                  style="width: 16px; height: 16px"
                  src="../assets/pen.svg"
                  alt=""
                />
                Edit course
              </q-btn>
              <q-btn
                :loading="loadingDel"
                @click="deleteLecturerCourse()"
                no-wrap
                class="offer q-ma-none minimize delete"
                flat
                no-caps
              >
                <img
                  style="width: 16px; height: 16px"
                  src="../assets/del.svg"
                  alt=""
                />
                Delete course
              </q-btn>
            </div>
          </div>
        </div>
      </div>

      <div class="main_area container">
        <div class="main_wrap">
          <div class="left">
            <div class="q-my-lg">
              <div class="row items-center justify-between">
                <div class="maindesc">Title</div>
                <div></div>
                <!-- <q-btn flat style="min-height: auto" icon="more_vert"> </q-btn> -->
              </div>

              <div class="text2 grey">{{ course.title }}</div>
            </div>
            <div class="q-my-lg">
              <div class="maindesc desc">Description</div>
              <div class="text2 grey">
                {{ course.description }}
              </div>

              <!-- <div class="q-mt-md">
                <q-btn flat no-caps style="padding: 0" class="text2 read">
                  Read more
                </q-btn>
              </div> -->
            </div>

            <div class="table_area">
              <div class="row q-pa-sm items-center justify-between">
                <div>
                  <div class="row text5 items-center">
                    Attendance tracker
                    <!-- <div class="f_crumb q-ml-sm">40 / 50</div> -->
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
                    @click="exportStudentTable"
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

              <div class="row q-pa-sm btns items-center justify-center">
                <div class="">
                  <div class="three_btns">
                    <q-btn
                      flat
                      :class="dataYouSee === 'View all' ? 'active' : ''"
                      no-wrap
                      no-caps
                      @click="dataShowing('View all')"
                    >
                      View all
                    </q-btn>
                    <q-btn
                      flat
                      no-caps
                      :class="dataYouSee === 'Present' ? 'active' : ''"
                      no-wrap
                      @click="dataShowing('Present')"
                    >
                      Present
                    </q-btn>
                    <q-btn
                      :class="dataYouSee === 'Absent' ? 'active' : ''"
                      flat
                      no-wrap
                      no-caps
                      @click="dataShowing('Absent')"
                    >
                      Absent
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
                          v-model="filter"
                          placeholder="Search"
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
                    v-if="store.userdetails.role === 'lecturer'"
                    :rows="sortedAttendanceData"
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
                            {{
                              new Date(props.row.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )
                            }}
                          </div>
                        </div>
                      </q-td>
                    </template>
                    <template v-slot:body-cell-time="props">
                      <q-td class="text2 grey" :props="props">
                        <div style="gap: 1rem" class="row items-center">
                          <div>
                            {{
                              new Date(props.row.createdAt).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )
                            }}
                          </div>
                        </div>
                      </q-td>
                    </template>
                    <template v-slot:body-cell-status="props">
                      <q-td
                        v-if="store.userdetails.role !== 'lecturer'"
                        :props="props"
                      >
                        <!-- {{ props.row }} -->
                        <div v-if="props.row.present" class="status present">
                          <img
                            style="width: 8px; height: 8px"
                            src="../assets/dotsuccess.svg"
                            alt=""
                            class="q-mr-sm"
                          />Present
                        </div>
                        <div v-if="!props.row.present" class="status absent">
                          <img
                            class="q-mr-sm"
                            style="width: 8px; height: 8px"
                            src="../assets/dotabsent.svg"
                            alt=""
                          />Absent
                        </div>
                      </q-td>
                      <q-td
                        v-if="store.userdetails.role === 'lecturer'"
                        :props="props"
                      >
                        <div class="text2 grey">
                          {{ props.row.attendees.length }} students present
                        </div>
                        <!-- <div class="text2 grey">
                          180 of 200 students present
                        </div> -->
                      </q-td>
                    </template>
                    <template
                      v-if="store.userdetails.role === 'lecturer'"
                      v-slot:body-cell-actions="props"
                    >
                      <q-td class="" :props="props">
                        <div class="table_btn">
                          <q-btn
                            round
                            dense
                            flat
                            @click="viewList(props.row)"
                            class="text2 grey"
                            no-caps
                            size="md"
                            :loading="loaders.save[props]"
                          >
                            <img
                              style="width: 18px; height: 18px"
                              src="../assets/view.svg"
                              alt=""
                            />
                            View
                          </q-btn>
                          |
                          <q-btn
                            round
                            dense
                            no-caps
                            @click="addStu(props.row)"
                            flat
                            class="text2 grey q-pr-md"
                            size="sm"
                            :loading="loaders.save[props]"
                          >
                            <img
                              style="width: 18px; height: 18px"
                              src="../assets/plus.svg"
                              alt=""
                            />
                            Add
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
                    <!-- <template v-slot:bottom>
                      <q-btn
                        v-if="store.userdetails.role === 'lecturer'"
                        class="bg-white text-black addstudent"
                        flat
                        icon="add"
                        @click="selectStudent = true"
                      >
                      </q-btn>
                    </template> -->
                  </q-table>

                  <q-table
                    v-if="store.userdetails.role === 'student'"
                    :rows="sortedStudentAttendanceData"
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
                            {{
                              new Date(props.row.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )
                            }},
                          </div>
                        </div>
                      </q-td>
                    </template>
                    <template v-slot:body-cell-time="props">
                      <q-td class="text2 grey" :props="props">
                        <div style="gap: 1rem" class="row items-center">
                          <div>
                            {{
                              new Date(props.row.createdAt).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )
                            }}
                          </div>
                        </div>
                      </q-td>
                    </template>
                    <template v-slot:body-cell-status="props">
                      <q-td :props="props">
                        <!-- {{ props.row }} -->
                        <div v-if="props.row.present" class="status present">
                          <img
                            style="width: 8px; height: 8px"
                            src="../assets/dotsuccess.svg"
                            alt=""
                            class="q-mr-sm"
                          />Present
                        </div>
                        <div v-if="!props.row.present" class="status absent">
                          <img
                            class="q-mr-sm"
                            style="width: 8px; height: 8px"
                            src="../assets/dotabsent.svg"
                            alt=""
                          />Absent
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
              <q-btn
                v-if="store.userdetails.role !== 'lecturer'"
                @click="readQr = true"
                class="offer minimize"
                flat
                no-caps
              >
                <img
                  style="width: 16px; height: 16px"
                  src="../assets/qr.svg"
                  alt=""
                />Scan QR code
              </q-btn>
              <q-btn
                v-if="store.userdetails.role === 'lecturer'"
                @click="generateQr"
                class="offer minimize"
                flat
                :loading="loading"
                no-caps
              >
                <img
                  style="width: 16px; height: 16px"
                  src="../assets/qr.svg"
                  alt=""
                />Generate QR code
              </q-btn>
            </div>

            <q-separator />
            <div class="div">
              <div class="text2 grey">Location</div>
              <div class="tag_desc">{{ course.venue }}</div>
            </div>
            <q-separator />
            <div class="div">
              <div class="text2 grey">Schedule</div>
              <div v-if="course.schedules">
                <div v-if="course.schedules.length">
                  <div
                    v-for="(schedule, index) in course.schedules"
                    :key="index"
                    class="tag_desc"
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
                <div v-else class="text2">
                  This course does not have any schedules
                </div>
              </div>
              <!-- <div class="tag_desc">Wednesdays by 15:00 to 16:00</div> -->
            </div>

            <q-separator />

            <div v-if="course.lecturers" class="div">
              <div v-if="course.lecturers.length">
                <div
                  v-for="(lecturer, index) in course.lecturers"
                  :key="index"
                  class="div_"
                >
                  <div class="img">
                    <img
                      v-if="lecturer.avatar"
                      style="width: 56px; height: 56px; border-radius: 100%"
                      :src="lecturer.avatar"
                      alt=""
                    />
                    <img
                      v-else
                      style="width: 56px; height: 56px; border-radius: 100%"
                      src="../assets/usersvg.svg"
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
                    <div class="text4 small">
                      {{ lecturer.firstName }} {{ lecturer.lastName }}
                    </div>

                    <div class="text2 grey comments">{{ lecturer.email }}</div>
                  </div>
                </div>
              </div>
              <div v-else class="text2">
                This course does not have any lecturers
              </div>
            </div>

            <q-separator />

            <div class="div">
              <div class="text2 grey">Course URL</div>
              <div class="copy">
                <div class="copy_">{{ pageurl }}</div>
                <q-btn
                  @click="copy"
                  no-wrap
                  class="offer minimize"
                  flat
                  no-caps
                >
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
              <span class="text5">{{
                new Date(attendanceData.schedule.createdAt).toLocaleDateString(
                  "en-US",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )
              }}</span>
              between
              <div class="text5">
                {{
                  attendanceData.schedule.startHour < 10
                    ? `0${attendanceData.schedule.startHour}`
                    : `${attendanceData.schedule.startHour}`
                }}:{{
                  attendanceData.schedule.startMinute < 10
                    ? `0${attendanceData.schedule.startMinute}`
                    : `${attendanceData.schedule.startMinute}`
                }}
                to
                {{
                  attendanceData.schedule.endHour < 10
                    ? `0${attendanceData.schedule.endHour}`
                    : `${attendanceData.schedule.endHour}`
                }}:{{
                  attendanceData.schedule.endMinute < 10
                    ? `0${attendanceData.schedule.endMinute}`
                    : `${attendanceData.schedule.endMinute}`
                }}
              </div>
            </div>
            <div>
              <q-btn
                style="width: fit-content"
                class="offer minimize"
                flat
                @click="exportSingleTable"
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
                <q-btn
                  style="padding: 5px"
                  flat
                  :class="dataYouSee === 'View all' ? 'active' : ''"
                  no-wrap
                  no-caps
                  @click="dataShowing('View all')"
                >
                  View all
                </q-btn>
                <q-btn
                  @click="dataShowing('Present')"
                  style="padding: 5px"
                  flat
                  no-caps
                  :class="dataYouSee === 'Present' ? 'active' : ''"
                  no-wrap
                >
                  Present
                </q-btn>
                <q-btn
                  @click="dataShowing('Absent')"
                  style="padding: 5px"
                  flat
                  :class="dataYouSee === 'Absent' ? 'active' : ''"
                  no-wrap
                  no-caps
                >
                  Absent
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
                    <input v-model="filter2" placeholder="Search" type="text" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="">
            <q-table
              :rows="sortedSingleAttendanceData"
              :hide-header="mode === 'grid'"
              :columns="columnsTwo"
              row-key="investor"
              :filter="filter2"
              class="sort_tables"
              :loading="loading"
              v-model:pagination="pagination"
              @request="onRequest"
            >
              <template v-slot:body-cell-name="props">
                <q-td class="text2 grey" :props="props">
                  <div style="gap: 1rem" class="row items-center">
                    <div>
                      {{ props.row.firstName }} {{ props.row.lastName }}
                    </div>
                  </div>
                </q-td>
              </template>
              <template v-slot:body-cell-time="props">
                <q-td class="text2 grey" :props="props">
                  <div style="gap: 1rem" class="row items-center">
                    <div>
                      {{
                        new Date(props.row.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      }},
                      {{
                        new Date(props.row.createdAt).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )
                      }}
                    </div>
                  </div>
                </q-td>
              </template>
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <!-- {{ props.row }} -->
                  <div v-if="!props.row.present" class="status present">
                    <img
                      style="width: 8px; height: 8px"
                      src="../assets/dotsuccess.svg"
                      alt=""
                      class="q-mr-sm"
                    />Present
                  </div>
                  <div v-if="props.row.present" class="status absent">
                    <img
                      class="q-mr-sm"
                      style="width: 8px; height: 8px"
                      src="../assets/dotabsent.svg"
                      alt=""
                    />Absent
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
            To authorise students to mark attendance, they have to scan this QR
            code below.
          </div>
          <q-btn @click="downloadQR = false" class="close" flat no-caps>
            <img src="../assets/circle.svg" alt="" />
          </q-btn>

          <div ref="qrcode" class="qr text-white">
            <vue-qrcode
              type="image/png"
              :color="color"
              style="width: 128px; height: 128px"
              :value="barcodeId"
              @change="onDataUrlChange"
            />
            <!-- <img src="../assets/qrcode.svg" alt="" /> -->
          </div>

          <div
            style="gap: 0.5rem"
            class="total no-wrap row justify-end q-mt-lg items-center"
          >
            <q-btn
              @click="downloadLink"
              style="width: 100%"
              class="apply bg-primary"
              no-caps
              flat
            >
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
            <q-btn
              @click="addstudentToAttendance"
              style="width: 100%"
              class="apply bg-primary"
              no-caps
              :loading="loading"
              flat
            >
              Add
            </q-btn>
          </div>
        </div>
      </q-card>
    </q-dialog>
    <q-dialog v-model="editCourse">
      <q-card class="billing q-pa-md">
        <form @submit.prevent="editLecturerCourse">
          <div class="auth">
            <div class="row q-pb-sm justify-between items-center">
              <div class="text5">Create course</div>

              <q-btn @click="editCourse = false" flat no-caps>
                <img src="../assets/circle.svg" alt="" />
              </q-btn>
            </div>
            <div class="grid">
              <div class="input">
                <label for="">Course code* </label>

                <div class="input_wrap">
                  <input
                    v-model="edit.courseCode"
                    placeholder="Course code "
                    type="text"
                  />
                </div>
              </div>
              <div class="input">
                <label for=""> Course title* </label>

                <div class="input_wrap">
                  <input
                    v-model="edit.title"
                    placeholder="Course title"
                    type="text"
                  />
                </div>
              </div>
            </div>
            <div class="input">
              <label for=""> Venue* </label>

              <div class="input_wrap">
                <input v-model="edit.venue" placeholder="Venue" type="text" />
              </div>
            </div>
            <div class="input">
              <label for=""> Description </label>

              <div class="input_wrap">
                <textarea
                  v-model="edit.description"
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
                  v-model="edit.department"
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
                <select v-model="edit.level" name="" class="text2 grey">
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
                <select v-model="edit.courseType" class="text2 grey" name="">
                  <option value="" disabled selected>Select a type</option>
                  <option value="departmental">Departmental Course</option>
                  <option value="school course">School Course</option>
                </select>
              </div>
            </div>

            <div style="gap: 0.5rem" class="">
              <div class="section_sub_ text-left">Class Schedule</div>
            </div>
            <div style="gap: 0.5rem" class="row items-center no-wrap">
              <div class="text2 grey">Class times</div>
              <q-separator class="hr" />
            </div>
            <!-- {{ edit.schedules }} -->
            <div
              v-for="(schedule, index) in edit.schedules"
              :key="index"
              class="grid three"
            >
              <q-btn
                style="width: fit-content"
                class="text-red trash"
                no-caps
                flat
                v-if="edit.schedules.length > 1"
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
                      src="../assets/clock.svg"
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
                      src="../assets/clock.svg"
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
                  src="../assets/carl.svg"
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
                :loading="loadingEdit"
              >
                Save
              </q-btn>
            </div>
          </div>
        </form>
      </q-card>
    </q-dialog>
    <q-dialog v-model="readQr">
      <q-card>
        <div v-if="qua.platform.is.mobile">
          <qrcode-stream @detect="onDetect"></qrcode-stream>
          <!-- <p v-if="scannedData">Scanned Data: {{ scannedData }}</p> -->
        </div>
        <div v-else>
          <div class="row q-mb-md justify-center">
            <div class="checkcircle">
              <img src="../assets/alertc.svg" alt="" />
            </div>
          </div>
          <div class="text4 big grey text-center">
            You can’t scan on desktop
          </div>

          <div class="text2 q-my-sm grey text-center">
            Sorry you need to be on your phone to scan the QR code for this
            class. Open the link on your phone to continue.
          </div>
          <div class="div q-mt-sm">
            <div class="copy">
              <div class="copy_">{{ pageurl }}</div>
              <q-btn @click="copy" no-wrap class="offer minimize" flat no-caps>
                <img
                  style="width: 16px; height: 16px"
                  src="../assets/copy.svg"
                  alt=""
                />Copy
              </q-btn>
            </div>
          </div>

          <div
            style="gap: 0.5rem"
            class="total no-wrap row justify-end q-mt-lg items-center"
          >
            <q-btn
              style="width: 100%"
              class="apply bg-primary"
              no-caps
              flat
              @click="readQr = false"
            >
              OK
            </q-btn>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { copyToClipboard } from "quasar";
import { api } from "src/boot/axios";
import { ref, watch, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Notify, exportFile, Loading, useQuasar, Dialog } from "quasar";

const qua = useQuasar();

// console.log(qua.platform.is.desktop);
// console.log(qua.platform.is.mobile);
// console.log(qua.platform);
let route = useRoute();
let router = useRouter();

import { useMyAuthStore } from "src/stores/auth";

import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from "vue-qrcode-reader";
let store = useMyAuthStore();
import VueQrcode from "vue-qrcode";
let scanQr = ref(false);
let pageurl = ref("");
let Attendeeslist = ref(false);
let loadingEdit = ref(false);
let loadingDel = ref(false);
let attendanceData = ref(false);
let loadingAdd = ref(false);
let admin = ref(false);
let readQr = ref(false);
let addClass = ref(false);
let getQr = ref(false);
let downloadQR = ref(false);
let selectStudent = ref(false);
let editCourse = ref(false);
let spin = ref(true);
let data = ref({});
let edit = ref({
  schedules: [
    {
      day: "Monday",
      startTime: "0:00",
      endTime: "0:00",
    },
  ],

  level: "",
  courseType: "",
});
let model = ref("");
let attendanceId = ref("");
let dataYouSee = ref("View all");
let course = ref({});
let multiple = ref([]);
let search = ref("");
let barcodeId = ref("");
let dataUrl = ref("");
let color = ref({ dark: "#000000ff", light: "#ffffffff" });
let options = ref([]);
const courseIsAdded = ref(false);

const addSchedule = () => {
  const newSchedule = {
    day: "",
    startTime: "",
    endTime: "",
  };
  edit.value.schedules.push(newSchedule);
};
const removeSchedule = (index) => {
  edit.value.schedules.splice(index, 1);
};
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
const columnsTwo = [
  {
    name: "name",
    required: true,
    label: "Name",
    align: "left",
    field: "name",
    // field: (row, index) => console.log(row, index),
    sortable: true,
  },

  {
    name: "time",
    required: true,
    label: "Timestamp",
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
];

let pagination = ref({
  sortBy: "id",
  descending: false,
  page: 1,
  rowsPerPage: 10,
});
let filter = ref("");
let filter2 = ref("");
let curl = ref("");
let separator = ref("");
let mode = ref("list");
let loaders = ref({
  delete: false,
  category: false,
  deleteBtn: [],
  save: [],
});
let rows = ref([]);
let selected = ref([]);
let singleRows = ref([]);
let studentsRow = ref([]);
let loading = ref(false);
const sortedAttendanceData = computed(() => {
  if (dataYouSee.value === "View all") {
    return rows.value;
  } else if (dataYouSee.value === "Present") {
    return rows.value.filter((data) => data.attendees.length > 0);
  } else {
    return rows.value.filter((data) => data.attendees.length < 1);
  }
});
const sortedSingleAttendanceData = computed(() => {
  if (dataYouSee.value === "View all") {
    return singleRows.value;
  } else if (dataYouSee.value === "Present") {
    return singleRows.value.filter((data) => data.present !== true);
  } else {
    return singleRows.value.filter((data) => data.present === true);
  }
});
const sortedStudentAttendanceData = computed(() => {
  if (dataYouSee.value === "View all") {
    return studentsRow.value;
  } else if (dataYouSee.value === "Present") {
    return studentsRow.value.filter((data) => data.present === true);
  } else {
    return studentsRow.value.filter((data) => data.present !== true);
  }
});
const dataShowing = (data) => {
  dataYouSee.value = data;
};
// function downloadLink(name, href) {
//   const a = document.createElement("a");
//   a.download = name;
//   a.href = href;
//   document.body.append();
//   a.click();
//   a.remove();
// }
const qrcode = ref(null);
const downloadLink = () => {
  let img = document.querySelector(".qr img").src;
  // console.log(img);
  const link = document.createElement("a");
  link.href = img;
  link.download = "qrcode.png";
  link.click();
};
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

const copy = () => {
  copyToClipboard(pageurl.value)
    .then(() => {
      Notify.create({
        message: "Copied",
        color: "green",
        position: "top",
      });
    })
    .catch(() => {
      // fail
      Notify.create({
        message: "Failed",
        color: "red",
        position: "top",
      });
    });
};
const viewList = (data) => {
  // console.log(data);
  Loading.show();
  api
    .get(`attendance/single/${data._id}`)
    .then((response) => {
      console.log(response);
      attendanceData.value = response.data.data;
      singleRows.value = response.data.data.attendees;
      Attendeeslist.value = true;
      Loading.hide();
    })
    .catch(({ response }) => {
      // console.log(response);
      Loading.hide();
      Notify.create({
        message: response.data.error,
        color: "red",
        position: "bottom",
        actions: [{ icon: "close", color: "white" }],
      });
    });
};
const onDetect = (data) => {
  // console.log(data);
  Loading.show({ message: "Scanning" });

  api
    .put(`attendance/mark/${data[0].rawValue}`)
    .then((response) => {
      // console.log(response);
      Notify.create({
        message: response.data.message,
        color: "green",
        position: "top",
      });
      readQr.value = false;

      Loading.hide();
    })
    .catch(({ response }) => {
      // console.log(response);
      Loading.hide();
      Notify.create({
        message: response.data.error,
        color: "red",
        position: "bottom",
        actions: [{ icon: "close", color: "white" }],
      });
    });
};
const onDataUrlChange = (dataUrll) => {
  dataUrl.value = dataUrll;
};
const generateQr = () => {
  loading.value = true;
  api
    .post(`attendance/${course.value._id}`)
    .then((response) => {
      // console.log(response);
      loading.value = false;
      Notify.create({
        message: response.data.message,
        color: "green",
        position: "top",
      });

      downloadQR.value = true;
      barcodeId.value = response.data.data.barcodeId;
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
const getCourseagain = async () => {
  try {
    const response = await api.get(`courses/${route.params.slug}`);
    course.value = response.data.data;
    if (store.userdetails.role === "lecturer") {
      courseIsAdded.value = course.value.lecturers.some(
        (lecturers) => lecturers._id === store.userdetails._id
      );
    } else {
      courseIsAdded.value = course.value.students.some(
        (student) => student._id === store.userdetails._id
      );
    }
  } catch (error) {
    console.error(error);
  }
};
onMounted(async () => {
  try {
    pageurl.value = window.document.URL;
    const response = await api.get(`courses/${route.params.slug}`);
    course.value = response.data.data;
    if (store.userdetails.role === "lecturer") {
      courseIsAdded.value = course.value.lecturers.some(
        (lecturers) => lecturers._id === store.userdetails._id
      );
    } else {
      courseIsAdded.value = course.value.students.some(
        (student) => student._id === store.userdetails._id
      );
    }
    options.value = response.data.data.students.map((item) => ({
      label: `${item.firstName} ${item.lastName}`,
      value: item._id,
    }));
    spin.value = false;

    const attendance = await api.get(`attendance/${route.params.slug}`);
    // console.log(attendance);

    if (store.userdetails.role === "lecturer") {
      rows.value = attendance.data.data;
    } else {
      const attendancesWithPresent = attendance.data.data.map((attendance) => {
        const isPresent = attendance.attendees.includes(store.userdetails._id);

        return {
          ...attendance,
          present: isPresent,
        };
      });

      // console.log(attendancesWithPresent);

      studentsRow.value = attendancesWithPresent;
    }

    // console.log(attendancesWithPresent);
  } catch (error) {
    console.error(error);
  }
});

const handleEdit = () => {
  // console.log(course.value);
  edit.value = { ...course.value };

  edit.value.schedules.forEach((schedule) => {
    const startTime = `${schedule.startHour}:${schedule.startMinute}`;
    const endTime = `${schedule.endHour}:${schedule.endMinute}`;

    schedule.startTime = startTime;
    schedule.endTime = endTime;
  });

  // console.log(edit.value);
  edit.value = { ...course.value };
  editCourse.value = true;
};

// setEndTimeValue;

const editLecturerCourse = () => {
  loadingEdit.value = true;
  let clonedObj = JSON.parse(JSON.stringify(edit.value));
  clonedObj.schedules.forEach((obj) => {
    const [startHour, startMinute] = obj.startTime.split(":");
    const [endHour, endMinute] = obj.endTime.split(":");
    obj.startHour = startHour;
    obj.startMinute = startMinute;
    obj.endHour = endHour;
    obj.endMinute = endMinute;

    delete obj.startTime;
    delete obj.endTime;
    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;
    delete obj._id;
  }),
    api
      .put(`courses/${course.value._id}`, clonedObj)
      .then((response) => {
        // console.log(response);
        loadingEdit.value = false;
        edit.value = {
          schedules: [
            {
              day: "Monday",
              startTime: "0:00",
              endTime: "0:00",
            },
          ],
        };

        editCourse.value = false;
        Notify.create({
          message: response.data.message,
          color: "green",
          position: "top",
        });

        getCourseagain();
      })
      .catch(({ response }) => {
        // console.log(response);
        loadingEdit.value = false;

        // errors.value = response.data.errors;
        Notify.create({
          message: response.data.error,
          color: "red",
          position: "bottom",
          actions: [{ icon: "close", color: "white" }],
        });
      });
};
const deleteLecturerCourse = () => {
  Dialog.create({
    title: "Delete course",
    message: "Please confirm you want to delete this course...",
    ok: {
      push: true,
      label: "Delete",
      color: "negative",
    },
    cancel: {
      push: true,
      color: "grey",
    },
    persistent: true,
  })
    .onOk(() => {
      loadingDel.value = true;
      api
        .delete(`courses/${course.value._id}`)
        .then((response) => {
          // console.log(response);
          Notify.create({
            message: response.data.message,
            color: "green",
            position: "top",
          });
          loadingDel.value = false;
          if (store.userdetails.role === "lecturer") {
            router.replace({
              name: "lecturer-courses",
            });
          } else {
            router.replace({
              name: "courses",
            });
          }
        })
        .catch(({ response }) => {
          // console.log(response);
          loadingDel.value = false;
          Notify.create({
            message: response.data.error,
            color: "red",
            position: "bottom",
            actions: [{ icon: "close", color: "white" }],
          });
        });
    })
    .onCancel(() => {
      // console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
};
const updateStudentCourse = () => {
  loadingAdd.value = true;
  api
    .put(`courses/toggle/student/${course.value._id}`)
    .then((response) => {
      // console.log(response);
      Notify.create({
        message: response.data.message,
        color: "green",
        position: "top",
      });
      loadingAdd.value = false;
      getCourseagain();
    })
    .catch(({ response }) => {
      // console.log(response);
      loadingAdd.value = false;
      Notify.create({
        message: response.data.error,
        color: "red",
        position: "bottom",
        actions: [{ icon: "close", color: "white" }],
      });
    });
};
const addStu = (data) => {
  selectStudent.value = true;
  // console.log(data);
  attendanceId.value = data._id;
};
const addstudentToAttendance = () => {
  // console.log(multiple.value);
  if (multiple.value.length < 1) {
    Notify.create({
      message: "You have to selected any students",
    });
  } else {
    let data = multiple.value.map((object) => object.value);
    loading.value = true;

    api
      .put(`attendance/add/${attendanceId.value}`, {
        studentIds: data,
      })
      .then((response) => {
        // console.log(response);
        Notify.create({
          message: response.data.message,
          color: "green",
          position: "top",
        });
        loading.value = false;
        selectStudent.value = false;
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
  }
};
const updateLecturerCourse = () => {
  loadingAdd.value = true;
  api
    .put(`courses/toggle/lecturer/${course.value._id}`)
    .then((response) => {
      // console.log(response);
      Notify.create({
        message: response.data.message,
        color: "green",
        position: "top",
      });
      loadingAdd.value = false;
      getCourseagain();
    })
    .catch(({ response }) => {
      // console.log(response);
      loadingAdd.value = false;
      Notify.create({
        message: response.data.error,
        color: "red",
        position: "bottom",
        actions: [{ icon: "close", color: "white" }],
      });
    });
};
function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;
  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);
  formatted = formatted.split('"').join('""');
  return `"${formatted}"`;
}
const exportTable = () => {
  // naive encoding to csv format
  const content = [columns.map((col) => wrapCsvValue(col.label))]
    .concat(
      rows.value.map((row) =>
        columns
          .map((col) =>
            wrapCsvValue(
              typeof col.field === "function"
                ? col.field(row)
                : row[col.field === void 0 ? col.name : col.field],
              col.format
            )
          )
          .join(",")
      )
    )
    .join("\r\n");
  const status = exportFile(`Attendance sheet`, content, "text/csv");
  if (status !== true) {
    Notify.create({
      message: "Browser denied file download...",
      color: "negative",
      icon: "warning",
    });
  }
};
const exportSingleTable = () => {
  // naive encoding to csv format
  const content = [columnsTwo.map((col) => wrapCsvValue(col.label))]
    .concat(
      singleRows.value.map((row) =>
        columnsTwo
          .map((col) =>
            wrapCsvValue(
              typeof col.field === "function"
                ? col.field(row)
                : row[col.field === void 0 ? col.name : col.field],
              col.format
            )
          )
          .join(",")
      )
    )
    .join("\r\n");
  const status = exportFile(`Attendance sheet`, content, "text/csv");
  if (status !== true) {
    Notify.create({
      message: "Browser denied file download...",
      color: "negative",
      icon: "warning",
    });
  }
};
const exportStudentTable = () => {
  // naive encoding to csv format
  const content = [columnsTwo.map((col) => wrapCsvValue(col.label))]
    .concat(
      studentsRow.value.map((row) =>
        columns
          .map((col) =>
            wrapCsvValue(
              typeof col.field === "function"
                ? col.field(row)
                : row[col.field === void 0 ? col.name : col.field],
              col.format
            )
          )
          .join(",")
      )
    )
    .join("\r\n");
  const status = exportFile(`Attendance sheet`, content, "text/csv");
  if (status !== true) {
    Notify.create({
      message: "Browser denied file download...",
      color: "negative",
      icon: "warning",
    });
  }
};

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
  top: 65%;
  left: 50%;
  min-width: 500px;
  transform: translate(-50%, 0%);
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
@media (max-width: 1100px) {
  .hero .card {
    top: 50%;
  }
}
@media (min-width: 1000px) {
  .q-card {
    min-width: 512px;
  }
}
.addstudent {
  right: -3%;
  top: 2%;
  transform: translateY(-2%);
  position: absolute;
}
.checkcircle {
  border-radius: 28px;
  background: #f4ebff;
  border: 8px solid #fef3f2;
  background: #fee4e2;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
}
.copy .copy_ {
  width: 100%;
  padding: 0.5rem;
  width: 80%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

.section_sub {
  text-align: left;
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
    min-width: 700px;
  }
}

@media (max-width: 800px) {
  .hero .card {
    min-width: 95%;
  }
}
@media (max-width: 600px) {
  .q-card {
    width: 100%;
  }

  .hero {
    height: 30vh;
  }
  .hero .card {
    transform: translate(-50%, -5%);
  }
}
</style>
