import {
  addPostType,
  addContentRoute,
  setting,
  pushToFilter,
  extendPostSchema
} from "@factor/tools"
import { Component } from "vue"
import jobsSchema from "./schema"

const baseRoute = setting("jobs.postRoute")

export const setup = (): void => {
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

  pushToFilter({
    key: "jobEdit",
    hook: "post-edit-components",
    item: {
      postType: ["jobs"],
      name: "Job Settings",
      component: (): Promise<Component> => import("./edit-post-settings.vue")
    }
  })

  pushToFilter({
    key: "jobIcon",
    hook: "post-populated-fields",
    item: { field: "jobIcon", depth: 20 }
  })
}
setup()
