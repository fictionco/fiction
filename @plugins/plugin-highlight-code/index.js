import { registerOnFilter } from "@factor/tools"
registerOnFilter("components", "plugin-highlight-code", () =>
  import("./highlight-code.vue")
)
