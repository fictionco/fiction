import { pushToFilter } from "@factor/tools/filters"

pushToFilter("site-components", {
  name: "plugin-ssr-bar",
  component: () => import("./ssr-progress-bar.vue")
})

