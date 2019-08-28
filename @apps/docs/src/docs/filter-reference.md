# Selected Filters Reference

## Overview

[Factor filters](./filters) are the most versatile and common way of altering or adding functionality to parts of your app.

In this document we provide a reference for commonly used and selected filters in the system. However note that it's possible to add filters nearly anywhere in Factor (including extensions), and often times its helpful to reference the source code to understand a particular filter's intent, possibilities and usage.

## Common App Filters

### Adding Routes

Routes in Factor use [Vue Router](https://router.vuejs.org). These filters add route objects to two main "parent" routes: _content_ and _dashboard_, or the root _routes_ array. All Vue Router functionality is supported via these filters.

- Filters:
  - `content-routes` - Add to app's front-end (`/my-route`)
  - `dashboard-routes` - Add to dashboard (`/dashboard/my-route`)
  - `routes` - Add to root routes for app (advanced use cases)

#### Example

```js
// Takes an array []
Factor.$filters.add("content-routes", routes => {
  return [
    ...routes,
    {
      path: "/my-route",
      component: () => import("./component-for-my-route.vue")
    },
    {
      path: "/another-route",
      component: () => import("./component-for-another-route.vue")
    }
  ]
})
```

### Adding Global Components

You can add global Vue components easily using the `components` filter.

#### Example

```js
Factor.$filters.add("components", _ => {
  _["my-global-component-one"] = () => import("./one.vue")
  _["my-global-component-two"] = () => import("./two.vue")
  return _
})
```

## Post Filters

### The Base "Post" Post Type

There are several filters available to extend the base "post" type which because this is the foundation of all posts, will affect all post types in your app.

Some use cases might be adding meta information like a 'social sharing' image and so on.

#### Post Schema

Filter: `post-schema` - To extend the base post schema:

```js
// Takes and returns an object {}
Factor.$filters.add("post-schema", _ => {
  return {
    ..._,
    myPluginSetting: { type: String, trim: true }
  }
})
```

Filter: `post-populated-fields` - To extend the base schema fields that should be [populated](https://mongoosejs.com/docs/populate.html) on retrieval

```js
Factor.$filters.push("post-populated-fields", { field: "shareImage", depth: 20 })
```
