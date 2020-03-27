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
      // Must be a function to use __FIND__
      icon: (): string => require("__FIND__/static/icon.svg"),
      blankUser: "https://fiction-com.s3-us-west-1.amazonaws.com/user-blank.png",
      templatePath: "__FIND__/index.html",
      faviconPath: "__FIND__/static/favicon.png"
    },
    dashboard: {
      route: "/dashboard"
    },
    metaInfo: {
      titleTemplate: "%s",
      image: ""
    }
  }
}
