## Framework Overview

Factor is powered by a robust Javascript framework. 
The framework brings together many different tools:

- VueJS 
  - Vue single file components
  - Routing with Vue-Router 
  - Global "stores" with Vuex
  - SSR with Vue Server Renderer
- Webpack Bundling
- NodeJS and Express Server
- Factor extension engine (themes/plugins/stacks)
- Factor Filters and Tools

## VueJS & Node

Factor is built using VueJS and Node as its Javascript engine. So if you're familiar with these tools, then you likely know a LOT about how to use Factor. There are a few caveats and improvements however. These we will discuss below. 

If you're not familiar with the basics of creating Vue components and routes, you can read more about them on [Vue's documentation portal](https://vuejs.org/).  


## Server-Side-Rendering (SSR)

Factor apps are server-rendered. This means that a working Factor app, will have its source generated on a server and sent to users browsers as raw source. This has many critical advantages that most modern web apps need, for example: 
- Improved SEO - Since search-engines prefer to source information from raw source
- Improved Syndication - Social and sharing apps scrape your source to get meta information when users post about your app

The SSR engine is based on Vue's [server-rendering system](https://ssr.vuejs.org).

In many ways, Factor behaves like a typical Vue app but SSR leads to some important caveats (which are the same for all Vue SSR apps): 



#### Mounted vs Created 

In Vue components we have two primary 'hooks' that are initialized when components are created, `mounted` and `created`.  With Factor SSR, it's important to know that the `mounted` hook is only fired on the users browser, while the `created` hook is fired on both. 

The goal is to have the server and the browser output match when the browser initially renders over the server rendered source. (If there is a mismatch you should see a warning)


#### User/Auth Considerations

If you're using Factor's user and authentication plugins, Factor NEVER loads user information on the server. This is because its not needed, and it allows for some useful and important caching features of server generated source. 

If you are implementing a feature where auth is necessary, place it after the user init hook, for example: 

```javascript
mounted(){
  this.$user.init(uid => {
    // user authentication has initialized
  })
}
```

### Serving Your App

Hosting a Factor app is straight-forward. Steps:
1. Get A NodeJs Server
1. Build your production app (creates `dist` folder)
1. Deploy your app to your server
1. Start your server with `factor serve` 

[Learn more about hosting](./hosting-and-deployment)

## Apps vs Themes

Apps and themes follow the exact same structure and are designed to be interchangeable. Meaning, a Factor app can be a theme and a them can be an app. 

This makes it easy to: 
- Use a theme as the starting point for an app, 
- Distribute an app you've built as a theme for others

#### Overriding

When an app is 'using' a theme, that means that the app has installed the theme as a dependency. From here, Factor loads the theme files first and then overrides them with files and config from your app. 

So if you'd like to completely customize a file from a theme, like a component, just copy it and place it in the same place within your app directory. 

```yaml
# If your app has the same component as the theme, it will override the theme's version of it:
- app/src
  - component.vue # takes precedence

- theme/src
  - component.vue
  - other-component.vue
```

Factor also uses a special overriding indicator `#` that is used when requiring modules. That tells Factor to look down the overriding hierarchy to find the component.

So if you include a component with the following request: 
```javascript
components: {
  'my-component': () => import('#/my-component')
}

// Order of priority: 
  // app
  // theme
  // relative file (replaces with a '.')
  // fallback
```

### `Settings.js`

The primary customization mechanism for themes from an app is using a simple `settings.js` settings system. 

To make themes easily cutomizeable, all they need to do is take customizeable information and place it in `theme/src/settings.js` as an exported object. 
Then it becomes easy to request that information from the theme as follows:

```javascript
// in settings.js
export default {
  val: "yes",
  nested: {
    val: "no"
  }
}

// inside a component: 
const myValue = this.$setting.get('val') // yes
const myNestedValue = this.$setting.get('val.nested') // no

// elsewhere
const myValue = Factor.$setting.get('val') // yes
const myNestedValue = Factor.$setting.get('val.nested') // no

```

Now, to customize these settings an app just needs to create the same `settings.js` file inside `app/src/settings.js`. The user can just copy paste the one from the theme or start fresh. Either way the resulting values are then merged together with the theme settings (with the app's settings taking precedence). 

## App File Structure

When working with Factor apps it's important to know the standard file structure for a Factor app, as well as how it relates to Factor modules and so on. 

```yaml

- App/
  - package.json
  - factor-config.json # public configuration
  - factor-secrets.json # top-secret configuration (don't commit)
  - src/ # source
    - (components, css, imgs)
    - plugin.js # entry file
    - settings.js # theme customization file
    - static/ # static files e.g. favicon
  - .factor/  # generated files
  - dist/ # built files
  - node_modules 
    - @factor/ # factor modules are installed here 
      - (themes, plugins, stacks)

```

## `Plugin.js` and Filters System

A key concept in Factor is the ability for extensions, components and files to inject functionality elsewhere in the Factor system. This mechanism is called Factor's `filters` system and  is based on a similar approach in WordPress called "actions and filters."

The primary benefit of filters is encapsulation and modularity, as well as control of when and where things run. 

It's critical to understand this mechanism when customizing your application. 

#### Example

```javascript

// A file or plugin adds a filter, add-to, modify or change a value
Factor.$filters.add('my-filter-id', str => {
  return str.replace('initial', 'edited')
})

// Somewhere in the application consumes all the filters applied to 'my-filter-id' starting with an initial value
const myList = Factor.$filters.apply('my-filter-id', 'my-initial-value' )

console.log(myList) // my-edited-value
```

#### Plugin.js
Each application, theme, plugin, etc includes a plugin.js entry file which is listed as the "main" inside of each's package.json. 

The plugin.js file serves as the primary entry point for each module as well as the controller for how it behaves. For example, this file is typically where you'll add routes, stores, global-components, and modifications to other parts of the overall system. 

The structure of a Factor plugin.js looks like this: 

```javascript
// plugin.js
export default Factor => {
  export new class{
    constructor(){
      // code
    }
  }()
}
```

## Routes and View Components

Now that you're familiar with the concept behind Factor's plugin and filters systems, let's discuss how to add views to your app. 

For routing, Factor implements the [Vue Router](https://router.vuejs.org/) module used by 99% of Vue apps. Therefore, the API is very similar with only one key difference: that routes are inserted via Factor filters. Also, there are different parent contexts available for routes, that are important depending on how the framework is being used. 

#### View Components

View components are just regular Vue components, only they are designed to wrap all components in a specific route. View components are loaded in component templates using the `router-view` functional component.

#### Content Routes

Most front-end views in Factor are added via the simple `content-routes` filter.  This is a parent route, which uses the required `content.vue` component as a wrapper for all front-end routes. To add a front end view, like a home page or a tour, you'll just do the following: 

```javascript
// plugin.js
export default Factor => {
  constructor(){
    this.addRoutes()
  }

  // This will create two route "views" 
  // One makes your homepage based on page-home.vue component and the other at /tour from page-tour.vue
  addRoutes(){
    Factor.$filters.add("content-routes", routes => {
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

## Custom Components

Adding all the custom components you'd like to your app is a straight-forward process. There are two primary methods for including custom components throughout your views. 
- Add a global component using the `components` filter
- Import a component relatively using a dynamic import 

#### Global Components

It's possible to add components globally to your app so they are available without having to specifically import them. To do this, we just use Factor's components filter: 

```javascript
// plugin.js
export default Factor => {
  constructor(){
    this.addComponents()
  }
  addComponents(){
    Factor.$filters.add("components", components => {
      // Adds the file ./my-component.vue as a globally available component
      // Available in your templates using <my-component /> 
      components["my-component"] = () => import("./my-component")
      return components
    })
  }
}
```

To only require components from within other components, you can use a simple dynamic import inside Vue's components property: 
```javascript
// the file './my-component.vue' will be available in THIS component's template as  <my-component /> 
components: {
  'my-component': () => import('./my-component')
}
```

## Stores

In web frameworks, a "store" is a globally available object that holds application data and keeps it no matter where you go in your app. While the the store pattern is popular, it is often overused and can be problematic due to its global nature. However, the store is quite necessary in the case of SSR.

### SSR and SEO
The store is primary how information will travel from the server-side to the client side and it's necessary in many cases where you would like to render dynamic information to source. 

> A common goal is to render dynamic content to the page for SEO purposes, this information must be added to the store

So here we will discuss: 
- Adding a custom store submodule 
- Factor's global store methods
- Adding or retrieving information from the store