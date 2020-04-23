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
}
setup()
