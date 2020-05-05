import { addRoutes, setting, addDashboardMenu } from "@factor/api"

/**
 * Checkout Routes
 */
addRoutes({
  location: "content",
  key: "checkoutPlugin",
  routes: [setting("checkout.routes.checkout")],
})

addDashboardMenu({
  name: "Subscription",
  path: "/subscription",
  key: "subscription",
  component: (): Promise<any> => import("./dashboard/subscription.vue"),
  children: [
    {
      name: "Payment Method",
      path: "/payment-method",
      component: (): Promise<any> => import("./dashboard/plans.vue"),
    },
    {
      name: "Invoices",
      path: "/invoices",
      component: (): Promise<any> => import("./dashboard/plans.vue"),
    },
  ],
})
