import { addRoutes, setting } from "@factor/api"

addRoutes({
  key: "checkoutPlugin",
  routes: [setting("checkout.routes.checkout")],
})
