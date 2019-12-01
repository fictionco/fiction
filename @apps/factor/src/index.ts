import "./extend/extension-server"
import { addFilter, setting } from "@factor/tools"
import { addPageTemplate } from "@factor/templates"
import Vue from "vue"
addPageTemplate({
  _id: "default",
  component: (): Promise<Vue> => import("./page-template-default.vue")
})

addFilter("content-routes", _ => {
  const base = setting("docs.base")

  return [
    ..._,
    {
      path: "/compare",
      component: (): Promise<Vue> => import("./page-compare.vue")
    },
    {
      path: "/",
      component: (): Promise<Vue> => import("./home/v-home.vue")
    },
    {
      path: `/${base}`,
      component: (): Promise<Vue> => import("./page-docs.vue")
    },
    {
      path: `/${base}/:doc`,
      component: (): Promise<Vue> => import("./page-docs.vue")
    },
    {
      path: `/themes`,
      component: (): Promise<Vue> => import("./extend/theme-wrap.vue"),
      children: [
        {
          path: `/`,
          component: (): Promise<Vue> => import("./extend/theme-index.vue")
        },
        {
          path: `/theme/view`,
          component: (): Promise<Vue> => import("./extend/theme-single.vue")
        }
      ]
    },
    {
      path: `/plugins`,
      component: (): Promise<Vue> => import("./extend/plugin-wrap.vue"),
      children: [
        {
          path: `/`,
          component: (): Promise<Vue> => import("./extend/plugin-index.vue")
        },
        {
          path: `/plugin/view`,
          component: (): Promise<Vue> => import("./extend/plugin-single.vue")
        }
      ]
    }
  ]
})
