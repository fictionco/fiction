import { addContentRoute } from "@factor/api"

addContentRoute({
  path: "/",
  component: () => import("./home.vue"),
})
