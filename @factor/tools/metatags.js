import { stored } from "@factor/app/store"
import { postLink } from "@factor/tools/permalink"
import { excerpt } from "@factor/tools/markdown"
import { getObservables } from "@factor/app"

export function titleTag(_id) {
  const { titleTag, title } = stored(_id) || {}
  return titleTag || title || ""
}

export function descriptionTag(_id) {
  const { descriptionTag, subTitle, content } = stored(_id) || {}
  return descriptionTag || subTitle || excerpt(content) || ""
}

export function shareImage(_id) {
  const { shareImage, avatar } = stored(_id) || {}
  const imageId = shareImage ? shareImage : avatar
  const { url } = stored(imageId) || {}
  return url ? url : ""
}

export function setPostMetatags(_id) {
  const post = stored(_id) || {}

  const out = {
    canonical: postLink(_id, { root: true }),
    title: post.titleTag || post.title || "",
    description: post.descriptionTag || excerpt(post.content) || "",
    image: post.avatar && stored(post.avatar) ? stored(post.avatar).url : ""
  }

  getObservables().metatags.push(out)
}
