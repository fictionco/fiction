import { addCallback } from "@factor/api/hooks"
import { CurrentUserState } from "@factor/user/types"
import { decodeTokenIntoUser } from "@factor/user/jwt"
import * as endpointHandler from "@factor/post/server"
import { EndpointMeta } from "@factor/endpoint/types"
import { addEndpoint } from "@factor/api/endpoints"
import { randomToken, timeUtil, omit } from "@factor/api"

import {
  PostActions,
  FactorPost,
  UnsavedFactorPost,
  FactorPostState,
  UpdatePostEmbedded,
  PostIndexAggregations,
  PostIndexCounts,
  PostIndexRequestParameters,
  PostIndex,
  UpdateManyPosts,
  PostRequestParameters,
  IndexTimeFrame,
  SortDelimiters
} from "./types"
import { manyPostsPermissionCondition, postPermission } from "./util"
import {
  getModel,
  dbInitialize,
  dbDisconnect,
  dbSetupUtility,
  dbIsOffline
} from "./database"

/**
 * Save a post to database
 * @param data - Data to save
 * @param postType - Post type
 * @param bearer - User that is saving the data
 */
export const savePost = async <T = {}>(
  {
    data,
    postType = "post"
  }: { data: FactorPost | UnsavedFactorPost | T; postType: string },
  { bearer, source }: EndpointMeta
): Promise<FactorPostState> => {
  if (dbIsOffline()) return

  let post
  let action = PostActions.Update

  const Model = getModel(postType)

  const { _id = "" } = data as FactorPost

  if (_id) post = await Model.findById(_id)

  /**
   * If no id is set or post, set up a new one
   */
  if (!_id || !post) {
    action = PostActions.Create
    post = new Model({ source })
  }

  Object.assign(post, data)

  if (postPermission({ post, bearer, action })) {
    await post.save()

    /**
     * instead of returning the data that is saved,
     * only return the data that is retrieved in a query
     * this way only intended items are returned (e.g. password)
     */
    const returnPost = await Model.findById(post._id)

    return returnPost ? returnPost : undefined
  } else {
    return
  }
}

/**
 * Operations on embedded docs
 */
export const embeddedAction = async (
  {
    action,
    embeddedPostId,
    data,
    postType = "post",
    postId,
    skip = 0,
    limit = 100
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
      embedded: true
    })

    if (!permissable) return

    if (action == "retrieve") {
      const post = await Model.findOne(
        {
          _id: postId
        },
        {
          embedded: { $slice: [skip, limit] }
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
          { $push: { embedded: data }, $inc: { embeddedCount: 1 } }
        )
      }

      const post = await Model.findById(postId, {
        embedded: { $elemMatch: { _id: data._id } }
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

/**
 * Get a single post from the DB.
 * @param params - selection parameters
 * @param meta - endpoint meta, including bearer
 */
export const getSinglePost = async (
  params: PostRequestParameters,
  meta: EndpointMeta = {}
): Promise<FactorPostState> => {
  const { bearer } = meta
  let { _id } = params

  const { token, postType = "post", conditions, createOnEmpty = false } = params

  let _post

  const Model = getModel(postType)

  if (!Model || dbIsOffline()) return

  // If token is sent, then return Post associated with it
  if (token) {
    const user = decodeTokenIntoUser(token)
    _id = user._id
  }

  // If ID is available, first look for it.
  if (_id) {
    _post = await Model.findById(_id)
  } else if (conditions) {
    _post = await Model.findOne(conditions)
  }

  if (
    _post &&
    !postPermission({
      post: _post,
      bearer,
      action: PostActions.Retrieve
    })
  ) {
    return
  } else if (!_post && createOnEmpty) {
    /**
     * If ID is unset or if it isn't found, create a new post model/doc
     * This is not saved at this point, leading to a post sometimes not existing although an ID exists
     */
    const initial = { author: bearer && bearer._id ? [bearer._id] : null }

    _post = new Model(initial)
  } else if (!_post) {
    return
  }

  return _post
}

/**
 * Set these types as they are passed into hooks
 */
export type UpdateManySetter = { $set: any }
export type UpdateManyOptions = { multi: boolean; bearer: CurrentUserState }
/**
 * Update many posts at the same time
 */
export const updateManyById = async (
  { _ids, postType = "post", data }: UpdateManyPosts,
  { bearer }: EndpointMeta
): Promise<FactorPost[]> => {
  const permissionCondition = manyPostsPermissionCondition({
    bearer,
    action: PostActions.Update,
    postType
  })

  const r = await getModel(postType).update(
    { $and: [permissionCondition, { _id: { $in: _ids } }] },
    { $set: data } as UpdateManySetter,
    { multi: true, bearer } as UpdateManyOptions
  )

  return r
}
/**
 * Delete many posts by _id
 */
export const deleteManyById = async (
  { _ids, postType = "post" }: UpdateManyPosts,
  { bearer }: EndpointMeta
): Promise<void> => {
  const permissionCondition = manyPostsPermissionCondition({
    bearer,
    action: PostActions.Delete,
    postType
  })

  await getModel(postType).remove({
    $and: [permissionCondition, { _id: { $in: _ids } }]
  })

  return
}

/**
 * Gets an array of posts based on an array of _ids
 */
export const populatePosts = async ({ _ids }: UpdateManyPosts): Promise<FactorPost[]> => {
  if (dbIsOffline()) return []

  const _in = Array.isArray(_ids) ? _ids : [_ids]

  const result = await getModel("post").find({ _id: { $in: _in } })

  return result
}

export const postList = async (
  params: PostIndexRequestParameters,
  { bearer, source }: EndpointMeta
): Promise<FactorPost[]> => {
  if (dbIsOffline()) return []

  const { postType, select = null, sameSource = false } = params
  let { options, conditions = {} } = params

  options = Object.assign(
    {},
    {
      sort: { createdAt: SortDelimiters.Descending },
      limit: 20,
      skip: 0
    },
    options
  )

  if (sameSource && source) {
    conditions.source = source
  }

  conditions = {
    ...conditions,
    ...manyPostsPermissionCondition({
      bearer,
      action: PostActions.Retrieve,
      postType
    })
  }

  return await getModel(postType).find(conditions, select, options)
}

export const indexMeta = async ({
  postType,
  conditions,
  options
}: PostIndexRequestParameters): Promise<PostIndexAggregations & PostIndexCounts> => {
  const { limit = 20, skip = 0 } = options || {}
  const ItemModel = getModel(postType)

  /**
   * $facet - processes several aggregation stages on a query
   */
  const aggregate = [
    { $match: conditions },
    {
      $facet: {
        tags: [{ $unwind: "$tag" }, { $sortByCount: "$tag" }],
        category: [{ $unwind: "$category" }, { $sortByCount: "$category" }],
        status: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 }
            }
          }
        ],
        role: [
          {
            $group: {
              _id: "$role",
              count: { $sum: 1 }
            }
          }
        ]
      }
    }
  ]

  const [aggregations, totalForQuery, total] = await Promise.all([
    ItemModel.aggregate(aggregate).exec(),
    ItemModel.find(conditions).count(),
    ItemModel.count({})
  ])

  const pageCount = !totalForQuery ? 1 : Math.ceil(totalForQuery / limit)
  const pageCurrent = 1 + Math.floor(skip / limit)

  const _out = { ...aggregations[0], total, totalForQuery, pageCount, pageCurrent }

  return _out
}

