module.exports.default = Factor => {
  return new (class {
    constructor() {
      if (Factor.FACTOR_ENV == "build") {
        this.addLessVars()
      } else {
        this.addPaths()
      }
    }

    addLessVars() {
      const { resolve } = require("path")
      Factor.$filters.add("prepended-style-var-files", _ => {
        _.push(resolve(__dirname, "css/style-vars.less"))
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

      const base = "work"

      Factor.$filters.addFilter("content-routes", _ => {
        const routes = [
          {
            path: "/",
            component: () => import("./page-home"),
            meta: { nav: true }
          },
          {
            path: "/docs",
            component: () => import("./page-docs"),
            meta: { nav: true }
          }
        ]

        return _.concat(routes)
      })
    }
  })()
}
