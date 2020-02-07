import { addPostType, addContentRoute } from "@factor/api"
import { setting } from "@factor/api/settings"

const baseRoute = setting("forum.postRoute")

addPostType({
  postType: "forumTopic",
  baseRoute,
  icon: require("./img/forum.svg"),
  nameIndex: "Forum Topics",
  nameSingle: "Forum Topic",
  namePlural: "Forum Topics"
})

addPostType({
  postType: "forumPost",
  baseRoute,
  icon: require("./img/forum.svg"),
  nameIndex: "Forum Posts",
  nameSingle: "Forum Post",
  namePlural: "Forum Posts"
})

addContentRoute({
  path: setting("forum.indexRoute") ?? "/",
  component: setting("forum.components.forumWrap"),
  children: [
    {
      path: "/",
      component: setting("forum.components.topicIndex")
    },
    {
      path: `${setting("forum.postRoute")}/:permalink`,
      component: setting("forum.components.topicSingle")
    }
  ]
})
