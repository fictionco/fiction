import { addFilter, pushToFilter, setting } from "@factor/tools"
export default Factor => {
  return new (class {
    constructor() {
      pushToFilter("data-schemas", () => require("./schema").default(Factor), {
        key: "jobs"
      })

      this.filters()

      pushToFilter("post-populated-fields", { field: "jobIcon", depth: 20 })
    }

    filters() {
      const baseRoute = setting("jobs.postRoute")

      pushToFilter("post-types", {
        postType: "jobs",
        baseRoute,
        icon: require("./img/jobs.svg"),
        model: "JobPost",
        nameIndex: "Jobs",
        nameSingle: "Jobs Post",
        namePlural: "Jobs Posts"
      })

      pushToFilter("content-routes", {
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
        component: () => import("./edit-post-settings")
      })
    }
  })()
}
