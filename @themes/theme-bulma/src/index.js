export default Factor => {
  return new (class {
    constructor() {
      this.filters()
    }

    filters() {
      // PAGE TEMPLATES

      Factor.$filters.add("page-templates", _ => {
        return _.concat([
          {
            name: "Default",
            value: "default",
            component: () => import("./page-template-default")
          }
        ])
      })

      // CONTENT ROUTES

      Factor.$filters.add("content-routes", _ => {
        const routes = [
          {
            path: "/",
            component: () => import("./page-home"),
            meta: { nav: true }
          },
          {
            path: "/elements",
            component: () => import("./page-elements"),
            meta: { nav: true }
          }
        ]

        return _.concat(routes)
      })
    }
  })()
}
