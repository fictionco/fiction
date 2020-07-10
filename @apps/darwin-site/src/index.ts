import { addRoutes } from "@factor/api"

addRoutes({
  key: "darwinApp",
  routes: [
    {
      path: "/",
      component: (): Promise<any> => import("./home/v-home.vue"),
      meta: {},
    },
  ],
})
