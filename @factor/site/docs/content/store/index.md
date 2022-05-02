---
title: The Data Store
description: Learn how to work with data and the flat store in Factor
---

To keep things simple, Factor uses a simple "flat store" for keeping track of global state. While Factor uses [Vuex](https://next.vuex.vuejs.org/) underneath the hood, you won't need to use it directly.

With Factor's store there are only two functions `stored(key)` and `storeItem(key, value)`.

- `storeItem` - Save some value in the store
- `stored` - Retrieve a value in the store.

That's it. Here's how it's used:

```js
import { storeItem, stored } from "@factor/api"
import { computed } from "vue"

storeItem("myKey", "hello")

// later

const myVariable = stored("myKey") // 'hello'

// you can also use a computed for dynamic values
const myVariable = computed(() => stored("myKey")) // 'hello'
```
