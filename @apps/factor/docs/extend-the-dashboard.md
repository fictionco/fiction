# Extend the Dashboard

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

## Listing and Editing Posts

The dashboard interface is based around the concept of post-types. Each post-type generally needs only two interfaces:

1. Post Listing
2. Post Edit / Add-New

Adding these interfaces simple and just requires using the `addPostType` function that is covered in [working with posts](./working-with-posts) doc.

```js
// index
import { addPostType } from "@factor/api"
addPostType({
  postType: "jobs",
  nameIndex: "Jobs",
  nameSingle: "Jobs Post",
  namePlural: "Jobs Posts",
  icon: require("./img/jobs.svg"), // dashboard icon
  baseRoute: "career", // base permalink route
  accessLevel: 100, // user access level needed to edit/add
  add: true, // can new posts be added via dashboard
  hideAdmin: false // Set to true to hide list/edit menu in admin
  listTemplate: () => import("./custom-dashboard-list-view.vue"), // optional
  editTemplate: () => import("./custom-post-edit-view.vue") // optional
})
```

Notice how it is possible to use your own listing and editing page for a specific post-type.

## Adding to the Post Edit UI

It's easy to extend the post editing interface of a post type. A common use case might adding a panel to the "page" editing interface for comment settings, SEO, etc.

To add a new panels, all that is needed is to use `addPostEditComponent`:

```js
import { addPostEditComponent } from "@factor/api"
addPostEditComponent({
  name: "My Plugin Settings",
  component: () => import("./plugin-panel.vue"),
  postType: ["page", "blog"], // if missing, defaults to all post types
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
  import { dashboardInput } from "@factor/dashboard"
  export default {
    props: {
      postId: { type: String, required: true },
    },
    computed: {
      post() {
        return stored(this.postId) || {}
      },
    },
  }
</script>
```

### Extend Post Schema

If you're adding settings to a post type, don't forget to extend the schema for that post type (or the base post schema). The exact filter to extend a schema depends on the name of the associated filter.

Extending the base schema is covered in [working with posts](./working-with-posts).
