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
            meta: { pageClass: ["nav-bg-gray"] }
          }
        ]

        return _.concat(routes)
      })
    }
  })()
}
