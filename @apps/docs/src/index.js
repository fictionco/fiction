module.exports.default = Factor => {
  return new (class {
    constructor() {
      Factor.$filters.add("content-routes", _ => {
        const routes = [
          {
            path: "/plugins",
            component: () => import("./page-plugins")
          },
          {
            path: "/themes",
            component: () => import("./page-themes")
          },
          {
            path: "/compare",
            component: () => import("./page-compare"),
            meta: { routeClass: ["nav-bg-gray"] }
          },
          {
            path: "/home",
            component: () => import("./home/v-home")
          }
        ]

        return _.concat(routes)
      })
    }
  })()
}
