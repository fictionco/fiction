import { applyFilters } from "@factor/tools/filters"
import { currentRoute } from "@factor/app/router"
import { emitEvent } from "@factor/tools/events"
import { endpointRequest } from "@factor/endpoint"
import { setPostMetatags } from "@factor/tools/metatags"
import { stored, storeItem } from "@factor/app/store"
import { timestamp } from "@factor/tools/time"
import { toLabel } from "@factor/tools/utils"
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

export async function preFetchPost({ to = null, clientOnly = false } = {}) {
  const route = to || currentRoute()

  const request = applyFilters("post-params", {
    ...route.params,
    ...route.query,
    status: "published"
  })

  const { permalink, _id } = request

  // Only add to the filter if permalink is set. That way we don't show loader for no reason.
  if (
    (!permalink && !_id) ||
    permalink == "__webpack_hmr" ||
    /\.(png|jpg|gif|svg|ico)$/.test(permalink)
  ) {
    return {}
  }
  // For pre-fetching that happens only in the browser
  // If this applied on server it causes a mismatch (store set with full post then set to loading)
  if (clientOnly) {
    storeItem("post", { loading: true })
  }

  const post = await requestPostSingle(request)

  storeItem("post", post)

  if (post) setPostMetatags(post._id)

  return post
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

  const params = { postType, createOnEmpty, status }

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
    await requestPostsPopulate({ posts: [post], depth })
  }

  return post
}

export async function requestPostById({ _id, postType = "post", createOnEmpty = false }) {
  const _post = await sendPostRequest("getSinglePost", { _id, postType, createOnEmpty })

  if (_post) {
    storeItem(_post._id, _post)
  }

  return _post
}

export async function requestPostIndex(_arguments) {
  const { limit = 10, page = 1, postType, sort } = _arguments
  const queryHash = objectHash({ ..._arguments, cache: _cacheKey(postType) })
  const storedIndex = stored(queryHash)

  // Create a mechanism to prevent multiple runs/pops for same data
  if (storedIndex) {
    storeItem(postType, storedIndex)
    return storedIndex
  }

  const taxonomies = ["tag", "category", "status", "role"]

  const conditions = {}
  taxonomies.forEach(_ => {
    if (_arguments[_]) conditions[_] = _arguments[_]
  })

  if (!_arguments.status) conditions.status = { $ne: "trash" }

  const skip = (page - 1) * limit

  const { posts, meta } = await sendPostRequest("postIndex", {
    postType,
    conditions,
    options: { limit, skip, page, sort }
  })

  storeItem(queryHash, { posts, meta })
  storeItem(postType, { posts, meta })

  await requestPostsPopulate({ posts, depth: 20 })

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

  await requestPostsPopulate({ posts, depth })

  return posts
}

export async function requestPostsPopulate({ posts, depth = 10 }) {
  let _ids = []

  posts.forEach(post => {
    storeItem(post._id, post)

    const populatedFields = getSchemaPopulatedFields({
      postType: post.postType,
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
    const posts = await sendPostRequest("populatePosts", { _ids: _idsFiltered })
    await requestPostsPopulate({ posts, depth })
  }
}

// Verify a permalink is unique,
// If not unique, then add number and recursively verify the new one
export async function requestPermalinkVerify({ permalink, id, field = "permalink" }) {
  const post = await requestPostSingle({ permalink, field })

  if (post && post.id != id) {
    emitEvent("notify", `${toLabel(field)} "${permalink}" already exists.`)
    let num = 1

    var matches = permalink.match(/\d+$/)

    if (matches) num = parseInt(matches[0]) + 1

    permalink = await requestPermalinkVerify({
      permalink: `${permalink.replace(/\d+$/, "")}${num}`,
      id
    })
  }
  return permalink
}
