import { addPostType, addContentRoute, slugify } from "@factor/api"
import { setting } from "@factor/api/settings"
import { FactorPost } from "@factor/post/types"

export const postType = "forumTopic"

const baseRoute = setting("forum.postRoute")

export const setup = (): void => {
  addPostType({
    postType,
    baseRoute,
    icon: require("./img/forum.svg"),
    nameIndex: "Forum Topics",
    nameSingle: "Forum Topic",
    namePlural: "Forum Topics",
    categories: setting("forum.categories"),
    addSitemap: true,
    permalink: (post: FactorPost): string => {
      return `${setting("forum.postRoute")}/${post._id}/${slugify(post.title)}`
    },
  })

  addContentRoute({
    path: setting("forum.indexRoute") ?? "/",
    component: setting("forum.components.forumWrap"),
    children: [
      {
        name: "forumIndex",
        path: "/",
        component: setting("forum.components.forumIndex"),
      },

      {
        name: "editTopic",
        path: "edit",
        component: setting("forum.components.topicEdit"),
        meta: { auth: true },
      },
      {
        name: "addNewTopic",
        path: "add-new",
        component: setting("forum.components.topicEdit"),
        meta: { auth: true },
      },
      {
        path: setting("forum.postRoute") ?? "",
        component: setting("forum.components.topicSingle"),
      },
      {
        path: `${setting("forum.postRoute")}/:_id`,
        component: setting("forum.components.topicSingle"),
      },
      {
        path: `${setting("forum.postRoute")}/:_id/:title`,
        component: setting("forum.components.topicSingle"),
      },
    ],
  })
}

setup()
