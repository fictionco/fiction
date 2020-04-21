import { stored } from "@factor/app/store"

import { excerpt } from "@factor/api/excerpt"

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
