module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.addPaths()
      if (Factor.FACTOR_TARGET == "app") {
        this.addComponents()
      }
    }

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
            _id: "sticky-sidebar",
            component: () => import("./tpl-sticky-sidebar")
          },
          {
            _id: "landing-page",
            component: () => import("./tpl-landing-page")
          }
        ])
      })

      Factor.$filters.add("content-routes", _ => {
        const routes = [
          {
            path: "/",
            component: () => import("./home/v-home")
          },
          {
            path: "/factor-js",
            component: () => import("./view-tour/page-tour"),
            meta: { nav: true }
          },
          {
            path: "/vip",
            component: () => import("./view-vip/page-vip"),
            meta: { nav: true, routeClass: ["nav-light"], background: "#fff" }
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
          }
          // {
          //   path: "/home",
          //   component: () => import("./view-home-2/v-home")
          // }

          // {
          //   path: "/how-it-works",
          //   component: () => import("./page-how-it-works"),
          //   meta: { background: "#f7f9ff" }
          // },
          // {
          //   path: "/hosting",
          //   component: () => import("./page-hosting")
          // },
          // {
          //   path: "/staying",
          //   component: () => import("./page-staying")
          // },
          // {
          //   path: "/network",
          //   component: () => import("./page-network")
          // }
        ]

        return _.concat(routes)
      })
    }
  })()
}
