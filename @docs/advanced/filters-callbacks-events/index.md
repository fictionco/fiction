---
title: Plugin API - Filters, Callbacks, and Events
description: The plugin API allows you to interact with Factor core from apps, plugins and themes.
---

# Filters, Callbacks, and Events

Hooks, also known as "filters", "callbacks", and "events" are provided by Factor to allow you to 'hook into' the rest of Factor. Allowing you to call functions or manipulate data in your code at specific times. There are three kinds of hooks:

- **Filters** - Change or add to data used in other parts of Factor
- **Callbacks** - Trigger and await functions at specific times
- **Events** - Trigger callbacks when certain events occur.

Each type of hook has it's own use case, and sometimes there are many ways to accomplish the same task. Let's go through how hooks are used.

## Filters

Filters are a powerful extension mechanism. They allow you to manipulate data that is used somewhere else in the Factor system. There are two basic functions:

- `applyFilters` - Runs input data through a hook-able filter
- `addFilter` - Hooks a new filter to data passed to a `applyFilters` function

Here is how they are used:

```js
import { applyFilters, addFilter } from "@factor/api"

addFilter({
  key: "uniqueKey",
  hook: "my-example-hook",
  callback: (data) => {
    data.myAddedData = "hello world"
    return data
  },
  priority: 100, // optional
})

// later

const data = applyFilters("my-example-hook", { defaultData: "Hi" })

// data = {defaultData: "hi", myAddedData: "hello there"}
```

- **Return Data:** Note that the edited data must be returned. If the callback function returns `undefined` then the original data won't be affected.
- **Unique Key** `key` - Is a key that is used for debugging and allowing server restarts (prevents double loading).
- **Priority Order** `priority` - Filters are priority sorted based on a default value of `100`. Lower numbers run first.

### pushToFilter

There is an additional utility function that saves some boiler-plate if you're just adding something to an array `pushToFilter`.

```js
import { applyFilters, pushToFilter } from "@factor/api"

pushToFilter({
  key: "key1",
  hook: "my-example-hook",
  item: "hello there",
  priority: 100, // optional
})

pushToFilter({
  key: "key2",
  hook: "my-example-hook",
  item: "hola",
  priority: 80, // optional
})

// Input data must be an array for pushToFilter to work
const data = applyFilters("my-example-hook", ["hi"])

// data = ["hi", "hola", "hello there"]
```

## Callbacks

Callbacks are a way to add async functions that are waited on at certain points in time. It is also possible to use the output of all the callbacks that are added to a hook. There are two main functions:

- `addCallback` - Add a callback function
- `runCallbacks` - Run all callback functions

```js
import { addCallback, runCallbacks, waitFor } from "@factor/api"

addCallback({
  key: "key1",
  hook: "my-example-hook",
  callback: async (data) => {
    // simulate async - wait for 1 second
    await waitFor(1000)

    return data + "world"
  },
  priority: 100, // optional
})

const results = await runCallbacks("my-example-hook", "hello")

// results = ["hello world"]
```

## Events

Events are triggers that can be emitted and listened for globally in your app.

- `emitEvent` - Emits an event
- `onEvent` - Listen for an event

```js
import { emitEvent, onEvent } from "@factor/api"

onEvent("my-event", (data) => {
  console.log(data) // hello world
})

emitEvent("my-event", "hello world")
```

## Load Order

For any hook to run correctly, you'll need to make sure all the functions that "hook in" are loaded before the trigger function. For example, if you emit an event before you listen for the event, then it won't work.

To ensure proper load order make sure that trigger functions (e.g. emitEvent, runCallbacks or applyFilters) come after extension.

```js
import { emitEvent, onEvent, addCallback } from "@factor/api"

addCallback({
  key: "key1",
  hook: "initialize-app"
  callback: () => {
    emitEvent("my-event", "hello world")
  }
})

onEvent("my-event", (data) => {
  console.log(data) // hello world
})
```
