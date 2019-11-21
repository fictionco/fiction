import { toLabel, setting, renderMarkdown } from "@factor/tools"

export function config() {
  return normalize(setting("docs.pages"))
}

export async function getMarkdownHTML(slug) {
  const { file } = selected(slug) || {}

  let html = ""

  if (file) {
    const { default: markdown } = await file()
    html = renderMarkdown(markdown)
  }

  return html
}

export function selected(slug) {
  return config().find(_ => _.slug == slug)
}

export function metatags(slug) {
  const { title, description } = selected(slug) || {}

  return { title, description }
}

export function normalize(items) {
  return items.map(options => {
    const { slug, name, route } = options

    const d = {
      slug,
      route: `/${setting("docs.base")}/${route || slug}`,
      name: name || toLabel(slug),
      title: name || toLabel(slug),
      description: "",
      file: () => import(`../docs/${slug}.md`)
    }

    return { ...d, ...options }
  })
}
