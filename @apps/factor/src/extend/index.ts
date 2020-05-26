import { addPostType } from "@factor/api"

import { FactorExtensionInfo } from "./types"
import { postType } from "./util"

addPostType({
  postType,
  nameIndex: "Extensions",
  nameSingle: "Extension",
  namePlural: "Extensions",
  addSitemap: true,
  permalink: (post: FactorExtensionInfo): string => {
    const baseRoute = post.extensionType == "plugin" ? "/plugin" : "/themes"
    const permalink = post.permalink || ""
    return `${baseRoute}/${encodeURIComponent(permalink)}`
  },
  schemaDefinition: {
    extensionType: { type: String, index: true },
    cdnUrl: { type: String },
    files: { type: [Object] },
    maintainer: { type: [Object] },
    downloads: { type: Number },
    packageName: { type: String },
    demo: { type: String },
    version: { type: String },
    homepage: { type: String },
    themeColor: { type: String },
    repositoryUrl: { type: String },
    featured: { type: Boolean },
    discover: { type: Boolean },
    extensionAuthor: { type: String },
    icon: { type: String },
    screenshots: { type: [String] },
  },
  permissions: {
    retrieve: { accessLevel: 0 },
  },
})
