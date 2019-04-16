export default Factor => {
  return new class {
    constructor() {
      Factor.$filters.add("content-routes", _ => {
        const contentRoutes = [
          {
            path: "/",
            component: () => import("./page-home"),
            meta: { nav: true }
          }
        ]

        console.log("ROP", _.concat(contentRoutes))
        return _.concat(contentRoutes)
      })
    }
  }()
}
