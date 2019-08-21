module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.addPaths()
      if (Factor.FACTOR_TARGET == "app") {
        this.addWorkPostType()
        this.addPaths()
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

    addWorkPostType() {
      Factor.$filters.add("post-types", _ => {
        _.push({
          postType: "work",
          baseRoute: "work",
          icon: require("./img/work.svg"),
          model: "WorkPost",
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

      const base = "work"

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
                path: `/${base}/:permalink`,
                component: () => import(`./el/work-single.vue`)
              }
            ]
          },
          {
            path: "/blog",
            component: () => import("./page-blog"),
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
  })()
}
