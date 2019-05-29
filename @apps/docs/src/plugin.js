module.exports.default = Factor => {
  return new (class {
    constructor() {
      Factor.$filters.add("content-routes", _ => {
        const base = "docs"
        const routes = [
          {
            path: "/plugins",
            component: () => import("./page-plugins")
          },
          {
            path: "/themes",
            component: () => import("./page-themes")
          }
        ]

        return _.concat(routes)
      })
    }
  })()
}
