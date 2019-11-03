import { pushToFilter } from "@factor/tools"
pushToFilter("global-components", {
  name: "plugin-highlight-code",
  component: () => import("./highlight-code.vue")
})
