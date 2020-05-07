---
title: The Database
description: Learn how to use Factor's MongoDB/Mongoose powered database.
---

# The Database

Don't forget that behind everything you have a fully-featured MongoDB/Mongoose powered DB. Let's learn how to use it.

## Understanding the Database Structure

The DB is a MongoDB powered database built as a single collection. Within the collection, each document is considered a "post." Finally, to distinguish between each post type, we use [Mongoose discriminators](https://mongoosejs.com/docs/discriminators.html).

Why is it structured this way? Here are the advantages:

- **It is simpler.** Posts can all share common structures and indexes.
- **It scales better.** A single collection can scale better since we have shared indexes.
- **Easier to set up.** Just add a single collection.
- **It can be cheaper.** Some MongoDB hosts [charge based on collection](https://www.azurefromthetrenches.com/azure-cosmos-db-and-its-perplexing-pricing-problems/).
- **It syncs.** It's meant to match the structure of the [flat store](./working-with-data).

## DB is Server Only

It's important to note that all direct database operations must happen inside the Factor server environment. This is because the server has **full** privileges to do whatever it wants to your database. You could never trust that to the client.

So when you want to get data from the client application, you'll need to:

1. Create an HTTP request to an [endpoint on the server](./endpoints-and-middleware)
2. In the endpoint, run the query and return the result

## Posts and the DB

This article is about understanding the raw Factor database and how to work with it. If you're interested in all the post tooling built to help you work with the DB, check out [Working with posts](./working-with-posts).

## Optimize with Schemas and Indexes

When you create a new post type it inherits the base post schema. However, in many cases, you might want to extend that schemas functionality with hooks, definitions, and privileges. Learn about extending the base post when you define a [post type](./post-types).

## Query Directly with Mongoose Models

As an advanced user, you'll often want to step outside of your tools and interact with the database directly. This is easy with the `getModel(postType)` function which returns the Mongoose model for a specific post type.

```js
// Import from server-only api
import { getModel } from "@factor/api/server"

// Get a user based on their userId
const getUser = async (_id) => {
  return await getModel("user").findOne({ _id })
}

// Endpoint to create an attachment
const createAttachment = async (data) => {
  const attachmentModel = getModel("attachment")
  const attachment = new attachmentModel(data)

  return await attachment.save()
}
```

## Work with the MongoDB Instance

If you ever want to work with the raw MongoDB instance beneath Mongoose, you can easily access it with `mongoose.connection.db`. This allows you to take things a bit further with raw operations. See the Mongoose documentation for more information.

```js
import mongoose from "mongoose"

const postsCollection = mongoose.connection.db.collection("posts")

postsCollection.update(
  { someFilterProperty: true },
  {
    $set: {
      example: true,
    },
  },
  { multi: true }
)
```
