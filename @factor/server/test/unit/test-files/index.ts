import { pushToFilter } from "@factor/tools/filters"

pushToFilter("content-routes", {
  path: "/",
  component: () => import("./test-route.vue")
})
