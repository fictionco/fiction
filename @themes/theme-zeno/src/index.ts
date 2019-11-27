import { addFilter, setting } from "@factor/tools"

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
      component: () => import("./v-home.vue"),
      meta: { nav: true }
    },
    {
      path: "/about",
      component: () => import("./v-about.vue"),
      meta: { nav: true }
    },
    {
      path: "/contact",
      component: () => import("./v-contact.vue"),
      meta: { nav: true }
    },
    {
      path: "/pricing",
      component: () => import("./v-pricing.vue"),
      meta: { nav: true }
    }
  ]

  return _.concat(routes)
})
