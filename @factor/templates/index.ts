import {
  toLabel,
  addFilter,
  pushToFilter,
  applyFilters,
  setting,
  addPostType,
  extendPostSchema
} from "@factor/tools"
import { RouteConfig } from "vue-router"
import { TemplateConfig, TemplateOption } from "./types"
import pageSchema from "./schema"

extendPostSchema(() => pageSchema())

addPostType({
  postType: "page",
  baseRoute: "",
  icon: require("./img/pages.svg"),
  nameIndex: "Pages",
  nameSingle: "Page",
  namePlural: "Pages",
  model: "Page"
})

pushToFilter("post-edit-components", {
  postType: ["page"],
  name: "Page Template Settings",
  component: () => import("./page-settings.vue")
})

addFilter("content-routes-unmatched", (_: RouteConfig[]) => {
  _.unshift({ path: "/:permalink", component: () => import("./template.vue") })

  return _
})

export function addPageTemplate(templateConfig: TemplateConfig): void {
  pushToFilter("page-templates", templateConfig)
}

export async function getTemplate(templateId: string): Promise<TemplateConfig | {}> {
  const _all = getPageTemplates()

  let tpl = _all.find(_ => _._id == templateId)

  if (!tpl) {
    tpl = _all.find(_ => _._id == "tpl-default")
  }

  if (!tpl) return {}

  tpl.fields = await getTemplateFields(tpl)

  return tpl
}

export async function getTemplateFields(tpl: TemplateConfig): Promise<TemplateOption[]> {
  const {
    default: { templateSettings }
  } = await tpl.component()

  return templateSettings ? templateSettings() : []
}

export function getPageTemplates(): TemplateConfig[] {
  const _templates: TemplateConfig[] = setting("pageTemplates.templates") || []

  return applyFilters("page-templates", _templates)
    .filter((page: TemplateConfig, index: number, self: TemplateConfig[]) => {
      // remove duplicates, favor the last
      const lastIndexOf = self.map(_ => _._id).lastIndexOf(page._id)
      return index === lastIndexOf
    })
    .map((_: TemplateConfig) => {
      const name = _.name || toLabel(_._id.replace("tpl-", ""))
      return { name, ..._ }
    })
}
