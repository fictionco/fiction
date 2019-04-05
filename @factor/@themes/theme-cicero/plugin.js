export default Factor => {
  return new class {
    constructor() {
      Factor.$filters.addFilter("content-routes", _ => {
        const routes = [
          {
            path: "/h",
            component: () => import("./home"),
            meta: { nav: true }
          }
        ]
        return _.concat(routes)
      })
    }
  }()
}
