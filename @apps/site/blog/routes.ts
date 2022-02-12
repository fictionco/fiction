export const routes = [
  {
    path: "/blog",
    component: (): any => import("./components/PageWrap.vue"),
    children: [
      {
        path: "/blog",
        component: (): any => import("./components/PageIndex.vue"),
      },
      {
        path: `/blog/:slug`,
        component: (): any => import("./components/PageSingle.vue"),
      },
    ],
  },
]
