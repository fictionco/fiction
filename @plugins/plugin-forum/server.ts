import { addPostSchema } from "@factor/post/util"
import forumSchema from "./schema"
import { addEndpoint } from "@factor/api/endpoints"
import { EndpointMeta } from "@factor/endpoint/types"
import { getModel } from "@factor/post/database"
import { embeddedAction } from "@factor/post/server"
import { FactorPost, FactorPostState } from "@factor/post/types"
import { ForumTopicFactorPost } from "./types"
import { sendTransactionalEmailToId } from "@factor/email/server"
import { topicLink } from "./request"
import { currentUrl } from "@factor/api/url"
// import { Document, Schema, SchemaDefinition, HookNextFunction } from "mongoose"
// import { EndpointMeta } from "@factor/endpoint/types"
import { SubscribeUser } from "./types"

const postType = "forumTopic"

export const isSubscribed = async ({
  userId,
  postId
}: Omit<SubscribeUser, "subscribe">): Promise<boolean> => {
  const r = await getModel(postType).findOne({ _id: postId, subscriber: userId })

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
  reply
}: {
  postId: string
  userId: string
  reply: FactorPost
}): Promise<true | undefined> => {
  const post = await getModel<ForumTopicFactorPost>(postType).findOne({ _id: postId })

  if (post && post !== null && post.subscriber && post.subscriber.length > 0) {
    const linkUrl = `${currentUrl()}${topicLink(post)}`
    const _promises = post.subscriber
      .filter(sub => sub != userId)
      .map(sub => {
        return sendTransactionalEmailToId(sub, {
          emailId: "forumTopicSubscribe",
          subject: `Re: ${post.title}`,
          text: reply.content,
          linkText: "View Topic",
          linkUrl,
          textFooter: `You are receiving this email because you are subscribed to this topic.\n<a href="${linkUrl}">Unsubscribe</a>`
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
    subscribe
  }: {
    postId: string
    reply: FactorPost
    subscribe: boolean
  },
  { bearer }: EndpointMeta
): Promise<FactorPostState> => {
  const userId = bearer?._id ?? ""
  const isNew = reply._id ? false : true
  const result = await embeddedAction(
    {
      action: "save",
      postId,
      data: reply,
      postType
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

export const setup = (): void => {
  addPostSchema(() => forumSchema)
  addEndpoint({ id: "forum", handler: { isSubscribed, setSubscribed, saveTopicReply } })
}
setup()
