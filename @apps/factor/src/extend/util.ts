import { toLabel } from "@factor/api"
import { FactorPackageJson } from "@factor/cli/types"

import { FactorExtensionInfo } from "./types"

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
  item: FactorExtensionInfo,
  fileName = "icon.svg"
): string => {
  const { files, cdnUrl } = item

  const found = files ? files.find(f => f.name == fileName) : false

  return found ? `${cdnUrl}/${fileName}` : ""
}

export const screenshotsList = (item: FactorExtensionInfo): string[] => {
  const imagePattern = /screenshot\.(png|gif|jpg|svg)$/i

  const { files = [], cdnUrl } = item

  let screenshots = []

  screenshots = files
    .filter((f: { name: string }) => !!f.name.match(imagePattern))
    .map((f: { name: string }) => `${cdnUrl}/${f.name}`)
    .sort()

  return screenshots
}

export const getAuthors = (
  { maintainers = [] }: { maintainers: { name: string }[] },
  { number = 2 } = {}
): string => {
  const authors = maintainers.map(a => a.name)

  return authors.slice(0, number).join(", ")
}
