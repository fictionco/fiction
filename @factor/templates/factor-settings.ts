import { TemplateConfig } from "./types"
export default {
  pageTemplates: {
    templates: [
      {
        name: "Default",
        slug: "default",
        component: (): Promise<any> => import("./tpl-basic.vue"),
      } as TemplateConfig,
    ],
  },
}
