export default {
  docsEngine: {
    nav: [],
    baseRoute: "/docs",
    components: {
      wrap: (): Promise<any> => import("./components/wrap.vue"),
      home: (): Promise<any> => import("./components/home.vue"),
      doc: (): Promise<any> => import("./components/doc.vue"),
    },
  },
}
