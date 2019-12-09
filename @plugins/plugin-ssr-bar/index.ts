import { pushToFilter } from "@factor/api/hooks"
import { Component } from "vue"

export const setup = (): void => {
  pushToFilter({
    hook: "site-components",
    key: "ssrProgressBar",
    item: {
      name: "plugin-ssr-bar",
      component: (): Promise<Component> => import("./ssr-progress-bar.vue")
    }
  })
}

setup()
