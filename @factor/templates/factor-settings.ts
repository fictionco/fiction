import { Component } from "vue"
import { TemplateConfig } from "./types"
export default {
  pageTemplates: {
    templates: [
      {
        name: "Basic Page",
        slug: "tpl-basic",
        component: (): Promise<Component> => import("./tpl-basic.vue")
      } as TemplateConfig
    ]
  }
}
