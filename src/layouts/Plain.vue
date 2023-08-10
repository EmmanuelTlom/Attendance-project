<template>
  <q-layout view="hHh Lpr fFf">
    <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header class="header">
      <div class="row container items-center justify-between">
        <div style="gap: 2rem; flex: 2" class="row items-center no-wrap">
          <div class="logo">
            <q-btn class="" flat no-wrap no-caps>
              <div class="row items-center no-wrap">
                <div class="logo_img">
                  <img src="../assets/dot.svg" alt="" />
                </div>
                <div class="tag_desc q-ml-sm">
                  {{ store.userdetails.firstName }}
                  {{ store.userdetails.lastName }}
                </div>
              </div>
            </q-btn>
          </div>

          <q-btn
            :to="{ name: 'courses' }"
            class="tag_desc"
            flat
            no-caps
            no-wrap
          >
            All Courses
          </q-btn>
          <q-btn
            :to="{ name: 'mycourses', params: { slug: 'name' } }"
            class="tag_desc"
            flat
            no-caps
            no-wrap
          >
            Your Courses
          </q-btn>
        </div>

        <div style="gap: 0.1rem" class="profile_img row items-center">
          <q-btn :to="{ name: 'info' }" style="min-height: auto" flat no-caps>
            <img
              style="width: 40px; height: 40px; border-radius: 200px"
              src="../assets/avatar.svg"
              alt=""
            />
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
      :width="200"
      v-model="leftDrawerOpen"
      side="left"
      bordered
      class="bg-grey-2"
    >
      <!-- QScrollArea is optional -->
      <q-scroll-area class="fit q-pa-sm">
        <!-- Content here -->
        <q-list>
          <q-item
            clickable
            :to="{
              name: 'courses',
            }"
            v-ripple
          >
            <q-item-section avatar>
              <q-icon name="fa-solid fa-book" />
            </q-item-section>
            <q-item-section> Courses </q-item-section>
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
            <q-item-section avatar>
              <q-icon name="fa-solid fa-book-open" />
            </q-item-section>
            <q-item-section> My Courses </q-item-section>
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
};
</script>

<style scoped>
.menu {
  display: none;
}

@media (max-width: 800px) {
  .q-btn.tag_desc {
    display: none;
  }
  .menu {
    display: block;
  }
}
</style>
