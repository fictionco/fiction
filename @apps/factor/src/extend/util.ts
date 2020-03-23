import { toLabel } from "@factor/api"
import { FactorPackageJson } from "@factor/cli/types"

export const endpointId = "pluginData"

export const postType = "extension"

export const titleFromPackage = ({
  pkg,
  _id = ""
}: {
  pkg: FactorPackageJson;
  _id: string;
}): string => {
  const { factor: { title = "" } = {} } = pkg
  if (title) {
    return title
  } else {
    const name = _id
    const base = name.slice(name.lastIndexOf("/") + 1)

    return toLabel(base)
  }
}

export const formatDownloads = (number: number): string => {
  const num = number
  return num.toLocaleString("en", { useGrouping: true })
}

export const extensionPermalink = ({ base = "plugin", name = "" }): string => {
  return `/${base}/view?package=${name}`
}

export const extensionImage = (
  files: { name: string }[],
  cdnUrl: string,
  fileName = "icon.svg"
): string => {
  const found = files ? files.find(f => f.name == fileName) : false

  return found ? `${cdnUrl}/${fileName}` : ""
}

/**
 * Removes the file extension
 */
const trimExtension = (file: string): string => {
  return file
    .split(".")
    .slice(0, -1)
    .join(".")
}

export const screenshotsList = (files: { name: string }[], cdnUrl: string): string[] => {
  let screenshots = []

  screenshots = files
    .map((f: { name: string }) => f.name)
    .filter(name => name.includes("screenshot"))
    .map(name => [cdnUrl, name].join("/"))
    .sort((a, b) => {
      // Sort alphabetically, but without file extension
      // Otherwise screenshot.jpg sorts after screenshot-2.jpg
      a = trimExtension(a)
      b = trimExtension(b)
      if (a < b) return -1
      if (a > b) return 1
      return 0
    })

  return screenshots
}

export const getAuthors = (
  { maintainers = [] }: { maintainers: { name: string }[] },
  { number = 2 } = {}
): string => {
  const authors = maintainers.map(a => a.name)

  return authors.slice(0, number).join(", ")
}
