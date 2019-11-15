/* eslint-disable import/no-unresolved */
import { resolveFilePath } from "@factor/tools/resolver"

export default () => {
  return {
    app: {
      components: {
        error404: () => import("#/404.vue"),
        content: () => import("#/content.vue"),
        site: () => import("#/site.vue")
      },
      icon: require("./icon.png"),
      templatePath: resolveFilePath("#/index.html"),
      faviconPath: resolveFilePath("#/static/favicon.png")
    }
  }
}
