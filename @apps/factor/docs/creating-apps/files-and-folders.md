---
title: Application Files and Folders
description: The standard files and folders you'll find in a Factor project and their purpose
---

# App Structure - Files and Folders

Factor follows standard conventions for structuring your JavaScript apps. Below we'll discuss the basic structure behind your app.

## Organizing Your App

Here is a typical structure for a Factor app:

```yaml
# Factor Application Structure
- /: Project Root
    package.json: Application config
    .env: Private keys
    index.ts: application entry file
    server.ts: server entry file
    factor-styles.less: styling and css variables
    factor-settings.ts: customize app / extensions
    content.vue: content wrapper component
    static/:
      icon.svg: Application icon (200px by 200px)
      favicon.png: Favicon
      example.jpg: statically hosted files
# Notes
#   - typescript (ts) and javascript (js) can both be used
```

Let's go through each of these files and what the do:

## Application Config (package.json)

The `package.json` file is a standard file that describes your application's configuration.

Inside this file, use the `factor` property to add config for your app. The `factor` property uses the following options:

```json
// package.json
{
  "name": "myApp",
  "main": "index.js",
  "factor": {
    // Load: loads the main file (index.js above) in both server and app
    "load": ["app", "server"],
    // Application configuration
    "app": {
      "name": "example",
      "email": "team@example.com",
      "url": "https://example.com"
    },
    // App admin users (could also be added in .env)
    "admins": ["ceo@example.com"]
  },
  "dependencies": {
    "@factor/core: ...
  }
}
```

## Private Keys (.env)

For private configuration keys and information, Factor uses the standard [dotenv](https://github.com/motdotla/dotenv) library.

This utility takes the values in this files and adds them to `process.env` at runtime. You should never commit this file to source control, treat it like a password.

```git
TOKEN_SECRET="SOME-LONG-TEXT-12345"
DB_CONNECTION="https://my-connection-string-etc"
```

## Main Files (index.js)

The "main" file is the entry point for app's code. It's loading is defined by the `load` property in `package.json` and it can technically be any file.

There are two environments where we need to load main files:

- **Server** - Your applications server environment (e.g. Node/Express/Webpack)
- **App** - Your apps built environment (Browser and SSR)

You can break out the entry for the app vs the server as follows:

```json
// package.json
{
  "factor": {
    "load": {
      "app": "index", // Loads index.js (or .ts) in webpack app
      "server": "server" // Loads server.js (or .ts) in cli and express server
    }
  }
}
```

Or you can load the main file (index.js) in both environments

```json
// package.json
{
  "factor": {
    "load": ["app", "server"]
  }
}
```

### What are main files for?

Main files control the rest of your app. You can add anything in them but they are especially useful when you use them with filters and events that are called by other parts of the app.

For example, the code below would add a new route at `/example` and show the `v-example.vue` component there. To create this behavior you'd use the main file.

```js
// index.js
import { addContentRoute } from "@factor/api"
addContentRoute({
  path: "/example",
  component: () => import("/v-example.vue")
})
```

In a server example, the code below adds an endpoint at `/_example`. You could build on this to create advanced functionality.

```typescript
// server.ts
import { addMiddleware } from "@factor/server/middleware"
addMiddleware({
  key: "example",
  path: "/_example",
  middleware: [
    async (request: Request, response: Response): Promise<void> => {
      response.send("cool").end()
      return
    }
  ]
})
```

## Using a `src` folder

You can place code for you application in either the root of the directory or in a `src` folder.

What determines this is the `main` value in your `package.json`.

If the main value is in a folder, it is assumed this is where your source is.

```json
// package.json
// Application code is assumed in the `src` folder
{
  "name": "my-app",
  "main": "src/index"
}
```

## Content Wrapper (content.vue)

This component `content.vue` is the global wrapper component for everything on your application front end.

It is designed to wrap your content, and allow you to add global UI elements like your navigation and footer.

Add `content.vue` to the root of your source code directory and Factor will auto-detect it and replace the default wrapper.

Here is an example `content.vue` that adds a header and footer:

```html
<template>
  <div class="content-layout">
    <header-main />
    <div class="content-main">
      <div class="content-main-content">
        <router-view />
      </div>
      <footer-main />
    </div>
  </div>
</template>
<script lang="ts">
  import Vue from "vue"
  export default Vue.extend({
    components: {
      headerMain: () => import("./header.vue"),
      footerMain: () => import("./footer.vue")
    }
  })
</script>

<style lang="less"></style>
```

## Settings (factor-settings)

Factor has a powerfully simple settings system that works with `factor-settings.js` files found in your application as well as any plugins you have installed.

It works by allowing you to easily override values from themes and plugins by placing values under the same key in your app.

## Styles (factor-styles)

Factor has a standardized global CSS styling system that works with a file called `factor-styles`.

By default, this works with `.less` and `.css`, but it is possible to support additional formats like SASS and Stylus via plugins.

## Static Assets

### static/

Place a folder named `static` in your application `src` directory and it will be handled as the static assets for your app. All files in this folder will be copied to your `dist` folder at build-time and then served under their original name.

For example, an image under `static/my-image.jpg` will be available and served at `https://your-url.com/my-image.jpg` after build.

### icon.svg, favicon.png

Set the default icons by adding the `icon.svg` and `favicon.png` images to your static folder. They both should be square and ideally 100px by 100px.

## Generated Folders

### dist/, .factor/

Their are two folders that are generated and managed by Factor when you perform various operations.

- `dist/` this is your distribution application that is generated by Webpack. It is what is hosted and optimized for serving in production.
- `.factor/` this is where generated files and information are stored by Factor.
