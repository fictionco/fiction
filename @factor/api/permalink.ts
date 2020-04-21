import { slugify, toLabel } from "@factor/api/utils"
import { stored } from "@factor/app/store"
import { getPostTypeConfig } from "@factor/api/post-types"
import { emitEvent } from "@factor/api/events"
import { requestPostSingle } from "@factor/post/request"
import { currentUrl } from "@factor/api/url"

// Verify a permalink is unique,
// If not unique, then add number and recursively verify the new one
export const requestPermalinkVerify = async ({
  permalink,
  _id,
  field = "permalink",
}: {
  permalink: string
  field: string
  _id: string
}): Promise<string> => {
  const post = await requestPostSingle({ permalink, field })

  if (post && post._id != _id) {
    emitEvent("notify", `${toLabel(field)} "${permalink}" already exists.`)
    let num = 1

    const matches = permalink.match(/\d+$/)

    if (matches) num = Number.parseInt(matches[0]) + 1

    permalink = await requestPermalinkVerify({
      permalink: `${permalink.replace(/\d+$/, "")}${num}`,
      _id,
      field,
    })
  }
  return permalink
}

interface PermalinkComponents {
  postType?: string
  permalink?: string
  root?: boolean
  path?: string
  title?: string
}

export const getPermalink = (_arguments: PermalinkComponents): string => {
  const { postType = "post", permalink = "", root = false, path = "" } = _arguments
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

    parts.push(!permalink && _arguments.title ? slugify(_arguments.title) : permalink)

    return parts.join("/")
  }
}

/**
 * Primary app linking for posts.
 * @param _id - Post ID
 * @param options.root - Include root domain
 */
export const postLink = (_id: string, options: PermalinkComponents = {}): string => {
  const root = options.root ? currentUrl() : ""

  const post = stored(_id)

  let route = ""
  if (post) {
    const { permalink } = getPostTypeConfig(post.postType)

    route = permalink ? permalink(post) : ""
  } else {
    route = `?_id=${_id}`
  }

  return `${root}${route}`
}
