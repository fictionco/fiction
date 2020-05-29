import { addRoutes } from "@factor/api"
import { addPageTemplate } from "@factor/templates"

import "./extend"

addPageTemplate({
  slug: "example",
  component: (): Promise<any> => import("./page-template-default.vue"),
})

addRoutes({
  key: "factorAppRoutes",
  routes: () => {
    return [
      {
        path: "/",
        component: (): Promise<any> => import("./home/v-home.vue"),
      },
      {
        path: "/install",
        component: (): Promise<any> => import("./home/v-install.vue"),
        meta: { auth: true, allowBots: true },
      },
      {
        path: "/plans",
        component: (): Promise<any> => import("./plans/v-plans.vue"),
      },
      {
        path: "/pro",
        component: (): Promise<any> => import("./pro/v-pro.vue"),
      },
      {
        path: "/contact",
        component: (): Promise<any> => import("./v-contact.vue"),
      },
      {
        path: "/vip",
        component: (): Promise<any> => import("./vip/v-vip.vue"),
      },
      {
        path: `/themes`,
        component: (): Promise<any> => import("./extend/wrap.vue"),
        children: [
          {
            path: `/`,
            component: (): Promise<any> => import("./extend/index.vue"),
          },
          {
            path: `/theme/:permalink`,
            component: (): Promise<any> => import("./extend/single.vue"),
            meta: { auth: true, allowBots: true },
          },
        ],
      },
      {
        path: `/plugins`,
        component: (): Promise<any> => import("./extend/wrap.vue"),
        children: [
          {
            path: `/`,
            component: (): Promise<any> => import("./extend/index.vue"),
          },
          {
            path: `/plugin/:permalink`,
            component: (): Promise<any> => import("./extend/single.vue"),
            meta: { auth: true, allowBots: true },
          },
        ],
      },
    ]
  },
})
