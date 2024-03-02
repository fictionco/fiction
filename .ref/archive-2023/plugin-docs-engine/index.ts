import type { FactorApp, FactorPluginSettings } from '@factor/api'
import { FactorPlugin, vue } from '@factor/api'
import * as types from './types'

export const postType = 'docsItem'
export * from './types'

export type DocsSettings = {
  baseRoute: string
  docs: types.Doc<string>[]
  groups: types.DocGroupRecord
  factorApp: FactorApp
} & FactorPluginSettings

export class FactorDocsEngine extends FactorPlugin<DocsSettings> {
  readonly types = types
  factorApp: FactorApp
  constructor(settings: DocsSettings) {
    super('docs', settings)

    this.factorApp = settings.factorApp

    this.factorApp.addSitemap(async () => ({
      topic: 'docs',
      paths: this.getDocRoutes(),
    }))
  }

  /**
   * Gets all the routes for docs
   */
  scanRoutes = (docs: types.Doc<string>[]): string[] => {
    const baseRoute = this.settings.baseRoute ?? '/docs'

    return docs.map(k => `${baseRoute}/${this.utils.camelToKebab(k.key)}`)
  }

  getDocRoutes = (): string[] => {
    const docs = this.settings.docs ?? []
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
      k => k.key === key,
    )

    if (!found)
      return

    const groups = this.settings.groups ?? {}

    Object.entries(groups).forEach(([groupKey, groupDetails]) => {
      if (groupKey === key) {
        found.parentGroup = groupDetails
      }
      else if (groupDetails.menu) {
        const inGroup = groupDetails.menu.includes(key)

        if (inGroup)
          found.parentGroup = groupDetails
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
    if (!key)
      return

    const storeKey = `docs-${key}`

    if (this.utils.stored(storeKey))
      return this.utils.stored(storeKey)

    const docs = this.settings.docs ?? []

    let config = this.scanDocs(key, docs)

    if (config?.fileImport) {
      const fileData = await config.fileImport()

      const childComponents: Record<string, vue.Component> = {}

      Object.entries(config.components || {}).forEach(([nm, c]) => {
        childComponents[nm] = vue.toRaw(c)
      })

      const comp = fileData.VueComponentWith(childComponents)

      config = {
        ...config,
        component: vue.markRaw(comp),
        attributes: (fileData.attributes ?? {}) as Record<string, string>,
        ...fileData.attributes,
      }
    }

    this.utils.storeItem(storeKey, config)

    return config
  }

  activeDocGroup = async (doc: string): Promise<string> => {
    const config = await this.getDocConfig(doc)
    const parents = config?.parentGroup
    const group = parents ? parents.title ?? '' : ''
    return group
  }
}
