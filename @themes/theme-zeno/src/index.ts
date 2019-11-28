import { addFilter, setting } from "@factor/tools"
import Vue from "vue"

addFilter(
  "factor_head",
  _ => {
    return [..._, setting("headTags.font")]
  },
  { priority: 200 }
)

// CONTENT ROUTES

addFilter("content-routes", _ => {
  const routes = [
    {
      path: "/",
      component: (): Promise<Vue> => import("./v-home.vue"),
      meta: { nav: true }
    },
    {
      path: "/about",
      component: (): Promise<Vue> => import("./v-about.vue"),
      meta: { nav: true }
    },
    {
      path: "/contact",
      component: (): Promise<Vue> => import("./v-contact.vue"),
      meta: { nav: true }
    },
    {
      path: "/pricing",
      component: (): Promise<Vue> => import("./v-pricing.vue"),
      meta: { nav: true }
    }
  ]

  return _.concat(routes)
})
