export default Factor => {
  return new class {
    constructor() {
      this.filters()
    }

    filters() {
      console.log("filer")

      Factor.$filters.add("post-types", _ => {
        _.push({
          type: "blog",
          base: "entry"
        })

        return _
      })

      Factor.$filters.add("content-routes", _ => {
        _.push({
          path: "/blog",
          component: () => import("./vc-blog-wrap"),
          children: [
            {
              path: "/",
              component: () => import("./index.vue")
            },
            {
              path: "/entry",
              component: () => import("./single.vue")
            },
            {
              path: "/entry/:permalink",
              component: () => import("./single.vue")
            },
            {
              path: "/tag/:tag",
              component: () => import("./index.vue")
            }
          ]
        })

        return _
      })
    }
  }()
}
