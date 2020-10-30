export default {
  core: {
    dashboard: {
      dashboardList: (): Promise<any> => import("./view/dashboard-list.vue"),
      dashboardEdit: (): Promise<any> => import("./view/dashboard-edit.vue"),
      postsEdit: (): Promise<any> => import("./view/posts-edit.vue"),
      postsList: (): Promise<any> => import("./view/posts-list.vue"),
    },
  },
}
