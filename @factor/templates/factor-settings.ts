import { Component } from "vue"
export default {
  pageTemplates: {
    templates: [
      {
        _id: "tpl-default",
        component: (): Promise<Component> => import("./tpl-default.vue")
      }
    ]
  }
}
