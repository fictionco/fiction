/* eslint-disable import/no-unresolved */
import { Component } from "vue"
export default (): object => {
  return {
    app: {
      components: {
        error404: (): Promise<Component> => import("__FALLBACK__/404.vue"),
        content: (): Promise<Component> => import("__FALLBACK__/content.vue"),
        site: (): Promise<Component> => import("__FALLBACK__/site.vue")
      },
      icon: require("__FALLBACK__/static/icon.svg"),
      templatePath: "__FALLBACK__/index.html",
      faviconPath: "__FALLBACK__/static/favicon.png"
    }
  }
}
