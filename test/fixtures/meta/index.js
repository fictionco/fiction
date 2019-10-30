import { pushToFilter } from "@factor/tools"

pushToFilter("content-routes", {
  path: "/basic",
  component: () => import("./v-basic.vue")
})

pushToFilter("content-routes", {
  path: "/mutation",
  component: () => import("./v-mutation.vue")
})

pushToFilter("content-routes", {
  path: "/async",
  component: () => import("./v-async.vue")
})
