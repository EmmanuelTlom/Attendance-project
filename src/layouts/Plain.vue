<template>
  <q-layout view="hHh Lpr fFf">
    <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header class="header">
      <div class="row items-center no-wrap justify-between">
        <div style="gap: 2rem; flex: 2" class="row items-center no-wrap">
          <div class="logo">
            <q-btn
              :to="{
                name: `${
                  store.userdetails.role === 'lecturer'
                    ? 'lecturer-courses'
                    : 'courses'
                }`,
              }"
              class=""
              flat
              no-wrap
              no-caps
            >
              <div class="row items-center no-wrap">
                <div class="logoo_img row">
                  <img src="../assets/log.svg" alt="" />
                </div>
                <!-- <div class="tag_desc q-ml-sm">Presence</div> -->
              </div>
            </q-btn>
          </div>

          <q-item
            :to="{
              name: `${
                store.userdetails.role === 'lecturer'
                  ? 'lecturer-courses'
                  : 'courses'
              }`,
            }"
            class="tag_desc no"
            flat
            style="min-height: auto; padding: 0"
            no-caps
            no-wrap
          >
            All Courses
          </q-item>
          <q-item
            style="min-height: auto; padding: 0"
            :to="{ name: 'mycourses', params: { slug: 'name' } }"
            class="tag_desc no"
            flat
            no-caps
            no-wrap
          >
            Your Courses
          </q-item>
        </div>

        <div style="gap: 0.1rem" class="profile_img row no-wrap items-center">
          <div class="tag_desc no q-ml-sm">
            {{ store.userdetails.firstName }}
            {{ store.userdetails.lastName }}
          </div>
          <q-btn style="min-height: auto" flat no-caps>
            <img
              style="width: 40px; height: 40px; border-radius: 200px"
              v-if="store.userdetails.avatar"
              :src="store.userdetails.avatar"
              alt=""
            />
            <img
              v-else
              style="width: 40px; height: 40px; border-radius: 200px"
              src="../assets/usersvg.svg"
              alt=""
            />

            <q-menu>
              <div class="q-py-sm">
                <q-item :to="{ name: 'info' }">
                  <!-- <img
                    style="width: 20px; height: 20px"
                    src="../assets/logout.svg"
                    alt=""
                    class="q-mr-sm"
                  /> -->
                  <i class="fa-regular q-mr-sm fa-user"></i>
                  Profile settings
                </q-item>

                <q-separator class="" />
                <q-item :to="{ name: 'logout' }">
                  <img
                    style="width: 20px; height: 20px"
                    src="../assets/logout.svg"
                    alt=""
                    class="q-mr-sm"
                  />
                  Logout
                </q-item>
              </div>
            </q-menu>
          </q-btn>

          <q-btn
            flat
            @click="toggleLeftDrawer"
            round
            dense
            style="min-height: auto"
            class="menu text-dark"
            icon="menu"
          />
        </div>
      </div>
    </q-header>

    <!-- (Optional) The Footer -->

    <!-- (Optional) A Drawer; you can add one more with side="right" or change this one's side -->
    <q-drawer
      :width="300"
      v-model="leftDrawerOpen"
      side="left"
      bordered
      class="bg-white"
    >
      <!-- QScrollArea is optional -->
      <q-scroll-area class="fit">
        <!-- Content here -->
        <div
          style="gap: 2rem; flex: 2"
          class="row justify-between q-pt-md q-pb-sm items-center no-wrap"
        >
          <div class="logo">
            <q-btn
              :to="{
                name: `${
                  store.userdetails.role === 'lecturer'
                    ? 'lecturer-courses'
                    : 'courses'
                }`,
              }"
              class=""
              flat
              no-wrap
              no-caps
            >
              <div class="row items-center no-wrap">
                <div class="logo_img row">
                  <img src="../assets/logoo.svg" alt="" />
                </div>
                <!-- <div class="tag_desc q-ml-sm">Presence</div> -->
              </div>
            </q-btn>
          </div>

          <q-btn @click="toggleLeftDrawer" flat no-caps no-wrap>
            <img
              style="width: 20px; height: 20px"
              src="../assets/x.svg"
              alt=""
            />
          </q-btn>
        </div>
        <q-separator class="q-mb-md" />
        <q-list class="q-mt-lg list_items">
          <q-item
            clickable
            :to="{
              name: 'courses',
            }"
            class="q-mb-sm"
            v-ripple
          >
            <q-item-section style="min-width: auto; padding-right: 10px" avatar>
              <!-- <img
                style="width: 24px; height: 24px"
                src="../assets/bookmark.svg"
                alt=""
              /> -->
              <BookAddSvgVue style="width: 24px; height: 24px" />
            </q-item-section>
            <q-item-section class="tag_desc"> All courses </q-item-section>
          </q-item>
          <q-item
            clickable
            :to="{
              name: 'mycourses',
              params: {
                slug: 'name',
              },
            }"
            v-ripple
          >
            <q-item-section style="min-width: auto; padding-right: 10px" avatar>
              <!-- <img
                style="width: 24px; height: 24px"
                src="../assets/bookmarkadd.svg"
                alt=""
              /> -->
              <BookSvgVue style="width: 24px; height: 24px" />
            </q-item-section>
            <q-item-section class="tag_desc"> Your courses </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { useMyAuthStore } from "src/stores/auth";
import BookAddSvgVue from "src/components/BookAddSvg.vue";
import BookSvgVue from "src/components/BookSvg.vue";
let store = useMyAuthStore();
export default {
  // name: 'LayoutName',

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      store,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },

  components: {
    BookAddSvgVue,
    BookSvgVue,
  },
};
</script>

<style scoped>
.menu {
  display: none;
}

.q-item {
  white-space: nowrap;
  min-height: auto;
  align-items: center;
  transition: all 0.5s ease-in-out;
}
/* .q-item:hover,
.q-item:hover {
  padding: 5px;
} */

@media (max-width: 800px) {
  .q-item.tag_desc {
    display: none;
  }
  .menu {
    display: block;
  }
}
</style>
