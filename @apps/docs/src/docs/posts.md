# The Post System

Factor is powered by a post system designed to help simplify and standardize the way your app works with your DB.

## Overview

The post system works by combining all your apps data items, e.g. users, pages, posts, etc.. into a single collection in your DB. Each data type is built on a standard "post type" (called `post`) and then extended.

There are some clear advantages to this approach:

1. **Shared functionality.** Most DB items need common functionality like category filtering or permalinks. With a post system all post-types inherit these tools automatically.
1. **Simplicity.** Since all data types are stored in the same place, it makes it much easier to manage your data. For example, to export/import your entire DB, you're just dealing with a single collection.

## Dashboard and Posts

The Factor dashboard is designed as an interface to your post system. Each type of post will add its own tab, but management is typically the same across many types. For example, you'll need to list and edit blog posts in a similar way to how you manage pages, or job listings, or users, etc..

Below we'll discuss the basics of adding your own "post types" and configuring your dashboard to edit and manage them.

## Working With Posts

### Creating a Post Type

It's easy to add a new post type to Factor, all you need to do is add a new object via the `post-types` filter.

```js
// index.js
Factor.$filters.push("post-types", {
  postType: "jobs",
  nameIndex: "Jobs",
  nameSingle: "Jobs Post",
  namePlural: "Jobs Posts",
  icon: require("./img/jobs.svg"), // dashboard icon
  baseRoute: "career", // base permalink route
  accessLevel: 100, // user access level needed to edit/add
  add: true // can new posts be added via dashboard
})
```

Adding a new post type will add a new tab in the dashboard. With the default **list** and **edit** views.

![New Jobs Post Type](./img/dashboard-post-type.jpg)

Now that you have your post type, it is possible to easily override the dashboard editing templates if you need custom functionality.

To do so, all you need to do is add your own components:

```js
// index.js
Factor.$filters.push("post-types", {
  postType: "my-post-type",
  listTemplate: () => import("./custom-dashboard-list-view.vue"),
  editTemplate: () => import("./custom-post-edit-view.vue")
  // ... other post type options
})
```

Now that we've set up the post type, let's add a validation schema and learn how to work with it on the front end.

### Data Schemas

With NoSQL databases there is no hard coded table schema. While this is often an advantage, there are some benefits to validating data structure on a post-type level. To do this, we'll use schemas.

For data modeling, Factor schemas use the Mongoose library for MongoDB.
