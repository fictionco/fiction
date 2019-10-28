export default {
  commentizer: {
    postTypes: ["page"],
    components: {
      commentizer: () => import("./commentizer"),
      commentizerAdd: () => import("./commentizer-add"),
      commentizerDisplay: () => import("./commentizer-display"),
      commentizerDashboardPanel: () => import("./commentizer-dashboard-panel"),
      commentizerDashboardList: () => import("./commentizer-dashboard-list"),
      commentizerDashboardEdit: () => import("./commentizer-dashboard-edit")
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
