export const routes = [
  {
    path: "/docs",
    component: (): any => import("./_components/PageWrap.vue"),
    children: [
      {
        path: "/docs",
        component: (): any => import("./_components/PageIndex.vue"),
      },
      {
        path: `/docs/:slug`,
        component: (): any => import("./_components/PageSingle.vue"),
      },
    ],
  },
]
