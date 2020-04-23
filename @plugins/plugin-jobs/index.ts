import { addPostType, addContentRoute, setting, pushToFilter } from "@factor/api"
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
  const page = Number.parseInt(params.page ?? query.page ?? 1)
  const limit = setting("jobs.limit")

  await requestPostIndex({
    postType: "jobs",
    tag,
    status: PostStatus.Published,
    sort: "-date",
    page,
    limit,
    sameSource: true,
  })
}

export const setup = (): void => {
  addPostType({
    postType: "jobs",
    baseRoute,
    icon: require("./img/jobs.svg"),
    model: "JobPost",
    nameIndex: "Jobs",
    nameSingle: "Jobs Post",
    namePlural: "Jobs Posts",
    customPermalink: true,
    addSitemap: true,
    managePosts: true,
    schemaDefinition: {
      jobLocation: String,
      jobType: String,
      jobApplyEmail: String,
      jobCompanyName: String,
      jobCompanyWebsite: String,
    },
  })

  addContentRoute({
    path: setting("jobs.indexRoute") ?? "/",
    component: setting("jobs.components.jobsWrap"),
    children: [
      {
        path: "/",
        component: setting("jobs.components.jobsIndex"),
      },
      {
        path: `${setting("jobs.postRoute")}/:permalink`,
        component: setting("jobs.components.jobsSingle"),
      },
    ],
  })

  pushToFilter({
    key: "jobEdit",
    hook: "post-edit-components",
    item: {
      postType: ["jobs"],
      name: "Job Settings",
      component: setting("jobs.settings.settingsPanel"),
    },
  })
}
setup()
