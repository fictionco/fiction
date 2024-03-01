import { AppRoute } from "@factor/api"

export const routes = [
  new AppRoute({
    name: "docs",
    path: "/docs",
    component: (): any => import("./components/PageWrap.vue"),
  }),
  new AppRoute({
    name: "docsIndex",
    path: "/docs",
    parent: "docs",
    component: (): any => import("./components/PageIndex.vue"),
  }),
  new AppRoute({
    name: "docsSingle",
    path: `/docs/:slug`,
    parent: "docs",
    component: (): any => import("./components/PageSingle.vue"),
  }),
]
