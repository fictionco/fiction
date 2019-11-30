import { toLabel, addFilter, pushToFilter, applyFilters, setting } from "@factor/tools"

import pageSchema from "./schema"

pushToFilter("data-schemas", () => pageSchema(), { key: "page" })

addFilter("post-types-config", (_) => {
  _.unshift({
    postType: "page",
    baseRoute: "",
    icon: require("./img/pages.svg"),
    nameIndex: "Pages",
    nameSingle: "Page",
    namePlural: "Pages",
    model: "Page"
  })
  return _
})

pushToFilter("post-edit-components", {
  postType: ["page"],
  name: "Page Template Settings",
  component: () => import("./page-settings.vue")
})

addFilter("content-routes-unmatched", (_) => {
  _.unshift({ path: "/:permalink", component: () => import("./template.vue") })

  return _
})

export function addPageTemplate(templateConfig) {
  pushToFilter("page-templates", templateConfig)
}

export async function getTemplate(templateId) {
  const _all = getPageTemplates()

  let tpl = _all.find((_) => _._id == templateId)

  if (!tpl) tpl = _all.find((_) => _._id == "tpl-default")

  tpl.fields = await getTemplateFields(tpl)

  return tpl
}

export async function getTemplateFields(tpl) {
  const {
    default: { templateSettings }
  } = await tpl.component()

  return templateSettings ? templateSettings() : []
}

export function getPageTemplates() {
  const _templates = setting("pageTemplates.templates") || []

  return applyFilters("page-templates", _templates)
    .filter((page, index, self) => {
      // remove duplicates, favor the last
      const lastIndexOf = self.map((_) => _._id).lastIndexOf(page._id)
      return index === lastIndexOf
    })
    .map((_) => {
      const name = _.name || toLabel(_._id.replace("tpl-", ""))
      return { name, ..._ }
    })
}
