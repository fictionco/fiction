export function titleTag(_id) {
  const { titleTag, title } = Factor.$store.val(_id) || {}
  return titleTag || title || ""
}

export function descriptionTag(_id) {
  const { descriptionTag, subTitle, content } = Factor.$store.val(_id) || {}
  return descriptionTag || subTitle || excerpt(content) || ""
}

export function shareImage(_id) {
  const { shareImage, avatar } = Factor.$store.val(_id) || {}
  const imageId = shareImage ? shareImage : avatar
  const { url } = Factor.$store.val(imageId) || {}
  return url ? url : ""
}

export function setPostMetatags(_id) {
  const post = Factor.$store.val(_id) || {}

  const out = {
    canonical: this.link(_id, { root: true }),
    title: post.titleTag || post.title || "",
    description: post.descriptionTag || excerpt(post.content) || "",
    image:
      post.avatar && Factor.$store.val(post.avatar)
        ? Factor.$store.val(post.avatar).url
        : ""
  }

  Factor.$globals.metatags.push(out)
}
