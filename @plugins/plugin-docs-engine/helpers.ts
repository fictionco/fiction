import { stored, storeItem, camelToKebab } from "@factor/api"
import { toRaw, markRaw, Component } from "vue"

import { DocPageConfig, DocsOptions, DocItem, Doc } from "./types"

/**
 * Creates a record with specific types
 * https://stackoverflow.com/a/49539369/1858322
 */
export const mapTypeHelper = <T extends { [name: string]: DocItem }>(
  cfg: T,
): Record<keyof T, DocItem> => {
  return cfg
}

/**
 * Doc engine settings utility
 */

export const docSetting = <T extends keyof DocsOptions>(
  key: T,
): DocsOptions[T] => {
  const settings = stored<DocsOptions>("docSettings")
  if (!settings) {
    throw new Error("no settings available for docs engine. Is it installed?")
  }
  return settings[key]
}

export const createSettings = (options: Partial<DocsOptions>): void => {
  const defaultSettings: DocsOptions = {
    baseRoute: "/docs",
    docs: [],
    groups: {},
  }

  storeItem("docSettings", { ...defaultSettings, ...options })
}
/**
 * Gets all the routes for docs
 */
const scanRoutes = (docs: Doc<string>[]): string[] => {
  const baseRoute = docSetting("baseRoute") ?? "/docs"

  return docs.map((k) => `${baseRoute}/${camelToKebab(k.key)}`)
}

export const getDocRoutes = (): string[] => {
  return scanRoutes(docSetting("docs") ?? {})
}

/**
 * Loops through docs to find the passed docName and the needed info for that page
 */
export const scanDocs = (
  key: string,
  docs: Doc<string>[],
): DocPageConfig | undefined => {
  const found: DocPageConfig | undefined = docs.find((k) => k.key === key)

  if (!found) return

  const groups = docSetting("groups") ?? {}

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
export const getDocConfig = async (
  key?: string,
): Promise<DocPageConfig | undefined> => {
  if (!key) return

  const storeKey = `docs-${key}`

  if (stored(storeKey)) {
    return stored(storeKey)
  }

  const docs = docSetting("docs") ?? {}

  let config = scanDocs(key, docs)

  if (config?.fileImport) {
    const fileData = await config.fileImport()

    const childComponents: Record<string, Component> = {}

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

  storeItem(storeKey, config)

  return config
}

export const activeDocGroup = async (doc: string): Promise<string> => {
  const config = await getDocConfig(doc)
  const parents = config?.parentGroup
  const group = parents ? parents.title ?? "" : ""
  return group
}
