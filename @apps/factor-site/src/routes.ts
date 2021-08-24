import { routes as docsRoutes } from "../docs/routes"
export const routes = [
  {
    path: "/",
    component: (): Promise<any> => import("./el/ViewHome.vue"),
  },
  {
    path: "/showcase",
    component: (): Promise<any> => import("./el/ViewHome.vue"),
  },
  {
    path: "/install",
    component: (): Promise<any> => import("./el/ViewInstall.vue"),
  },
  {
    path: `/themes`,
    component: (): Promise<any> => import("./extend/Wrap.vue"),
    children: [
      {
        path: `/`,
        component: (): Promise<any> => import("./extend/Index.vue"),
      },
      {
        path: `/theme/:permalink`,
        component: (): Promise<any> => import("./extend/Single.vue"),
      },
    ],
  },
  {
    path: `/plugins`,
    component: (): Promise<any> => import("./extend/Wrap.vue"),
    children: [
      {
        path: `/`,
        component: (): Promise<any> => import("./extend/Index.vue"),
      },
      {
        path: `/plugin/:path`,
        component: (): Promise<any> => import("./extend/Single.vue"),
      },
    ],
  },
  ...docsRoutes,
]
