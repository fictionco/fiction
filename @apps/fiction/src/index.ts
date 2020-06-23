import { addRoutes } from "@factor/api"

addRoutes({
  key: "fictionRoutes",
  routes: () => {
    const routes = [
      {
        path: "/",
        component: (): Promise<any> => import("./home-4/v-home.vue"),
      },
      {
        path: "/contact",
        component: (): Promise<any> => import("./page-contact.vue"),
      },
    ]

    return routes
  },
})
