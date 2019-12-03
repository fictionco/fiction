import { Component } from "vue"

export const factorHighlightCode = (): Promise<Component> =>
  import("./highlight-code.vue")
