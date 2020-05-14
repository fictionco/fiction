import { EndpointMeta } from "@factor/endpoint/types"
import { randomToken } from "@factor/api"

import { PostActions, FactorPost, FactorPostState, UpdatePostEmbedded } from "./types"
import { postPermission } from "./util"
import { getModel, dbIsOffline } from "./database"

/**
 * Gets parent post with only the selected embedded post added to embedded
 * @param parentId
 * @param _id
 */
const getPostWithEmbeddedById = async (
  parentId: string,
  _id: string
): Promise<FactorPostState> => {
  const post = await getModel("post").findById(parentId, {
    embedded: { $elemMatch: { _id } },
  })

  return post ?? undefined
}

const getEmbeddedPost = async (
  parentId: string,
  _id: string
): Promise<FactorPostState> => {
  const parentPost = await getPostWithEmbeddedById(parentId, _id)

  const { embedded = [] } = parentPost || {}

  const embeddedPost = embedded[0] || {}

  return embeddedPost
}

/**
 * Operations on embedded docs
 */
export const embeddedPost = async (
  {
    action,
    _id,
    data,
    parentId,
    skip = 0,
    limit = 100,
    postType = "post",
  }: UpdatePostEmbedded,
  { bearer }: EndpointMeta
): Promise<FactorPostState> => {
  if (dbIsOffline()) return

  const Model = getModel(postType)
  const parent = await Model.findById(parentId)

  if (!parent) return

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

  const embeddedPostId = _id ? _id : data?._id

  let embeddedPost: FactorPostState | true = true
  if (embeddedPostId && parentId) {
    embeddedPost = await getEmbeddedPost(parentId, embeddedPostId)
  }

  // Check permissions
  const permissable = postPermission({
    post: parent,
    bearer,
    action: operation,
    embeddedPost,
  })

  if (!permissable) return

  if (action == "retrieve") {
    const post = await Model.findOne(
      { _id: parentId },
      { embedded: { $slice: [skip, limit] } }
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

      await Model.updateOne({ _id: parentId, "embedded._id": data._id }, { $set: setter })
    } else {
      data._id = `${parentId}-${randomToken(8)}`
      data.createdAt = new Date().toISOString()
      await Model.update(
        { _id: parentId },
        { $push: { embedded: data as FactorPost }, $inc: { embeddedCount: 1 } }
      )
    }

    return getPostWithEmbeddedById(parentId, data._id)
  } else if (action == "delete" && _id) {
    const post = getPostWithEmbeddedById(parentId, _id)
    await Model.update(
      { _id: parentId },
      { $pull: { embedded: { _id } }, $inc: { embeddedCount: -1 } }
    )

    return post
  }

  return
}
