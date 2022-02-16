import { AppRoute } from "@factor/api"

export const routes = [
  new AppRoute({
    key: "docs",
    path: "/docs",
    component: (): any => import("./components/PageWrap.vue"),
  }),
  new AppRoute({
    key: "docsIndex",
    path: "/docs",
    parent: "docs",
    component: (): any => import("./components/PageIndex.vue"),
  }),
  new AppRoute({
    key: "docsSingle",
    path: `/docs/:slug`,
    parent: "docs",
    component: (): any => import("./components/PageSingle.vue"),
  }),
]
