export default Factor => {
  return new (class {
    constructor() {
      // Factor.$filters.add("data-schemas", _ => {
      //   _.jobs = require("./schema").default(Factor)
      //   return _
      // })

      Factor.$filters.push("data-schemas", require("./schema").default(Factor))

      this.filters()

      Factor.$filters.add("post-populated-fields", _ => {
        _.push({ field: "jobIcon", depth: 20 })
        return _
      })
    }

    filters() {
      const baseRoute = Factor.$setting.get("jobs.postRoute")

      Factor.$filters.push("post-types", {
        postType: "jobs",
        baseRoute,
        icon: require("./img/jobs.svg"),
        model: "JobPost",
        nameIndex: "Jobs",
        nameSingle: "Jobs Post",
        namePlural: "Jobs Posts"
      })

      Factor.$filters.add("content-routes", _ => {
        return [
          ..._,
          {
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
          }
        ]
      })

      Factor.$filters.add("post-edit-components", _ => {
        _.push({
          postType: ["jobs"],
          name: "Job Settings",
          component: () => import("./edit-post-settings")
        })

        return _
      })
    }
  })()
}
