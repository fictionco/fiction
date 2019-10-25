import Factor from "@factor/core"
export default () => {
  return {
    pageTemplates: {
      templates: [
        {
          name: "Commentizer Enabled",
          _id: "commentizer-enabled",
          component: () => import("./commentizer-page-template")
        }
      ]
    }
  }
}
