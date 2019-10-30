import { pushToFilter } from "@factor/tools"
pushToFilter("content-routes", {
  path: "/",
  component: () => import("./index.vue")
})
