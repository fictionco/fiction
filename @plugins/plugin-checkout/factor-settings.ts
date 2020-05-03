export default {
  checkout: {
    routes: {
      checkout: {
        path: "/checkout",
        component: (): Promise<any> => import("./checkout.vue"),
        meta: { auth: true },
      },
    },
  },
}
