## Overview

Factor blog makes it easy to add a blog to your app.

Add images, tags, and manage your content dynamically through the Factor dashboard without having to rebuild your app. It can be easily customized via [factor-settings](https://factor.dev/docs/settings).

## Installation

Just add to your application dependencies:

```bash
npm add  @factor/plugin-blog
```

Once you've installed it in your project, next time you run Factor it will be automatically loaded. The loading will handle endpoints and data, all you need to do now is add some routes, import components and customize.

## Adding Routes

### Auto Routes

By default this plugin adds routes for you (which can be customized). However, in many cases this is not desireable since it can be harder to customize. You can disable this by adding `blog.disableAutoRoutes` to `true` in your factor settings. If instead you'd just like to customize the default routes, you can use `blog.indexRoute` and `blog.postRoute`.

```js
// factor-settings
export default {
  blog: {
    indexRoute: "/blog",
    postRoute: "/entry",
    disableAutoRoutes: false,
    // other settings
  },
}
```

> Note that when using auto routes, you'll often need to override the `blogSingle` or `blogIndex`

### Manually Adding Routes

If you'd like to customize the blog, we recommend you disable automatic routes and manually add them, then import the blog components. This allows you complete control of the views on these pages.

Make sure to set `blog.indexRoute` and `blog.postRoute` so the blog knows how to handle links and other functionality.

```js
// factor-settings
export default {
  blog: {
    indexRoute: "/journal",
    postRoute: "/journal-post",
    disableAutoRoutes: true,
    // other settings
  },
}
```

Then in your [main file](https://factor.dev/docs/main-files) you can add your routes using the `addRoutes` function:

```js
// index
import { addRoutes } from "@factor/api"

addRoutes({
  key: "myRoutes",
  routes: [
    {
      path: "/journal",
      component: (): Promise<any> => import("./my-index.vue"),
    },
    {
      path: "/journal-post/:permalink",
      component: (): Promise<any> => import("./my-single.vue"),
    },
  ],
})
```

Now inside each of your custom components (`my-index` and `my-single` above) you can import the blog index and single post components respectively.

```html
<!-- my-index.vue -->
<template>
  <div class="blog-index">
    <h1>My Custom Layout</h1>
    <standard-blog-index />
  </div>
</template>
<script lang="ts">
  import { standardBlogIndex } from "@factor/plugin-blog"
  export default {
    components: {
      standardBlogIndex,
    },
  }
</script>
```

```html
<!-- my-single.vue -->
<template>
  <div class="blog-index">
    <h1>My Custom Layout</h1>
    <standard-blog-single />
  </div>
</template>
<script lang="ts">
  import { standardBlogSingle } from "@factor/plugin-blog"
  export default {
    components: {
      standardBlogSingle,
    },
  }
</script>
```

Now you should be up and running with a working blog. The plugin takes care of all the data handling from here. Let's discuss further customization.

## Taxonomy - Categories, Tags and Search

The standard post index functions in Factor allow `category`, `tag` and `search` filtering and this plugin supports this.

To filter by category, for example, all you need to do is add `category=theCategory` to your url and the plugin will take care of the rest. Same goes for `search` and tag:

```yaml
- https://www.example.com/blog?category=rome
- https://www.example.com/blog?tag=aristotle
- https://www.example.com/blog?search=plato
```

Now with this, you can add custom navigation schemes or links to your layout.

To create a set list of categories that can be selected in the dashboard, you can use the `blog.categories` setting.

```js
// factor-settings
export default {
  blog: {
    categories: ["cicero", "aristotle", "plato"],
    // other settings
  },
}
```

## Post Limit / Pagination

If you'd like to change the amount of posts that are shown on the index before pagination, use the `blog.limit` option.

```js
// factor-settings
export default {
  blog: {
    limit: 40,
    // other settings
  },
}
```

## Localization / i18n

Factor supports [localization](./docs/localization) and this plugin can easily be localized by adding the translations to a `factor-lang-[code].ts` file in your app.

If you'd like to contribute a translation to the plugin that would be much appreciated. Please create a pull request to add it.

## Advanced Customization

### Layout and Overriding

The layout of components and the components in this plugin can easily be overwritten from your app.

The settings available look like this:

```js
// factor-settings
export default {
  blog: {
    // other settings
    layout: {
      index: ["featuredImage", "title", "subtitle", "meta"],
      single: ["returnLink", "title", "meta", "entry", "social", "authorBio"],
      meta: ["authorDate", "tags"],
    },
    components: {
      blogWrap: (): Promise<any> => import("./blog-wrap.vue"),
      blogIndex: (): Promise<any> => import("./blog-index.vue"),
      blogSingle: (): Promise<any> => import("./blog-single.vue"),
      returnLink: (): Promise<any> => import("./widget-return-link.vue"),
      featuredImage: (): Promise<any> => import("./widget-featured-image.vue"),
      title: (): Promise<any> => import("./widget-title.vue"),
      meta: (): Promise<any> => import("./widget-meta.vue"),
      subtitle: (): Promise<any> => import("./widget-subtitle.vue"),
      pagination: (): Promise<any> => import("./widget-pagination.vue"),
      authorDate: (): Promise<any> => import("./widget-author-date.vue"),
      authorBio: (): Promise<any> => import("./widget-author-bio.vue"),
      entry: (): Promise<any> => import("./widget-entry.vue"),
      excerpt: (): Promise<any> => import("./widget-excerpt.vue"),
      social: (): Promise<any> => import("./widget-social.vue"),
      tags: (): Promise<any> => import("./widget-tags.vue"),
      notFound: (): Promise<any> => import("./widget-not-found.vue"),
      loading: (): Promise<any> => import("./widget-loading.vue"),
    },
  },
}
```

In your app's settings file you can choose to change the layout of components in the `index` `single` or post `meta` area.

You can also override the components in this plugin with your own if you'd like detailed component customization.
