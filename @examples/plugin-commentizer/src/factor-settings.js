export default Factor => {
  return {
    pageTemplates: {
      templates: [{
        name: "Commentizer Enabled",
        _id: "commentizer-enabled",
        component: () => import("./commentizer-page-template")
      }]
    }
  }
}
