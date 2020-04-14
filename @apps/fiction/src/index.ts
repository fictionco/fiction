import { addContentRoutes } from "@factor/api"
import { addPageTemplate } from "@factor/templates"

addPageTemplate({
  slug: "sticky-sidebar",
  component: (): Promise<any> => import("./tpl-sticky-sidebar.vue"),
})

addPageTemplate({
  name: "Landing Page Name",
  slug: "landing-page",
  component: (): Promise<any> => import("./tpl-landing-page.vue"),
})

addContentRoutes({
  key: "fictionRoutes",
  routes: () => {
    const routes = [
      {
        path: "/",
        component: (): Promise<any> => import("./v-home/v-home.vue"),
      },
      {
        path: "/factor-js",
        component: (): Promise<any> => import("./v-tour/page-tour.vue"),
        meta: { nav: true },
      },
      {
        path: "/vip",
        component: (): Promise<any> => import("./v-vip-2/v-vip.vue"),
      },
      {
        path: "/contact",
        component: (): Promise<any> => import("./page-contact.vue"),
        meta: { background: "#fafbff" },
      },
      {
        path: "/chat",
        component: (): Promise<any> => import("./page-chat.vue"),
        meta: { background: "#f7f9ff", auth: true },
      },
    ]

    return routes
  },
})
