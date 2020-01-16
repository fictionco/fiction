import { addPostType } from "@factor/api/post-types"
import { pushToFilter } from "@factor/api/hooks"
import { Component } from "vue"
import { logout } from "./util"
export const setup = (): void => {
  pushToFilter({
    key: "account",
    hook: "dashboard-routes",
    item: {
      path: "account",
      component: (): Promise<Component> => import("./v-account.vue"),
      meta: {
        postType: "user"
      }
    }
  })

  pushToFilter({
    key: "account",
    hook: "account-menu",
    item: {
      group: "account",
      path: "account",
      name: "Your Account",
      icon: require("./img/users.svg")
    }
  })

  pushToFilter({
    key: "account",
    hook: "action-menu",
    item: {
      key: "logout",
      click: (): Promise<void> => logout(),
      name: "Logout"
    }
  })

  addPostType({
    postType: "user",
    icon: require("./img/users.svg"),
    nameIndex: "Users",
    nameSingle: "User",
    namePlural: "Users",
    listTemplate: (): Promise<Component> => import("./v-list.vue"),
    editTemplate: (): Promise<Component> => import("./v-edit.vue"),
    baseRoute: "@",
    accessLevel: 500,
    noAddNew: true
  })
}
setup()
