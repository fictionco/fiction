import { addRoutes, setting } from "@factor/api"

/**
 * Checkout Routes
 */
addRoutes({
  location: "content",
  key: "checkoutPlugin",
  routes: [setting("checkout.routes.checkout")],
})
