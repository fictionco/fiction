export default Factor => {
  return new (class {
    constructor() {
      Factor.$filters.push("content-routes", {
        path: "/basic",
        component: () => import("./v-basic.vue")
      })

      // Factor.$filters.push("content-routes", {
      //   path: "/mutation",
      //   component: () => import("./v-mutation.vue")
      // })

      // Factor.$filters.push("content-routes", {
      //   path: "/store-data",
      //   component: () => import("./v-store-data.vue")
      // })
    }
  })()
}
