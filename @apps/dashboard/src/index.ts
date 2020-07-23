import { addRoutes, onEvent, navigateToRoute } from "@factor/api"

addRoutes({
  key: "darwinApp",
  routes: [
    {
      name: "register",
      path: "/register",
      component: (): Promise<any> => import("./signin/v-signin.vue"),
    },
    {
      name: "login",
      path: "/login",
      component: (): Promise<any> => import("./signin/v-signin.vue"),
    },
    {
      name: "onboard",
      path: "/onboard",
      component: (): Promise<any> => import("./onboard/v-onboard.vue"),
      meta: { auth: true },
    },
    {
      path: "/",
      component: (): Promise<any> => import("./el/dash.vue"),
      children: [
        {
          path: "/replay",
          component: (): Promise<any> => import("./app/v-replay.vue"),
        },
        {
          path: "/optimize",
          component: (): Promise<any> => import("./app/v-optimize.vue"),
        },
        {
          path: "/heatmap",
          component: (): Promise<any> => import("./app/v-heatmap.vue"),
        },
        {
          path: "/settings",
          component: (): Promise<any> => import("./app/v-settings.vue"),
        },

        {
          path: "/",
          component: (): Promise<any> => import("./app/v-performance.vue"),
        },
      ],
      meta: { auth: true },
    },
  ],
})

onEvent("signin-form", (query: Record<string, string>) => {
  navigateToRoute({ path: "/register", query })
})
