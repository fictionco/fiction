import { addContentRoute } from "@factor/api"

addContentRoute({
  path: "/",
  component: () => import("./test-route.vue")
})
