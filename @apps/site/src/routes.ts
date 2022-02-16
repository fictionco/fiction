import { AppRoute } from "@factor/api"

import { routes as docsRoutes } from "../docs/routes"
import { routes as blogRoutes } from "../blog/routes"
export const routes = [
  new AppRoute({
    key: "home",
    name: "Home",
    path: "/",
    component: (): Promise<any> => import("./el/ViewHome.vue"),
  }),
  new AppRoute({
    key: "plugins",
    name: "Plugins",
    path: "/plugins",
    component: (): Promise<any> => import("./plugins/PageIndex.vue"),
  }),
  new AppRoute({
    key: "showcase",
    name: "Showcase",
    path: "/showcase",
    component: (): Promise<any> => import("./showcase/PageIndex.vue"),
  }),
  new AppRoute({
    key: "showcaseSingle",
    name: "Showcase Item",
    path: "/showcase/:slug",
    component: (): Promise<any> => import("./showcase/PageSingle.vue"),
  }),
  new AppRoute({
    key: "install",
    name: "Install",
    path: "/install",
    component: (): Promise<any> => import("./el/ViewInstall.vue"),
  }),
  ...blogRoutes,
  ...docsRoutes,
]
