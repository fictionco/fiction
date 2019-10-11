export default Factor => {
  return new (class {
    constructor() {
      this.filters()
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
          icon: require("./img/portfolio.svg"),
          model: "portfolioPost",
          nameIndex: "Portfolio",
          nameSingle: "Portfolio Post",
          namePlural: "Portfolio"
        })

        return _
      })

      const newsBaseRoute = Factor.$setting.get("news.postRoute")

      Factor.$filters.add("post-types", _ => {
        _.push({
          postType: "news",
          portfolioBaseRoute,
          icon: require("./img/news.svg"),
          model: "newsPost",
          nameIndex: "News",
          nameSingle: "News Post",
          namePlural: "News"
        })

        return _
      })

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
            component: () => import("./page-home")
          },
          {
            path: Factor.$setting.get("portfolio.indexRoute"),
            component: Factor.$setting.get("portfolio.components.portfolioWrap"),
            children: [
              {
                path: "/#portfolio",
                component: Factor.$setting.get("portfolio.components.portfolioIndex")
              },
              {
                path: `${Factor.$setting.get("portfolio.postRoute")}/:permalink`,
                component: Factor.$setting.get("portfolio.components.portfolioSingle")
              }
            ]
          },
          {
            path: Factor.$setting.get("news.indexRoute"),
            component: Factor.$setting.get("news.components.newsWrap"),
            children: [
              {
                path: "/#news",
                component: Factor.$setting.get("news.components.newsIndex")
              },
              {
                path: `${Factor.$setting.get("news.postRoute")}/:permalink`,
                component: Factor.$setting.get("news.components.newsSingle")
              }
            ]
          }
        ]

        return _.concat(routes)
      })
    }
  })()
}
