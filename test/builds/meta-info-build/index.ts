import { addContentRoute } from "@factor/api"

addContentRoute({
  path: "/basic",
  component: () => import("./v-basic.vue"),
})

addContentRoute({
  path: "/mutation",
  component: () => import("./v-mutation.vue"),
})

addContentRoute({
  path: "/async",
  component: () => import("./v-async.vue"),
})
