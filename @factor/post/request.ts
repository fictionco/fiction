import { endpointRequest } from "@factor/endpoint"
import { stored, storeItem } from "@factor/app/store"
import { timestamp } from "@factor/tools/time"
import objectHash from "object-hash"

import { getSchemaPopulatedFields } from "./util"

function _setCache(postType) {
  storeItem(`${postType}Cache`, timestamp())
}

function _cacheKey(postType) {
  return stored(`${postType}Cache`) || ""
}

export async function sendPostRequest(method, params) {
  return await endpointRequest({ id: "posts", method, params })
}

export async function requestPostSave({ post, postType }) {
  _setCache(postType)
  return await sendPostRequest("savePost", { data: post, postType })
}

export async function requestPostSaveMany({ _ids, data, postType }) {
  _setCache(postType)
  return await sendPostRequest("updateManyById", {
    data,
    _ids
  })
}

export async function requestPostDeleteMany({ _ids, postType }) {
  _setCache(postType)
  return await sendPostRequest("deleteManyById", { _ids })
}

interface PostRequestParameters {
  _id?: string;
  status?: string;
  createOnEmpty?: boolean;
  postType?: string;
  conditions?: any;
  token?: string;
  options?: { limit?: number; skip?: number; page?: number; sort?: string };
}

export async function requestPostSingle(args) {
  const {
    permalink,
    field = "permalink",
    postType = "post",
    _id,
    token,
    createOnEmpty = false,
    status = "all",
    depth = 50
  } = args

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

  const post = await sendPostRequest("getSinglePost", params)

  if (post) {
    await requestPostPopulate({ posts: [post], depth })
  }

  return post
}

export async function requestPostIndex(_arguments) {
  const { limit = 10, page = 1, postType, sort } = _arguments
  const queryHash = objectHash({ ..._arguments, cache: _cacheKey(postType) })
  const storedIndex = stored(queryHash)

  const skip = (page - 1) * limit

  // Create a mechanism to prevent multiple runs/pops for same data
  if (storedIndex) {
    storeItem(postType, storedIndex)
    return storedIndex
  }

  const taxonomies = ["tag", "category", "status", "role"]

  const params: PostRequestParameters = {
    conditions: {},
    postType,
    options: { limit, skip, page, sort }
  }

  taxonomies.forEach((_) => {
    if (_arguments[_]) params.conditions[_] = _arguments[_]
  })

  if (!_arguments.status) params.conditions.status = { $ne: "trash" }

  const { posts, meta } = await sendPostRequest("postIndex", params)

  storeItem(queryHash, { posts, meta })
  storeItem(postType, { posts, meta })

  await requestPostPopulate({ posts, depth: 20 })

  return { posts, meta }
}

// Gets List of Posts
// The difference with 'index' is that there is no meta information returned
export async function requestPostList(_arguments) {
  const { limit = 10, page = 1, postType, sort, depth = 20, conditions = {} } = _arguments

  const skip = (page - 1) * limit

  const posts = await sendPostRequest("postList", {
    postType,
    conditions,
    options: { limit, skip, page, sort }
  })

  await requestPostPopulate({ posts, depth })

  return posts
}

export async function requestPostPopulate({ posts, depth = 10 }) {
  let _ids = []

  posts.forEach((post) => {
    storeItem(post._id, post)

    const populatedFields = getSchemaPopulatedFields({
      postType: post.postType,
      depth
    })

    populatedFields.forEach((field) => {
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
    const posts = await sendPostRequest("populatePosts", { _ids: _idsFiltered })
    await requestPostPopulate({ posts, depth })
  }
}
