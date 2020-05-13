---
title: Working With Posts
description: Work with Factor's post system to create blogs, listings, eCommerce and more.
---

# Working with Posts

Every document in the database is considered a post. All posts share some standard functionality but can be extended and changed in big ways based on post type. In this document, we'll go over ways to work with posts in Factor.

## Post Types

When doing advanced work with posts, the first step in many cases is to [create and configure a new post type](./post-types). This allows you to set up a unique set of posts with a custom schema, data handling, and management configuration.

This example adds two post types and connects them via population. Whenever the `example` post type is queried; population will get the posts listed in `anotherList` and replace the `_id`'s with post objects.

```js
import { addPostType, ObjectId } from "@factor/api"

addPostType({
  postType: "example",
  schemaPopulated: ["anotherList"],
  schemaDefinition: {
    exampleTitle: String,
    anotherList: [{ ref: "anotherPostType", type: ObjectId }],
  },
})

addPostType({
  postType: "anotherPostType",
  schemaDefinition: {
    anotherTitle: String,
  },
})
```

> Doc - Read the [post types doc](./post-types) for more information on setting up post types

## Posts and the Store

The post system is designed to work smoothly with the [flat store](./working-with-data).

Whenever posts are queried they are added to the store directly and which makes them available throughout Factor by `_id`. This simplifies things since we don't need to pass around posts anymore, only their `_id`.

A simplified example:

```js
import { requestPostSingle, storeItem } from "@factor/api"

const post = requestPostSingle({ _id })

storeItem(_id, post)
```

Now later in a component:

```html
<template>
  <div>{{post.title}}</div>
</template>
<script>
  import {stored} from "@factor/api"
  export default {
    props: {
      // Pass only the _id to the component
      postId: {type: String}
    }
    computed: {
      // Using stored() we get the full post
      post(){ return stored(this.postId)}
    }
  }
</script>
```

The above makes posts portable and universal. This results in making posts easy to move around and work with because you're only working with the post `_id`s.

## Post Population

Factor allows you to populate posts based on their post type configuration. This happens automatically with native post request functions like `requestPostIndex` but you can also use the `requestPostPopulate` function.

```js
// Get posts from DB
const posts = await myEndpointRequest("customQuery")

// Populate posts to the store based on their post type
await requestPostPopulate({ posts, context: "list" })
```

The result of the above is that all the retrieved posts are in the store along with the posts from their populated fields.

## Requesting Single Posts and Indexes

The two most common post requests you'll be doing are requesting single posts and requesting post lists or indexes of posts that include meta information about them (total count, categories, etc..)

Factor provides three native helpers to make these easy:

## Request Single Post

To request a single post, use the `requestPostSingle` function. The post and populated fields will be added to the store automatically.

```js
import {requestPostSingle} from "@factor/api"

// Get post by permalink
const post = await requestPostSingle({ permalink: "my-permalink"})

// Get post by _id
const post = await requestPostSingle({ _id: "---objectId---"})

// Get post by conditions
const post = await requestPostSingle({ conditions: {title: "Post Title"}})

// Advanced condition
const post = await requestPostSingle({ conditions: {$text: { $search: search }}})

// Additional options
requestPostSingle({
  _id: "---objectId---",
  log: "myExampleContext", // Logs the context on request, useful for optimization
  createOnEmpty: true // creates a new post if it doesn't exist (requires post type, doesn't save)
  postType: "blog" // required for 'createOnEmpty'
})
```

> **createOnEmpty**
> If you pass the `createOnEmpty` property, the requested post will be created if it doesn't exist.

## Requesting Post Lists and Indexes

Often you'll want to get lists or indexes of posts. An index also returns meta information like total count, taxonomy information (e.g. count per category)

Let's walk through the native helper `requestPostIndex`...

