import { addPostSchema } from "@factor/post/util"
import { addPostType, addContentRoute, setting, pushToFilter } from "@factor/api"
import { requestPostIndex } from "@factor/post/request"
import { PostStatus } from "@factor/post/types"
import { currentRoute } from "@factor/app/router"
import jobsSchema from "./schema"

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

export const setup = (): void => {
  addPostSchema(jobsSchema)

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

  pushToFilter({
    key: "jobEdit",
    hook: "post-edit-components",
    item: {
      postType: ["jobs"],
      name: "Job Settings",
      component: setting("jobs.settings.settingsPanel")
    }
  })
}
setup()