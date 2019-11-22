import { addFilter } from "@factor/tools"
import { addPageTemplate } from "@factor/templates"

addPageTemplate({
  _id: "default",
  component: () => import("./page-template-default.vue")
})

// CONTENT ROUTES

addFilter("content-routes", _ => {
  const routes = [
    {
      path: "/",
      component: () => import("./page-home.vue"),
      meta: { nav: true }
    },
    {
      path: "/elements",
      component: () => import("./page-elements.vue"),
      meta: { nav: true }
    }
  ]

  return _.concat(routes)
})
