import { addPostType } from "@factor/api"

import { FactorExtensionInfo } from "./types"
import { postType } from "./util"

addPostType({
  postType,
  nameIndex: "Extensions",
  nameSingle: "Extension",
  namePlural: "Extensions",
  addSitemap: true,
  hideAdmin: true,
  permalink: (post: FactorExtensionInfo): string => {
    const baseRoute = post.extensionType == "plugin" ? "/plugin" : "/themes"
    const permalink = post.permalink || ""
    return `${baseRoute}/${encodeURIComponent(permalink)}`
  }
})
