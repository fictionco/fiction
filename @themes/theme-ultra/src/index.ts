import { setting } from "@factor/tools/settings"
import { addFilter } from "@factor/tools/filters"
import { addPageTemplate } from "@factor/templates"
import { addPostType } from "@factor/tools/post-types"
import { addContentRoutes } from "@factor/tools"
addFilter(
  "factor_head",
  (_: string[]) => {
    return [..._, setting("headTags.font")]
  },
  { priority: 200 }
)

const portfolioBaseRoute = setting("portfolio.postRoute")

addPostType({
  postType: "portfolio",
  baseRoute: portfolioBaseRoute,
  icon: require("./img/portfolio.svg"),
  model: "portfolioPost",
  nameIndex: "Portfolio",
  nameSingle: "Portfolio Post",
  namePlural: "Portfolio"
})

addPostType({
  postType: "news",
  baseRoute: portfolioBaseRoute,
  icon: require("./img/news.svg"),
  model: "newsPost",
  nameIndex: "News",
  nameSingle: "News Post",
  namePlural: "News"
})

addPageTemplate({
  _id: "default",
  component: () => import("./page-template-default.vue")
})

addContentRoutes([
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
])
