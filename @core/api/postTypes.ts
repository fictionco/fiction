import { FactorPost, PostTypeConfig } from "@factor/types"

import { applyFilters, pushToFilter } from "./hook"
import { slugify, toLabel } from "./utils"

/**
 * Adds a new post type
 */
export const addPostType = (config: PostTypeConfig): void => {
  pushToFilter({
    hook: "postTypesConfig",
    key: config.postType,
    item: config,
  })
}
/**
 * Gets all added post types
 */
export const postTypesConfig = (): PostTypeConfig[] => {
  return applyFilters("postTypesConfig", []).map(
    (_: Partial<PostTypeConfig>) => {
      const baseRoute =
        typeof _.baseRoute == "undefined" ? `/${_.postType}` : _.baseRoute

      const label = toLabel(_.postType)

      return {
        postType: "post",
        permalink: (post: FactorPost): string => {
          const permalink = post.permalink ?? slugify(post.title ?? "")

          return `/${permalink}`
        },
        baseRoute,
        nameIndex: label,
        nameSingle: label,
        namePlural: label,
        ..._,
      }
    },
  )
}

export const basePostTypeConfig = (): PostTypeConfig => {
  return (
    postTypesConfig().find((pt) => pt.postType == "post") || {
      postType: "post",
    }
  )
}

export const getPostTypeConfig = (postType?: string): PostTypeConfig => {
  const base = basePostTypeConfig()

  if (!postType) return base

  return postTypesConfig().find((pt) => pt.postType == postType) || base
}
