import { getPostTypeUIConfig } from "@factor/dashboard"
import { setting, stored, slugify } from "@factor/tools"
export function getPermalink(args = {}) {
  const { postType, permalink = "", root = false, path = false } = args
  const parts = []

  parts.push(root ? setting("url") : "")

  if (path) {
    parts.push(path)
    return parts.join("").replace(/\/$/, "") // remove trailing backslash
  } else {
    const typeMeta = postType ? getPostTypeUIConfig(postType) : false

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
