export const routes = [
  {
    path: "/blog",
    component: (): any => import("./components/Wrap.vue"),
    children: [
      {
        path: "/blog",
        component: (): any => import("./components/PageIndex.vue"),
      },
      {
        path: `/blog/:postSlug`,
        component: (): any => import("./components/PageSingle.vue"),
      },
    ],
  },
]
