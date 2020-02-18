import {
  requestPostSave,
  requestPostDeleteMany,
  requestPostIndex,
  requestEmbeddedAction
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

type FactorPostForumTopic = UnsavedFactorPost & {
  pinned?: boolean;
  flagged?: boolean;
  locked?: boolean;
}

export enum PostActions {
  Edit = "edit",
  Pin = "pin",
  Unpin = "unpin",
  Lock = "lock",
  Unlock = "unlock",
  Flag = "flag",
  Unflag = "unflag",
  Delete = "delete"
}
interface RunPostAction {
  action: PostActions;
  value?: boolean;
  post: FactorPost;
  parentId: string;
}

/**
 * Request to create a new topic
 */
export const saveTopic = async (
  post: FactorPostForumTopic
): Promise<FactorPostForumTopic | never> => {
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
  data: UnsavedFactorPost & { _id: string }
): Promise<void | never> => {
  await requestEmbeddedAction({ action: "save", postId, data, postType })

  emitEvent("notify", "Reply saved")

  return
}

export const deleteTopicReply = async (
  postId: string,
  embeddedPostId: string
): Promise<void | never> => {
  await requestEmbeddedAction({
    action: "delete",
    postId,
    embeddedPostId,
    postType
  })

  emitEvent("notify", "Reply deleted")

  return
}

export const postAction = async ({
  action,
  value = true,
  post,
  parentId
}: RunPostAction): Promise<void> => {
  const isParent = post._id == parentId ? true : false

  if (isParent) {
    if (action == PostActions.Pin) {
      await saveTopic({ pinned: value })
    } else if (action == PostActions.Lock) {
      await saveTopic({ locked: value })
    } else if (action == PostActions.Delete) {
      await deleteTopic(parentId)
    } else if (action == PostActions.Edit) {
      await saveTopic(post)
    }
  } else {
    if (action == PostActions.Edit) {
      await saveTopicReply(parentId, post)
    } else if (action == PostActions.Delete) {
      await deleteTopicReply(parentId, post._id)
    }
  }

  return
}

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
 * Gets a link to a topic based on its post
 */
export const topicLink = (topicPost: FactorPostForumTopic): string => {
  const { permalink, title, _id } = topicPost
  const base = setting("forum.postRoute")
  if (permalink) {
    const parts = [base, permalink, slugify(title)]

    return parts.join("/")
  } else {
    return `${base}?_id=${_id}`
  }
}

/**
 * Navigates to a topic thread
 */
export const redirectToTopic = (topicPost: FactorPostForumTopic): void => {
  navigateToRoute({ path: topicLink(topicPost) })
}

/**
 * Gets a link to edit a topic
 */
export const editTopic = (topicPost: FactorPostForumTopic): void => {
  navigateToRoute({ name: "editTopic", query: { _id: topicPost._id } })
}
