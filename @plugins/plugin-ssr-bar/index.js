import { pushToFilter } from "@factor/tools"
pushToFilter("site-components", {
  name: "plugin-ssr-bar",
  component: () => import("./ssr-progress-bar.vue")
})
