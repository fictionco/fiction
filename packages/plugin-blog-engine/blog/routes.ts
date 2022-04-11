import { blogSetting } from "../helpers"

const baseRoute = blogSetting("baseRoute")

export const routes = [
  {
    path: `/${baseRoute}`,
    component: (): any => import("./components/PageWrap.vue"),
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
