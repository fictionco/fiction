export const routes = [
  {
    path: "/docs",
    component: (): any => import("./components/Wrap.vue"),
    children: [
      {
        path: "/docs",
        component: (): any => import("./components/PageIndex.vue"),
      },
      {
        path: `/docs/:slug`,
        component: (): any => import("./components/PageSingle.vue"),
      },
    ],
  },
]
