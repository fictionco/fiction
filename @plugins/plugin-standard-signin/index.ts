import { pushToFilter, addContentRoute, emitEvent } from "@factor/api"
import { Component } from "vue"
import { currentUser } from "@factor/user"

export const notifySignedIn = (): void => {
  const user = currentUser()

  if (user && user.email) {
    emitEvent("notify", { message: `Signed in as ${user.email}` })
  }
}

export const accountMenu = (): Promise<Component> => import("./account-menu.vue")

export const setup = (): void => {
  addContentRoute({
    name: "signin",
    path: "/signin",
    component: (): Promise<Component> => import("./sign-in-view.vue")
  })

  pushToFilter({
    key: "dashboard",
    hook: "site-components",
    item: {
      name: "sign-in-modal",
      component: (): Promise<Component> => import("./sign-in-modal.vue")
    }
  })
}

setup()
