import { UserConfig, FactorPlugin } from "@factor/api"
import type { Component } from "vue"
import { Doc, DocPageConfig, DocsOptions } from "./types"

export const postType = "docsItem"

export * from "./types"

export class FactorDocsEngine extends FactorPlugin<DocsOptions> {
  constructor(settings: DocsOptions) {
    super(settings)
  }
  setup = (): UserConfig => {
    return {
      name: this.constructor.name,
      sitemaps: [{ topic: "docs", paths: this.getDocRoutes() }],

      paths: [this.utils.safeDirname(import.meta.url)],
    }
  }

  /**
   * Gets all the routes for docs
   */
  scanRoutes = (docs: Doc<string>[]): string[] => {
    const baseRoute = this.setting("baseRoute") ?? "/docs"

    return docs.map((k) => `${baseRoute}/${this.utils.camelToKebab(k.key)}`)
  }

  getDocRoutes = (): string[] => {
    const docs = this.setting("docs") ?? []
    return this.scanRoutes(docs)
  }

  /**
   * Loops through docs to find the passed docName and the needed info for that page
   */
  scanDocs = (key: string, docs: Doc<string>[]): DocPageConfig | undefined => {
    const found: DocPageConfig | undefined = docs.find((k) => k.key === key)

    if (!found) return

    const groups = this.setting("groups") ?? {}

    Object.entries(groups).some(([groupKey, groupDetails]) => {
      if (groupKey == key) {
        found.parentGroup = groupDetails
      } else if (groupDetails.menu) {
        const inGroup = groupDetails.menu.some((k) => k == key)

        if (inGroup) found.parentGroup = groupDetails
      }
    })

    return found
  }

  /**
   * Gets the full page configuration for an individual doc
   */
  getDocConfig = async (key?: string): Promise<DocPageConfig | undefined> => {
    if (!key) return

    const storeKey = `docs-${key}`

    if (this.store.stored(storeKey)) {
      return this.store.stored(storeKey)
    }

    const docs = this.setting("docs") ?? []

    let config = this.scanDocs(key, docs)

    if (config?.fileImport) {
      const fileData = await config.fileImport()

      const childComponents: Record<string, Component> = {}

      Object.entries(config.components || {}).map(([nm, c]) => {
        childComponents[nm] = this.vue.toRaw(c)
      })

      const comp = fileData.VueComponentWith(childComponents)

      config = {
        ...config,
        component: this.vue.markRaw(comp),
        attributes: fileData.attributes ?? {},
        ...fileData.attributes,
      }
    }

    this.store.storeItem(storeKey, config)

    return config
  }

  activeDocGroup = async (doc: string): Promise<string> => {
    const config = await this.getDocConfig(doc)
    const parents = config?.parentGroup
    const group = parents ? parents.title ?? "" : ""
    return group
  }
}
