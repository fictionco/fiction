import { addContentRoutes } from "@factor/api"
import { addPageTemplate } from "@factor/templates"
import { Component } from "vue"
import "./extend"

addPageTemplate({
  name: "Factor Basic",
  slug: "factor-basic",
  component: (): Promise<Component> => import("./page-template-default.vue")
})

addContentRoutes({
  key: "docsRoutes",
  routes: () => {
    return [
      {
        path: "/",
        component: (): Promise<Component> => import("./home/v-home.vue")
      },
      {
        path: "/install",
        component: (): Promise<Component> => import("./home/v-install.vue"),
        meta: { auth: true }
      },
      {
        path: `/themes`,
        component: (): Promise<Component> => import("./extend/wrap.vue"),
        children: [
          {
            path: `/`,
            component: (): Promise<Component> => import("./extend/index.vue")
          },
          {
            path: `/theme/:permalink`,
            component: (): Promise<Component> => import("./extend/single.vue")
          }
        ]
      },
      {
        path: `/plugins`,
        component: (): Promise<Component> => import("./extend/wrap.vue"),
        children: [
          {
            path: `/`,
            component: (): Promise<Component> => import("./extend/index.vue")
          },
          {
            path: `/plugin/:permalink`,
            component: (): Promise<Component> => import("./extend/single.vue")
          }
        ]
      }
    ]
  }
})
