---
title: Markdown
description: Learn how to work with markdown in Factor
---

# Markdown

Markdown is a great way of working with formatted text. Learn about the tools included that will help you work with it.

## Reading Markdown Files

Factor is set up to read markdown files (`.md`) by default. It also supports relative image urls via [Markdown Image Loader](https://github.com/lucsorel/markdown-image-loader).

```js
const getMarkdown = async () => {
  const markdownContent = await import("./my-markdown-file.md")
}
```

## Rendering Markdown

Now that you've got markdown via a file, a post or some other source it's time to render it to HTML.

Factor has two functions for this `renderMarkdown` and `renderMarkdownWithMeta`.

If you'd like to simply render markdown to HTML use `renderMarkdown`.

```js
import { renderMarkdown } from "@factor/api"

const getContent = async () => {
  const markdownContent = await import("./my-markdown-file.md")

  const html = renderMarkdown(markdownContent)

  return html
}
```

However, often you'll want to include meta information from [front matter](https://github.com/jxson/front-matter).

In that case, use `renderMarkdownWithMeta`.

Given a markdown file that looks like this:

```md
---
title: My Title
description: My description
---

# Markdown

Some content.
```

Then you can use `renderMarkdownWithMeta` to get meta information and rendered markdown to HTML.

```js
import { renderMarkdown } from "@factor/api"

const myFunction = async () => {
  const markdownContent = await import("./my-markdown-file.md")

  const { meta, content } = renderMarkdownWithMeta(markdownContent)

  // Meta and content will equal:

  // meta = {
  //   title: "My Title"
  //   description: "My description"
  // }

  // content = "<h1>Markdown</h1><p>Some content.</p>"
}
```

## Using in Components

Rendering HTML in component templates can be considered a security risk in certain situations. Specifically when using stored user generated content.

For this reason, Factor has a special [Vue directive](https://vuejs.org/v2/guide/custom-directive.html) called "formatted-text".

You should use this directive to put generated HTML into your templates. It's secure because it sanitizes the HTML elements and makes sure that insecure tags and markup can't be used.

```html
<template>
  <div v-formatted-text="myHtml"></div>
</template>
```

Alternatively you can use Vue's native `v-html` but that is less secure since it trusts all tags.

## Variables

If you need to get values from the store or settings and use them in your markdown, you can access them with the `variables` option.

This will take variables with the format `{{setting}}` and search the store and settings for values that correspond with that dot setting.

```js
const html = renderMarkdown(markdownContent, { variables: true })
```

## Components in Markdown

You can also inject components into markdown after render.

This can be done by adding a HTML element with a class of `inject-component` and an ID that corresponds to the setting associated with the component.

```js
// factor-settings
export default {
  myApp: {
    components: {
      myComponent: () => import("my-component.vue"),
    },
  },
}
```

```md
<component class="inject-component" id="myApp.components.myComponent"></component>
```

Now in the component you are using to render the markdown just call the `injectMarkdownComponents` function after everything has mounted.

```html
<template>
  <div class="entry" v-formatted-text="content"></div>
</template>
<script>
  import { injectMarkdownComponents, setting } from "@factor/api"

  export default {
    props: {
      content: { type: String, default: "" },
    },
    mounted(this: any) {
      injectMarkdownComponents()
    },
  }
</script>
```
