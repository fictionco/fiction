---
title: Settings
description: Learn how to customize plugins, themes and Factor core with settings
---

# Settings

When using plugins or themes, you'll often want to make customizations to text, layout, and more. To make this as easy as possible, Factor provides a simple file-based system `factor-settings`.

## Settings in Factor

The `factor-settings` convention is a system for customizing extensions and Factor core.

It works by gathering all `factor-settings` files in your app and extensions, then merging them in priority order.

![Factor Settings](./factor-settings.jpg)

To get started with settings, just add `factor-settings.ts` (or `factor-settings.js`) to your app. Then export an empty object `{}`

```js
// factor-settings
export default {}
```

Now you're ready to start..

## Basic Settings Overview

If your app has a `factor-settings` file, then it will override any settings from Factor or an extension, if you use the same object key.

If a plugin has the following setting:

```js
// factor-settings in a plugin
export default {
  plugin: {
    foo: "bar",
  },
}
```

And then you create a `factor-settings` file with the following setting at the same location:

```js
// factor-settings from your app
export default {
  plugin: {
    foo: "baz",
  },
}
```

Then when the plugin references that setting, they will get your custom value:

```js
setting("plugin.foo") // baz
```

## Overriding Components

A common and powerful technique for customizing extensions is simply to override its components.

To enable this, many plugins load in components based on settings. If you reference their code or documentation; you will likely see something like this example from the blog plugin:

```js
// blog/factor-settings.ts
export default {
  blog: {
    components: {
      // ... other components ...
      blogIndex: () => import("./blog-index.vue"),
    },
  },
}
```

Now, if you'd like to override the default blog index with a custom one. Then just:

- Copy the original component into your application (`/src/my-blog-index.vue`)
- Make any changes needed
- Override the setting:

```js
// src/factor-settings.ts
export default {
  blog: {
    components: {
      // ... other components ...
      blogIndex: () => import("./my-blog-index.vue"),
    },
  },
}
```

Now when the plugin references that setting, they will get your custom component:

```js
setting("blog.components.blogIndex") // () => import("./my-blog-index.vue"),
```
