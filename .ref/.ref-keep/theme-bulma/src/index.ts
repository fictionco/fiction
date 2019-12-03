import { addContentRoutes } from "@factor/tools"
import { addPageTemplate } from "@factor/templates"
import Vue from "vue"
addPageTemplate({
  _id: "default",
  component: () => import("./page-template-default.vue")
})

addContentRoutes([
  {
    path: "/",
    component: (): Promise<Vue> => import("./page-home.vue"),
    meta: { nav: true }
  },
  {
    path: "/elements",
    component: (): Promise<Vue> => import("./page-elements.vue"),
    meta: { nav: true }
  }
])
