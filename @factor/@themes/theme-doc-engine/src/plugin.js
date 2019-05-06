module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.addPaths()
      this.addComponents()
    }

    addComponents() {
      Factor.$filters.add("components", _ => {
        _["app-btn"] = () => import("./el/btn")
        _["app-link"] = () => import("./el/link")
        return _
      })
    }

    async addPaths() {
      Factor.$filters.addFilter("page-templates", _ => {
        return _.concat([
          {
            name: "Default",
            value: "default",
            component: () => import("./page-template-default")
          }
        ])
      })

      Factor.$filters.addFilter("content-routes", _ => {
        const base = "docs"
        const routes = [
          {
            path: "/",
            component: () => import("./page-home"),
            meta: { nav: true }
          },
          {
            path: "/docs",
            component: () => import("./page-docs"),
            meta: { footer: false }
          },
          {
            path: "/docs/:markdownurl",
            component: () => import("./page-docs"),
            meta: { footer: false }
          },
          {
            path: "/plugins",
            component: () => import("./page-plugins"),
            meta: { nav: true }
          }
        ]

        return _.concat(routes)
      })
    }
  })()
}
