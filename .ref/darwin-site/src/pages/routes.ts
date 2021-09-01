export const routes = [
  {
    path: "/pagelines",
    component: (): Promise<any> => import("./pagelines/Page.vue"),
  },
]
