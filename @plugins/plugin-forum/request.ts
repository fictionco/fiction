import {
  requestPostSave,
  requestPostDeleteMany,
  requestPostIndex,
  requestPostSaveEmbedded
} from "@factor/post/request"
import {
  UnsavedFactorPost,
  FactorPost,
  PostStatus,
  IndexOrderBy,
  IndexTimeFrame
} from "@factor/post/types"

import { setting } from "@factor/api/settings"
import { slugify, emitEvent } from "@factor/api"
import { navigateToRoute, currentRoute } from "@factor/app/router"

import { postType } from "."

export const loadAndStoreIndex = async (): Promise<void> => {
  const route = currentRoute()
  const { query } = route
  const {
    tag = "",
    category = "",
    order = IndexOrderBy.Latest,
    time = IndexTimeFrame.AllTime,
    page = "1",
    search = ""
  } = query as Record<string, string>

  const limit =
    page == "1" ? setting("forum.indexLimit") - 1 : setting("forum.indexLimit")

  await requestPostIndex({
    postType,
    tag,
    category,
    status: PostStatus.Published,
    order: order as IndexOrderBy,
    time: time as IndexTimeFrame,
    search,
    page: parseInt(page),
    limit,
    conditions: {
      source: setting("package.name")
    }
  })

  return
}

/**
 * Request to create a new topic
 */
export const saveTopic = async (post: FactorPost): Promise<FactorPost | never> => {
  return await requestPostSave({ post, postType })
}

export const deleteTopic = async (postId: string): Promise<void> => {
  const confirmed = confirm("Are you sure? This will permanently delete this post")

  if (confirmed) {
    await requestPostDeleteMany({ _ids: [postId], postType })

    emitEvent("notify", "Topic deleted")
    navigateToRoute({ name: "forumIndex" })
  }

  return
}

export const saveTopicReply = async (
  postId: string,
  embeddedPost: UnsavedFactorPost
): Promise<FactorPost | never> => {
  return await requestPostSaveEmbedded({ postId, embeddedPost, postType })
}

/**
 * Gets a link to a topic based on its post
 */
export const topicLink = (topicPost: FactorPost): string => {
  const parts = [
    setting("forum.postRoute"),
    topicPost.permalink,
    slugify(topicPost.title)
  ]

  return parts.join("/")
}

/**
 * Navigates to a topic thread
 */
export const redirectToTopic = (topicPost: FactorPost): void => {
  navigateToRoute({ path: topicLink(topicPost) })
}

/**
 * Gets a link to edit a topic
 */
export const editTopic = (topicPost: FactorPost): void => {
  navigateToRoute({ name: "editTopic", query: { _id: topicPost._id } })
}
