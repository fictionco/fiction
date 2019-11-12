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
      component: () => import("./page-home.vue"),
      meta: { nav: true }
    }
  ]

  return _.concat(routes)
})
