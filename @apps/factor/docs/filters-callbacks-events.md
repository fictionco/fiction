# Filters, Callbacks and Events

There are three tools that can be used by extensions to modify the behavior of Factor without modifying its code: filters, callbacks and events.

## Filters

Filters are functions that are called with data the moment before Factor does something with that data. By hooking into a filter you can modify or add to the data before its used.

In the example below, an item "bar" is added to the data with filter id: `item-list`. The result of the initial input `["foo"]` and the added item is `["foo", "bar"]`.

```javascript
import { applyFilters, addFilter } from "@factor/api"

addFilter("item-list", (list) => {
  list.push("bar")
  return list
})

const finalList = applyFilters("item-list", ["foo"])
// finalList = ["foo", "bar"]
```

- `pushToFilter` is a shorthand for filters that take an array as data. It allows you to pass only the item you want to add to the array and it takes care of the rest.

```javascript
import { applyFilters, pushToFilter } from "@factor/api"

pushToFilter("item-list", "bar")

const finalList = applyFilters("item-list", ["foo"])
// finalList = ["foo", "bar"]
```

## Callback Filters

There are two special callback filter functions for dealing with async callbacks in Factor: `addCallback` and `runCallbacks`.

An awaited `runCallbacks` will "await" for all async callbacks attached to run before it continues. This is similar to `Promise.all`.

```javascript
import { runCallbacks, addCallback } from "@factor/api"

addCallback("after-action", (args) => exampleFunction1(args))
addCallback("after-action", (args) => exampleFunction2(args))

async function exampleFunction1(args) {
  return args + "-first"
}

async function exampleFunction1(args) {
  return args + "-second"
}

const results = await runCallbacks("after-action", "example")

// As with Promise.all, results will be an array of the results from all attached callbacks\
// results = ["example-first", "example-second"]
```

## Global Events

Factor has a global events system that allows you to easily emit and listen for events based on an id.

Here is an example:

```js
import { emitEvent, onEvent } from "@factor/api"

onEvent("custom-event", (data) => {
  // data = "foo"
})

emitEvent("custom-event", "foo")
```
