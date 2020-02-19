/* eslint-disable import/no-unresolved */
import { Component } from "vue"
export default (): object => {
  return {
    app: {
      components: {
        error404: (): Promise<Component> => import("__FIND__/404.vue"),
        content: (): Promise<Component> => import("__FIND__/content.vue"),
        site: (): Promise<Component> => import("__FIND__/site.vue")
      },
      icon: (): string => require("__FIND__/static/icon.svg"),
      templatePath: "__FIND__/index.html",
      faviconPath: "__FIND__/static/favicon.png"
    },
    metaInfo: {
      titleTemplate: "%s",
      image: ""
    }
  }
}
