/* eslint-disable import/no-unresolved */
import { resolveFilePath } from "@factor/tools/resolver"
import Vue from "vue"
export default (): object => {
  return {
    app: {
      components: {
        error404: (): Promise<Vue> => import("__FALLBACK__/404.vue"),
        content: (): Promise<Vue> => import("__FALLBACK__/content.vue"),
        site: (): Promise<Vue> => import("__FALLBACK__/site.vue")
      },
      icon: require("__FALLBACK__/static/icon.svg"),
      templatePath: resolveFilePath("__FALLBACK__/index.html"),
      faviconPath: resolveFilePath("__FALLBACK__/static/favicon.png")
    }
  }
}
