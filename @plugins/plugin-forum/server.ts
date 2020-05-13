import { addEndpoint } from "@factor/api/endpoints"
import { EndpointMeta } from "@factor/endpoint/types"
import { getModel } from "@factor/post/database"
import { embeddedPost, savePost } from "@factor/post/server"
import { FactorPost, FactorPostState, ObjectId } from "@factor/post/types"
import { sendEmail } from "@factor/email/server"
import { currentUrl } from "@factor/api/url"
import { runCallbacks, setting } from "@factor/api"
import { EmailTransactionalConfig } from "@factor/email/util"
import { FactorUser } from "@factor/user/types"
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

export const sendNotificationEmails = async ({
  emailAddresses,
  config,
}: {
  emailAddresses: string[]
  config: EmailTransactionalConfig
  bearer?: FactorUser
}): Promise<void> => {
  const _promises = emailAddresses.map((emailAddress) => {
    return sendEmail({ ...config, to: emailAddress })
  })

  await Promise.all(_promises)

  return
}

const getTopicUrl = (post: FactorPost): string => {
  return `${currentUrl()}${topicLink(post)}`
}

/**
 * Email all topic subscribers about response
 */
export const serverNotifySubscribers = async ({
  post,
  userId,
  reply,
}: {
  post: ForumTopicFactorPost
  userId: string
  reply: FactorPost
}): Promise<true | undefined> => {
  if (post && post !== null && post.subscriber && post.subscriber.length > 0) {
    const linkUrl = getTopicUrl(post)

    // don't forget to convert objectId to string
    const emailUsers = post.subscriber.filter(
      (sub) => sub.toString() != userId.toString()
    )

    const userPosts = await getModel<FactorUser>("user").find({
      _id: { $in: emailUsers },
    })

    await sendNotificationEmails({
      emailAddresses: userPosts.map((p) => p.email),
      config: {
        emailId: "forumTopicSubscribe",
        subject: `Re: ${post.title}`,
        text: reply.content,
        linkText: "View Topic",
        linkUrl,
        textFooter: `You are receiving this email because you are subscribed to this topic.\n<a href="${linkUrl}">Unsubscribe</a>`,
      },
    })
  }
  return true
}

export const saveTopicReply = async (
  {
    postId,
    reply,
    options,
  }: {
    postId: string
    reply: FactorPost
    options?: { subscribe?: boolean; notifySubscribers?: boolean }
  },
  { bearer }: EndpointMeta
): Promise<FactorPostState> => {
  const { subscribe, notifySubscribers } = options || {}
  const post = await getModel<ForumTopicFactorPost>(postType).findOne({ _id: postId })
  const userId = bearer?._id ?? ""
  const isNew = reply._id ? false : true
  const result = await embeddedPost(
    {
      action: "save",
      parentId: postId,
      data: reply,
      postType,
    },
    { bearer }
  )

  if (!post) return

  if (subscribe && bearer) {
    await setSubscribed({ userId, postId, subscribe })
  }

  // Async, don't wait (slow one)
  if (isNew) {
    if (notifySubscribers) {
      serverNotifySubscribers({ userId, post, reply })
    }

    const notifyEmails = setting("forum.notify.newReply")

    if (notifyEmails && notifyEmails.length > 0) {
      sendNotificationEmails({
        emailAddresses: notifyEmails,
        config: {
          emailId: "newForumTopic",
          subject: `New Topic Reply: ${reply.title}`,
          text: reply.content,
          linkText: "View Topic",
          linkUrl: getTopicUrl(reply),
        },
        bearer,
      })
    }

    await runCallbacks("forum-new-reply", { user: bearer, topic: post, reply })
  }

  return result
}

/**
 * Save a new topic
 */
export const saveTopic = async (
  { post, subscribe }: { post: FactorPost; subscribe?: boolean },
  meta: EndpointMeta
): Promise<FactorPostState> => {
  const { bearer } = meta
  const newPost = await savePost({ data: post, postType }, meta)

  if (subscribe && bearer && newPost) {
    await setSubscribed({ userId: bearer._id, postId: newPost._id, subscribe })
  }

  const notifyEmails = setting("forum.notify.newTopic")

  if (notifyEmails && notifyEmails.length > 0) {
    sendNotificationEmails({
      emailAddresses: notifyEmails,
      config: {
        emailId: "newForumTopic",
        subject: `New Topic: ${post.title}`,
        text: post.content,
        linkText: "View Topic",
        linkUrl: getTopicUrl(post),
      },
      bearer,
    })
  }

  await runCallbacks("forum-new-topic", { user: bearer, topic: post })

  return newPost
}

export const setup = (): void => {
  addEndpoint({
    id: "forum",
    handler: { isSubscribed, setSubscribed, saveTopicReply, saveTopic },
  })
}
setup()
