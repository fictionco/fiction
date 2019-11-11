import { pushToFilter } from "@factor/tools"


console.log("ADD TO FILTER")
pushToFilter("content-routes", {
  path: "/basic",
  component: () => import("./v-basic.vue")
})

pushToFilter("content-routes", {
  path: "/mutation",
  component: () => import("./v-mutation.vue")
})

pushToFilter("content-routes", {
  path: "/store-data",
  component: () => import("./v-store-data.vue")
})
