import { addFilter, setting } from "@factor/tools"
export default Factor => {
  return new (class {
    constructor() {
      this.filters()
    }

    filters() {
      const baseRoute = setting("blog.postRoute")

      addFilter("post-types", _ => {
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

      addFilter("content-routes", _ => {
        return [
          ..._,
          {
            path: setting("blog.indexRoute"),
            component: setting("blog.components.blogWrap"),
            children: [
              {
                path: "/",
                component: setting("blog.components.blogIndex")
              },
              {
                path: `${setting("blog.postRoute")}/:permalink`,
                component: setting("blog.components.blogSingle")
              }
            ]
          }
        ]
      })
    }
  })()
}
