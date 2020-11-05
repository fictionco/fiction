export default {
  core: {
    dashboard: {
      dashboardEdit: (): Promise<any> => import("./view/dashboard-edit.vue"),
      dashboardList: (): Promise<any> => import("./view/dashboard-list.vue"),
      postsEdit: (): Promise<any> => import("./view/posts-edit.vue"),
      postsList: (): Promise<any> => import("./view/posts-list.vue"),
    },
  },
}
