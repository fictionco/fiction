---
title: Routes in Factor
description: Working with routes and URLs in Factor
---

Factor includes the standard `vue-router` to handle routing. To include all your routes in Factor, all that is needed is to return them in your app entry file (`index.ts`).

## Route Format

The route format required by Factor is the same as discussed in the [vue-router documentation](https://next.router.vuejs.org/).

Including routes in Factor with your entry file `index.html` looks like this:

```ts
// FILE: src/index.ts

// 1. Define route components.
// These can be imported from other files
const Home = { template: "<div>Home</div>" }
const About = { template: "<div>About</div>" }

// 2. Define some routes
// Each route should map to a component.
const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
]

export const setup = () => {
  return {
    routes,
  }
}
```

## In Your Components

Using the routes in your components is again standard for `vue-router`.

- `<router-link>` - Link to another route from a component
- `<router-view>` - This tag is replaced with child routes as needed based on the current URL

```html
<template>
  <h1>Hello App!</h1>
  <p>
    <!-- use the router-link component for navigation. -->
    <!-- specify the link by passing the `to` prop. -->
    <!-- `<router-link>` will render an `<a>` tag with the correct `href` attribute -->
    <router-link to="/">Go to Home</router-link>
    <router-link to="/about">Go to About</router-link>
  </p>
  <!-- route outlet -->
  <!-- component matched by the route will render here -->
  <router-view />
</template>
```
