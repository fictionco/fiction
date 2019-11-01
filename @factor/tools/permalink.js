import { getPostTypeConfig , setting, stored, slugify } from "@factor/tools"


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
  if (process.env.NODE_ENV == "development") return localhostUrl()
  else return setting("url") || setting("app.url") || "https://url-needed-in-config"
}

export function localhostUrl() {
  const port = process.env.PORT || 3000
  const routine = process.env.HTTP_PROTOCOL || "http"
  return `${routine}://localhost:${port}`
}
