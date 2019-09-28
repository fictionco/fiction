export default Factor => {
  return new (class {
    constructor() {
      Factor.$filters.push("content-routes", {
        path: "/basic",
        component: () => import("./basic.vue")
      })

      Factor.$filters.push("content-routes", {
        path: "/mutation",
        component: () => import("./mutation.vue")
      })
    }
  })()
}
