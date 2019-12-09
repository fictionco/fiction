import { addContentRoute } from "@factor/tools"

addContentRoute({
  path: "/",
  component: () => import("./test-route.vue")
})
