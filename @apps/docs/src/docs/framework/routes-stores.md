# Adding Routes and Stores

## Routes and Views

Once you're familiar with the concept behind Factor's filters system, let's discuss how to add views to your app.

For routing, Factor implements the [Vue Router](https://router.vuejs.org/) module used by 99% of Vue apps. Therefore, the API is very similar with only one key difference: that routes are inserted via Factor filters. Also, there are different parent contexts available for routes, that are important depending on how the framework is being used.

#### View Components

View components are just regular Vue components, only they are designed to wrap all components in a specific route. View components are loaded in component templates using the `router-view` functional component.

#### Content Routes

Most front-end views in Factor are added via the simple `content-routes` filter. This is a parent route, which uses the required `content.vue` component as a wrapper for all front-end routes. To add a front end view, like a home page or a tour, you'll just do the following:

```javascript
// index.js
export default Factor => {
  constructor(){
    this.addRoutes()
  }

  // This will create two route "views"
  // One makes your homepage based on page-home.vue component and the other at /tour from page-tour.vue
  addRoutes(){
    addFilter("content-routes", routes => {
        const added = [
          {
            path: "/",
            component: () => import("./page-home.vue"),
            meta: { background: "#fafbff" } // Add meta information available to all components (e.g. this.$route.meta.background from component)
          },
          {
            path: `/tour`,
            component: () => import("./page-tour.vue")
          }
        ]

        // Important:
        // Return the modified value
        // Here we add new routes to any other added content routes
        return routes.concat(added)

      })
  }
}
```

## Stores for Data

In web frameworks, a "store" is a globally available object that holds application data and keeps it no matter where you go in your app. While the the store pattern is popular, it is often overused and can be problematic due to its global nature. However, the store is quite necessary in the case of SSR.

> Factor stores are built using [Vuex](https://vuex.vuejs.org/), Vue's standard store library

### Store SSR and SEO

The store is primary how information will travel from the server-side to the client side and it's necessary in many cases where you would like to render dynamic information to source.

> A common goal is to render dynamic content to the page for SEO purposes, this information must be added to the store

So here we will discuss:

- Adding a custom store submodule
- Factor's global store methods
- Adding or retrieving information from the store

#### Adding A Custom Store

Factor provides a convenient and standard way of adding custom stores for your plugin or app.

```javascript
// index.js
export default Factor => {
  constructor(){
    this.addStore()
  }
  addStore(){
    addFilter("stores", stores => {
      stores.myStore = require("./store").default
      return stores
    })
  }
}
```

An example of a custom store submodule might take this form:

```javascript
export default {
  name: "myStore",
  namespaced: true,
  state: () => {
    list: []
  }, // function syntax needed for SSR
  getters: {
    getItem: state => item => {
      return state[item]
    }
  },
  mutations: {
    setItem: (state, { item, value }) => {
      Factor.set(state, item, value)
    }
  }
}
```

Inside of a component, you can setup a computed property to stay synced with a store value. As follows:

```javascript
// component.vue
export default {
  computed: {
    list: this.$store.getters["myStore/getItem"]("list") || {}
  }
}
```

Note that this is all standard Vuex code, so you can read more about how stores work at the [Vuex site](https://vuex.vuejs.org/).
