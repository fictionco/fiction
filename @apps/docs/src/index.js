module.exports.default = Factor => {
  return new (class {
    constructor() {
      Factor.$filters.add("content-routes", _ => {
        return [
          ..._,
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
            component: () => import("./page-compare")
          },
          {
            path: "/",
            component: () => import("./home/v-home")
          }
        ]
      })
    }
  })()
}
