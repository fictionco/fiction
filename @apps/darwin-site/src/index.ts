import { addRoutes } from "@factor/api"

addRoutes({
  key: "darwinApp",
  routes: [
    {
      path: "/",
      component: (): Promise<any> => import("./home.vue"),
      meta: {},
    },
  ],
})
