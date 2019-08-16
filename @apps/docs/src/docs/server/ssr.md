# Server-Side-Rendering (SSR)

Factor is a "universal" or server-side-rendered platform. This means that HTML is first generated and cached by your server and then sent to the client and "hydrated" by client-side javascript.

While SSR comes with some added work, it comes with some big benefits which are necessary for professional applications.

SSR apps have better:

- **SEO** - Most search-engines struggle with client-only applications
- **Syndication** - Social and sharing apps scrape your source to get meta information when users post about your app
- **Performance** - SSR'd applications have faster loading time than client-side only apps

#### VUE SSR

This doc will explain how SSR relates to Factor. However, if you'd like to understand more, Factor's SSR engine is built on Vue's [server-rendering system](https://ssr.vuejs.org). Make sure to read those docs to learn more...

## Managing Data

In Factor SSR, server-rendered information must first be "prefetched" on your server and then sent to the browser for hydration. The easiest way to do this with Factor is using two tools:

- The `site-prefetch` filter based on Vue [serverPrefetch](https://ssr.vuejs.org/api/#serverprefetch)
- Factor's "store", built on top of [Vuex](https://vuex.vuejs.org/)

### Prefetch and Stores

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

## SSR and Authentication

By design, Factor SSR always renders assuming the user is logged out. This allows Factor to send the same source to all visitors which allows for aggressive caching and optimization.

There is little utility to considering authentication server-side; all the benefits including speed and syndication can be realized without specific user info.

Once your visitors have loaded the browser version of the application, Factor loads authentication and changes the app as needed.

When coding throughout Factor, you'll need to be aware of the timeline of user initialization and how to work with it in harmony. Here are some considerations to be aware of...

### Mounted vs Created

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

### User Init

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
