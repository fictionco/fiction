import { UserConfigApp } from "@factor/api"

/**
 * Primary view components
 * Vue natively has support for the dynamic imports format below
 * treat these as working components
 */
const ItemPage = (): Promise<any> => import("./el/PageItem.vue")
const UserPage = (): Promise<any> => import("./el/PageUser.vue")
const ListPage = (): Promise<any> => import("./el/PageList.vue")

export const setup = (): UserConfigApp => {
  return {
    routes: [
      { path: "/v/:view", component: ListPage },
      { path: "/v/:view/:page", component: ListPage },
      { path: "/item/:id", component: ItemPage },
      { path: "/user/:id", component: UserPage },
      { path: "/", redirect: "/v/top" },
    ],
  }
}
