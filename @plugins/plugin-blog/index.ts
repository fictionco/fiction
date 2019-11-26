import { pushToFilter } from "@factor/tools/filters"
import { setting } from "@factor/tools/settings"

const baseRoute = setting("blog.postRoute")

pushToFilter("post-types-config", {
  postType: "blog",
  baseRoute,
  icon: require("./img/posts.svg"),
  model: "BlogPost",
  nameIndex: "Blog",
  nameSingle: "Blog Post",
  namePlural: "Blog Posts"
})

pushToFilter("content-routes", {
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
})
