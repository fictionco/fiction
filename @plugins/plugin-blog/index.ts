import { addPostType, addContentRoute } from "@factor/api"
import { setting } from "@factor/api/settings"
import { requestPostIndex } from "@factor/post/request"
import { PostStatus } from "@factor/post/types"
import { currentRoute } from "@factor/app/router"
const baseRoute = setting("blog.postRoute")

/**
 * Get post index and add to store
 */
export const loadAndStoreBlogIndex = async (): Promise<void> => {
  const route = currentRoute()
  const { params, query } = route

  const tag = params.tag ?? query.tag ?? ""
  const category = params.category ?? query.category ?? ""
  const page = parseInt(params.page ?? query.page ?? 1)
  const limit = setting("blog.limit")

  await requestPostIndex({
    postType: "blog",
    tag,
    category,
    status: PostStatus.Published,
    sort: "-date",
    page,
    limit,
    sameSource: true
  })
}

/**
 * Sets admin and CMS
 */
addPostType({
  postType: "blog",
  baseRoute,
  icon: require("./img/posts.svg"),
  model: "BlogPost",
  nameIndex: "Blog",
  nameSingle: "Blog Post",
  namePlural: "Blog Posts",
  customPermalink: true,
  categories: setting("blog.categories"),
  addSitemap: true
})

/**
 * The front end routes
 */
addContentRoute({
  path: setting("blog.indexRoute") ?? "/",
  component: setting("blog.components.blogWrap"),
  children: [
    {
      path: "/",
      component: setting("blog.components.blogIndex"),
      meta: { index: true }
    },
    {
      path: `${setting("blog.postRoute")}/:permalink`,
      component: setting("blog.components.blogSingle")
    }
  ]
})
