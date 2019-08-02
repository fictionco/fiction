export default Factor => {
  return new (class {
    constructor() {
      this.filters()
    }

    filters() {
      const baseRoute = Factor.$setting.get("blog.postRoute")

      Factor.$filters.add("post-types", _ => {
        _.push({
          postType: "blog",
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
        return [
          ..._,
          {
            path: Factor.$setting.get("blog.indexRoute"),
            component: Factor.$setting.get("blog.components.blogContent"),
            children: [
              {
                path: "/",
                component: Factor.$setting.get("blog.components.blogIndex")
              },
              {
                path: `${Factor.$setting.get("blog.postRoute")}/:permalink`,
                component: Factor.$setting.get("blog.components.blogSingle")
              }
            ]
          }
        ]
      })
    }
  })()
}
