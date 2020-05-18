import {
  toLabel,
  addFilter,
  pushToFilter,
  applyFilters,
  setting,
  addPostType,
  getPostTypeConfig,
} from "@factor/api"

import { RouteConfig } from "vue-router"

import { TemplateConfig, TemplateSetting } from "./types"

declare module "vue" {
  interface ComponentOptions<V extends Vue> {
    templateSettings?: any
  }
}

export const addPageTemplate = (templateConfig: TemplateConfig): void => {
  pushToFilter({ hook: "page-templates", key: templateConfig.slug, item: templateConfig })
}

export const getTemplateFields = async (
  tpl: TemplateConfig
): Promise<TemplateSetting[]> => {
  const theComponent = await tpl.component()
  const {
    default: { templateSettings },
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
      const lastIndexOf = self.map((_) => _.slug).lastIndexOf(page.slug)
      return index === lastIndexOf
    })
    .map((_: TemplateConfig) => {
      const name = _.name || toLabel(_.slug.replace("tpl-", ""))
      return { name, ..._ }
    })
}

export const getTemplate = async (templateId: string): Promise<TemplateConfig | {}> => {
  const _all = getPageTemplates()

  let tpl = _all.find((_) => _.slug == templateId)

  if (!tpl) {
    tpl = _all.find((_) => _.slug == "")
  }

  if (!tpl) return {}

  tpl.fields = await getTemplateFields(tpl)

  return tpl
}

export const sortableSettings = ({
  _default,
  settings,
}: {
  _default: Record<string, any>[]
  settings: TemplateSetting[]
}): Record<string, any>[] => {
  return _default.map((item: Record<string, any>) => {
    if (settings) {
      settings.forEach((sub) => {
        if (typeof item[sub._id] == "undefined" && sub._default) {
          item[sub._id] = sub._default
        }
      })
    }

    return item
  })
}

export const getDefaultTemplateSettings = (
  fields: TemplateSetting[],
  current: Record<string, any>
): any => {
  const out: Record<string, any> = {}
  fields.forEach((field: TemplateSetting) => {
    const { _id, _default, settings } = field
    let val

    // If undefined, then set defaults
    if (typeof current[_id] == "undefined" && _default) {
      if (settings && _default && Array.isArray(settings) && Array.isArray(_default)) {
        val = sortableSettings({
          _default,
          settings: settings,
        })
      } else {
        val = _default
      }

      out[_id] = val
    } else {
      out[_id] = current[_id]
    }
  })

  return out
}

export const setup = (): void => {
  addPostType({
    postType: "page",
    managePosts: true,
    baseRoute: "",
    icon: require("./img/pages.svg"),
    nameIndex: "Pages",
    nameSingle: "Page",
    namePlural: "Pages",
    //model: "Page",
    customPermalink: true,
    addSitemap: true,
    schemaDefinition: {
      template: { type: String, default: "default" },
    },
  })

  pushToFilter({
    key: "pageTemplateSettings",
    hook: "post-meta-components",
    item: {
      postType: ["page"],
      name: "Page Template",
      component: (): Promise<any> => import("./page-select.vue"),
    },
  })
  pushToFilter({
    key: "pageTemplateSettings",
    hook: "post-edit-components",
    item: {
      name: "Template Settings",
      component: (): Promise<any> => import("./template-settings.vue"),
    },
  })

  addFilter({
    key: "pageTemplateSettings",
    hook: "post-edit-components",
    callback: (_, { postType }) => {
      const config = getPostTypeConfig(postType)

      if (postType == "page" || config.templateSettings) {
        _.push({
          name: "Template Settings",
          component: (): Promise<any> => import("./template-settings.vue"),
        })
      }

      return _
    },
  })

  addFilter({
    key: "runTemplatePermalink",
    hook: "content-routes-unmatched",
    callback: (_: RouteConfig[]) => {
      _.unshift({ path: "/:permalink", component: () => import("./template.vue") })

      return _
    },
  })
}
setup()
