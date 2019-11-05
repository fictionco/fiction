export default {
  commentizer: {
    postTypes: ["page"],
    components: {
      commentizer: () => import("./commentizer.vue"),
      commentizerAdd: () => import("./commentizer-add.vue"),
      commentizerDisplay: () => import("./commentizer-display.vue"),
      commentizerDashboardPanel: () => import("./commentizer-dashboard-panel.vue"),
      commentizerDashboardList: () => import("./commentizer-dashboard-list.vue"),
      commentizerDashboardEdit: () => import("./commentizer-dashboard-edit.vue")
    },
    displayText: "Comments",
    submitText: "Submit Comment",
    confirm: {
      title: "Comment Added",
      subTitle: "Thank you for submitting a comment."
    },
    inputFormat: "horizontal",
    layout: [
      {
        label: "Name",
        _id: "name",
        inputType: "text",
        required: true
      },
      {
        label: "Email",
        _id: "email",
        inputType: "email",
        required: true
      },
      {
        label: "Comment",
        _id: "content",
        inputType: "textarea",
        required: true
      }
    ]
  }
}