```js
const {posts, meta} = requestPostIndex({
  limit: 20, // posts per page
  page: 1, // page number
  postType: "blog", // post type
  status: "published" // publication status (published | draft | trash)
  sort: {createdAt: "descending"} // query sort
})

// you can also query by conditions
const {posts, meta} = requestPostIndex({
  postType: "blog", // post type
  conditions: { additionalCondition: "fieldValue" },
})

// common conditions are supported as options
const {posts, meta} = requestPostIndex({
  postType: "blog", // post type
  search: "my search term", // sets search condition
  tag: "my-tag", // gets by tag
  category: "my-category", // gets by category
  time: "day", // posts created within time range (momentJS) "day" | "week" | "month"
  cache: false // cache unique indexes in the store prevents reruns for same data (default: true)
})
```

- `sort` - Sorting is handled by [Mongoose sort](https://mongoosejs.com/docs/api/query.html#query_Query-sort)

### Indexes and the Store

When you request an index, the index is added to the store with a `storeKey` which defaults to the name of the post type (`postType`). You can change this if you need to run multiple indexes of the same post type on the same page.
Query to the arguments provided. This prevents you from running the same queries over and over again as a user navigates.

```js
const { posts, meta } = requestPostIndex({
  postType: "blog", // post type
  storeKey: "exampleList",
  cache: false, // run every time instead of use stored cache (default: true)
})
```

```js
// blog-single.vue
export default {
  computed: {
    post() {
      return stored("exampleList") || {}
    },
  },
}
```

### Returned Meta Information

Post index queries return meta information about the query and results. This is useful for displaying pagination, taxonomy, links, and info to the user.

```json
{
  "page": 1,
  "pageCount": 10,
  "pageCurrent": 1,
  "total": 3,
  "totalForQuery": 3,
  "category": [{ "_id": "my-category", "count": 1 }],
  "tag": [{ "_id": "my-tag", "count": 1 }],
  "role": [{ "_id": "my-role", "count": 1 }],
  "status": [{ "_id": "my-status", "count": 1 }]
}
```

## Saving A Single Post

## Updating or Deleting Multiple Posts

In some cases, you'll want to update or delete multiple posts at a time. Factor offers some utilities for this as well:

```js
const posts = requestPostSaveMany({
  _ids: ["---objectId---", "---objectId---"],
  data: { dataToSaveToEach: true },
  postType: "blog",
})

const posts = requestPostDeleteMany({
  _ids: ["---objectId---", "---objectId---"],
  postType: "blog",
})
```

## Permalink Prefetching

When navigating an app it is common to want post information that is related to a permalink that is in the URL. To help with this Factor will prefetch post information that corresponds to a `permalink` or `_id` if it is available in the route.

This helps reduce boilerplate and reduces errors in handling this information yourself. To implement it, all that is needed is to add a route with a parameter of `permalink`.

```js
addContentRoute({
  path: "/blog/:permalink",
  component: () => import("./blog-single.vue"),
})
```

When you've done that, the post that corresponds to `permalink` will be pre-fetched and added to the store with the key of `permalink`.

```js
// blog-single.vue
export default {
  computed: {
    post() {
      return stored("permalink") || {}
    },
  },
}
```

## Posts on the Dashboard

When you create new post types, you'll have the option to use Factor's default post-management handling with the `managePost` option. You can also add your own handling and functionality to the dashboard via [filters](./filters-callbacks-events) if desired.

Learn more about [creating post types](./post-types).

## Embedded Posts

There are situations when you might not want to create new posts for every data point. For example, in forum threads, comments, or chat.

For this use case, Factor has an embedded post system that adds some additional tooling that makes this sort of thing easy.

Learn more about [embedded posts](./embedded-posts).

## Direct Requests On The Server

If you are working in the server environment, for example in endpoints or middleware, then you can make a direct call to server functions for posts; you only have to make sure to pass along the `bearer` parameter discussed in [endpoints and middleware](./../endpoints-and-middleware).

```js
import { savePost, getSinglePost } from "@factor/api/server"

export const myEndpoint = async (data, { bearer }) => {
  // Save a post
  await savePost({ postType: "user", data }, { bearer })

  // Get a post
  await getSinglePost({ postType: "attachment", _id: "---objectId---" }, { bearer })
}
```

> **New Posts on Save**
> If no `_id` is passed to the `savePost` function a new post will be created.
