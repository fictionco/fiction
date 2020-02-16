import {
  requestPostSave,
  requestPostDeleteMany,
  requestPostIndex,
  requestPostSaveEmbedded
} from "@factor/post/request"
import { UnsavedFactorPost, FactorPost, PostStatus } from "@factor/post/types"

import { setting } from "@factor/api/settings"
import { slugify, emitEvent } from "@factor/api"
import { navigateToRoute, currentRoute } from "@factor/app/router"

import { postType } from "."

export const loadAndStoreIndex = async (): Promise<void> => {
  const route = currentRoute()
  const { params, query } = route

  const tag = params.tag ?? query.tag ?? ""
  const category = params.category ?? query.category ?? ""
  const page = parseInt(params.page ?? query.page ?? 1)
  const limit = page === 1 ? setting("forum.indexLimit") - 1 : setting("forum.indexLimit")

  await requestPostIndex({
    postType,
    tag,
    category,
    status: PostStatus.Published,
    sort: "-date",
    page,
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
