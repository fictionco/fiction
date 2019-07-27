module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.addPaths()
      if (Factor.FACTOR_TARGET == "app") {
        this.addComponents()
      }
    }

    // addComponents() {
    //   Factor.$filters.add("components", _ => {
    //     _["el-btn"] = () => import("./el/btn.vue")
    //     return _
    //   })
    // }

    addComponents() {
      Factor.$filters.add("components", _ => {
        _["app-btn"] = () => import("./el/btn")
        _["app-link"] = () => import("./el/link")
        return _
      })
    }

    async addPaths() {
      Factor.$filters.add("page-templates", _ => {
        return _.concat([

          {
            name: "Sticky Sidebar",
            value: "tpl-sticky-sidebar",
            component: () => import("./tpl-sticky-sidebar")
          },
          {
            name: "Landing Page",
            value: "tpl-landing-page",
            component: () => import("./tpl-landing-page"),
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

      Factor.$filters.add("content-routes", _ => {
        const routes = [
          {
            path: "/",
            component: () => import("./view-home/page-home"),
            meta: { nav: true }
          },
          {
            path: "/vip",
            component: () => import("./view-vip/page-vip"),
            meta: { nav: true, background: "#fff" }
          },
          {
            path: "/factor-js",
            component: () => import("./view-tour/page-tour"),
            meta: { nav: true }
          },
          {
            path: "/how-it-works",
            component: () => import("./page-how-it-works"),
            meta: { background: "#f7f9ff" }
          },
          {
            path: "/about",
            component: () => import("./view-about/page-about")
          },
          {
            path: "/contact",
            component: () => import("./page-contact"),
            meta: { background: "#fafbff" }
          },
          {
            path: "/chat",
            component: () => import("./page-chat"),
            meta: { background: "#f7f9ff", auth: true }
          },
          {
            path: "/hosting",
            component: () => import("./page-hosting")
          },
          {
            path: "/staying",
            component: () => import("./page-staying")
          },
          {
            path: "/careers",
            component: () => import("./page-careers")
          },
          {
            path: "/network",
            component: () => import("./page-network")
          }
        ]

        return _.concat(routes)
      })
    }
  })()
}