/**
 * Transform standard sorts and filters into Database API
 */
const transformIndexParameters = (
  params: PostIndexRequestParameters
): PostIndexRequestParameters => {
  const { options, conditions } = params
  const { order, time, search } = options
  let { sort } = options

  if (search) {
    // https://docs.mongodb.com/manual/text-search/
    const searchCondition = { $text: { $search: search } }
    params.conditions = { ...conditions, ...searchCondition }
  } else {
    if (order == "popular") {
      sort = {
        embeddedCount: SortDelimiters.Descending,
        createdAt: SortDelimiters.Descending
      }
    }

    // remove non-db paths
    params.options = omit({ ...options, sort }, "order", "time", "search")

    if (time && time != IndexTimeFrame.AllTime) {
      const timeHorizon = timeUtil().subtract(1, time)
      const timeCondition = { createdAt: { $gte: timeHorizon.toDate() } }
      params.conditions = { ...conditions, ...timeCondition }
    }
  }

  return params
}

/**
 * Gets an index of posts along with meta information like counts
 */
export const postIndex = async (
  params: PostIndexRequestParameters,
  { bearer, source }: EndpointMeta
): Promise<PostIndex> => {
  if (dbIsOffline()) return { meta: {}, posts: [] }

  const dbParams = transformIndexParameters(params)

  const { postType, sameSource = false } = dbParams
  let { options, conditions = {} } = dbParams

  options = Object.assign(
    {},
    {
      sort: { date: SortDelimiters.Descending, createdAt: SortDelimiters.Descending },
      limit: 20,
      skip: 0
    },
    options
  )

  if (sameSource && source) {
    conditions.source = source
  }

  conditions = {
    ...conditions,
    ...manyPostsPermissionCondition({
      bearer,
      action: PostActions.Retrieve,
      postType
    })
  }

  const [counts, posts] = await Promise.all([
    indexMeta({ postType, conditions, options }),
    getModel(postType)
      .find(conditions, null, options)
      .exec()
  ])

  return { meta: { ...counts, ...options, conditions }, posts }
}

export const setup = (): void => {
  addEndpoint({ id: "posts", handler: endpointHandler })

  if (process.env.DB_CONNECTION) {
    addCallback({
      key: "db",
      hook: "initialize-server",
      callback: async () => {
        /**
         * This is async but we shouldn't wait for it
         * as it adds time to loading
         */
        dbInitialize()

        return
      }
    })
    addCallback({ key: "db", hook: "close-server", callback: () => dbDisconnect() })
  }

  /**
   * Add DB Setup CLI
   */
  dbSetupUtility()
}

setup()
