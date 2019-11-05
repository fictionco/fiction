/* eslint-disable import/no-unresolved */
import { resolveFilePath } from "@factor/tools/paths"
import icon from "./icon.png"
export default () => {
  return {
    app: {
      icon: icon,
      error404: () => import("#/404.vue"),
      content: () => import("#/content.vue"),
      site: () => import("#/site.vue"),
      templatePath: resolveFilePath("#/index.html"),
      faviconPath: resolveFilePath("#/static/favicon.png")
    }
  }
}
