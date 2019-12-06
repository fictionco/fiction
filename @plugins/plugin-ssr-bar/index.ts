import { pushToFilter } from "@factor/tools/filters"

export const setup = (): void => {
  pushToFilter("site-components", {
    name: "plugin-ssr-bar",
    component: () => import("./ssr-progress-bar.vue")
  })
}

setup()
