import { toLabel, setting } from "@factor/tools"
import { renderMarkdown } from "@factor/tools/markdown"
import { DocsItem } from "./types"

export const normalize = (items: DocsItem[]): DocsItem[] => {
  return items.map(options => {
    const { slug, name, root } = options

    if (!root && !slug) return options

    const route = `/${setting("docs.base")}/${root ? "" : slug}`

    const d = {
      slug,
      route,
      name: name || toLabel(slug),
      title: name || toLabel(slug),
      description: "",
      file: (): Promise<{ default: string }> => import(`../docs/${slug}.md`)
    }

    return { ...d, ...options }
  })
}

export const config = (): DocsItem[] => {
  return normalize(setting("docs.pages"))
}

export const selected = (slug: string): DocsItem | void => {
  return config().find(_ => (slug ? _.slug == slug : _.root))
}

export const getMarkdownHTML = async (slug: string): Promise<string> => {
  const { file } = selected(slug) || {}

  let html = ""

  if (file) {
    const { default: markdown } = await file()
    html = renderMarkdown(markdown)
  }

  return html
}

export const metatags = (slug: string): { title?: string; description?: string } => {
  const { title, description } = selected(slug) || {}

  return { title, description }
}