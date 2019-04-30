export default Factor => {
  return new class {
    constructor() {
      Factor.$filters.addFilter("content-routes", _ => {
        const routes = [
          {
            path: "/ray",
            component: () => import(`#/page-template`),
            meta: { nav: true }
          }
        ]
        return _.concat(routes)
      })
    }
  }()
}
