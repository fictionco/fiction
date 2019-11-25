import { slugify, toLabel } from "@factor/tools/utils"
import { stored } from "@factor/app/store"
import { getPostTypeConfig } from "@factor/tools/post-types"
import { emitEvent } from "@factor/tools/events"
import { requestPostSingle } from "@factor/post/request"
import { currentUrl } from "@factor/tools/url"

// Verify a permalink is unique,
// If not unique, then add number and recursively verify the new one
export async function requestPermalinkVerify({ permalink, id, field = "permalink" }) {
  const post = await requestPostSingle({ permalink, field })

  if (post && post.id != id) {
    emitEvent("notify", `${toLabel(field)} "${permalink}" already exists.`)
    let num = 1

    var matches = permalink.match(/\d+$/)

    if (matches) num = parseInt(matches[0]) + 1

    permalink = await requestPermalinkVerify({
      permalink: `${permalink.replace(/\d+$/, "")}${num}`,
      id
    })
  }
  return permalink
}

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
