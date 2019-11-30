import { addFilter } from "@factor/tools"
import { addPageTemplate } from "@factor/templates"

addPageTemplate({
  _id: "sticky-sidebar",
  component: () => import("./tpl-sticky-sidebar.vue")
})

addPageTemplate({
  _id: "landing-page",
  component: () => import("./tpl-landing-page.vue")
})

addFilter("content-routes", (_) => {
  const routes = [
    {
      path: "/",
      component: () => import("./v-home/v-home.vue")
    },
    {
      path: "/factor-js",
      component: () => import("./v-tour/page-tour.vue"),
      meta: { nav: true }
    },
    {
      path: "/vip",
      component: () => import("./v-vip-2/v-vip.vue")
    },
    {
      path: "/contact",
      component: () => import("./page-contact.vue"),
      meta: { background: "#fafbff" }
    },
    {
      path: "/chat",
      component: () => import("./page-chat.vue"),
      meta: { background: "#f7f9ff", auth: true }
    }
  ]

  return _.concat(routes)
})
