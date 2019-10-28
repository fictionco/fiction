import { addFilter, pushToFilter } from "@factor/tools"
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
      const baseRoute = Factor.$setting.get("jobs.postRoute")

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
        path: Factor.$setting.get("jobs.indexRoute"),
        component: Factor.$setting.get("jobs.components.jobsContent"),
        children: [
          {
            path: "/",
            component: Factor.$setting.get("jobs.components.jobsIndex")
          },
          {
            path: `${Factor.$setting.get("jobs.postRoute")}/:permalink`,
            component: Factor.$setting.get("jobs.components.jobsSingle")
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
