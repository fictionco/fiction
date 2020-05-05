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
      plans: {
        pro: "plan_HDdUFHsAuiYJf3",
        proMonthly: "plan_HDdVV8sK4WHPq3",
        business: "plan_HDggbm822dNjDg",
        businessMonthly: "plan_HDggVQfROhqWoT",
      },
    },
    production: {
      publishableKey: "",
      plans: {
        pro: "plan_HDdUFHsAuiYJf3",
        proMonthly: "plan_HDdVV8sK4WHPq3",
        business: "plan_HDggbm822dNjDg",
        businessMonthly: "plan_HDggVQfROhqWoT",
      },
    },
  },
}
