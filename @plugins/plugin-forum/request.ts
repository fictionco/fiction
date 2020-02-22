import {
  requestPostDeleteMany,
  requestPostIndex,
  requestEmbeddedAction,
  handlePostPopulation
} from "@factor/post/request"
import {
  FactorPost,
  FactorPostState,
  PostStatus,
  IndexOrderBy,
  IndexTimeFrame,
  SortDelimiters
} from "@factor/post/types"

import { endpointRequest, EndpointParameters } from "@factor/endpoint"
import { slugify, emitEvent } from "@factor/api"
import { setting } from "@factor/api/settings"

import { navigateToRoute, currentRoute } from "@factor/app/router"

import { SubscribeUser } from "./types"
import { postType } from "."

type FactorPostForumTopic = FactorPost & {
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
 * Gets a link to a topic based on its post
 */
export const topicLink = (topicPost: FactorPostForumTopic): string => {
  const { title, _id } = topicPost
  const base = setting("forum.postRoute")
  const parts = [base, _id, slugify(title)]

  return parts.join("/")
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

export const deleteTopic = async (postId: string): Promise<void> => {
  const confirmed = confirm("Are you sure? This will permanently delete this post")

  if (confirmed) {
    await requestPostDeleteMany({ _ids: [postId], postType })

    emitEvent("notify", "Topic deleted")
    navigateToRoute({ name: "forumIndex" })
  }

  return
}

export const sendRequest = async <T = unknown>(
  method: string,
  params: EndpointParameters
): Promise<T> => {
  const result = await endpointRequest<T>({
    id: "forum",
    method,
    params
  })

  return result
}

/**
 * Request to create a new topic
 */
export const requestSaveTopic = async (
  post: FactorPostForumTopic,
  subscribe?: boolean
): Promise<FactorPostForumTopic | undefined | never> => {
  const topic = await sendRequest<FactorPostForumTopic>("saveTopic", { post, subscribe })

  redirectToTopic(topic)

  return topic
}

export const requestSaveTopicReply = async (
  postId: string,
  reply: FactorPost,
  subscribe = false
): Promise<FactorPostState> => {
  const result = await sendRequest<FactorPost>("saveTopicReply", {
    postId,
    reply,
    subscribe
  })

  handlePostPopulation(result)
  emitEvent("notify", "Reply saved")

  return result
}

export const deleteTopicReply = async (
  postId: string,
  embeddedPostId: string
): Promise<FactorPostState> => {
  const result = await requestEmbeddedAction({
    action: "delete",
    postId,
    embeddedPostId,
    postType
  })

  emitEvent("notify", "Reply deleted")

  return result
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
      await requestSaveTopic({ _id: post._id, pinned: value })
    } else if (action == PostActions.Lock) {
      await requestSaveTopic({ _id: post._id, locked: value })
    } else if (action == PostActions.Delete) {
      await deleteTopic(parentId)
    } else if (action == PostActions.Edit) {
      await requestSaveTopic(post)
    }
  } else {
    if (action == PostActions.Edit) {
      await requestSaveTopicReply(parentId, post)
    } else if (action == PostActions.Delete) {
      const r = confirm("Are you sure? This reply with be permanently deleted.")
      if (r) {
        await deleteTopicReply(parentId, post._id)
      }
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
    },
    sort: {
      pinned: SortDelimiters.Descending,
      date: SortDelimiters.Descending,
      updatedAt: SortDelimiters.Descending
    }
  })

  return
}

export const requestIsSubscribed = async <T = boolean>(
  params: Omit<SubscribeUser, "subscribe">
): Promise<T> => {
  return await sendRequest<T>("isSubscribed", params)
}

export const requestSetSubscribed = async <T = boolean>(
  params: SubscribeUser
): Promise<T> => {
  return await sendRequest<T>("setSubscribed", params)
}
