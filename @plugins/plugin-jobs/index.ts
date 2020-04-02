import { addPostType, addContentRoute } from "@factor/api"
import { setting } from "@factor/api/settings"
import { requestPostIndex } from "@factor/post/request"
import { PostStatus } from "@factor/post/types"
import { currentRoute } from "@factor/app/router"
const baseRoute = setting("jobs.postRoute")


/**
 * Get post index and add to store
 */
export const loadAndStoreJobsIndex = async (): Promise<void> => {
  const route = currentRoute()
  const { params, query } = route

  const tag = params.tag ?? query.tag ?? ""
  const page = parseInt(params.page ?? query.page ?? 1)
  const limit = setting("jobs.limit")

  await requestPostIndex({
    postType: "jobs",
    tag,
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
  postType: "jobs",
  baseRoute,
  icon: require("./img/jobs.svg"),
  model: "JobPost",
  nameIndex: "Jobs",
  nameSingle: "Jobs Post",
  namePlural: "Jobs Posts",
  customPermalink: true,
  addSitemap: true
})

/**
  * The front end routes
  */
addContentRoute({
  path: setting("jobs.indexRoute") ?? "/",
  component: setting("jobs.components.jobsWrap"),
  children: [
    {
      path: "/",
      component: setting("jobs.components.jobsIndex")
    },
    {
      path: `${setting("jobs.postRoute")}/:permalink`,
      component: setting("jobs.components.jobsSingle")
    }
  ]
})