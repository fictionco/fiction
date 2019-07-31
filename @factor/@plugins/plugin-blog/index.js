export default Factor => {
  return new (class {
    constructor() {
      this.filters()
    }

    filters() {
      const baseRoute = "entry"
      const postType = "blog"
      Factor.$filters.add("post-types", _ => {
        _.push({
          postType,
          baseRoute,
          icon: require("./img/posts.svg"),
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
              path: `/${baseRoute}`,
              component: () => import(`./single.vue`)
            },
            {
              path: `/${baseRoute}/:permalink`,
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
