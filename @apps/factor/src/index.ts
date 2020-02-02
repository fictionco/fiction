import "./extend/extension-server"
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
      // {
      //   path: "/new",
      //   component: (): Promise<Component> => import("./homenew/v-home.vue")
      // },
      {
        path: "/install",
        component: (): Promise<Component> => import("./home/v-install.vue")
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
        component: (): Promise<Component> => import("./extend/theme-wrap.vue"),
        children: [
          {
            path: `/`,
            component: (): Promise<Component> => import("./extend/theme-index.vue")
          },
          {
            path: `/theme/view`,
            component: (): Promise<Component> => import("./extend/theme-single.vue")
          }
        ]
      },
      {
        path: `/plugins`,
        component: (): Promise<Component> => import("./extend/plugin-wrap.vue"),
        children: [
          {
            path: `/`,
            component: (): Promise<Component> => import("./extend/plugin-index.vue")
          },
          {
            path: `/plugin/view`,
            component: (): Promise<Component> => import("./extend/plugin-single.vue")
          }
        ]
      }
    ]
  }
})
