import { endpointRequest } from "@factor/endpoint"
import { stored, storeItem } from "@factor/app/store"
import { timestamp } from "@factor/api/time"
import objectHash from "object-hash"
import {
  FactorPost,
  UpdatePost,
  UpdateManyPosts,
  PostRequestParameters,
  PostIndexParametersFlat,
  PostIndexRequestParameters,
  PostIndex,
  PostStatus
} from "./types"
import { getSchemaPopulatedFields } from "./util"

/**
 * For lists of posts, we don't want to call/populate on every page nav if not needed
 * So we set a cache that can be invalidated if any posts in that post type change
 * @param postType - post type
 */
const _setCache = (postType: string): void => {
  storeItem(`${postType}Cache`, timestamp())
}

/**
 * Used to identify if an identical query has already been made with no changes to the post type in between
 * @param postType - post type
 */
const _cacheKey = (postType: string): any => {
  return stored(`${postType}Cache`) || ""
}

/**
 * Sends an endpoint request
 * @param method - endpoint method
 * @param params - parameters to call endpoint method with
 */
export const sendPostRequest = async (
  method: string,
  params: object
): Promise<unknown> => {
  return await endpointRequest({ id: "posts", method, params })
}

/**
 * Populates fields in a post as determined by its Factor schema
 * @param posts - posts to populate
 * @param depth - depth of population, as given by scheme setup for population
 *
 * @remarks
 * Depth is useful as in some situations, like a long list, etc, it doesn't make sense to populate all joins
 */
export const requestPostPopulate = async ({
  posts,
  depth = 10
}: {
  posts: FactorPost[];
  depth?: number;
}): Promise<string[]> => {
  let _ids: string[] = []

  posts.forEach((post: FactorPost) => {
    storeItem(post._id, post)

    const populatedFields = getSchemaPopulatedFields({
      postType: post.postType ?? "post",
      depth
    })

    populatedFields.forEach(field => {
      const v = post[field]
      if (v) {
        if (Array.isArray(v)) {
          _ids = [..._ids, ...v]
        } else {
          _ids.push(v)
        }
      }
    })
  })

  const _idsFiltered = _ids.filter((_id, index, self) => {
    return !stored(_id) && self.indexOf(_id) === index ? true : false
  })

  if (_idsFiltered.length > 0) {
    const posts = (await sendPostRequest("populatePosts", {
      _ids: _idsFiltered
    })) as FactorPost[]

    await requestPostPopulate({ posts, depth })
  }

  return _ids
}

export const requestPostSave = async ({
  post,
  postType
}: UpdatePost): Promise<FactorPost> => {
  let result

  try {
    result = await sendPostRequest("savePost", { data: post, postType })
    _setCache(postType)
  } catch (error) {
    result = post
    throw error
  }

  return result as FactorPost
}

export const requestPostSaveMany = async ({
  _ids,
  data,
  postType
}: UpdateManyPosts): Promise<FactorPost[]> => {
  _setCache(postType)
  const result = await sendPostRequest("updateManyById", { data, _ids, postType })

  return result as FactorPost[]
}

export const requestPostDeleteMany = async ({
  _ids,
  postType
}: UpdateManyPosts): Promise<FactorPost[]> => {
  _setCache(postType)

  const result = await sendPostRequest("deleteManyById", { _ids })

  return result as FactorPost[]
}

export const requestPostSingle = async (
  _arguments: PostRequestParameters
): Promise<FactorPost> => {
  const {
    permalink,
    field = "permalink",
    postType = "post",
    _id,
    token,
    createOnEmpty = false,
    status = "all",
    depth = 50
  } = _arguments

  const params: PostRequestParameters = { postType, createOnEmpty, status }

  if (_id) {
    params._id = _id
    const existing = stored(_id)
    if (existing) {
      storeItem("post", existing)
      return existing
    }
  } else if (permalink) {
    params.conditions = { [field]: permalink }
  } else if (token) {
    params.token = token
  }

  const post = (await sendPostRequest("getSinglePost", params)) as FactorPost

  if (post) {
    // Populate fields, will add this post and all others to store
    await requestPostPopulate({ posts: [post], depth })
  }

  return post as FactorPost
}

/**
 * Gets an index of posts based on typical filters and postType
 * Also returns meta numbers like counts per category/tag
 * @param _arguments - Post index options
 */
export const requestPostIndex = async (
  _arguments: PostIndexParametersFlat
): Promise<PostIndex> => {
  const { limit = 50, page = 1, postType, sort, cache = true } = _arguments
  const queryHash = objectHash({ ..._arguments, cache: _cacheKey(postType) })
  const storedIndex = stored(queryHash)

  const skip = (page - 1) * limit

  // Create a mechanism to prevent multiple runs/pops for same data
  if (storedIndex && cache) {
    storeItem(postType, storedIndex)
    return storedIndex
  }

  const params: PostIndexRequestParameters = {
    conditions: {},
    postType,
    options: { limit, skip, page, sort }
  }

  const taxonomies = ["tag", "category", "status", "role"]
  taxonomies.forEach(_ => {
    if (_arguments[_]) params.conditions[_] = _arguments[_]
  })

  if (!_arguments.status) params.conditions.status = { $ne: PostStatus.Trash }

  const { posts, meta } = (await sendPostRequest("postIndex", params)) as PostIndex

  storeItem(queryHash, { posts, meta })
  storeItem(postType, { posts, meta })

  await requestPostPopulate({ posts, depth: 20 })

  return { posts, meta }
}

// Gets List of Posts
// The difference with 'index' is that there is no meta information returned
export const requestPostList = async (
  _arguments: PostIndexParametersFlat
): Promise<FactorPost[]> => {
  const { limit = 10, page = 1, postType, sort, depth = 20, conditions = {} } = _arguments

  const skip = (page - 1) * limit

  const posts = (await sendPostRequest("postList", {
    postType,
    conditions,
    options: { limit, skip, page, sort }
  })) as FactorPost[]

  await requestPostPopulate({ posts, depth })

  return posts
}
