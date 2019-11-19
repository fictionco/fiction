import { slugify } from "@factor/tools/utils"
import { stored } from "@factor/app/store"
import { setting } from "@factor/tools/settings"
import { getPostTypeConfig } from "@factor/tools/post-types"
import { default as log } from "@factor/tools/logger"
export function getPermalink(args = {}) {
  const { postType, permalink = "", root = false, path = false } = args
  const parts = []

  parts.push(root ? currentUrl() : "")

  if (path) {
    parts.push(path)
    return parts.join("").replace(/\/$/, "") // remove trailing backslash
  } else {
    const typeMeta = postType ? getPostTypeConfig(postType) : false

    if (typeMeta) {
      const { baseRoute } = typeMeta

      // trim slashes
      if (baseRoute) parts.push(baseRoute.replace(/^\/|\/$/g, ""))
    }

    parts.push(!permalink && args.title ? slugify(args.title) : permalink)

    return parts.join("/")
  }
}

export function postLink(_id, options = {}) {
  const post = stored(_id)

  if (!post) return

  return getPermalink({ ...post, ...options })
}

export function currentUrl() {
  if (process.env.NODE_ENV == "development" || process.env.FACTOR_ENV == "test")
    return localhostUrl()
  else {
    if (setting("app.url")) return setting("app.url")
    else if (setting("url")) return setting("url")
    else {
      log.warn("URL Missing. Set application URL in Factor settings.")
      return "https://url-needed-in-config"
    }
  }
}

export function localhostUrl() {
  // eslint-disable-next-line no-console
  console.log("process.env.PORT", process.env.PORT)
  const port = process.env.PORT || 3000
  const routine = process.env.HTTP_PROTOCOL || "http"
  return `${routine}://localhost:${port}`
}
