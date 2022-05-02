export default {
  metaInfo: {
    script: [
      {
        vmid: "stripe",
        src: "https://js.stripe.com/v3/",
      },
    ],
  },
  subscriptions: {
    routes: {
      checkout: {
        path: "/checkout",
        component: (): Promise<any> => import("./checkout.vue"),
        meta: { auth: true },
      },
    },
    publishableKey: {
      development: "",
      production: "",
    },
    products: [],
  },
}
