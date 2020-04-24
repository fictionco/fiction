---
title: Post Types
description: Reference for the schema API
---

# Post Types

You can create new post types for use creating advanced functionality like blogs, forums, job listings, etc. In this document we'll walk through the basic steps. 

## Base Post Type

All post types are built on a base post type schema called simply `post`. 

This post type includes functionality that is common to most post use cases. For example, it adds `title`, `content`, `tag`, and `category` fields.  

It also adds [indexes](https://mongoosejs.com/docs/guide.html#indexes) for common queries. Examples of default indexes are: 

- Text search on `title` and `content` fields
- Unique index on `permalink`
- Index on `postType`

Here is the schema definition summarized for clarity ([actual definition is here](https://github.com/fiction-com/factor/blob/development/%40factor/post/post-type.ts))

```js
const schemaDefinition = {
  // Standard post content / taxonomy
  postType: String,
  date: Date,
  title: String,
  synopsis: String,
  content: String,
  author: [{ ref: "user" }],
  follower: [{ ref: "user" }],
  images: [{ ref: "attachment" }],
  avatar: { ref: "attachment" },
  tag: [String],
  category: [String],
  // Used to distinguish which app created a post in multi-app databases
  source: String,
  // Vanilla key/value container
  settings: {},
  // vanilla list container
  list: { type: [Object] },
  // Embedded documents (comments, posts, etc.)
  embedded: [Object],
  embeddedCount: Number,
  // published, draft, trash
  status: String,
  // Allow plugins to set a custom UniqueId
  uniqueId: String, // must be unique
  permalink: String // must be unique
}
```
## Adding A Post Type

To add a post type, all that is needed is the `addPostType` function: 

```js
import {addPostType} from "@factor/api"

addPostType({
  postType: "myPostType", 
  // ... other options
}) 
```

For all post type features to work correctly this function needs to be run in both the app and server environments. So make sure to address this with your [main files](./main-files); for example a load configuration of `load: ['app', 'server']`.

## Configuring the Post Type

There are many available options available when creating new post types, let's walk through them.

## Post Type Management Options

You can control the dashboard management features with the following options: 

```js
import {addPostType} from "@factor/api"

import icon from './my-icon.svg'

addPostType({
  postType: "myPostType", 
  managePosts: true, // Enable dashboard menu
  icon, // Dashboard icon
  nameIndex: "Users", // Contextual references
  nameSingle: "User",
  namePlural: "Users",
  accessLevel: 500, // accessLevel needed to see dashboard menu
  noAddNew: true, // hide "add new" 
  addNewText: "Create User", // change add new text
  listTemplate: () => import("./v-list.vue"), // override post listing component
  editTemplate: () => import("./v-edit.vue"), // override post edit component
}) 
```

## Post Type Permalinks

You can control the post type permalinks when you set up the post type. 

This doesn't create the route however it just allows you to use `postLink` ([doc](./links)) and get the desired link. You'll also need to[ create the routes and handling](./routes) to make the post show correctly on that page.

```js
import {addPostType, slugify} from "@factor/api"
 
addPostType({
  postType: "myPostType", 
  permalink: (post) => {
    return `/my-post-type/${post._id}/${slugify(post.title)}`
  },
}) 
```

If you want to allow permalinks to be set in the dashboard:

```js
import {addPostType} from "@factor/api"
 
addPostType({
  postType: "myPostType", 
  customPermalink: true, // Allow permalink option on post edit
  permalink: (post) => {
    return `/my-post-type/${post.permalink}` 
  },
}) 
```

## Create Structure with Post Schema Options

### Schema Definition 

Schemas are to help organize the handling of post data on your server. Create a custom schema to add new properties or to change the base post definition.

The `schemaDefinition` options is used to add a [Mongoose schema](https://mongoosejs.com/docs/guide.html) definition to your post type and extend the base post schema.

Post type creation also supports three additional options related to schemas: 
- `schemaMiddleware` - Callback function for adding [Mongoose middleware](https://mongoosejs.com/docs/middleware.html) functions
- `schemaOptions` - Add Mongoose [options](https://mongoosejs.com/docs/guide.html#options) to the schema
- `schemaPopulated` - Defines which fields define IDs that should should be looked up and populated. It also supports a context value for controlling when population should occur (population is similar to a join in SQL).  
  - **Context:** Defines the depth of population based on situation. 
    - `any` always populates
    - `list` populated on single post views and post listings
    - `single` only populate on single post views (e.g. specific content like images)

```js
import { addPostType, ObjectId } from "@factor/api"


addPostType({
  schemaDefinition: {
    foo: String,
    bar: Buffer,
    baz: Number,
    buz: {ref: "anotherPostType", type: ObjectId}
  }, 
  schemaMiddleware: Schema => {
    Schema.pre('save', function(){
      // add middleware
    })
  }
  schemaPopulated: {
    buz: "any" // "any" | "list" | "single"
  }
  schemaOptions: {}
  // ...other post type options
})

// Add the schema to factor
addPostSchema(mySchema)
```
#### Notes
- Populated fields are fields consisting of just `_id`'s or `objectId` that populate based on data in the original post (like a SQL join)
- `ObjectId` is needed for Mongoose to property type check reference to other posts

## Security Permissions

For database operations you need permissions to control access. Factor offers a basic system to control standard CRUD input and output.

The base post permissions schema looks like this:

```js
addPostType({
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
})
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

## Template Settings

If you would like to allow users to set meta information on each post, there is a way to add template options in post types using the [template settings API]('./template-settings'). 

```js
addPostType({
  postType: "portfolioItems", 
  templateSettings: [
      {
        _id: "items",
        input: "sortable",
        label: "Additional Work Info",
        description: "Additional information about this project",
        _default: [
          { __title: "Client", value: "Client Name" },
          { __title: "Role", value: "Role" },
          { __title: "Year", value: new Date().getFullYear() },
          { __title: "Platforms", value: "Web" },
          { __title: "URL", value: "https://www.example.com" },
        ],
        settings: [
          {
            input: "text",
            label: "Value",
            _id: "value",
          },
        ],
      },
    ]
})
```

## Public Sitemap

Some post types are meant to be public, e.g. blog posts, while others are meant to be private, e.g. contact form submissions.

If you would like to indicate that posts are public and meant to be added to the public sitemap then use `addSitemap`.

```js
addPostType({
  postType: "portfolioItems", 
  addSitemap: true
})
```

Enabling this option will add the post type to public tools like the `sitemap.xml` file and search utilities.
