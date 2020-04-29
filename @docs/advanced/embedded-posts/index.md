---
title: Embedded Posts
description: Working with embedded post documents
---

# Embedded Posts

In some cases it isn't practical to create new posts for every data item needed. Examples of this are comments or chat messages where messages easily grow into the thousands.

In situations like this, it's easier and more practical to use embedded posts. What are embedded posts? Just posts within posts.

Factor has a tool to help you with embedded posts that is built on the post system.

## Basics

Embedded posts add two fields to posts: `embedded` and `embeddedCount`.

- **Embedded Posts** `post.embedded` - An array of embedded posts
- **Embedded Post Count** `post.embeddedCount` - The total number of embedded posts

Factor provides a function to help with embedded posts

- `embeddedPost` on the server and
- `requestEmbeddedPost` in the client.

## Saving

To save new embedded posts from the client you'll only need to know the `_id` for the parent post. Once you have that you can use the `requestEmbeddedPost` function.

```js
import {requestEmbeddedPost, currentUserId} from "@factor/api"

const myFunction = async (parentId) => {

  // Set up a post
  const postData = {
    title: "My embedded post title"
    content: "Embedded post content",
    author: [currentUserId()]
  }

  // Save as embedded
  await requestEmbeddedPost({
    action: "save",
    data: postData,
    parentId
  })
}

```

When the embedded post is saved, it's pushed onto the end of the embedded posts array for the post document.

## Retrieving

To retrieve a list of embedded post you can use the same `requestEmbeddedPost` function. Note that the parent post is returned with the embedded posts available under `embedded` and total count of embedded posts under `embeddedCount`.

```js
export const myFunction = async () => {
  const post = await requestEmbeddedPost({
    parentId, // parent post ID
    skip: 0, // embedded post to skip
    limit: 50, // number of embedded posts returned
    action: "retrieve",
  })

  const embedded = post.embedded
}
```

Once you have your embedded posts, you can use the total `embeddedCount` to handle pagination.

## Deleting

Deleting an embedded post is also straight forward, you'll need to know the parent post ID and the `_id` of the embedded post.

```js
export const myFunction = async (parentId, embeddedPostId) => {
  await requestEmbeddedPost({
    _id: embeddedPostId, // embedded post ID
    parentId, // parent post ID
    action: "delete",
  })

  // deleted
}
```

## Permissions

Whenever you're making general CRUD-style database operations from the client, it's important to consider permissions. Otherwise anonymous users could create or delete data.

For that reason, Factor provides a simple permissions schema for embedded posts that goes along with the permissions for [post types](./post-types).

The default embedded post permissions looks like this:

```js
addPostType({
  // ... other post type setup
  permissions: {
    // ... other permissions on post type
    embedded: {
      create: { accessLevel: 1 },
      retrieve: { accessLevel: 0 },
      update: { accessLevel: 100, accessAuthor: true },
      delete: { accessLevel: 100, accessAuthor: true },
    },
  },
})
```

Which corresponds to any logged in user can create embedded posts, and anyone can retrieve them. Only moderators or authors of a post may update or delete them.

To change this for any particular post type, you can add the changes under `permissions.embedded` in the [post type definition](./post-types).
