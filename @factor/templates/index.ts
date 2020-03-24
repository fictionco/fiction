import {
  toLabel,
  addFilter,
  pushToFilter,
  applyFilters,
  setting,
  addPostType,
  getPostTypeConfig
} from "@factor/api"
import { addPostSchema } from "@factor/post/util"
import { RouteConfig } from "vue-router"
import { Component } from "vue"
import { TemplateConfig, TemplateSetting } from "./types"
import pageSchema from "./schema"

export const addPageTemplate = (templateConfig: TemplateConfig): void => {
  pushToFilter({ hook: "page-templates", key: templateConfig.slug, item: templateConfig })
}

export const getTemplateFields = async (
  tpl: TemplateConfig
): Promise<TemplateSetting[]> => {
  const theComponent = await tpl.component()
  const {
    default: {
      options: { templateSettings }
    }
  } = theComponent

  return templateSettings ? templateSettings() : []
}

/**
 * Gets the available page templates
 */
export const getPageTemplates = (): TemplateConfig[] => {
  const _templates: TemplateConfig[] = setting("pageTemplates.templates") || []

  return applyFilters("page-templates", _templates)
    .filter((page: TemplateConfig, index: number, self: TemplateConfig[]) => {
      // remove duplicates, favor the last
      const lastIndexOf = self.map(_ => _.slug).lastIndexOf(page.slug)
      return index === lastIndexOf
    })
    .map((_: TemplateConfig) => {
      const name = _.name || toLabel(_.slug.replace("tpl-", ""))
      return { name, ..._ }
    })
}

export const getTemplate = async (templateId: string): Promise<TemplateConfig | {}> => {
  const _all = getPageTemplates()

  let tpl = _all.find(_ => _.slug == templateId)

  if (!tpl) {
    tpl = _all.find(_ => _.slug == "")
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
    model: "Page",
    customPermalink: true,
    addSitemap: true
  })

  pushToFilter({
    key: "pageTemplateSettings",
    hook: "post-meta-components",
    item: {
      postType: ["page"],
      name: "Page Template",
      component: (): Promise<Component> => import("./page-select.vue")
    }
  })
  pushToFilter({
    key: "pageTemplateSettings",
    hook: "post-edit-components",
    item: {
      name: "Template Settings",
      component: (): Promise<Component> => import("./template-settings.vue")
    }
  })

  addFilter({
    key: "pageTemplateSettings",
    hook: "post-edit-components",
    callback: (_, { postType }) => {
      const config = getPostTypeConfig(postType)

      if (postType == "page" || config.templateSettings) {
        _.push({
          name: "Template Settings",
          component: (): Promise<Component> => import("./template-settings.vue")
        })
      }

      return _
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
