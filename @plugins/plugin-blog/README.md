## Overview

Factor blog makes it easy to add a blog to your app. Add images, add tags, and manage your content dynamically through the Factor dashboard without having to rebuild your app. It can be easily customized via factor-settings.js

## Installation

Just add to your application dependencies:

```bash
npm add  @factor/plugin-blog
```

## Options and Settings

The customization system for this plugin is based on the standard `factor-settings.js` API that is provided by Factor.

```js
// app factor-settings.js
export default {
  blog: {
    indexRoute: "/my-blog-index-route",
    postRoute: "/my-post-base-route",
    limit: 6
  }
}
```

## Factor Setup CLI

Run `npx factor setup` for a question based CLI to help you configure this plugin's options.
