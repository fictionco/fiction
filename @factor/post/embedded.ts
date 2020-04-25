import { EndpointMeta } from "@factor/endpoint/types"
import { randomToken } from "@factor/api"

import { PostActions, FactorPost, FactorPostState, UpdatePostEmbedded } from "./types"
import { postPermission } from "./util"
import { getModel, dbIsOffline } from "./database"

/**
 * Operations on embedded docs
 */
export const embeddedPost = async (
  {
    action,
    embeddedPostId,
    data,
    postType = "post",
    postId,
    skip = 0,
    limit = 100,
  }: UpdatePostEmbedded,
  { bearer }: EndpointMeta
): Promise<FactorPostState> => {
  if (dbIsOffline()) return

  const Model = getModel(postType)

  const parent = await Model.findById(postId)

  if (parent) {
    let operation

    if (action == "save" && data && data._id) {
      operation = PostActions.Update
    } else if (action == "save") {
      operation = PostActions.Create
    } else if (action == "delete") {
      operation = PostActions.Delete
    } else if (action == "retrieve") {
      operation = PostActions.Retrieve
    } else {
      return
    }

    const permissable = postPermission({
      post: parent,
      bearer,
      action: operation,
      embedded: true,
    })

    if (!permissable) return

    if (action == "retrieve") {
      const post = await Model.findOne(
        {
          _id: postId,
        },
        {
          embedded: { $slice: [skip, limit] },
        }
      )
        .select("+embedded")
        .exec()
      return post ?? undefined
    } else if (action == "save") {
      if (!data) return

      data.updatedAt = new Date().toISOString()

      // Already exists
      if (data._id) {
        // No way to merge array entries, so we set each explicitly
        const setter: Record<string, any> = {}

        Object.entries(data).forEach(([key, value]) => {
          setter[`embedded.$.${key}`] = value
        })

        await Model.updateOne({ _id: postId, "embedded._id": data._id }, { $set: setter })
      } else {
        data._id = `${postId}-${randomToken(8)}`
        data.createdAt = new Date().toISOString()
        await Model.update(
          { _id: postId },
          { $push: { embedded: data as FactorPost }, $inc: { embeddedCount: 1 } }
        )
      }

      const post = await Model.findById(postId, {
        embedded: { $elemMatch: { _id: data._id } },
      })

      return post && post.embedded ? post.embedded[0] : undefined
    } else if (action == "delete") {
      await Model.update(
        { _id: postId },
        { $pull: { embedded: { _id: embeddedPostId } }, $inc: { embeddedCount: -1 } }
      )
    }
  }

  return
}
