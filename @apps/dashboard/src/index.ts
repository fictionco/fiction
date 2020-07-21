import { addRoutes, onEvent, navigateToRoute } from "@factor/api"

addRoutes({
  key: "darwinApp",
  routes: [
    {
      path: "/",
      component: (): Promise<any> => import("./dashboard/view.vue"),
      meta: { auth: true },
    },
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
    },
  ],
})

onEvent("signin-form", (query: Record<string, string>) => {
  navigateToRoute({ path: "/register", query })
})
