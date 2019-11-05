import { toLabel } from "@factor/tools"

export function titleFromPackage(name) {
  const base = name.slice(name.lastIndexOf("/") + 1)

  return toLabel(base)
}

export function formatDownloads(number) {
  let num = number
  return num.toLocaleString("en", { useGrouping: true })
}

export function extensionPermalink({ base = "plugin", name }) {
  const slug = name.slice(name.lastIndexOf("/") + 1)
  return `/${base}/${slug}`
}
