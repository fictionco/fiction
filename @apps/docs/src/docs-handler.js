import { toLabel, setting, renderMarkdown } from "@factor/tools"

export function config() {
  return normalize(setting("docs.pages"))
}
export async function getMarkdownHTML(doc) {
  const { file } = selected(doc) || {}

  let html = ""
  if (file) {
    const { default: contents } = await file()

    html = renderMarkdown(contents)
  }

  return html
}

export function selected(doc) {
  return config().find(_ => _.doc == doc)
}

export function metatags(doc) {
  const { title, description } = selected(doc) || {}

  return { title, description }
}

export function normalize(items) {
  return items.map(_ => {
    const d = {
      doc: _.doc,
      route: `/${setting("docs.base")}/${_.doc}`,
      name: toLabel(_.doc),
      title: toLabel(_.doc),
      description: ""
    }

    return { ...d, ..._ }
  })
}
