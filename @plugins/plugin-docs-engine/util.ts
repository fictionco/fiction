import { setting, storeItem, stored } from "@factor/api"
import { renderMarkdownWithMeta } from "@factor/api/markdown"
import { omit } from "@factor/api/utils-lodash"
export interface DocConfig {
  doc?: string
  title?: string
  path?: string
  file?: () => Promise<{ default: string }>
  items?: DocConfig[]
  parents?: DocConfig[]
  meta?: Record<string, string>
  markdown?: string
  content?: string
}

const scanRoutes = (nav: DocConfig[]): string[] => {
  const routes: string[] = []
  const baseRoute = setting("docsEngine.baseRoute") ?? "/docs"

  nav.forEach((group) => {
    if (group.doc) {
      routes.push(group.path ?? `${baseRoute}/${group.doc}`)
    }
    if (group.items) {
      const subRoutes = scanRoutes(group.items)
      routes.push(...subRoutes)
    }
  })

  return routes
}

export const getDocRoutes = (): string[] => {
  return scanRoutes(setting("docsEngine.nav") ?? [])
}

export const scanDocs = (
  doc: string,
  nav: DocConfig[],
  parents: DocConfig[] = []
): DocConfig | undefined => {
  const found = nav.find((group) => group.doc == doc)

  if (found) {
    found.parents = parents
    return found
  } else {
    let foundInItems
    nav.some((group) => {
      if (group.items) {
        // Omit circular reference
        const result = scanDocs(doc, group.items, [...parents, omit(group, ["items"])])

        if (result) {
          foundInItems = result
          return true
        }
      }
      return false
    })
    return foundInItems
  }
}

export const getDocConfig = async (doc: string): Promise<DocConfig | undefined> => {
  const storeKey = `docs-${doc}`

  if (stored(storeKey)) {
    return stored(storeKey)
  }

  const nav = setting("docsEngine.nav")

  const config = scanDocs(doc, nav)

  if (config?.file) {
    const { default: markdown } = await config.file()
    const { meta, content } = renderMarkdownWithMeta(markdown, {
      variables: true,
      permalink: true,
    })

    config.markdown = markdown
    config.meta = meta
    config.content = content
  }

  storeItem(storeKey, config)

  return config
}

export const activeDocGroup = async (doc: string): Promise<string> => {
  const config = await getDocConfig(doc)
  const parents = config?.parents ?? []
  const group = parents.length > 0 ? parents[0].title ?? "" : ""
  return group
}
