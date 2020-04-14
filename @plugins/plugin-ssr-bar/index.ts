import { pushToFilter } from "@factor/api/hooks"

export const setup = (): void => {
  pushToFilter({
    hook: "site-components",
    key: "ssrProgressBar",
    item: {
      name: "plugin-ssr-bar",
      component: (): Promise<any> => import("./ssr-progress-bar.vue"),
    },
  })
}

setup()
