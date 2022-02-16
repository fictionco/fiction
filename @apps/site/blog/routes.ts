import { AppRoute } from "@factor/api"

export const routes = [
  new AppRoute({
    key: "blog",
    path: "/blog",
    component: (): any => import("./components/PageWrap.vue"),
  }),
  new AppRoute({
    key: "blogIndex",
    path: "/blog",
    parent: "blog",
    component: (): any => import("./components/PageIndex.vue"),
  }),
  new AppRoute({
    key: "blogSingle",
    path: `/blog/:slug`,
    parent: "blog",
    component: (): any => import("./components/PageSingle.vue"),
  }),
]
