import { addContentRoutes } from "@factor/api"
import { addPageTemplate } from "@factor/templates"

import { Component } from "vue"

addPageTemplate({
  slug: "sticky-sidebar",
  component: (): Promise<Component> => import("./tpl-sticky-sidebar.vue")
})

addPageTemplate({
  slug: "landing-page",
  component: (): Promise<Component> => import("./tpl-landing-page.vue")
})

addContentRoutes({
  key: "fictionRoutes",
  routes: () => {
    const routes = [
      {
        path: "/",
        component: (): Promise<Component> => import("./v-home/v-home.vue")
      },
      {
        path: "/factor-js",
        component: (): Promise<Component> => import("./v-tour/page-tour.vue"),
        meta: { nav: true }
      },
      {
        path: "/vip",
        component: (): Promise<Component> => import("./v-vip-2/v-vip.vue")
      },
      {
        path: "/contact",
        component: (): Promise<Component> => import("./page-contact.vue"),
        meta: { background: "#fafbff" }
      },
      {
        path: "/chat",
        component: (): Promise<Component> => import("./page-chat.vue"),
        meta: { background: "#f7f9ff", auth: true }
      }
    ]

    return routes
  }
})
