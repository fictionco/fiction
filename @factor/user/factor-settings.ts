export default {
  factorUser: {
    baseRoute: "@",
    dashboard: {
      account: (): Promise<any> => import("./v-account.vue"),
      edit: (): Promise<any> => import("./v-edit.vue"),
      list: (): Promise<any> => import("./v-list.vue"),
    },
  },
}
