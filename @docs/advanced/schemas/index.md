---
title: Schema API
description: Reference for the schema API
---

# Schemas

Extending the base post schema is a common task when adding new post types. To help you with this Factor provides a standard schema format to help simplify the process.

## Extending the Schema is Optional

Custom schemas for new post types are optional and used to add additional fields or functionality. If you don't set one, then the new post type will inherit the schema from the base post type.

## Purpose Of Schemas

Schemas are to help organize the handling of post data on your server. You'll want to create a custom schema when you want to add new data fields to a post type, do additional validation of data, or if you want to change the default permissions for [standard post functions](./working-with-posts).

The Factor schema API has the following elements:

- **Name:**
  Set the post type name
- **Permissions:**
  Allows you to add standard privileges handling on read, write, update, delete requests to the post type
- **Schema:**
  The [Mongoose schema](https://mongoosejs.com/docs/guide.html) definition that allows you to structure and validate your data.
- **Callback:**
  A callback function for adding [Mongoose middleware](https://mongoosejs.com/docs/middleware.html)

## Defining A Schema

Here is how a basic post type schema is defined:

```js
import { addPostSchema } from "@factor/api"

const mySchema = {
  name: "myPostType",
  schema: {
    mimetype: String,
    imageData: Buffer,
    size: Number,
    url: String,
  },
  callback: (MongooseSchema) => {
    // Add standard mongoose middleware
    // Do NOT use arrow function (=>) as `this` within the callback is equal to the
    // object being saved.
    MongooseSchema.pre("save", async function () {
      const myPost = this

      await doStuff()

      return
    })
  },
}

// Add the schema to factor
addPostSchema(mySchema)
```

> Schemas are only used on the server side, so there is no need to add them in the app environment.

## Permissions

With schemas you have the ability to override the default permissions handling of the base post. The base post permissions schema looks like this:

```js
const schema = {
  permissions: {
    create: { accessLevel: 100 },
    retrieve: {
      accessLevel: 100,
      accessPublished: 0,
      accessAuthor: true,
    },
    update: { accessLevel: 100, accessAuthor: true },
    delete: { accessLevel: 200, accessAuthor: true },
    embedded: {
      create: { accessLevel: 1 },
      retrieve: { accessLevel: 0 },
      update: { accessLevel: 100, accessAuthor: true },
      delete: { accessLevel: 100, accessAuthor: true },
    },
  },
}
```

In your extending schema you can override this. For example with contact form submissions, we want it to be possible for anyone to create them (`accessLevel: 0`) but you have to be a moderator or the post author to read them (`accessLevel: 300`). In your schema that looks like this:

```js
export default {
  name: "contact-form",
  permissions: {
    create: { accessLevel: 0 },
    retrieve: {
      accessLevel: 300,
      accessAuthor: true,
    },
  },
}
```

## Population

Once you've retrieved a document, most times you have some related data that also needs to be queried. For example, you'll need to get the author, or images based on their IDs. In the MongoDb world this is called "population."

Factor provides a simple system for defining fields that should be populated when data is retrieved called `populatedFields`.

It includes a context depth property for defining when and where the population should occur. This is needed because you don't always want to populate everything. For example, if you are showing a long list of blog posts, you don't want to pull all the images for each post just to index them.

The default populated fields for the base post schema look like this:

```js
const mySchema = {
  populated: {
    author: "list",
    images: "single",
    avatar: "any",
  },
}
```
