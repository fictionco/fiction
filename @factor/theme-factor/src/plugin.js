export default Factor => {
  return new class {
    constructor() {
      Factor.$filters.add("content-routes", _ => {
        const contentRoutes = [
          {
            path: "/",
            component: () => import("./home"),
            meta: { nav: true }
          },
          {
            path: "/how-it-works",
            component: () => import("./page-how-it-works"),
            meta: { nav: true }
          },
          {
            path: "/plugins",
            component: () => import("./page-plugins"),
            meta: { nav: true }
          },
          {
            path: "/docs",
            component: () => import("./page-docs"),
            meta: { nav: true }
          }
        ]

        return _.concat(contentRoutes)
      })
    }
  }()
}
