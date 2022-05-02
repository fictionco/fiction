import { AppRoute } from "@factor/api"

export const routes = [
  new AppRoute({
    name: "blog",
    path: "/blog",
    component: (): any => import("./components/PageWrap.vue"),
  }),
  new AppRoute({
    name: "blogIndex",
    path: "/blog",
    parent: "blog",
    component: (): any => import("./components/PageIndex.vue"),
  }),
  new AppRoute({
    name: "blogSingle",
    path: `/blog/:slug`,
    parent: "blog",
    component: (): any => import("./components/PageSingle.vue"),
  }),
]
