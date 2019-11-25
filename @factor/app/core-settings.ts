/* eslint-disable import/no-unresolved */
import { resolveFilePath } from "@factor/tools/resolver"

export default () => {
  return {
    app: {
      components: {
        error404: () => import("__FALLBACK__/404.vue"),
        content: () => import("__FALLBACK__/content.vue"),
        site: () => import("__FALLBACK__/site.vue")
      },
      icon: require("__FALLBACK__/static/icon.svg"),
      templatePath: resolveFilePath("__FALLBACK__/index.html"),
      faviconPath: resolveFilePath("__FALLBACK__/static/favicon.png")
    }
  }
}
