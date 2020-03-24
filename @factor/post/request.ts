import { endpointRequest, EndpointParameters } from "@factor/endpoint"
import { stored, storeItem } from "@factor/app/store"
import { timestamp } from "@factor/api/time"
import { isNode } from "@factor/api"
import objectHash from "object-hash"
import {
  FactorPost,
  FactorPostKey,
  FactorPostState,
  UpdatePost,
  UpdatePostEmbedded,
  UpdateManyPosts,
  PostRequestParameters,
  PostIndexParametersFlat,
  PostIndexRequestParameters,
  PostIndex,
  PostStatus,
  PostIndexConditions
} from "./types"
import { getSchemaPopulatedFields } from "./util"

/**
 * For lists of posts, we don't want to call/populate on every page nav if not needed
 * So we set a cache that can be invalidated if any posts in that post type change
 * @param postType - post type
 */
export const setLocalPostTypeCache = (postType: string): void => {
  storeItem(`${postType}Cache`, timestamp())
}

/**
 * Used to identify if an identical query has already been made with no changes to the post type in between
 * @param postType - post type
 */
export const localPostTypeCache = (postType: string): any => {
  return stored(`${postType}Cache`) || ""
}

/**
 * Sends an endpoint request
 * @param method - endpoint method
 * @param params - parameters to call endpoint method with
 */
export const sendPostRequest = async <T = unknown>(
  method: string,
  params: EndpointParameters
): Promise<T> => {
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
export const requestPostPopulate = async <T extends FactorPostKey>({
  posts,
  depth = 10
}: {
  posts: T[];
  depth?: number;
}): Promise<string[]> => {
  let _ids: string[] = []

  posts.forEach((post: T) => {
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

/**
 * Populate joined fields, will add this post and all others to store
 * In BROWSER - DON'T WAIT, but we should not wait for it, data will be loaded to store
 * In SERVER - WAIT - SSR needs to have all store information so it will be picked up on load
 */
export const handlePostPopulation = async (
  post: FactorPostState,
  { depth = 10 }: { depth?: number } = {}
): Promise<void> => {
  if (post) {
    const embedded = post.embedded ?? []
    const posts = [post, ...embedded]

    if (isNode) {
      await requestPostPopulate({ posts, depth })
    } else {
      requestPostPopulate({ posts, depth })
    }
  }

  return
}

/**
 * Sends an endpoint request to save a post
 */
export const requestPostSave = async <T extends FactorPostState | never>({
  post,
  postType
}: UpdatePost): Promise<T> => {
  const _post = await sendPostRequest<T>("savePost", { data: post, postType })
  setLocalPostTypeCache(postType)
  await handlePostPopulation(_post)

  return _post
}

export const requestEmbeddedAction = async <T extends FactorPostState | never>(
  _arguments: UpdatePostEmbedded & EndpointParameters
): Promise<T> => {
  const _post = await sendPostRequest<T>("embeddedAction", _arguments)
  setLocalPostTypeCache(_arguments.postType)

  await handlePostPopulation(_post)

  return _post
}

/**
 * Send an HTTP request to save data to multiple posts at the same time
 * @param _ids - array of post Ids
 * @param data - the data that should be saved/updated
 * @param postType - the post type
 */
export const requestPostSaveMany = async ({
  _ids,
  data,
  postType
}: UpdateManyPosts): Promise<FactorPost[]> => {
  setLocalPostTypeCache(postType)
  const result = await sendPostRequest("updateManyById", { data, _ids, postType })

  return result as FactorPost[]
}

export const requestPostDeleteMany = async ({
  _ids,
  postType
}: UpdateManyPosts): Promise<FactorPost[]> => {
  setLocalPostTypeCache(postType)

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
    log = "",
    _id,
    token,
    createOnEmpty = false,
    status = "all",
    depth = 50
  } = _arguments

  const params: PostRequestParameters = { postType, createOnEmpty, status, log }

  if (_id) {
    params._id = _id
  } else if (permalink) {
    params.conditions = { [field]: permalink }
  } else if (token) {
    params.token = token
  }

  // If this post is in the store, don't get it again
  let post = stored(_id)

  if (!post) {
    post = (await sendPostRequest("getSinglePost", params)) as FactorPost
  }

  await handlePostPopulation(post, { depth })

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
  const {
    limit = 20,
    page = 1,
    postType,
    sort,
    order,
    time,
    search,
    cache = true,
    sameSource = false,
    conditions = {}
  } = _arguments

  let { storeKey } = _arguments
  const queryHash = objectHash({ ..._arguments, cache: localPostTypeCache(postType) })
  const storedIndex = stored(queryHash)

  const skip = (page - 1) * limit

  storeKey = storeKey ? storeKey : postType

  /**
   * Create a mechanism to prevent multiple runs/pops for same data
   */
  if (storedIndex && cache) {
    storeItem(storeKey, storedIndex)
    return storedIndex
  }

  const params: PostIndexRequestParameters = {
    conditions,
    postType,
    options: { limit, skip, page, sort, order, time, search },
    sameSource
  }

  const taxonomies: (keyof PostIndexConditions)[] = ["tag", "category", "status", "role"]
  taxonomies.forEach(_ => {
    if (_arguments[_]) params.conditions[_] = _arguments[_]
  })

  if (!_arguments.status) params.conditions.status = { $ne: PostStatus.Trash }

  const result = await sendPostRequest("postIndex", params)

  /**
   * IF no result, then an error was thrown
   */
  if (result) {
    const { posts, meta } = result as PostIndex

    storeItem(queryHash, { posts, meta })
    storeItem(storeKey, { posts, meta })

    await requestPostPopulate({ posts, depth: 20 })

    return { posts, meta }
  } else {
    return { posts: [], meta: {} }
  }
}

/**
 * Gets List of Posts
 * The difference with 'index' is that there is no meta information returned
 * @param _arguments
 */
export const requestPostList = async (
  _arguments: PostIndexParametersFlat
): Promise<FactorPost[]> => {
  const {
    limit = 10,
    page = 1,
    postType,
    sort,
    depth = 20,
    conditions = {},
    sameSource
  } = _arguments

  const skip = (page - 1) * limit

  const posts = (await sendPostRequest("postList", {
    postType,
    conditions,
    options: { limit, skip, page, sort },
    sameSource
  })) as FactorPost[]

  await requestPostPopulate({ posts, depth })

  return posts
}
