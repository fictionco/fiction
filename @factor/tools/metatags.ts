import { stored } from "@factor/app/store"

import { excerpt } from "@factor/tools/excerpt"
import { addFilter } from "@factor/tools/hooks"
import { FactorMetaInfo } from "@factor/meta/types"

export const titleTag = (_id: string): string => {
  const { titleTag, title } = stored(_id) || {}
  return titleTag || title || ""
}

export const descriptionTag = (_id: string): string => {
  const { descriptionTag, subTitle, content } = stored(_id) || {}
  return descriptionTag || subTitle || excerpt(content) || ""
}

export const shareImage = (_id: string): string => {
  const { shareImage, avatar } = stored(_id) || {}
  const imageId = shareImage ? shareImage : avatar
  const { url } = stored(imageId) || {}
  return url ? url : ""
}

export const setPostMetatags = (_id: string): void => {
  const post = stored(_id) || {}

  addFilter({
    hook: "meta-refine",
    key: "set-post-tags",
    callback: (meta: FactorMetaInfo): FactorMetaInfo => {
      return {
        ...meta,
        title: post.titleTag || post.title || "",
        description: post.descriptionTag || excerpt(post.content) || "",
        image: post.avatar && stored(post.avatar) ? stored(post.avatar).url : ""
      }
    }
  })
}
