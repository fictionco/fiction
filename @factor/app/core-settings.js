/* eslint-disable import/no-unresolved */
import { resolveFilePath } from "@factor/tools/paths"

export default () => {
  return {
    app: {
      icon: require("./icon.png"),
      error404: () => import("#/404.vue"),
      content: () => import("#/content.vue"),
      site: () => import("#/site.vue"),
      templatePath: resolveFilePath("#/index.html"),
      faviconPath: resolveFilePath("#/static/favicon.png")
    }
  }
}
