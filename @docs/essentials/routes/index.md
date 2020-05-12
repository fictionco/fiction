---
title: Routes and Views
description: Learn how to add custom routes and custom view components.
---

# Routes and Views

Factor's routing system is built on top of [Vue Router](https://router.vuejs.org/). However, Factor adds some additional functionality to help with modularity.

## Routes in Factor

In Factor, routes are designed to be dynamically added by apps, plugins, and themes.

This allows plugins like your blog to make itself available at a route like`/blog`. This saves you from guesswork and configuration.

It is also typical to add custom routes from your app. For that Factor gives you a few functions that you can add directly into your [main file](./main-files) for your `app` environment.

## Add Routes

There are two primary functions used to add routes: `addContentRoute` to add a single route, and `addRoutes` to add many routes.

Their syntax is as follows:

```js
// index.js
import { addContentRoute, addRoutes } from "@factor/api"

addContentRoute({
  path: "/my-path",
  component: () => import("./my-view-component"),
  children: [],
  meta: {},
})

addRoutes({
  key: "myRoutes",
  routes: [
    {
      path: "/",
      component: () => import("./page-home.vue"),
      children: [],
      meta: {},
    },
    {
      path: "/example",
      component: () => import("./page-example.vue"),
    },
    {
      path: "/example-with-param/:param",
      component: () => import("./page-param.vue"),
    },
  ],
})
```

Notice that the route objects in both functions are just fed into the global [Vue Router](https://router.vuejs.org/) instance. The advantage they bring you, however, is modularity. You can now easily add routes from any file.

## Using Routes in Components

From within Vue components you can use the router like in any Vue app; it is available under `this.$router` and the current route is available under `this.$route`.

## Navigating To Routes

There are many ways to navigate to routes from within components.

In addition to standard Vue Router's native techniques, Factor provides the `<factor-link>` component that adds additional features to `<router-link>`:

- It adds `path` and `query` props for more discrete navigation
- If a protocol is detected (e.g. `https://`) in the link, it bails from the router and navigates like a regular link
- It supports a `btn` property that converts the link into a button

here are some examples of how you'd navigate within Vue components:

```html
<template>
  <div>
    <!-- factor-link component -->
    <factor-link btn="primary" path="https://www.external.com">Link</factor-link>
    <factor-link path="/example" :query="{foo: bar}">Link</factor-link>
    <!-- router-link component -->
    <router-link :to="{path: '/example', query: {foo: bar}">Link</router-link>
    <!-- programmatic -->
    <div @click="navigate()">Link</div>
  </div>
</template>
<script>
  import { factorLink } from "@factor/ui"
  export default {
    components: { factorLink },
    methods: {
      navigate() {
        this.$router.push({ path: "/example", query: { foo: bar } })
      },
    },
  }
</script>
```

## Working With Routes Elsewhere

If the need arises to work with the current route and router from elsewhere in your app (e.g. a main file), then we provide two additional functions:

```js
// index.js
import { currentRoute, navigateToRoute } from "@factor/api"

// Gets the current route
const currentRoute = currentRoute()

// Programmatically navigates to routes
navigateToRoute({
  path: "/example",
})
```

## Adding Page Classes from Components

In certain situations, you may want to add a class to the wrapper of the page from a component. A common use case might be changing the color of the navigation based on your component.

To do this, Factor adds the `routeClass` component option.

```html
<script>
  export default {
    // other component code
    routeClass() {
      return "nav-white"
    },
  }
</script>
```

## Protecting Routes

You can make a route "protected" by adding meta values to the route. 

- `auth: true` - Will require that users are logged in to view a page
- `accessLevel: 100` - Is the required user access level needed to view a page
- `allowBots: true` - If you set allowBots to true, then robots like Google will be able to access pages even if users are blocked.

```js
addContentRoute({
  path: "/my-protected-path",
  component: () => import("./my-view-component"),
  meta: {auth: true, allowBots: true},
})

addContentRoute({
  path: "/my-protected-path",
  component: () => import("./my-admin-component"),
  meta: {auth: true, accessLevel: 300}, // admins only
})
```
