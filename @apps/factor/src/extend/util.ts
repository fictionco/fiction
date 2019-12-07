import { toLabel } from "@factor/tools"
import { FactorPackageJson } from "@factor/cli/types"
export const endpointId = "pluginData"
import { FactorExtensionListing } from "../types"

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

type ExtensionFile = FactorExtensionListing & { fileName: string; defaultFile: string }

export const formatDownloads = (number: number): string => {
  const num = number
  return num.toLocaleString("en", { useGrouping: true })
}

export const extensionPermalink = ({ base = "plugin", name = "" }): string => {
  return `/${base}/view?package=${name}`
}

export const cdnUrl = (item: ExtensionFile): string => {
  const {
    files,
    cdnBaseUrl,
    fileName = "icon.svg",
    defaultFile = ""
  }: ExtensionFile = item

  const found = files ? files.find(f => f.name == fileName) : false

  return found ? `${cdnBaseUrl}/${fileName}` : defaultFile
}

export const extensionIcon = (item: FactorExtensionListing): string => {
  return cdnUrl({
    ...item,
    fileName: "icon.svg",
    defaultFile: require("./img/icon-factor.svg")
  })
}

export const extensionScreenshot = (item: FactorExtensionListing): string => {
  return cdnUrl({
    ...item,
    fileName: "screenshot.jpg",
    defaultFile: require("./img/icon-factor.svg")
  })
}

export const screenshotsList = (item: FactorExtensionListing): string[] => {
  const imagePattern = /screenshot\.(png|gif|jpg|svg)$/i

  const { files = [], cdnBaseUrl } = item

  let screenshots = []

  screenshots = files
    .filter((f: { name: string }) => !!f.name.match(imagePattern))
    .map((f: { name: string }) => `${cdnBaseUrl}/${f.name}`)

  return screenshots
}

export const getAuthors = (
  { maintainers = [] }: { maintainers: { name: string }[] },
  { number = 2 } = {}
): string => {
  const authors = maintainers.map(a => a.name)

  return authors.slice(0, number).join(", ")
}
