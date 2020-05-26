import { addRoutes } from "@factor/api"

addRoutes({
  key: "demoRoutes",
  routes: [
    {
      path: "/",
      component: (): Promise<any> => import("./home.vue"),
    },
    {
      path: "/contact",
      component: (): Promise<any> => import("./contact.vue"),
    },
  ],
})
