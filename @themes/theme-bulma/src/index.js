import { addFilter } from "@factor/tools"
// PAGE TEMPLATES

addFilter("page-templates", _ => {
  return _.concat([
    {
      name: "Default",
      value: "default",
      component: () => import("./page-template-default.vue")
    }
  ])
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
