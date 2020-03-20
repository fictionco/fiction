import "./extend/endpoint"
import { setting, addContentRoutes } from "@factor/api"
import { addPageTemplate } from "@factor/templates"
import { Component } from "vue"

addPageTemplate({
  name: "Factor Basic",
  slug: "factor-basic",
  component: (): Promise<Component> => import("./page-template-default.vue")
})

addContentRoutes({
  key: "docsRoutes",
  routes: () => {
    const base = setting("docs.base")

    return [
      {
        path: "/compare",
        component: (): Promise<Component> => import("./page-compare.vue")
      },
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
        path: `/${base}`,
        component: (): Promise<Component> => import("./page-docs.vue")
      },
      {
        path: `/${base}/:doc`,
        component: (): Promise<Component> => import("./page-docs.vue")
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
            path: `/theme/:slug`,
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
            path: `/plugin/:slug`,
            component: (): Promise<Component> => import("./extend/single.vue")
          }
        ]
      }
    ]
  }
})
