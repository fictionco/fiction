import { addRoutes, setLocale } from "@factor/api"

setLocale("es")

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
    {
      path: "/blog",
      component: (): Promise<any> => import("./blog/blog-index.vue"),
    },
    {
      path: "/entry/:permalink",
      component: (): Promise<any> => import("./blog/blog-single.vue"),
    },
  ],
})
