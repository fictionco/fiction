module.exports.default = Factor => {
  return new (class {
    constructor() {
      if (Factor.FACTOR_TARGET == "server") {
        this.addLessVars()
      } else {
        this.addWorkPostType()
        this.addPaths()
        this.addComponents()
        this.addSettings()
      }
    }

    addLessVars() {
      const { resolve } = require("path")
      Factor.$filters.add("prepended-style-var-files", _ => {
        _.push(resolve(__dirname, "css/style-vars.less"))
        return _
      })
    }

    addSettings() {
      Factor.$filters.add("settings", _ => {
        return [..._, require("./settings")(Factor)]
      })
    }

    addComponents() {
      Factor.$filters.add("components", _ => {
        _["app-btn"] = () => import("./el/btn")
        _["app-link"] = () => import("./el/link")
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
          }
        ])
      })

      const baseWork = "work"

      Factor.$filters.add("content-routes", _ => {
        const routes = [
          {
            path: "/",
            component: () => import("./page-home"),
            meta: { nav: true }
          },
          {
            path: "/about",
            component: () => import("./page-about"),
            meta: { nav: true }
          },
          {
            path: "/work",
            component: () => import("./page-work"),
            children: [
              {
                path: "/",
                component: () => import("./el/work-index.vue")
              },
              {
                path: `/${baseWork}/:permalink`,
                component: () => import(`./el/work-single.vue`)
              }
            ]
          },
          {
            path: "/blog",
            component: () => import("./page-template-blog"),
            meta: { nav: true }
          },
          {
            path: "/contact",
            component: () => import("./page-contact"),
            meta: { nav: true }
          }
        ]

        return _.concat(routes)
      })
    }

    // async addPathsOLD() {
    //   Factor.$filters.add("page-templates", _ => {
    //     return _.concat([
    //       {
    //         name: "Default",
    //         value: "default",
    //         component: () => import("./page-template-default")
    //       },
    //       {
    //         name: "Landing Page",
    //         description: "Landing page template",
    //         value: "page-template-landing",
    //         component: () => import("./page-template-landing"),
    //         options: [
    //           {
    //             type: "text",
    //             label: "Heading",
    //             description: "some desc"
    //           },
    //           {
    //             type: "multi",
    //             label: "Feature Boxes",
    //             description: "Some feature boxes",
    //             fields: [
    //               {
    //                 type: "text",
    //                 label: "Heading"
    //               },
    //               {
    //                 type: "image",
    //                 label: "Icon"
    //               }
    //             ]
    //           }
    //         ]
    //       },
    //       // {
    //       //   name: "About",
    //       //   value: "about",
    //       //   component: () => import("./page-about")
    //       // },
    //       {
    //         name: "Work",
    //         value: "work",
    //         component: () => import("./page-template-work")
    //       },
    //       {
    //         name: "Blog",
    //         value: "blog",
    //         component: () => import("./page-template-blog")
    //       },
    //       {
    //         name: "Contact",
    //         value: "contact",
    //         component: () => import("./page-contact")
    //       }
    //     ])
    //   })

    //   const base = "work"

    //   Factor.$filters.add("content-routes", _ => {
    //     const routes = [
    //       {
    //         path: "/",
    //         component: () => import("./page-home"),
    //         meta: { nav: true }
    //       },
    //       {
    //         path: "/about",
    //         component: () => import("./page-about"),
    //         meta: { nav: true }
    //       }
    //     ]

    //     return _.concat(routes)
    //   })
    // }
  })()
}
