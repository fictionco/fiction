import { addPostType, addContentRoute } from "@factor/api"
import { setting } from "@factor/api/settings"

const baseRoute = setting("forum.postRoute")

addPostType({
  postType: "forum",
  baseRoute,
  icon: require("./img/forum.svg"),
  model: "ForumPost",
  nameIndex: "Forum",
  nameSingle: "Forum Topic",
  namePlural: "Forum Topics"
})

addContentRoute({
  path: setting("forum.indexRoute") ?? "/",
  component: setting("forum.components.forumWrap"),
  children: [
    {
      path: "/",
      component: setting("forum.components.forumIndex")
    },
    {
      path: `${setting("forum.postRoute")}/:permalink`,
      component: setting("forum.components.forumSingle")
    }
  ]
})
