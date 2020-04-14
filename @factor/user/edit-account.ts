import { addPostType } from "@factor/api/post-types"
import { pushToFilter, addFilter } from "@factor/api/hooks"

import { logout } from "./util"
export const setup = (): void => {
  pushToFilter({
    key: "account",
    hook: "dashboard-routes",
    item: {
      path: "account",
      component: (): Promise<any> => import("./v-account.vue"),
      meta: {
        postType: "user",
      },
    },
  })

  pushToFilter({
    key: "account",
    hook: "dashboard-menu",
    item: {
      group: "account",
      path: "account",
      name: "Your Account",
      icon: require("./img/users.svg"),
    },
  })

  addFilter({
    key: "accountMenu",
    hook: "action-menu",
    callback: (_: any[]): any[] => {
      return [
        ..._,
        {
          path: "account",
          name: "Profile Settings",
        },
        {
          click: (): Promise<void> => logout(),
          name: "Logout",
        },
      ]
    },
  })

  addPostType({
    postType: "user",
    icon: require("./img/users.svg"),
    nameIndex: "Users",
    nameSingle: "User",
    namePlural: "Users",
    listTemplate: (): Promise<any> => import("./v-list.vue"),
    editTemplate: (): Promise<any> => import("./v-edit.vue"),
    baseRoute: "@",
    accessLevel: 500,
    noAddNew: true,
  })
}
setup()
