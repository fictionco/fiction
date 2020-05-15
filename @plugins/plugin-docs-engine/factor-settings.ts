export default {
  docsEngine: {
    nav: [],
    baseRoute: "/docs",
    metaInfo: {
      title: "Docs",
      description: "Learn how to build apps with Factor",
    },
    components: {
      wrap: (): Promise<any> => import("./components/wrap.vue"),
      home: (): Promise<any> => import("./components/home.vue"),
      doc: (): Promise<any> => import("./components/doc.vue"),
    },
    requireLoggedIn: false,
  },
}
