# Working With Posts

Factor's post system is designed to simplify and standardize working with the database.

In Factor, every data object, e.g. users, pages, posts, etc.. is a variety of the base `post` object. These varieties are called "post types." The advantages of this approach are efficiency and simplicity. It makes both development and scaling easier.

Let's walk through how to create post types and work with them.

## Adding a Post Type

To add a post type, all that is needed is to register it using the `addPostType` function.

> Note that this needs to occur in the **app** environment since it is used for UI.

```js
// index.js
import { addPostType } from "@factor/tools"
addPostType({
  postType: "jobs",
  nameIndex: "Jobs",
  nameSingle: "Jobs Post",
  namePlural: "Jobs Posts",
  icon: require("./img/jobs.svg"), // dashboard icon
  baseRoute: "career", // base permalink route
  accessLevel: 100, // user access level needed to edit/add
  add: true, // can new posts be added via dashboard
  showAdmin: true // Set to false to hide list/edit menu in admin
  listTemplate: () => import("./custom-dashboard-list-view.vue"), // optional
  editTemplate: () => import("./custom-post-edit-view.vue") // optional
})
```

This globally registers your post type and allows you to set UI information that the dashboard and your components will use to display these posts.

Note that you haven't designated any type of schema for the post type, by default post types use the base `post` schema shared by all posts through the system.

Next we'll talk about adding new fields to your custom post type by extending the base schema.

## Extending the Base Schema

Initially, all post types inherit the basic post schema that you can [reference here](https://github.com/fiction-com/factor/blob/master/%40factor/%40core/post/schema.js).

In some cases, the base schema is not enough. The format for extending the base post schema uses the `extendPostSchema` function

> Note that this needs to occur in the **server** environment since database transactions happen in Express endpoints.

```js
import { extendPostSchema } from "@factor/tools"

extendPostSchema({
  name: "post-type-name",
  callback: schema => {
    schema.pre("save", async function(next) {
      next()
    }) // Mongoose hooks belong here.
  },
  schema: { example: { type: String, trim: true } },
  populatedFields: [{ field: "company", depth: 10 }],
  options: {}
})
```

### Extending an Existing Schema

If you'd like to extend an existing schema, it's easy through the `data-schema-[POST TYPE]` filter.

For example, to extend the `page` schema:

```js
import { addFilter } from "@factor/tools"

addFilter("data-schema-page", _original => {
  // Add to schema
  _original.schema = { ..._original.schema, ...{ comments: [] } }

  // Add to schema
  const cb = _original.callback
  schemaConfig.callback = _schema => {
    cb(_schema) // don't forget to call the original
    schema.pre("save", async function(next) {
      next()
    })
  }

  return schemaConfig
})
```
