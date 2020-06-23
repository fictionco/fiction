import { addPostType, addContentRoute } from "@factor/api"
import { setting } from "@factor/api/settings"
import { requestPostIndex } from "@factor/post/request"
import { PostStatus } from "@factor/post/types"
import { currentRoute } from "@factor/app/router"
const baseRoute = setting("blog.postRoute")

/**
 * Components for import
 */
export const standardBlogIndex = setting("blog.components.standardBlogIndex")
export const standardBlogSingle = setting("blog.components.standardBlogSingle")

/**
 * Get post index and add to store
 */
export const loadAndStoreBlogIndex = async (): Promise<void> => {
  const route = currentRoute()
  const { params, query } = route

  const tag = params.tag ?? query.tag ?? ""
  const category = params.category ?? query.category ?? ""
  const search = params.search ?? query.search ?? ""
  const page = Number.parseInt(params.page ?? query.page ?? 1)
  const limit = setting("blog.limit")

  await requestPostIndex({
    postType: "blog",
    tag,
    category,
    search,
    status: PostStatus.Published,
    sort: "-date",
    page,
    limit,
    sameSource: true,
  })
}

/**
 * Sets admin and CMS
 */
addPostType({
  postType: "blog",
  baseRoute,
  icon: require("./img/posts.svg"),
  nameIndex: setting("blog.nameIndex"),
  nameSingle: setting("blog.nameSingle"),
  namePlural: setting("blog.namePlural"),
  managePosts: true,
  customPermalink: true,
  categories: setting("blog.categories"),
  addSitemap: true,
})

if (!setting("blog.disableAutoRoutes")) {
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
        meta: { index: true },
      },
      {
        path: `${setting("blog.postRoute")}/:permalink`,
        component: setting("blog.components.blogSingle"),
      },
    ],
  })
}
