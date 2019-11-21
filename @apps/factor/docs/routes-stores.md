# Adding Routes and Stores

## Routes and Views

Once you're familiar with the concept behind Factor's filters system, let's discuss how to add views to your app.

For routing, Factor implements the [Vue Router](https://router.vuejs.org/) module used by 99% of Vue apps. Therefore, the API is very similar with only one key difference: that routes are inserted via Factor filters. Also, there are different parent contexts available for routes, that are important depending on how the framework is being used.

### View Components

View components are just regular Vue components, only they are designed to wrap all components in a specific route. View components are loaded in component templates using the `router-view` functional component.

### Content Routes

Most front-end views in Factor are added via the simple `content-routes` filter. This is a parent route, which uses the required `content.vue` component as a wrapper for all front-end routes. To add a front end view, like a home page or a tour, you'll just do the following:

```javascript
addFilter("content-routes", routes => {
  // Important:
  // Return the modified value
  // Here we add new routes to any other added content routes
  return [
    ...routes,
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
})
```
