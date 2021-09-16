import { blogSetting } from "@factor/plugin-blog-engine/helpers"

const baseRoute = blogSetting("baseRoute")

export const routes = [
  {
    path: `/${baseRoute}`,
    component: (): any => import("./components/Wrap.vue"),
    children: [
      {
        path: `/${baseRoute}`,
        component: (): any => import("./components/PageIndex.vue"),
      },
      {
        path: `/${baseRoute}/:slug`,
        component: (): any => import("./components/PageSingle.vue"),
      },
    ],
  },
]
