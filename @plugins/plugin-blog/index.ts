import { addPostType, addContentRoute } from "@factor/api"
import { setting } from "@factor/api/settings"

const baseRoute = setting("blog.postRoute")

addPostType({
  postType: "blog",
  baseRoute,
  icon: require("./img/posts.svg"),
  model: "BlogPost",
  nameIndex: "Blog",
  nameSingle: "Blog Post",
  namePlural: "Blog Posts"
})

addContentRoute({
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
