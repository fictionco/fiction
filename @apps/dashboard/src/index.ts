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
      component: (): Promise<any> => import("./signin/view.vue"),
    },
    {
      name: "login",
      path: "/login",
      component: (): Promise<any> => import("./signin/view.vue"),
    },
  ],
})

onEvent("signin-form", (query: Record<string, string>) => {
  navigateToRoute({ path: "/register", query })
})
