import { routes as docsRoutes } from "../docs/routes"
import { routes as blogRoutes } from "../blog/routes"
export const routes = [
  {
    path: "/",
    component: (): Promise<any> => import("./el/ViewHome.vue"),
  },
  {
    path: "/plugins",
    component: (): Promise<any> => import("./plugins/PageIndex.vue"),
  },
  {
    path: "/showcase",
    component: (): Promise<any> => import("./showcase/PageIndex.vue"),
  },
  {
    path: "/showcase/:slug",
    component: (): Promise<any> => import("./showcase/PageSingle.vue"),
  },
  {
    path: "/install",
    component: (): Promise<any> => import("./el/ViewInstall.vue"),
  },
  ...blogRoutes,
  ...docsRoutes,
]
