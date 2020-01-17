import { Component } from "vue"
import { TemplateConfig } from "./types"
export default {
  pageTemplates: {
    templates: [
      {
        name: "Default",
        slug: "default",
        component: (): Promise<Component> => import("./tpl-basic.vue")
      } as TemplateConfig
    ]
  }
}
