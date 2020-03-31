import { setting, storeItem, stored } from "@factor/api"
import { renderMarkdownWithMeta } from "@factor/api/markdown"

export interface DocConfig {
  doc?: string;
  title?: string;
  path?: string;
  file?: () => Promise<{ default: string }>;
  items?: DocConfig[];
  meta?: Record<string, string>;
  markdown?: string;
  content?: string;
}

export const scanDocs = (doc: string, nav: DocConfig[]): DocConfig | undefined => {
  const found = nav.find(group => group.doc == doc)

  if (found) {
    return found
  } else {
    let foundInItems
    nav.some(group => {
      if (group.items) {
        const result = scanDocs(doc, group.items)

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
    const { meta, content } = renderMarkdownWithMeta(markdown)

    config.markdown = markdown
    config.meta = meta
    config.content = content
  }

  storeItem(storeKey, config)

  return config
}
