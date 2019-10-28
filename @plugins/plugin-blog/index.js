import { addFilter } from "@factor/tools"
export default Factor => {
  return new (class {
    constructor() {
      this.filters()
    }

    filters() {
      const baseRoute = Factor.$setting.get("blog.postRoute")

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
            path: Factor.$setting.get("blog.indexRoute"),
            component: Factor.$setting.get("blog.components.blogWrap"),
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
