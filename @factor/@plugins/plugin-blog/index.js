export default Factor => {
  return new (class {
    constructor() {
      this.filters()
    }

    filters() {
      const base = "entry"
      const type = "blog"
      const icon = Factor.FACTOR_TARGET == "app" ? require("./img/posts.svg") : ""
      Factor.$filters.add("post-types", _ => {
        _.push({
          type,
          base,
          icon,
          model: "BlogPost",
          nameIndex: "Blog",
          nameSingle: "Blog Post",
          namePlural: "Blog Posts"
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
              path: `/${base}`,
              component: () => import(`./single.vue`)
            },
            {
              path: `/${base}/:permalink`,
              component: () => import(`./single.vue`)
            },
            {
              path: `/tag/:tag`,
              component: () => import(`./index.vue`)
            }
          ]
        })

        return _
      })
    }
  })()
}
