import { addPostType, addContentRoute } from "@factor/api"
import { setting } from "@factor/api/settings"
import { requestPostSave } from "@factor/post/request"
import { FactorPost } from "@factor/post/types"

const postType = "forumTopic"

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
        path: "/",
        component: setting("forum.components.topicIndex")
      },
      {
        path: "new",
        component: setting("forum.components.topicNew")
      },
      {
        path: `${setting("forum.postRoute")}/:permalink`,
        component: setting("forum.components.topicSingle")
      }
    ]
  })
}

setup()
