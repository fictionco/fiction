export default {
  metaInfo: {
    script: [
      {
        vmid: "stripe",
        src: "https://js.stripe.com/v3/",
      },
    ],
  },
  checkout: {
    routes: {
      checkout: {
        path: "/checkout",
        component: (): Promise<any> => import("./checkout.vue"),
        meta: { auth: true },
      },
    },
    development: {
      publishableKey: "",
      plans: {},
    },
    production: {
      publishableKey: "",
      plans: {},
    },
  },
}
