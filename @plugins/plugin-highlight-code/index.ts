import { defineAsyncComponent } from "vue"

export const HighlightCode = defineAsyncComponent(
  () => import("./HighlightCode.vue"),
)
