import { addFilter, setting } from "@factor/tools"

addFilter(
  "factor_head",
  _ => {
    return [..._, setting("headTags.font")]
  },
  { priority: 200 }
)

const portfolioBaseRoute = setting("portfolio.postRoute")

addFilter("post-types", _ => {
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

//const newsBaseRoute = setting("news.postRoute")

addFilter("post-types", _ => {
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

addFilter("page-templates", _ => {
  return _.concat([
    {
      name: "Default",
      value: "default",
      component: () => import("./page-template-default.vue")
    }
  ])
})

addFilter("content-routes", _ => {
  const routes = [
    {
      path: "/",
      component: () => import("./page-home.vue")
    },
    {
      path: setting("portfolio.indexRoute"),
      component: setting("portfolio.components.portfolioWrap"),
      children: [
        {
          path: "/#portfolio",
          component: setting("portfolio.components.portfolioIndex")
        },
        {
          path: `${setting("portfolio.postRoute")}/:permalink`,
          component: setting("portfolio.components.portfolioSingle")
        }
      ]
    },
    {
      path: setting("news.indexRoute"),
      component: setting("news.components.newsWrap"),
      children: [
        {
          path: "/#news",
          component: setting("news.components.newsIndex")
        },
        {
          path: `${setting("news.postRoute")}/:permalink`,
          component: setting("news.components.newsSingle")
        }
      ]
    }
  ]

  return _.concat(routes)
})
