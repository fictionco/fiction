import { addEndpoint } from "@factor/api/endpoints"
import { EndpointMeta } from "@factor/endpoint/types"
import { getModel } from "@factor/post/database"
import { embeddedPost, savePost } from "@factor/post/server"
import { FactorPost, FactorPostState, ObjectId } from "@factor/post/types"
import { sendEmailToId } from "@factor/email/server"
import { currentUrl } from "@factor/api/url"
import { ForumTopicFactorPost, SubscribeUser } from "./types"
import { topicLink } from "./request"

// import { Document, Schema, SchemaDefinition, HookNextFunction } from "mongoose"
// import { EndpointMeta } from "@factor/endpoint/types"

const postType = "forumTopic"

export const isSubscribed = async ({
  userId,
  postId,
}: Omit<SubscribeUser, "subscribe">): Promise<boolean> => {
  const r = await getModel(postType).findOne({
    _id: postId as ObjectId,
    subscriber: userId,
  })

  return r ? true : false
}

export const setSubscribed = async (_arguments: SubscribeUser): Promise<boolean> => {
  const { userId, postId, subscribe } = _arguments

  const action = subscribe ? "$addToSet" : "$pull"

  await getModel(postType).updateOne(
    { _id: postId },
    { [action]: { subscriber: userId } }
  )

  return subscribe
}

/**
 * Email all topic subscribers about response
 */
export const notifySubscribers = async ({
  postId,
  userId,
  reply,
}: {
  postId: string
  userId: string
  reply: FactorPost
}): Promise<true | undefined> => {
  const post = await getModel<ForumTopicFactorPost>(postType).findOne({ _id: postId })

  if (post && post !== null && post.subscriber && post.subscriber.length > 0) {
    const linkUrl = `${currentUrl()}${topicLink(post)}`

    // don't forget to convert objectId to string
    const _promises = post.subscriber
      .filter((sub) => sub.toString() != userId.toString())
      .map((sub) => {
        return sendEmailToId(sub, {
          emailId: "forumTopicSubscribe",
          subject: `Re: ${post.title}`,
          text: reply.content,
          linkText: "View Topic",
          linkUrl,
          textFooter: `You are receiving this email because you are subscribed to this topic.\n<a href="${linkUrl}">Unsubscribe</a>`,
        })
      })

    await Promise.all(_promises)
  }
  return true
}

export const saveTopicReply = async (
  {
    postId,
    reply,
    subscribe,
  }: {
    postId: string
    reply: FactorPost
    subscribe: boolean
  },
  { bearer }: EndpointMeta
): Promise<FactorPostState> => {
  const userId = bearer?._id ?? ""
  const isNew = reply._id ? false : true
  const result = await embeddedPost(
    {
      action: "save",
      postId,
      data: reply,
      postType,
    },
    { bearer }
  )

  if (subscribe && bearer) {
    await setSubscribed({ userId, postId, subscribe })
  }

  // Async, don't wait (slow one)
  if (isNew) {
    notifySubscribers({ userId, postId, reply })
  }

  return result
}

export const saveTopic = async (
  { post, subscribe }: { post: FactorPost; subscribe?: boolean },
  meta: EndpointMeta
): Promise<FactorPostState> => {
  const newPost = await savePost({ data: post, postType }, meta)

  if (subscribe && meta.bearer && newPost) {
    await setSubscribed({ userId: meta.bearer._id, postId: newPost._id, subscribe })
  }
  return newPost
}

export const setup = (): void => {
  addEndpoint({
    id: "forum",
    handler: { isSubscribed, setSubscribed, saveTopicReply, saveTopic },
  })
}
setup()
