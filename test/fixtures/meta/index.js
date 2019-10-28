import { pushToFilter } from "@factor/tools"
export default Factor => {
  return new (class {
    constructor() {
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

      // pushToFilter("content-routes", {
      //   path: "/store-data",
      //   component: () => import("./v-store-data.vue")
      // })
    }
  })()
}
