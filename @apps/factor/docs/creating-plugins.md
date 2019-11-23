# Creating Factor Plugins

## Project Setup

Factor plugins are standard Node modules that "hook" into Factor functionality.

The first step in creating a plugin is to create a folder that includes a `package.json` file.

To make your project a Factor plugin all that is needed is to add the `factor` property.

If you'd like your plugin to be "auto-loaded" in your user's applications, you'll also need to set the `target` property and assign the entry files.

```json
// package.json
{
  "name": "excellent-factor-plugin",
  "factor": {
    "target": {
      "app": "index", // Loads index.js in webpack app
      "server": "server" // Loads server.js in server environment
    }
  }
}
```

## Development Setup

To work on your plugin and see what it does, you'll need to add it to a Factor application or theme. If you have an app setup locally for development, then you'll need to reference the local plugin in its dependencies.

To do this, we recommend looking into:

- [Yarn Workspaces](https://yarnpkg.com/en/docs/cli/workspace),
- [Yarn Link](https://yarnpkg.com/en/docs/cli/link), or
- [NPM Local Paths](https://docs.npmjs.com/files/package.json#local-paths).

## Starting Your Plugin

The first step is to add some code to your plugin "entry" or "main" files (set with `target` property).

These files typically "hook" into Factor via functions, filters and callbacks. A few examples of what you can do:

- Add [endpoints and middleware](./endpoints-and-middleware)
- Add [routes](./router-and-store)
- Add a [new post types](./working-with-posts) and [modify the dashboard](./extend-the-dashboard)
- Change Factor's behavior with [filters](./filters-callbacks-events)
- Add [callbacks and events](./filters-callbacks-events)

### Index.js and Server.js

There are two environments in Factor. The "app" runs through Webpack and should be able to run in the browser, while the "server" environment represents your CLI and Express app.

With the entry files, you'll typically want to split code that is meant to run in the client into `index.js` and code that is meant for the server into `server.js`.

However the naming and loading of these files can be completely controlled using the `package.json > target` property.

## Allowing Customization

To make your plugin customizable, use filters, callbacks and events as well as adding editable settings to `factor-settings` and employing CSS variables that can be set from apps.

### Settings and Styles

#### factor-settings.js

Anything that should be editable belongs in a `factor-settings.js` file in your plugin. As an example, adding settings to this file like this:

```js
export default {
  myWelcomePlugin: {
    bannerText: "Welcome",
    route: "/welcome"
  }
}
```

Means that users can easily override these settings with their own `factor-settings.js` file.

#### factor-styles.less

If your plugin has components that include their own style, use CSS variables and a `factor-styles.less` file to set defaults.

```html
<template>
  <div class="banner">{{ setting("myWelcomePlugin.bannerText") }}</div>
</template>
<script>
  import { setting } from "@factor/tools"
  export default {
    methods: { setting }
  }
</script>
<style lang="less">
  .banner {
    background: var(--welcome-banner-bg);
  }
</style>
```

and in your CSS/LESS file:

```css
.factor-app {
  --welcome-banner-bg: #0496ff;
}
```

This approach makes your plugin completely customizable and allows you to set ideal defaults for a great initial experience.

### Filters, Callbacks and Events

Use filters, callbacks and events to maximize the amount of code in your plugin that can be customized.

Learn more about [filters, callbacks, and events &rarr;](./filters-callbacks-events)

## Standards and Conventions

Once you've created your plugin, you likely want to set it up for distribution. Here are standards for assets and plugin quality that will help your plugin get discovered and used.

### Screenshots

Add screenshots to the root of your plugin. These will be used in plugin listings.

- **Naming:** screenshot.jpg, screenshot-2.jpg, screenshot-3.jpg. These will be ordered according to the number (with the default screenshot not needing a number).
- **Sizing** The standard screenshot size is [720p](https://en.wikipedia.org/wiki/720p): 1280px-by-720px.

### icon.svg

Add a square `icon.svg` file to your plugin that defaults to **100px by 100px**.

### Plugin Name Spacing

The name of your extension should generally include the word `factor-`. This way it will be clear it's a Factor plugin and it will also help with SEO.

Apply your plugin name as a "name space" when naming fields and filters in order to avoid naming collisions with other authors and developers.

- **Don't** name your filter/field/id: `comments` or `job`
- **Do** prefix your filters/fields/id with a namespace or similar: `my-plugin-comments`, `myPluginId`

### Documenting Your Plugin

Never assume people know how to use your plugin, we recommend adding the following instructions to your `README.md`:

- Overview including Purpose and/or motivation behind the plugin
- Installation
- Options and Settings
- Utilities available (`factor setup`)
- FAQ or Related documentation and context links

### License

Factor plugins should be compatible with the [GPLv2 license](https://en.wikipedia.org/wiki/GNU_General_Public_License).

### Distribution and Discovery

After you've [published your plugin as an NPM package](https://docs.npmjs.com/cli/publish), write us an email at [support@fiction.com](mailto:support@fiction.com) about getting your plugin listed on the [Factor plugins listing &rarr;](https://factor.dev/plugins)
