import { resolveFilePath } from "@factor/paths/util"

export default () => {
  return {
    app: {
      error404: () => import("#/404.vue"),
      content: () => import("#/content.vue"),
      site: () => import("#/site.vue"),
      templatePath: resolveFilePath("#/index.html"),
      faviconPath: resolveFilePath("#/static/favicon.png"),
      icon: () => import("./icon.png")
    }
  }
}
