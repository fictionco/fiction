import { Component } from "vue"
export default {
  highlightCode: {
    style: (): Promise<Component> => import("./style.vue")
  }
}
