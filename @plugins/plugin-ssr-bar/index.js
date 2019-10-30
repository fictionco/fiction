import { registerOnFilter } from "@factor/tools"
registerOnFilter("site-components", "plugin-ssr-bar", () =>
  import("./ssr-progress-bar.vue")
)
