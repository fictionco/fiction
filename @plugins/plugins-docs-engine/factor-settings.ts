import { Component } from "vue"

export default {
  docsEngine: {
    nav: [],
    baseRoute: "/docs",
    components: {
      wrap: (): Promise<Component> => import("./components/wrap.vue"),
      home: (): Promise<Component> => import("./components/home.vue"),
      doc: (): Promise<Component> => import("./components/doc.vue")
    }
  }
}
