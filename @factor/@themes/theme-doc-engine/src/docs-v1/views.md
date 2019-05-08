# Views

> The Views section describes all you need to configure data and views for a specific route in your Factor.js Application (App Template, Layouts, Pages and HTML Head).

![factor-views-schema](/factor-views-schema.svg)

## App Template

> You can customize the HTML app template used by Factor.js to include scripts or conditional CSS classes.

To change the template, create an `app.html` file in the root folder of your project.

The default template used by Factor.js is:

```html
<!DOCTYPE html>
<html {{ HTML_ATTRS }}>
  <head {{ HEAD_ATTRS }}>
    {{ HEAD }}
  </head>
  <body {{ BODY_ATTRS }}>
    {{ APP }}
  </body>
</html>
```

One use case of using a custom app template is to add conditional CSS classes for IE:

```html
<!DOCTYPE html>
<!--[if IE 9]><html lang="en-US" class="lt-ie9 ie9" {{ HTML_ATTRS }}><![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--><html {{ HTML_ATTRS }}><!--<![endif]-->
  <head {{ HEAD_ATTRS }}>
    {{ HEAD }}
  </head>
  <body {{ BODY_ATTRS }}>
    {{ APP }}
  </body>
</html>
```

<!-- TODO: Load polyfills here? -->

## Layouts

Layouts are a great help when you want to change the look and feel of your Factor.js app.
Whether you want to include a sidebar or having distinct layouts for mobile and desktop

### Default Layout

You can extend the main layout by adding a `layouts/default.vue` file.
It will be used for all pages that don't have a layout specified.

<div class="alert">
  <p>The default layout that comes out of the box is just three lines long and simply renders the page component:</p>
</div>

```html
<template>
  <factor />
</template>
```

### Custom Layout

Every file (*top-level*) in the `layouts` directory will create a custom layout accessible with the `layout` property in the page components.

Let's say we want to create a blog layout and save it to `layouts/blog.vue`:

```html
<template>
  <div>
    <div>My blog navigation bar here</div>
    <factor />
  </div>
</template>
```

Then we have to tell the pages (i.e. `pages/posts.vue`) to use your custom layout:

```html
<template>
<!-- Your template -->
</template>
<script>
export default {
  layout: 'blog'
  // page component definitions
}
</script>
```

More information about the `layout` property: [API Pages `layout`](/api/pages-layout)

Check out the [demo video](link) to see custom layouts in action.

<!-- TODO: Scoped styles best practice -->

### Error Page

The error page is a *page component* which is always displayed when an error occurs (that does not happen while server-side rendering).

<div class="alert">

**Warning:** Though this file is placed in the <code>layouts</code> folder, it should be treated as a **page**.

</div>

As mentioned above, this layout is special, since you **should not** include `<factor/>` inside its template.
You must see this layout as a component displayed when an error occurs (`404`, `500`, etc.).
Similar to other page components, you can set a custom layout for the error page as well in the usual way.

The default error page source code is [available on GitHub](link).

You can customize the error page by adding a `layouts/error.vue` file:

```html
<template>
  <div class="container">
    <h1 v-if="error.statusCode === 404">Page not found</h1>
    <h1 v-else>An error occurred</h1>
    <factor-link to="/">Home page</factor-link>
  </div>
</template>

<script>
export default {
  props: ['error'],
  layout: 'blog' // you can set a custom layout for the error page
}
</script>
```

## Pages

Every Page component is a Vue component but Factor.js adds special attributes and functions to make the development of your universal application as easy as possible.

```html
<template>
  <h1 class="red">Hello {{ name }}!</h1>
</template>

<script>
export default {
  asyncData (context) {
    // called every time before loading the component
    // as the name said, it can be async
    // Also, the returned object will be merged with your data object
    return { name: 'World' }
  },
  fetch () {
    // The `fetch` method is used to fill the store before rendering the page
  },
  head () {
    // Set Meta Tags for this Page
  },
  // and more functionality to discover
  ...
}
</script>

<style>
.red {
  color: red;
}
</style>
```

| Attribute | Description | Documentation |
|-----------|-------------| ------------- |
| `asyncData` | The most important key. It can be asynchronous and receives the context as argument. | [Guide: Async data](/docs/async-data) |
| `fetch` | Used to fill the store before rendering the page. It's like the `asyncData` method, except it doesn't set the component data. | [API Pages `fetch`](/api/pages-fetch) |
| `head` | Set specific `<meta>` tags for the current page. | [API Pages `head`](/api/pages-head) |
| `layout` | Specify a layout defined in the `layouts` directory. | [API Pages `layout`](/api/pages-layout) |
| `loading` | If set to `false`, prevents a page from automatically calling `this.$factor.$loading.finish()` as you enter it and `this.$factor.$loading.start()` as you leave it, allowing you to **manually** control the behavior, as [this example](/examples/custom-page-loading) shows. Only applies if `loading` is also set in `factor.config.js`. | [API Configuration `loading`](/api/configuration-loading) |
| `transition` | Defines a specific transition for the page. | [API Pages `transition`](/api/pages-transition) |
| `scrollToTop` | Boolean (default: `false`). Specify if you want the page to scroll to the top before rendering the page. It's used for [nested routes](/docs/routing#nested-routes). | [API Pages `scrollToTop`](/api/pages-scrolltotop#the-scrolltotop-property) |
| `validate` | Validator function for [dynamic routes](/docs/routing#dynamic-routes). | [API Pages `validate`](/api/pages-validate#the-validate-method) |
| `middleware` | Defines middleware for this page. The middleware will be called before rendering the page. | [Guide: middleware](/docs/routing#middleware) |

More information about the pages properties usage: [API Pages](/api)

## HTML Head

Factor.js uses [vue-meta](https://github.com/declandewet/vue-meta) to update the `document head` and `meta attributes` of your application.

The `vue-meta` Factor.js uses can be found [on GitHub](https://github.com/factor/factor.js/blob/dev/packages/vue-app/template/index.js#L29-L35)

<div class="alert"> 

<p><b>Info:</b> Factor.js uses <code>hid</code> instead of the default <code>vmid</code> key to identify meta elements</p>

</div>

### Default Meta Tags

Factor.js lets you define all default `<meta>` tags for your application inside `factor.config.js`. Define them using the same `head` property:

Example of a custom viewport with a custom Google font:

```js
head: {
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto' }
  ]
}
```

To learn more about the options available for `head`, take a look at [vue-meta documentation](https://github.com/declandewet/vue-meta#recognized-metainfo-properties).

More information about the `head` method are available on the [API Configuration `head`](/api/configuration-head) page.

### Custom Meta Tags for a Page

More information about the head method can be found on the [API Pages `head`](/api/pages-head) page.