# Working with the Dashboard

## Overview

The Factor dashboard is designed to a minimal and extendable interface useful for common functional tasks in both end-user and admin scenarios.

**Example use cases for admins:**

- Writing blog posts
- Adding job listings
- Managing forms

**Example use cases for end-users:**

- Manage orders or tickets
- View and manage bookings
- Edit profile

The dashboard has a simple yet powerful extension system that allows you to add pages, tabs, post management interfaces, extend other interfaces and more. This doc will discuss the common scenarios and how to leverage the powerful of the standard dashboard interface.

## Post Editing

The dashboard interface is based around the concept of posts and post management. Each post type generally needs two interfaces for management:

1. Listing the posts and group actions
2. Adding or editing an individual post.

When you add a new post type using the `post-types` filter, this will automatically create a new post management tab in the admin. The behavior of this can be fully customized however. To override the default list and edit post templates use the `listTemplate` and `editTemplate` options for the post type.

```js
// index.js
Factor.$filters.push("post-types", {
  postType: "examples",
  nameIndex: "Examples",
  nameSingle: "Example Post",
  namePlural: "Example Posts",
  icon: require("./img/example.svg"), // dashboard icon
  baseRoute: "example", // base permalink route
  accessLevel: 100, // user access level needed to edit/add
  add: true, // can new posts be added via dashboard,
  listTemplate: () => import("./custom-dashboard-list-view.vue"),
  editTemplate: () => import("./custom-post-edit-view.vue")
})
```

This will replace the listing and editing interfaces with your own.

While setting your own listing/editing panels is easy. THere are several utility components that have been created to make the listing and editing panels consistent and more useful. So we generally recommend you reference the default [post edit and list](https://github.com/fiction-com/factor/tree/master/%40factor/%40core/post) components when creating your own.

## Adding Settings Panels to Post Types

It's easy to extend the post editing interface of a post type. A common use case might adding a panel to the "page" editing interface for comment settings, SEO, etc.

To add a new panel all that is needed is to use the `post-edit-components` filter and add a component which recieves the `postId` as a prop and makes changes to the post being edited in the store.

```js
Factor.$filters.push("post-edit-components", {
  name: "My Plugin Settings",
  component: () => import("./plugin-panel.vue"),
  postType: ["page", "blog"] // if missing, defaults to all post types
})
```

```html
<template>
  <div class="edit-post-my-plugin">
    <dashboard-input
      v-model="post.myPluginSetting"
      input="factor-input-text"
      label="My Setting"
    />
    <!-- More inputs -->
  </div>
</template>
<script>
  export default {
    props: {
      postId: { type: String, required: true }
    },
    computed: {
      post() {
        return this.$store.val(this.postId) || {}
      }
    }
  }
</script>
<style lang="less"></style>
```

### Extend Post Schema

If you're adding settings to a post type, don't forget to extend the schema for that post type (or the base post schema). The exact filter to extend a schema depends on the name of the associated filter. But extending the base schema can be done using the `post-schema` filter:

```js
addFilter("post-schema", _ => {
  return {
    ..._,
    myPluginSetting: { type: String, trim: true }
  }
})
```
