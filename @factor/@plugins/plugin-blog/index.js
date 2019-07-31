export default Factor => {
  return new (class {
    constructor() {
      this.filters()
    }

    filters() {
      const base = "entry"
      const type = "blog"
      const icon = require("./img/posts.svg")
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
          component: () => import("./blog-wrap"),
          children: [
            {
              path: "/",
              component: () => import("#/blog-index.vue")
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
              component: () => import(`#/blog-index.vue`)
            }
          ]
        })

        return _
      })
    }
  })()
}
