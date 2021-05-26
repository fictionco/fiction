import { addRoutes, addFilter } from "@factor/api"
import { addPageTemplate } from "@factor/templates"

import "./extend"

addFilter({
  key: "addDarwin",
  hook: "factor_head",
  callback: (_: []) => {
    return [..._, `<!-- Darwin Conversion Optimization --><script src="https://s.darwin.to/si60806e1b47791440e0898b80.js"></script>`]
  },
  priority: 200,
})

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
      },

      {
        path: "/developers",
        component: (): Promise<any> => import("./develop/v-develop.vue"),
      },
      {
        path: "/contact",
        component: (): Promise<any> => import("./v-contact.vue"),
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
            //    meta: { auth: true, allowBots: true },
          },
        ],
      },
    ]
  },
})
