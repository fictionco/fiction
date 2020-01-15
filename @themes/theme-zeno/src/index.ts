import { addFilter, setting, addContentRoutes } from "@factor/api"
import { Component } from "vue"

if (setting("headTags") != '') {
  addFilter({
    key: "addZenoFont",
    hook: "factor_head",
    callback: (_: []) => {
      return [..._, setting("headTags.font")]
    },
    priority: 200
  })
}

// CONTENT ROUTES

addContentRoutes({
  key: "zenoRoutes",
  routes: [
    {
      path: "/",
      component: (): Promise<Component> => import("./v-home.vue"),
      meta: { nav: true }
    },
    {
      path: "/about",
      component: (): Promise<Component> => import("./v-about.vue"),
      meta: { nav: true }
    },
    {
      path: "/contact",
      component: (): Promise<Component> => import("./v-contact.vue"),
      meta: { nav: true }
    },
    {
      path: "/pricing",
      component: (): Promise<Component> => import("./v-pricing.vue"),
      meta: { nav: true }
    }
  ]
})
