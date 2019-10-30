export default {
  pageTemplates: {
    templates: [
      {
        name: "Commentizer Enabled",
        _id: "commentizer-enabled",
        component: () => import("./commentizer-page-template.vue")
      }
    ]
  }
}
