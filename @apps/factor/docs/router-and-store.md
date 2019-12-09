# Routing and Navigation

For routing, Factor implements [Vue Router](https://router.vuejs.org/).

## Content vs Dashboard Routes

Factor breaks you app into two functional components:

- **Content** - The front end of your application, where pages, posts and routes are displayed.
- **Dashboard** - The administrative and functional part of your application where users and admins can view and manage content.

For our purposes, we'll be focusing primarily on content routing and nav.

## Adding Content Routes

The simplest way to add content routes is using the straight-forward `addContentRoute` function.

```js
import { addContentRoute } from "@factor/api"

addContentRoute({
  path: "/example-route",
  component: () => import("./v-example.vue")
})
```

The above creates a new route that will be available at `/example-route` and will show the `v-example.vue` component at that route.

## Factor Link

Factor has a core UI component called `factor-link` that can be used to easily navigate between routes in your app. This works in a similar way to [router-link](https://router.vuejs.org/api/) however it supports a few additional features:

- If a link contains a full url `https://...` then it will be considered external and handled accordingly
- Supports a `path` and `query` attribute to allow for more direct reference
- Optionally pass a `btn` option to transform the link into a `factor-btn` component

```html
<template>
  <div>
    <factor-link path="/example-route" :query="{var: 123}">Link Text</factor-link>
    <factor-link path="https://github.com" :query="{var: 123}">External Link</factor-link>

    <factor-link btn="primary" path="https://github.com" :query="{var: 123}"
      >Button Link</factor-link
    >
  </div>
</template>
```

## Dashboard Routes

If you'd like to learn about working with the dashboard, then check out [extending the dashboard &rarr;](./extend-the-dashboard)

## Store and Global State

Factor has a simple interface to maintaining global "state" in your application. While Factor implements the standard [Vuex](https://vuex.vuejs.org/) we don't recommend you use it in a complicated fashion.

Instead, Factor includes two simple functions and recommends a flat data store format that mirrors your DB.

Essentially, the store does two things:

1. `storeItem` - Store an object by ID
2. `stored` - Retrieve an object by ID

An example:

```js
import { storeItem } from "@factor/api"

const myData = { foo: "bar" }

storeItem("myData", myData)

// In your component
import { stored } from "@factor/api"
export default {
  computed: {
    myData() {
      return stored("myData") // {foo: "bar"}
    }
  }
}
```

This simple interface is all you need to manage state in your app. For example, you can store posts as they are retrieved from the database by their `_id` and then reference them anywhere you like. Simple is better!
