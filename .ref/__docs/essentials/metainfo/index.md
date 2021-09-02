---
title: Metainfo and Metatags
description: Learn how to add metatags and metainfo to pages and components in Factor.
---

# Metainfo and Metatags

For meta handling, Factor uses the [Vue Meta Plugin](https://github.com/nuxt/vue-meta). Which allows you to set meta information in the source of your HTML. The features of this plugin are fully implemented on both the client and in SSR.

## Vue Meta

Factor's meta system implements [Vue Meta](https://vue-meta.nuxtjs.org/guide/), so use its docs for additional help working with Factor's meta info.

**Features:**

- Server-side rendered - Ideal for SEO
- Can add almost anything to your HTML:
  - `<body>` tags and attributes
  - `<html>` tags and attributes
  - Meta info like viewport, author, scripts, styles, "og" info and more.

In many cases, if you're using [Factor plugins](../plugins), they will set meta information for you and you won't need to worry about it.

If you are creating custom components you can easily add this info yourself.

## Meta In Components

Setting meta info in components is easy, you just need to use the `metaInfo` property to any component's options.

The meta system for Factor reads the `metaInfo` property from your view components, giving priority to those that are more nested.

### Typical Meta Information

The most typical meta items that are needed are:

- **Title** - The page title `<title>`
- **Description** - The page description `<meta name="description">`
- **Sharing Image** - Shows up when someone shares a URL `og:image`
- **Title Template** - The format for title tags. `%s - My App` (`%s` is the title)

Setting this information looks like this:

```js
// Inside Content Wrapper (content.vue)
export default {
  metaInfo() {
    return {
      titleTemplate: "%s - My App",
      title: "My default title",
      description: "My default description",
      image: require("./my-default-sharing-image.jpg"),
    }
  },
}
// In view component (my-page.vue)
// This info overwrites the default since it is more nested
export default {
  metaInfo() {
    return {
      title: "My title",
      description: "My description",
      image: require("./my-sharing-image.jpg"),
    }
  },
}
```

Here we set some global defaults for the app, then override them in individual pages.

## Setting Advanced Meta

Aside from the basic meta, are many different types of meta information that you may want to set. Some examples:

- Adding an author `<meta name="author">`
- Changing viewport `<meta name="viewport">`
- Changing HTML language `<html lang="">`
- Adding styles or script `<script>` `<link rel="stylesheet>`

All this can be done using the standard [Vue Meta api](https://vue-meta.nuxtjs.org/api/#metainfo-properties).

To set the above from a component:

```js
// src/factor-settings
export default {
  metaInfo: {
    htmlAttrs: { lang: "fr" },
    meta: [
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no",
      },
      {
        name: "author",
        content: "Elvis Presley",
      },
    ],
    link: [
      {
        vmid: "my-key",
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/some-external-stylesheet/css.min.css",
      },
    ],
    script: [
      {
        vmid: "my-key",
        src: "https://cdn.jsdelivr.net/some-external-script/script.js",
        async: true,
        defer: true,
      },
    ],
  },
}
```

> **VMID** The [vmid property](https://vue-meta.nuxtjs.org/faq/#unique-metadata) helps the Vue Meta determine if they should add or replace meta information. If the `vmid` key already exists, it will be replaced instead of creating a new tag.

## Global Meta Setting

If you want to set the global meta defaults in `factor-settings` instead of a component, that is possible with `app.metaInfo`:

```js
// src/factor-settings
export default {
  metaInfo: {
    titleTemplate: "%s - My App",
    image: require("./image.jpg"),
    htmlAttrs: { lang: "fr" },
    meta: [
      {
        name: "author",
        content: "Elvis Presley",
      },
    ],
  },
}
```

## Resources

- [Making your JavaScript App discoverable](https://www.youtube.com/watch?v=Op8Q8bUAKNc)
