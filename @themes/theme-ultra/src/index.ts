import { addFilter, setting, addContentRoutes, addPostType } from "@factor/api"
import { addPageTemplate } from "@factor/templates"

const baseRoute = setting("portfolio.postRoute")

if (setting("headTags") != "") {
  addFilter({
    key: "addUltraFont",
    hook: "factor_head",
    callback: (_: []) => {
      return [..._, setting("headTags.font")]
    },
    priority: 200,
  })
}

addPageTemplate({
  slug: "ultra-default",
  component: () => import("./page-template-default.vue"),
})

// CUSTOM POST TYPE
addPostType({
  postType: "portfolio",
  baseRoute,
  icon: require("./img/dashicon-portfolio.svg"),
  nameIndex: "Portfolio",
  nameSingle: "Portfolio Post",
  namePlural: "Portfolio Posts",
  customPermalink: true,
  managePosts: true,
})

// CONTENT ROUTES
addContentRoutes({
  key: "ultraRoutes",
  routes: [
    {
      path: "/",
      component: (): Promise<any> => import("./page-home.vue"),
    },
    {
      path: setting("portfolio.indexRoute") ?? "/",
      component: setting("portfolio.components.portfolioWrap"),
      children: [
        {
          path: "/",
          component: setting("portfolio.components.portfolioIndex"),
        },
        {
          path: `${setting("portfolio.postRoute")}/:permalink`,
          component: setting("portfolio.components.portfolioSingle"),
        },
      ],
    },
  ],
})
