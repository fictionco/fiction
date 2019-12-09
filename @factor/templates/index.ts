import {
  toLabel,
  addFilter,
  pushToFilter,
  applyFilters,
  setting,
  addPostType,
  addPostSchema
} from "@factor/api"
import { RouteConfig } from "vue-router"
import { Component } from "vue"
import { TemplateConfig, TemplateOption } from "./types"
import pageSchema from "./schema"

export const addPageTemplate = (templateConfig: TemplateConfig): void => {
  pushToFilter({ hook: "page-templates", key: templateConfig._id, item: templateConfig })
}

export const getTemplateFields = async (
  tpl: TemplateConfig
): Promise<TemplateOption[]> => {
  const {
    default: { templateSettings }
  } = await tpl.component()

  return templateSettings ? templateSettings() : []
}

export const getPageTemplates = (): TemplateConfig[] => {
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

export const getTemplate = async (templateId: string): Promise<TemplateConfig | {}> => {
  const _all = getPageTemplates()

  let tpl = _all.find(_ => _._id == templateId)

  if (!tpl) {
    tpl = _all.find(_ => _._id == "tpl-default")
  }

  if (!tpl) return {}

  tpl.fields = await getTemplateFields(tpl)

  return tpl
}

export const setup = (): void => {
  addPostSchema(() => pageSchema())

  addPostType({
    postType: "page",
    baseRoute: "",
    icon: require("./img/pages.svg"),
    nameIndex: "Pages",
    nameSingle: "Page",
    namePlural: "Pages",
    model: "Page"
  })

  pushToFilter({
    key: "pageTemplateSettings",
    hook: "post-edit-components",
    item: {
      postType: ["page"],
      name: "Page Template Settings",
      component: (): Promise<Component> => import("./page-settings.vue")
    }
  })

  addFilter({
    key: "runTemplatePermalink",
    hook: "content-routes-unmatched",
    callback: (_: RouteConfig[]) => {
      _.unshift({ path: "/:permalink", component: () => import("./template.vue") })

      return _
    }
  })
}
setup()
