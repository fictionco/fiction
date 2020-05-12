import { addContentRoute, addCallback } from "@factor/api"
import { setting } from "@factor/api/settings"
import { getDocRoutes } from "./util"
export const postType = "docsItem"

export const setup = (): void => {
  const basePath = setting("docsEngine.baseRoute") ?? "/"

  const meta = setting("docsEngine.requireLoggedIn") ? { auth: true } : {}
  addContentRoute({
    path: basePath,
    component: setting("docsEngine.components.wrap"),
    meta,
    children: [
      {
        path: basePath,
        component: setting("docsEngine.components.home"),
      },
      {
        path: `${basePath}/:doc`,
        component: setting("docsEngine.components.doc"),
      },
    ],
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
        items: routes.map((_) => {
          return { url: _ }
        }),
      }
    },
  })
}

setup()
