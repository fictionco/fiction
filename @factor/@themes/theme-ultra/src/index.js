module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.addPaths()
      this.addComponents()
      if (Factor.FACTOR_TARGET == "app") {
        this.filters()
      }
    }

    // addSettings() {
    //   Factor.$filters.add("settings", _ => {
    //     return [..._, require("./factor-settings")(Factor)]
    //   })
    // }

    addComponents() {
      Factor.$filters.add("components", _ => {
        _["app-btn"] = () => import("./el/btn")
        _["factor-link"] = () => import("./el/link")
        return _
      })
    }

    filters() {
      Factor.$filters.add(
        "factor_head",
        _ => {
          const add = Factor.$setting.get("headTags.font")

          return [..._, add]
        },
        { priority: 200 }
      )

      const portfolioBaseRoute = Factor.$setting.get("portfolio.postRoute")

      Factor.$filters.add("post-types", _ => {
        _.push({
          postType: "portfolio",
          portfolioBaseRoute,
          icon: require("./img/work.svg"),
          model: "portfolioPost",
          nameIndex: "Portfolio",
          nameSingle: "Portfolio Post",
          namePlural: "Portfolio Posts"
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

      Factor.$filters.add("content-routes", _ => {
        const routes = [
          {
            path: "/",
            component: () => import("./page-home"),
            meta: { nav: true }
          },
          {
            path: Factor.$setting.get("portfolio.indexRoute"),
            component: Factor.$setting.get("portfolio.components.portfolioWrap"),
            children: [
              {
                path: "/",
                component: Factor.$setting.get("portfolio.components.portfolioIndex")
              },
              {
                path: `${Factor.$setting.get("portfolio.postRoute")}/:permalink`,
                component: Factor.$setting.get("portfolio.components.portfolioSingle")
              }
            ]
          }
        ]

        return _.concat(routes)
      })
    }
  })()
}
