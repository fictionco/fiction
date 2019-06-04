module.exports.default = Factor => {
  return new (class {
    constructor() {
      if (Factor.FACTOR_TARGET == "server") {
        this.addLessVars()
      } else {
        this.addWorkPostType()
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
    addWorkPostType() {
      const base = "work"
      const type = "work"
      Factor.$filters.add("post-types", _ => {
        _.push({
          type,
          base,
          icon: require("./img/work.svg"),
          nameIndex: "Work",
          nameSingle: "Work Post",
          namePlural: "Work Posts"
        })

        return _
      })
    }

    async addPaths() {
      Factor.$filters.add("page-templates", _ => {
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
            description: "Landing page template",
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
          },
          {
            name: "About",
            value: "about",
            component: () => import("./page-template-about")
          },
          {
            name: "Work",
            value: "work",
            component: () => import("./page-template-work")
          },
          {
            name: "Blog",
            value: "blog",
            component: () => import("./page-template-blog")
          },
          {
            name: "Contact",
            value: "contact",
            component: () => import("./page-template-contact")
          }
        ])
      })

      const base = "work"

      Factor.$filters.add("content-routes", _ => {
        const routes = [
          {
            path: "/",
            component: () => import("./page-home"),
            meta: { nav: true }
          },
          {
            path: "/work",
            component: () => import("./page-template-work"),
            children: [
              {
                path: "/",
                component: () => import("./el/work-index.vue")
              },
              {
                path: `/${base}`,
                component: () => import(`./el/work-single.vue`)
              },
              {
                path: `/${base}/:permalink`,
                component: () => import(`./el/work-single.vue`)
              }
            ]
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

    //
    //     return _.concat(contentRoutes)
    //   })
    // }
  })()
}
