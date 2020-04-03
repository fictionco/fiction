import { addContentRoute, addCallback } from "@factor/api"
import { setting } from "@factor/api/settings"
import { getDocRoutes } from "./util"
export const postType = "docsItem"

export const setup = (): void => {
  // addPostType({
  //   postType,
  //   baseRoute: setting("docs.baseRoute"),
  //   icon: require("./img/forum.svg"),
  //   nameIndex: "Docs",
  //   nameSingle: "Docs Page",
  //   namePlural: "Docs Pages",
  //   addSitemap: true,
  //   permalink: (post: FactorPost): string => {
  //     return `${setting("docs.baseRoutePost")}/${post._id}/${slugify(post.title)}`
  //   }
  // })

  const basePath = setting("docsEngine.baseRoute") ?? "/"

  addContentRoute({
    path: basePath,
    component: setting("docsEngine.components.wrap"),
    children: [
      {
        path: basePath,
        component: setting("docsEngine.components.home")
      },
      {
        path: `${basePath}/:doc`,
        component: setting("docsEngine.components.doc")
      }
    ]
  })

  /**
   * Add docs to sitemap
   */
  addCallback({
    key: "docs",
    hook: "sitemaps",
    callback: (): { _id: string; items: { url: string }[] } => {
      const routes = getDocRoutes()

      return {
        _id: "docs",
        items: routes.map(_ => {
          return { url: _ }
        })
      }
    }
  })
}

setup()
