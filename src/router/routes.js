const routes = [
  {
    path: "/",
    component: () => import("pages/auth/LoginPage.vue"),
    name: "login",
  },
  {
    path: "/",
    component: () => import("pages/auth/LoginPage.vue"),
    name: "logout",
  },
  {
    path: "/register",
    component: () => import("pages/auth/RegisterPage.vue"),
    name: "register",
  },

  {
    path: "/account",
    component: () => import("layouts/Plain.vue"),
    children: [
      {
        path: "/courses",
        component: () => import("pages/CoursesPage.vue"),
        name: "courses",
      },
      {
        path: "/courses/:slug",
        component: () => import("pages/MyCourse.vue"),
        name: "mycourses",
      },
      {
        path: "/course-detail/:slug",
        component: () => import("pages/CourseDetail.vue"),
        name: "course-detail",
      },
      {
        path: "/info",
        component: () => import("pages/InfoPage.vue"),
        name: "info",
      },
      {
        path: "/lecturer-courses",
        component: () => import("pages/lecturer/LecCourses.vue"),
        name: "lecturer-courses",
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
  // {
  //   path: "/login",
  //   component: () => import("pages/auth/LoginPage.vue"),
  //   name: "login",
  // },
];

export default routes;
