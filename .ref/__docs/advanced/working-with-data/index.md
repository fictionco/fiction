---
title: Working With Data and the Store
description: Learn how to work with data and the flat store in Factor
---

# Working with Data

Working with data in Factor is designed to be simple and powerful.

## The Flat Store

For data, there is the [database](./database) and it's equivalent in your app called the "flat store."

The flat store is a store built with Vue's store solution: [Vuex](https://vuex.vuejs.org/), but you won't need to interact with it directly. In about 99% of cases, you'll be able to get by with two functions `stored(key)` and `storeItem(key, value)`.

Here is how it works:

```js
import { stored, storeItem } from "@factor/api"

storeItem("myKey", { myValue: "hello world" })

// later
const value = stored("myKey") // hello world
```

## The Store In Components

The store is reactive and can be used as computed properties in your components. You can also use [computed setters](https://vuejs.org/v2/guide/computed.html#Computed-Setter) to interact with the stored value directly in your component.

```js
import { stored, storeItem } from "@factor/api"
export default {
  computed: {
    myValue() {
      // Available as this.myValue
      return stored("myKey")
    },
    post: {
      get() {
        // gets whatever is stored under key [this._id]
        return stored(this._id) || {}
      },
      set(post): void {
        // whenever this.post changes, it updates the value in the store
        storeItem(this._id, post)
      },
    },
  },
}
```

## Server-side Rendering

To prevent double-fetching of data between your server and client, use the store to send information from the server to the client.

Whenever you add information to the store on the server it is delivered and added to the store on load.

The example below uses [serverPrefetch](https://ssr.vuejs.org/api/#serverprefetch) to get data on the server and then send it to the client.

```js
import { storeItem } from "@factor/api"

// Example fetching of data and add to store
const getSomeData = async () => {
  const data = await getData()
  storeItem("myData", data)

  return
}

// In component
export default {
  computed: {
    // The property we'll use in the component
    myData() {
      return stored("myData")
    },
  },
  // Runs on server
  serverPrefetch() {
    return getSomeData()
  },
  async beforeMount() {
    // If we are not on initial page load (ssr)
    // Then run the request in the client
    if (!this.myData) {
      this.getSomeData()
    }
  },
}
```

## Further Reading

To learn more about working with data in Factor, here are some resources we recommend:

### Docs

- [Endpoints and middleware](./endpoints-and-middleware) - Learn how to make requests to custom endpoints or middleware.
- [Working with posts](./working-with-posts) - Learn how fetching works in the posts system and how it makes use of the store.
- [Database](./database) - Working with MongoDB/Mongoose in Factor.

### Example

- [Factor Hacker News](./hacker-news) - This example uses the flat store along with SSR.

### External Resources

- [Axios](https://github.com/axios/axios) - Recommended HTTP request client
- [serverPrefetch](https://ssr.vuejs.org/api/#serverprefetch) - Server pre-fetching of data in Vue
