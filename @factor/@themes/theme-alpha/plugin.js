module.exports.default = Factor => {
  return new class {
    constructor() {
      if (Factor.FACTOR_ENV == "build") {
        this.addLessVars()
      } else {
        this.addPaths()
        this.addComponents()
      }
    }

    addLessVars() {
      const { resolve } = require("path")
      Factor.$filters.add("prepended-style-var-files", _ => {
        _.push(resolve(__dirname, "css/style-vars.less"))
        return _
      })
    }

    addComponents() {
      Factor.$filters.add("components", _ => {
        _["el-logo"] = () => import("./el/logo")

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
          },
          // {
          //   name: "With Nav",
          //   description: "Scans the page and creates a dynamic table of contents.",
          //   value: "page-template-sidebar",
          //   component: () => import("./page-template-sidebar")
          // },
          {
            name: "Landing Page",
            description: "Fancy landing page template",
            value: "page-template-landing",
            component: () => import("./page-template-landing"),
            options: [
              {
                type: "text",
                label: "Heading",
                description: "some desc"
              },
              {
                type: "multi",
                label: "Feature Boxes",
                description: "Some feature boxes",
                fields: [
                  {
                    type: "text",
                    label: "Heading"
                  },
                  {
                    type: "image",
                    label: "Icon"
                  }
                ]
              }
            ]
          }
        ])
      })

      Factor.$filters.addFilter("content-routes", _ => {
        const routes = [
          {
            path: "/",
            component: () => import("./page-home"),
            meta: { nav: true }
          }
        ]

        return _.concat(routes)
      })
    }

    // constructor() {
    //   Factor.$filters.add("content-routes", _ => {
    //     const contentRoutes = [
    //       {
    //         path: "/",
    //         component: () => import("./page-home"),
    //         meta: { nav: true }
    //       }
    //     ]

    //     console.log("ROP", _.concat(contentRoutes))
    //     return _.concat(contentRoutes)
    //   })
    // }
  }()
}
