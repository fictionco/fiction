import { stored } from "@factor/app/store"

import { excerpt } from "@factor/tools/excerpt"
import { addFilter } from "@factor/tools/filters"
import { FactorMetaInfo } from "@factor/meta/types"
export function titleTag(_id: string): string {
  const { titleTag, title } = stored(_id) || {}
  return titleTag || title || ""
}

export function descriptionTag(_id: string): string {
  const { descriptionTag, subTitle, content } = stored(_id) || {}
  return descriptionTag || subTitle || excerpt(content) || ""
}

export function shareImage(_id: string): string {
  const { shareImage, avatar } = stored(_id) || {}
  const imageId = shareImage ? shareImage : avatar
  const { url } = stored(imageId) || {}
  return url ? url : ""
}

export function setPostMetatags(_id: string): void {
  const post = stored(_id) || {}

  addFilter(
    "meta-refine",
    (meta: FactorMetaInfo): FactorMetaInfo => {
      return {
        ...meta,
        title: post.titleTag || post.title || "",
        description: post.descriptionTag || excerpt(post.content) || "",
        image: post.avatar && stored(post.avatar) ? stored(post.avatar).url : ""
      }
    }
  )
}
