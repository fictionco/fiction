import { addPostType, addContentRoute, slugify } from "@factor/api"
import { setting } from "@factor/api/settings"
import { FactorPost } from "@factor/post/types"

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
}

setup()
