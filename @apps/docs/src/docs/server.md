# Server Environment and Endpoints

## Overview

## Server-Side-Rendering (SSR)

Factor is a "universal" or server-side-rendered platform. This means that HTML is first generated and cached by your server and then sent to the client and "hydrated" by client-side javascript.

While SSR comes with some added work, it comes with some big benefits which are necessary for professional applications.

SSR apps have better:

- **SEO** - Most search-engines struggle with client-only applications
- **Syndication** - Social and sharing apps scrape your source to get meta information when users post about your app
- **Performance** - SSR'd applications have faster loading time than client-side only apps

#### VUE SSR

This doc will explain how SSR relates to Factor. However, if you'd like to understand more, Factor's SSR engine is built on Vue's [server-rendering system](https://ssr.vuejs.org). Make sure to read those docs to learn more...

### Managing SSR Data

In Factor SSR, server-rendered information must first be "prefetched" on your server and then sent to the browser for hydration. The easiest way to do this with Factor is using two tools:

- The `site-prefetch` filter based on Vue [serverPrefetch](https://ssr.vuejs.org/api/#serverprefetch)
- Factor's "store", built on top of [Vuex](https://vuex.vuejs.org/)

#### Prefetch and Stores

If you'd like to get information prior to server-render the easiest way to do it is to request it inside Factor's `site-prefetch` callback filter and then add this information to Factor's store.

Example:

```javascript
// index.js
export default Factor => {
  return new class{
    constructor(){

      // This requests information and adds to Factor store
      Factor.$filters.callback('site-prefetch', async () => {
        const list = await this.getList()

        Factor.$store.add("myList", list)
      })
    }
  }()
}

// inside-my-component.vue
// using a store "getter" the information needed will be available
// both server-side and client-side
export default {
  computed: {
    myList() {
      return this.$store.val("myList") || {}
    }
  }
}
```

### SSR and Authentication

By design, Factor SSR always renders assuming the user is logged out. This allows Factor to send the same source to all visitors which allows for aggressive caching and optimization.

There is little utility to considering authentication server-side; all the benefits including speed and syndication can be realized without specific user info.

Once your visitors have loaded the browser version of the application, Factor loads authentication and changes the app as needed.

When coding throughout Factor, you'll need to be aware of the timeline of user initialization and how to work with it in harmony. Here are some considerations to be aware of...

#### Mounted vs Created

In Vue components we have two primary 'hooks' that are initialized when components are created, `mounted` and `created`. With Factor SSR, it's important to know that the `mounted` hook is only fired on the users browser, while the `created` hook is fired on both.

The goal is to have the server and the browser output match when the browser initially renders over the server rendered source. (If there is a mismatch you should see a warning)

```javascript
// some-component.vue
export default {
  created(){
    // fired on both server and client
  }
  mounted(){
    // fired only on client
  }
}
```

#### User Init

If you're using Factor's user and authentication plugins, Factor NEVER loads user information on the server. This is because its not needed, and it allows for some useful and important caching features of server generated source.

If you are implementing a feature where auth is necessary, place it after the user init hook, for example:

```javascript
// some-component.vue
export default {
  async mounted() {
    // Using a callback
    this.$user.init(user => {
      // user authentication has initialized
      // user status and information is available
    })

    // Using async/await
    const user = await this.$user.init()
  }
}
```

## Endpoints

_For operations that must happen on the server, Factor includes utilities for adding endpoints and middleware. This document discusses how to create and use them..._

### When To Use

In a normal web-app, many actions need to happen in a trusted server environment. Some example scenarios:

- Indexing or deleting data in a third-party service
- Charging a customer
- Authentication

This is because transactions handle private information and secret API keys that can't be exposed to the public.

Using endpoints and middleware allows the Factor application to securly request an action take place; and simply returns the result to the user.

### HTTP Endpoints

As endpoints are a common pattern, Factor includes a standard endpoint handling utility to make this easy.

- On the server

  - Endpoints are added via the `endpoints` filter
  - Endpoints represent a typical Factor module or class. This allows for simple resource sharing amonst similar endpoint requests.
  - The endpoint handler takes care of parsing requests and determining authentication status.

- In the client
  - The form of an endpoint request uses `$factor.$endpoint.request(args)`
  - The request method arguments:
    - `id` (required) - The ID of the endpoint to call
    - `method` (required) - The method of the endpoint class
    - `auth` (optional) - If the user must be authenticated (default: `true`)
    - `params` (optional) - Additional arguments are passed as parameters to the method (default: `{}`)

Adding an endpoint in a server accessible module/plugin:

```javascript
// Adding an endpoint in a server loaded module
export default Factor => {
  return new (class {
    constructor() {
      // adds "this" representing the current class as the server endpoint handler
      // the endpoint ID is "myEndpoint"
      Factor.$filters.callback("endpoints", {
        id: "myEndpoint",
        handler: this
      })

      // Note: On the server Factor.$config.settings() is available with all secrets and environmental vars (TOP SECRET!)
    }

    endpointMethod(params) {
      return `my response with option: ${params.myOption}`
    }
  })()
}
```

And in another plugin in the client or app:

```javascript
// Requesting an endpoint transaction from your app
export default Factor => {
  return new (class {
    constructor() {}

    async requestEndpointMethod() {
      // Request and await transaction of endpointMethod
      const response = await Factor.$endpoint.request({
        id: "myEndpoint",
        method: "endpointMethod",
        params: { myOption: 123 }
      })

      console.log(response) // "my response with option: 123"

      // Note: Authorization header automatically included with user token which is used to determine auth status
    }
  })()
}
```

## Middleware

Endpoints are built on top of "middleware." Middleware is used as a more general utility for handling server requests to specific URLs. In Factor, middleware is easily extended and adding middleware can solve many different problems, such as generating sitemaps or handling form data.

In Node, middleware functions always take the form:

```javascript
const myMiddleware = (request, response, next) => {}
```

- _Request_ - Is the client's request to the URl
- _Response_ - Is your server's response
- _Next_ - Is a function which Node uses to determine if it should continue processing middleware at a specific URL or stop.

### Adding Middleware

To add middleware to your Factor server, all you have to do is use the `middleware` filter and a middleware object which includes the `path` and callback function(s).

As an example, middleware for creating a sitemap might look like the following:

```javascript
// index.js
export default Factor => {
  return new (class {
    constructor() {
      addFilter("middleware", middlewares => {
        middlewares.push({
          path: "/sitemap.xml",
          callback: async (request, response, next) => {
            // generate sitemap
            const sitemapXML = await this.getSitemap()

            response.header("Content-Type", "application/xml")
            response.send(sitemapXML)

            // Notes: No 'next' call is needed since we don't need to continue processing other middleware
          }
        })
      })
    }
  })()
}
```
