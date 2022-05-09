import { FactorPlugin, FactorApp, vue } from "@factor/api"
import { toRaw, markRaw } from "vue"
export const postType = "docsItem"
import * as types from "./types"
export * from "./types"

export type DocsSettings = {
  baseRoute: string
  docs: types.Doc<string>[]
  groups: types.DocGroupRecord
  factorApp: FactorApp
}

export class FactorDocsEngine extends FactorPlugin<DocsSettings> {
  readonly types = types
  factorApp: FactorApp
  constructor(settings: DocsSettings) {
    super(settings)

    this.factorApp = settings.factorApp

    this.factorApp.addSitemaps([{ topic: "docs", paths: this.getDocRoutes() }])
  }
  setup = () => {
    return {
      name: this.constructor.name,
    }
  }

  /**
   * Gets all the routes for docs
   */
  scanRoutes = (docs: types.Doc<string>[]): string[] => {
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
  scanDocs = (
    key: string,
    docs: types.Doc<string>[],
  ): types.DocPageConfig | undefined => {
    const found: types.DocPageConfig | undefined = docs.find(
      (k) => k.key === key,
    )

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
  getDocConfig = async (
    key?: string,
  ): Promise<types.DocPageConfig | undefined> => {
    if (!key) return

    const storeKey = `docs-${key}`

    if (this.store.stored(storeKey)) {
      return this.store.stored(storeKey)
    }

    const docs = this.setting("docs") ?? []

    let config = this.scanDocs(key, docs)

    if (config?.fileImport) {
      const fileData = await config.fileImport()

      const childComponents: Record<string, vue.Component> = {}

      Object.entries(config.components || {}).map(([nm, c]) => {
        childComponents[nm] = toRaw(c)
      })

      const comp = fileData.VueComponentWith(childComponents)

      config = {
        ...config,
        component: markRaw(comp),
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
