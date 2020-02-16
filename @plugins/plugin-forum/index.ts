import { addPostType, addContentRoute } from "@factor/api"
import { setting } from "@factor/api/settings"
import { requestPostSave } from "@factor/post/request"
import { FactorPost } from "@factor/post/types"

export const postType = "forumTopic"

const baseRoute = setting("forum.postRoute")

type NewTopic = Pick<FactorPost, "title">

/**
 * Request to create a new topic
 */
export const createNewTopic = async (post: NewTopic): Promise<FactorPost> => {
  const savedPost = await requestPostSave({ post, postType })

  return savedPost
}

export const setup = (): void => {
  addPostType({
    postType,
    baseRoute,
    icon: require("./img/forum.svg"),
    nameIndex: "Forum Topics",
    nameSingle: "Forum Topic",
    namePlural: "Forum Topics"
  })

  addContentRoute({
    path: setting("forum.indexRoute") ?? "/",
    component: setting("forum.components.forumWrap"),
    children: [
      {
        name: "forumIndex",
        path: "/",
        component: setting("forum.components.forumIndex")
      },
      {
        name: "editTopic",
        path: "edit",
        component: setting("forum.components.topicEdit"),
        meta: { auth: true }
      },
      {
        name: "addNewTopic",
        path: "add-new",
        component: setting("forum.components.topicEdit"),
        meta: { auth: true }
      },
      {
        path: `${setting("forum.postRoute")}/:permalink`,
        component: setting("forum.components.topicSingle")
      },
      {
        path: `${setting("forum.postRoute")}/:permalink/:title`,
        component: setting("forum.components.topicSingle")
      }
    ]
  })
}

setup()
