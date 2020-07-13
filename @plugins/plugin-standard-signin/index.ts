import {
  pushToFilter,
  addContentRoute,
  emitEvent,
  onEvent,
  navigateToRoute,
} from "@factor/api"

import { currentUser } from "@factor/user"

export const notifySignedIn = (): void => {
  const user = currentUser()

  if (user && user.email) {
    emitEvent("notify", { message: `Signed in as ${user.email}` })
  }
}

export const accountMenu = (): Promise<any> => import("./account-menu.vue")

export const setup = (): void => {
  onEvent("signin-redirect", ({ redirect }: { redirect: string }) => {
    navigateToRoute({ path: "/signin", query: { redirect } })
  })

  addContentRoute({
    name: "signin",
    path: "/signin",
    component: (): Promise<any> => import("./sign-in-view.vue"),
  })

  pushToFilter({
    key: "dashboard",
    hook: "site-components",
    item: {
      name: "signin-modal",
      component: (): Promise<any> => import("./signin-modal.vue"),
    },
  })
}

setup()
