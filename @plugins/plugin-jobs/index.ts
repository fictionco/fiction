import {
  addPostType,
  addContentRoute,
  setting,
  pushToFilter,
  extendPostSchema
} from "@factor/tools"

import jobsSchema from "./schema"

const baseRoute = setting("jobs.postRoute")

extendPostSchema(jobsSchema)

addPostType({
  postType: "jobs",
  baseRoute,
  icon: require("./img/jobs.svg"),
  model: "JobPost",
  nameIndex: "Jobs",
  nameSingle: "Jobs Post",
  namePlural: "Jobs Posts"
})

addContentRoute({
  path: setting("jobs.indexRoute"),
  component: setting("jobs.components.jobsContent"),
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

pushToFilter("post-edit-components", {
  postType: ["jobs"],
  name: "Job Settings",
  component: () => import("./edit-post-settings.vue")
})

pushToFilter("post-populated-fields", { field: "jobIcon", depth: 20 })
