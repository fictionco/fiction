import { setting } from "@factor/api/settings"
import { addFilter } from "@factor/api/hooks"
import { addPageTemplate } from "@factor/templates"
import { addPostType } from "@factor/api/post-types"
import { addContentRoutes } from "@factor/api"
import { Component } from "vue"

if (setting("headTags") != "") {
  addFilter({
    key: "addUltraFont",
    hook: "factor_head",
    callback: (_: []) => {
      return [..._, setting("headTags.font")]
    },
    priority: 200
  })
}

const portfolioBaseRoute = setting("portfolio.postRoute")

//const newsBaseRoute = setting("news.postRoute")


export const setup = (): void => {

  addPostType({
    postType: "portfolio",
    baseRoute: portfolioBaseRoute,
    icon: require("./img/portfolio.svg"),
    model: "portfolioPost",
    nameIndex: "Portfolio",
    nameSingle: "Portfolio Post",
    namePlural: "Portfolio"
  })

  // addPostType({
  //   postType: "news",
  //   baseRoute: newsBaseRoute,
  //   icon: require("./img/news.svg"),
  //   model: "newsPost",
  //   nameIndex: "News",
  //   nameSingle: "News Post",
  //   namePlural: "News"
  // })

  addPageTemplate({
    slug: "ultra-default",
    component: () => import("./page-template-default.vue")
  })

  addContentRoutes({
    key: "ultraRoutes",
    routes: [
      {
        path: "/",
        component: (): Promise<Component> => import("./page-home.vue")
      },
      {
        path: setting("portfolio.indexRoute") ?? "/",
        component: setting("portfolio.components.portfolioWrap"),
        children: [
          {
            path: "#portfolio",
            component: setting("portfolio.components.portfolioIndex")
          },
          {
            path: `${portfolioBaseRoute}/:permalink`,
            component: setting("portfolio.components.portfolioSingle")
          }
        ]
      }
      // {
      //   path: setting("news.indexRoute") ?? "/",
      //   component: setting("news.components.newsWrap"),
      //   children: [
      //     {
      //       path: "#news",
      //       component: setting("news.components.newsIndex")
      //     },
      //     {
      //       path: `${setting("news.postRoute")}/:permalink`,
      //       component: setting("news.components.newsSingle")
      //     }
      //   ]
      // }
    ]
  })
}

setup()
