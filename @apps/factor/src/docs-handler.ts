import { toLabel, setting, renderMarkdown } from "@factor/tools"

export function config() {
  return normalize(setting("docs.pages"))
}

export async function getMarkdownHTML(slug: string): Promise<string> {
  const { file } = selected(slug) || {}

  let html = ""

  if (file) {
    const { default: markdown } = await file()
    html = renderMarkdown(markdown)
  }

  return html
}

export function selected(slug) {
  return config().find((_) => (slug ? _.slug == slug : _.root))
}

export function metatags(slug: string) {
  const { title, description } = selected(slug) || {}

  return { title, description }
}

export function normalize(items) {
  return items.map((options) => {
    const { slug, name, root } = options

    if (!root && !slug) return options

    const route = `/${setting("docs.base")}/${root ? "" : slug}`

    const d = {
      slug,
      route,
      name: name || toLabel(slug),
      title: name || toLabel(slug),
      description: "",
      file: () => import(`../docs/${slug}.md`)
    }

    return { ...d, ...options }
  })
}
